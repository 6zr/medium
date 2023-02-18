<template>
  <div class="melody">
    <p>譜面: {{score}}</p>

    <!--
    <div class="paragraph">
        <input type="button" value="ド" @click="ring(48,1)">
        <input type="button" value="レ" @click="ring(50,1)">
        <input type="button" value="ミ" @click="ring(52,1)">
        <input type="button" value="ファ" @click="ring(53,1)">
        <input type="button" value="ソ" @click="ring(55,1)">
        <input type="button" value="ラ" @click="ring(57,1)">
        <input type="button" value="シ" @click="ring(59,1)">
        <input type="button" value="ド" @click="ring(60,1)">
    </div>
    -->

    <div class="paragraph">
        <input type="button" value="演奏" @click="play">
        <input type="button" value="停止" @click="stop">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

const scaleList = [
    { scale: 'ド', node: 48 },
    { scale: 'レ', node: 50 },
    { scale: 'ミ', node: 52 },
    { scale: 'ファ', node: 53 },
    { scale: 'ソ', node: 55 },
    { scale: 'ラ', node: 57 },
    { scale: 'シ', node: 59 },
];

// https://qiita.com/APO/items/883f7eb250f17c36473a
const makeAudio = function(nodeArg:number, sec:number): HTMLAudioElement {

    const node = nodeArg >= 96 ? 0 : nodeArg;
    const Hz = 11025; // サンプリングレート

    // Waveデータ
    const bytes = new Uint8Array(Math.floor(Hz*sec)+100);

    // Waveヘッダー作成
    const header="524946460000000057415645666D74201000000001000100112B0000112B0000010008006461746100000000";
    let fp = 0;
    for(fp = 0; fp < header.length/2; fp++){
        bytes[fp]=parseInt(header.substr(fp*2,2),16);
    }

    // 音階(ドド#レ…シ)の周波数(1オクターブ下がると1/2倍)
    const freqs=[4180, 4428, 4708, 4968, 5264, 5592, 5884, 6300, 6676, 6988, 7476, 7848];

    // 1サンプルあたりの位相計算
    const octave = Math.floor(node/12); // オクターブ
    const freq = freqs[node%12] / (1<<(7-octave)); // 周波数
    const phase = 6.28 / (Hz / freq);

    // 波形作成
    for (let t = 0; t < Math.floor(Hz*sec); t++){
        bytes[fp++] = Math.floor(Math.sin(phase*t)*127)+128;
    }

    // データ補正
    setLittleEndian(bytes,4,fp-8);  // ファイルサイズ
    setLittleEndian(bytes,24,Hz);   // サンプリングレート
    setLittleEndian(bytes,40,fp-44);// 波形サイズ

    // BASE64変換してオーディオ作成
    let str="";
    for (let i=0;i<fp;i++){
        str+=String.fromCharCode(bytes[i]);
    }

    return new Audio("data:audio/wav;base64,"+btoa(str));
};
const setLittleEndian = function(bytes:Uint8Array, p:number, data: number) {
    bytes[p] = (data & 0xFF);
    bytes[p+1] = ((data >> 8) & 0xFF);
    bytes[p+2] = ((data >> 16) & 0xFF);
    bytes[p+3] = ((data >> 24) & 0xFF);
};

@Component({
  components: {
    HelloWorld,
  },
})
export default class extends Vue {

    audio: HTMLAudioElement | null = null;

    get score() {
        if (typeof this.$route.query.q === 'string') {
            return decodeURI(this.$route.query.q);
        }
        return '';
    }

    get scoreInner(): {
        scale: string,
        len: number,
    }[] {
        const separetor = '/';
        const str = this.score.replaceAll(/(ド|レ|ミ|ファ|ソ|ラ|シ|・)/g, `${separetor}$1`)

        const arr: string[] = str.split(separetor);

        // [{scale: 'ド', len: 3},
        //  {scale: 'レ', len: 2},
        //  {scale: '・', len: 1},
        //  {scale: 'ミ', len: 2}], みたいな
        return arr
            .filter(x => x != null && x !== '')
            .map(x => ({
              scale: x.match(/(^ド|^レ|^ミ|^ファ|^ソ|^ラ|^シ|^・)/)![0],
              len: (x.match(/ー/g) || []).length + 1,
            }))
        ;
    }

    async play() {
        for (const item of this.scoreInner) {
            const sec = item.len * 0.2;
            if (item.scale === '・') {
                await this.wait(sec);
            } else {
                const scale = scaleList.find(x => x.scale === item.scale);
                if (scale != null) {
                    await this.ring(scale.node, sec);
                }
            }
        };
    }

    async ring(node:number, sec:number) {
        return new Promise(resolve => {
            this.stop();
            this.audio = makeAudio(node,sec);
            this.audio.onended = resolve;
            this.audio.play();
        });
    }

    async wait(sec:number) {
        return new Promise(resolve => {
            setTimeout(resolve, sec*1000);
        });
    }

    stop() {
        if (this.audio&&!this.audio.ended){
            this.audio.pause();
            this.audio.currentTime=0;
        }
    }
}
</script>

<style scoped>
.paragraph {
    margin-top: 4px;
}
</style>

