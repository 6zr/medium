<template>
  <v-app id="app-container">
    <div ref="threeContainer" class="three-container"></div>

    <v-btn
      fixed
      top
      right
      fab
      dark
      color="primary"
      class="mt-4 mr-4"
      @click="drawer = !drawer"
      style="z-index: 100;"
    >
      <v-icon>{{ drawer ? 'mdi-close' : 'mdi-menu' }}</v-icon>
    </v-btn>

    <v-navigation-drawer
      v-model="drawer"
      fixed
      right
      temporary
      width="320"
      class="pa-4"
    >
      <div style="height: 60px;"></div> 
    
      <div class="d-flex align-center mb-4">
        <v-icon color="primary" class="mr-2">mdi-human-male-height-variant</v-icon>
        <h3 class="text-h6">Pose Editor</h3>
      </div>
      
      <v-divider class="mb-4"></v-divider>
    
      <v-subheader>Body Controls</v-subheader>
      <v-slider v-model="params.tilt" label="首の傾き" min="-45" max="45" thumb-label></v-slider>
      <v-slider v-model="params.rArm" label="右腕上げ" min="-90" max="90" thumb-label></v-slider>
      <v-slider v-model="params.lArm" label="左腕上げ" min="-90" max="90" thumb-label></v-slider>
    
      <v-divider class="my-4"></v-divider>
    
      <v-subheader>Camera & Scene</v-subheader>
      <v-slider v-model="params.rot" label="全体回転" min="0" max="360" thumb-label></v-slider>
      <v-slider v-model="params.zoom" label="ズーム" min="1" max="10" step="0.1" thumb-label></v-slider>
    
      <v-divider class="my-4"></v-divider>
    
      <v-subheader>Animation</v-subheader>
      <v-switch v-model="isDancing" label="ダンスモード (自動ポーズ)" color="secondary"></v-switch>
      <v-slider 
        v-if="isDancing"
        v-model="params.danceSpeed" 
        label="ポーズ切り替え間隔" 
        min="0.5" 
        max="5" 
        step="0.1"
        thumb-label
      ></v-slider>

      <v-divider class="my-4"></v-divider>
      <v-subheader>Debug Tools</v-subheader>
      <v-switch
              v-model="params.showGrid"
              label="ガイド線を表示 (RGB)"
              color="success"
              hide-details
              class="ma-0 pa-0"
              ></v-switch> 
    </v-navigation-drawer>

    <div class="bottom-controls">
      <v-btn
        x-large
        rounded
        color="secondary"
        elevation="10"
        @click="randomize"
        class="white--text px-10"
      >
        <v-icon left>mdi-dice-5</v-icon>
        Random Pose
      </v-btn>
    </div>
  </v-app>
</template>
<style scoped>
/* スライダーの見た目をスマホ向けに調整 */
.three-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* 下部中央にボタンを固定 */
.bottom-controls {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50; /* Three.jsより前面、ドロワーより背面 */
}

