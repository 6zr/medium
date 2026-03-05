<template>
  <div id="app">
    <div id="ui-container" :class="{ closed: isClosed }">
      
      <button id="toggle-btn" @click="isClosed = !isClosed">
        {{ isClosed ? '⚙️' : '❌' }}
      </button>
      
      <div id="ui-menu">
        <div class="button-group">
          <button class="primary-btn" @click="randomize">🎲 Random Pose</button>
          
          <button class="dance-btn" :style="danceBtnStyle" @click="toggleDance">
            {{ isDancing ? '🕺 Dance: ON' : '💃 Dance: OFF' }}
          </button>
        </div>

        <div class="scroll-area">
          <div v-for="(label, key) in sliderLabels" :key="key" class="control-group">
            <label>
              {{ label }} 
              <span class="val-display">{{ params[key] }}</span>
            </label>
            
            <input 
              type="range" 
              v-model.number="params[key]" 
              :min="ranges[key].min" 
              :max="ranges[key].max" 
              :step="ranges[key].step || 1"
            >
          </div>
        </div>

        <div class="url-section">
          <label>URL Parameter:</label>
          <input type="text" :value="currentURL" readonly @click="$event.target.select()">
        </div>
      </div>
    </div>
    </div>
</template>

<style scoped>
#ui-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  font-family: sans-serif;
}

#ui-container.closed #ui-menu {
  transform: translateX(280px); /* メニューを隠す */
  opacity: 0;
}

#ui-menu {
  width: 240px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: 15px;
  border-radius: 12px;
  color: white;
  transition: all 0.3s ease;
}

.scroll-area {
  max-height: 60vh;
  overflow-y: auto;
  margin: 15px 0;
  padding-right: 10px;
}

/* スライダーの見た目をスマホ向けに調整 */
input[type="range"] {
  width: 100%;
  height: 20px;
  cursor: pointer;
}

.val-display {
  float: right;
  color: #00ff88;
  font-weight: bold;
}

.button-group button {
  width: 100%;
  padding: 12px;
  margin-bottom: 8px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.url-section input {
  width: 100%;
  background: #222;
  color: #888;
  border: 1px solid #444;
  font-size: 10px;
  padding: 5px;
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

  // --- スライダーの目標値 (v-modelと連動) ---
  private params: any = {
    tilt: 0, rArm: 0, lArm: 0, rLeg: 0, lLeg: 0,
    lean: 0, sideTilt: 0, rot: 0, zoom: 3, danceSpeed: 2.0
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
    this.initThree();
    window.addEventListener('resize', this.onWindowResize);
  }

  // --- Methods ---
  private initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 1.2, 3);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.$el.appendChild(this.renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 2, 3);
    this.scene.add(directionalLight);

    const loader = new GLTFLoader();
    // loader.load('https://6zr.github.io/medium/resources/glb/character_base.glb', (gltf) => {
    loader.load('http://localhost:8080/medium/resources/glb/character_base.glb', (gltf: any) => {
      this.model = gltf.scene;

      if(this.model == null) {
		  return;
	  }

      this.scene.add(this.model);

      this.model.traverse((obj: any) => {
        if (obj.isBone) {
          this.initialRotations.set(obj.name, obj.rotation.clone());
        }
      });
      this.animate();
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

  // アロー関数にすることで this をこのクラスに固定
  private animate = () => {
    requestAnimationFrame(this.animate);

    const now = Date.now() / 1000;
    if (this.isDancing && now - this.lastPoseChangeTime > this.params.danceSpeed) {
      this.randomize();
      this.lastPoseChangeTime = now;
    }

    this.updateLerp();
    this.updateBones();

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