/* UIパネルが背景を邪魔しないように少し透過させるなどの調整 */
.v-navigation-drawer {
  background-color: rgba(255, 255, 255, 0.9) !important;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component
export default class PoseSimulator extends Vue {
    // --- UI状態 ---
    private isClosed: boolean = true;
    private isDancing: boolean = false;
    private lastPoseChangeTime: number = 0;
    private drawer: boolean = false; // 初期状態はメニューを閉じておく

    private axesHelper: THREE.AxesHelper | null = null;

    // --- スライダーの目標値 (v-modelと連動) ---
    private params: any = {
        tilt: 0, rArm: 0, lArm: 0, rLeg: 0, lLeg: 0,
        lean: 0, sideTilt: 0, rot: 0, zoom: 3, danceSpeed: 2.0,
        showGrid: true, // ガイド線の初期状態
    };

    // --- 描画用の現在値 (Lerpで目標値に近づく) ---
    private current: any = {
        tilt: 0, rArm: 0, lArm: 0, rLeg: 0, lLeg: 0,
        lean: 0, sideTilt: 0, rot: 0, zoom: 3
    };

    // --- UI設定データ ---
    private sliderLabels: any = {
        tilt: '首のかしげ', rArm: '右腕', lArm: '左腕',
        rLeg: '右足', lLeg: '左足', lean: '体のしなり',
        sideTilt: '左右の傾き', rot: '回転', zoom: 'ズーム',
        danceSpeed: 'ダンス速度'
    };

    private ranges: any = {
        tilt: { min: -45, max: 45 },
        rArm: { min: -30, max: 110 },
        lArm: { min: -30, max: 110 },
        rLeg: { min: -40, max: 40 },
        lLeg: { min: -40, max: 40 },
        lean: { min: -30, max: 30 },
        sideTilt: { min: -20, max: 20 },
        rot: { min: 0, max: 360 },
        zoom: { min: 1, max: 10, step: 0.1 },
        danceSpeed: { min: 0.5, max: 5.0, step: 0.1 }
    };

    // --- Three.js インスタンス (リアクティブ非対象) ---
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private model: THREE.Group | null = null;
    private initialRotations: Map<string, THREE.Euler> = new Map();

    // --- Computed ---
    get currentURL(): string {
        const p = this.params;
        return `?tilt=${p.tilt}&rArm=${p.rArm}&lArm=${p.lArm}&rLeg=${p.rLeg}&lLeg=${p.lLeg}&lean=${p.lean}&sideTilt=${p.sideTilt}&rot=${p.rot}&zoom=${p.zoom}`;
    }

    get danceBtnStyle() {
        return {
            background: this.isDancing ? '#44ff44' : '#ff4444',
            color: 'white',
            fontWeight: 'bold'
        };
    }

    // --- Lifecycle ---
    mounted() {
        this.$nextTick(() => {
            this.initThree();
            window.addEventListener('resize', this.onWindowResize);
        });
    }

    // --- Methods ---
    private initThree() {
        // $el ではなく、ref で指定した div を取得する
        const container = this.$refs.threeContainer as HTMLElement;
        if (!container) return;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111111); // これで「黒」になるはず

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // 指定した div の中に Canvas を入れる
        container.appendChild(this.renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9); // 環境光
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6); // 太陽光
        directionalLight.position.set(1, 2, 3);
        this.scene.add(directionalLight);

        this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 1.2, 3);
        this.camera.lookAt(0, 0.3, 0); // 視点を胸のあたりに固定

        this.axesHelper = new THREE.AxesHelper(5);
        this.scene.add(this.axesHelper);

        // 4. モデル読み込み
        const loader = new GLTFLoader();
        loader.load('https://6zr.github.io/medium/resources/glb/character_base.glb', (gltf) => {
            this.model = gltf.scene;

            this.scene.add(this.model);
            console.log("モデル読み込み成功！", this.model);

            // モデルを原点(0,0,0)に強制配置
            this.model.position.set(0, 0, 0);

            this.model.traverse((obj: any) => {
                // ここで空だった initialRotations に名前とポーズをセット！
                this.initialRotations.set(obj.name, obj.rotation.clone());
            });

            // ボーン初期化...
            this.animate();

        }, undefined, (error) => {
            console.error("モデル読み込みエラー:", error);
        });
    }

    public toggleDance() {
        this.isDancing = !this.isDancing;
        if (this.isDancing) this.lastPoseChangeTime = 0;
    }

    public randomize() {
        Object.keys(this.ranges).forEach((key: string) => {
            if (key === 'danceSpeed') return;
            const r = this.ranges[key];
            const val = Math.random() * (r.max - r.min) + r.min;
            this.params[key] = key === 'zoom' ? parseFloat(val.toFixed(1)) : Math.round(val);
        });
    }

    private animate() {
        // console.log("Looping...");
        requestAnimationFrame(this.animate);

        const now = Date.now() / 1000;
        if (this.isDancing && now - this.lastPoseChangeTime > this.params.danceSpeed) {
            this.randomize();
            this.lastPoseChangeTime = now;
        }

        this.updateLerp();
        this.updateBones();

        if (this.axesHelper) {
            this.axesHelper.visible = this.params.showGrid;
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    private updateLerp() {
        const lerpSpeed = 0.1;
        // currentの各値をparamsにじわじわ近づける
        Object.keys(this.current).forEach((key: string) => {
            this.current[key] += (this.params[key] - this.current[key]) * lerpSpeed;
        });
    }

    private updateBones() {
        if (!this.model) return;

        const toRad = (d: number) => d * (Math.PI / 180);
        const c = this.current;

        this.model.traverse((obj: any) => {
            if (obj.isBone && this.initialRotations.has(obj.name)) {
                const init = this.initialRotations.get(obj.name)!;
                obj.rotation.copy(init);

                if (obj.name === 'ボーン003') obj.rotation.z += toRad(c.tilt);
                if (obj.name === 'ボーン006R') obj.rotation.z += toRad(c.rArm);
                if (obj.name === 'ボーン006L') obj.rotation.z += toRad(-c.lArm);
                if (obj.name === 'ボーン009R') obj.rotation.x += toRad(c.rLeg);
                if (obj.name === 'ボーン009L') obj.rotation.x += toRad(c.lLeg);
                if (obj.name === 'ボーン002') obj.rotation.x += toRad(c.lean * 0.6);
                if (obj.name === 'ボーン001') {
                    obj.rotation.x += toRad(c.lean * 0.4);
                    obj.rotation.z += toRad(c.sideTilt);
                }
            }
        });

        // モデル全体の変形・位置補正
        this.model.rotation.y = toRad(c.rot);
        this.model.rotation.z = toRad(c.sideTilt);
        this.model.position.y = Math.abs(c.sideTilt) * 0.02; // 足の埋まり防止
        this.model.position.x = toRad(c.sideTilt) * -0.5;    // 重心移動
        this.camera.position.z = c.zoom;
    }

    private onWindowResize() {
        if (!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
</script>
