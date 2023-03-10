<template>
  <v-container class="melody">

    <v-card class="mt-4">
        <v-card-subtitle class="pb-1">音階 [{{scale}}]</v-card-subtitle>
        <v-card-text>{{score}}</v-card-text>
        <v-card-text>
            <v-row class="pb-2">
                <v-col cols="12" sm="4" class="py-1">
                    <v-btn small block outlined @click="stop">
                        <v-icon small>mdi-stop</v-icon>
                        <span class="font-weight-bold ml-1">停止</span>
                    </v-btn>
                </v-col>
                <v-col cols="12" sm="4" class="py-1">
                    <v-btn small block color="secondary" @click="playSolo">
                        <v-icon small>mdi-music-note</v-icon>
                        <span class="font-weight-bold ml-1">ソロ</span>
                    </v-btn>
                </v-col>
                <v-col cols="12" sm="4" class="py-1">
                    <v-btn small block color="primary" @click="play">
                        <v-icon small>mdi-music</v-icon>
                        <span class="font-weight-bold ml-1">演奏</span>
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>

  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Scale } from '../components/Melody/Scale'
import * as Tone from 'tone'; // @ is an alias to /src

const allScaleList: {
    [key: string]: {
        key: string;
        scale: Scale;
    }[],
} = {
    '通常': [
        { key:  'ド',   scale: new Scale('C', 4) },
        { key:  'レ',   scale: new Scale('D', 4) },
        { key:  'ミ',   scale: new Scale('E', 4) },
        { key:'ファ',   scale: new Scale('F', 4) },
        { key:  'ソ',   scale: new Scale('G', 4) },
        { key:  'ラ',   scale: new Scale('A', 4) },
        { key:  'シ',   scale: new Scale('B', 4) },
    ],
    '琉球': [
        { key:  'ド',   scale: new Scale('C', 4) },
        { key:  'レ',   scale: new Scale('E', 4) },
        { key:  'ミ',   scale: new Scale('E', 4) },
        { key:'ファ',   scale: new Scale('F', 4) },
        { key:  'ソ',   scale: new Scale('G', 4) },
        { key:  'ラ',   scale: new Scale('B', 4) },
        { key:  'シ',   scale: new Scale('B', 4) },
    ],
    'ジプシー': [
        { key:  'ド',   scale: new Scale( 'C', 4) },
        { key:  'レ',   scale: new Scale('C#', 4) },
        { key:  'ミ',   scale: new Scale( 'E', 4) },
        { key:'ファ',   scale: new Scale( 'F', 4) },
        { key:  'ソ',   scale: new Scale( 'G', 4) },
        { key:  'ラ',   scale: new Scale('G#', 4) },
        { key:  'シ',   scale: new Scale( 'B', 4) },
    ],
    'アラビア': [
        { key:  'ド',   scale: new Scale( 'C', 4) },
        { key:  'レ',   scale: new Scale( 'D', 4) },
        { key:  'ミ',   scale: new Scale('D#', 4) },
        { key:'ファ',   scale: new Scale('F#', 4) },
        { key:  'ソ',   scale: new Scale('G#', 4) },
        { key:  'ラ',   scale: new Scale( 'B', 4) },
        { key:  'シ',   scale: new Scale( 'B', 4) },
    ],
    'ヨナ抜き短調': [
        { key:  'ド',   scale: new Scale( 'C', 4) },
        { key:  'レ',   scale: new Scale( 'D', 4) },
        { key:  'ミ',   scale: new Scale('D#', 4) },
        { key:'ファ',   scale: new Scale( 'G', 4) },
        { key:  'ソ',   scale: new Scale( 'G', 4) },
        { key:  'ラ',   scale: new Scale('G#', 4) },
        { key:  'シ',   scale: new Scale('G#', 4) },
    ],
    '宮調式': [
        { key:  'ド',   scale: new Scale('C', 4) },
        { key:  'レ',   scale: new Scale('D', 4) },
        { key:  'ミ',   scale: new Scale('E', 4) },
        { key:'ファ',   scale: new Scale('G', 4) },
        { key:  'ソ',   scale: new Scale('G', 4) },
        { key:  'ラ',   scale: new Scale('A', 4) },
        { key:  'シ',   scale: new Scale('A', 4) },
    ],
    'メジャーブルース': [
        { key:  'ド',   scale: new Scale( 'C', 4) },
        { key:  'レ',   scale: new Scale( 'D', 4) },
        { key:  'ミ',   scale: new Scale('D#', 4) },
        { key:'ファ',   scale: new Scale( 'E', 4) },
        { key:  'ソ',   scale: new Scale( 'G', 4) },
        { key:  'ラ',   scale: new Scale( 'A', 4) },
        { key:  'シ',   scale: new Scale( 'A', 4) },
    ],
    'マイナーブルース': [
        { key:  'ド',   scale: new Scale( 'C', 4) },
        { key:  'レ',   scale: new Scale('D#', 4) },
        { key:  'ミ',   scale: new Scale( 'F', 4) },
        { key:'ファ',   scale: new Scale('F#', 4) },
        { key:  'ソ',   scale: new Scale( 'G', 4) },
        { key:  'ラ',   scale: new Scale('A#', 4) },
        { key:  'シ',   scale: new Scale('A#', 4) },
    ],
};

const lenList = [
    { len: 0.5, value: '16n' },
    { len: 1, value: '8n' },
    { len: 2, value: '4n' },
    { len: 3, value: '4n.' },
    { len: 4, value: '2n' },
    { len: 5, value: '1n' },
];
const hankaku: {
    [key: string]: string,
} = {
    'ﾄﾞ': 'ド',
    'ﾚ': 'レ',
    'ﾐ': 'ミ',
    'ﾌｧ': 'ファ',
    'ｿ': 'ソ',
    'ﾗ': 'ラ',
    'ｼ': 'シ',
    'ﾓ': 'モ',
    ',': '・',
};

const octaveArrowsCount = function(octaveArrows: string): number {
    const up =( octaveArrows.match(/↑/g) || []).length;
    const down = (octaveArrows.match(/↓/g) || []).length;
    return up - down;
};

@Component
export default class extends Vue {
    songLength = 0;

    get scale() {
        if (typeof this.$route.query.scale !== 'string') {
            return '通常';
        }
        if (!Object.keys(allScaleList).includes(this.$route.query.scale)) {
            return '通常';
        }
        return this.$route.query.scale;
    }

    get scaleList() {
        return allScaleList[this.scale];
    }

    mounted() {
        Tone.Transport.bpm.value = 240;
        this.updateSongLength();
        this.setDrums();
    }

    updateSongLength() {
        this.songLength = this.scoreInner.reduce((a, b) => {
            return a + b.len;
        }, 0);
    }

    play() {
        this.stop();
        this.updateSongLength();
        this.setMelody();
        this.setDrums();
        Tone.Transport.start();
    }

    playSolo() {
        this.stop();
        this.updateSongLength();
        this.setMelody();
        Tone.Transport.start();
    }

    stop() {
        Tone.Transport.stop();
        Tone.Transport.cancel();
    }

    setDrums() {
        const songLength = Math.ceil(this.songLength/4) + 4; // ドラムを終わる小節

        const membrane = new Tone.MembraneSynth().toDestination();
        const partA = new Tone.Part(function(time, note){
            membrane.triggerAttackRelease(note.note, "16n", time, 0.4);
        }, [
            { time: '0:0.0', note: 'C3' },
            { time: '0:1.0', note: 'C3' },
        ]);
        partA.loop = true;
        partA.start();
        partA.stop(songLength);

        const metal = new Tone.MetalSynth().toDestination();
        const partB = new Tone.Part(function(time, note){
            metal.triggerAttackRelease(note.note, "16n", time, 0.05);
        }, [
            { time: '0:2.0', note: 'C4' },
            { time: '0:3.0', note: 'C4' },
        ]);
        partB.loop = true;
        partB.start();
        partB.stop(songLength);
    }

    setMelody() {
        const synth = new Tone.Synth().toDestination();
        const values = this.scaleList.map(x => x.scale);
        const mo = values[Math.floor(Math.random() * values.length)];

        const melodyList = this.scoreInner.map((x) => {
            const isMo = x.character === 'モ';
            const scaleBase = isMo? mo : (this.scaleList.find(y => x.character === y.key))?.scale;
            const scale = scaleBase == null ? null
                : scaleBase!.shift(octaveArrowsCount(x.octaveArrows), x.sharp);
            return { scale, len: x.len };
        });

        let time = 0;
        const melodyLine: {
            note: string;
            duration: string;
            time: string;
        }[] = [];

        melodyList.forEach((item) => {
            if (item.scale != null) {
                const duration = (lenList.find(x => item.len === x.len))?.value || '16n';
                melodyLine.push({
                    note: item.scale.scaleText,
                    duration,
                    time: `2:${time}`,
                });
            }
            time = time + item.len;
        });

        //メロディをセット  
        const melody = new Tone.Part((time, note) => {
            synth.triggerAttackRelease(note.note, note.duration, time);
        }, melodyLine); 
        // melody.loop = true;
        melody.start();
    }

    get score() {
        if (typeof this.$route.query.q === 'string') {
            return decodeURI(this.$route.query.q);
        }
        return '';
    }

    get scoreInner(): {
        character: string,
        sharp: boolean,
        octaveArrows: string,
        len: number,
    }[] {
        const separetor = '/';
        const str = this.score.replaceAll(/(ド|レ|ミ|ファ|ソ|ラ|シ|モ|ﾄﾞ|ﾚ|ﾐ|ﾌｧ|ｿ|ﾗ|ｼ|ﾓ|・|,)/g, `${separetor}$1`)

        const arr: string[] = str.split(separetor);

        const joined = [
            'ド', 'レ', 'ミ', 'ファ', 'ソ', 'ラ', 'シ', 'モ', '・',
            'ﾄﾞ', 'ﾚ', 'ﾐ', 'ﾌｧ', 'ｿ', 'ﾗ', 'ｼ', 'ﾓ', ','].join('|');
        const regExp = new RegExp(`^(${joined})(\\*)?([↑↓]+)?`);

        // [{scale: 'ド', len: 3},
        //  {scale: 'レ', len: 2},
        //  {scale: '・', len: 1},
        //  {scale: 'ミ', len: 2}], みたいな
        return arr
            .filter(x => x != null && x !== '')
            .map(x => {
                const hit = x.match(regExp);
                const isHankaku = Object.keys(hankaku).includes(hit![1]);
                const character = isHankaku ? hankaku[hit![1]] : hit![1];
                const sharp = hit![2] === '*';
                const octaveArrows = hit![3] || '';
                const len = isHankaku ? 0.5 : (x.match(/ー/g) || []).length +1;
                return { character, sharp, octaveArrows, len };
            })
        ;
    }
}
</script>

<style scoped>
</style>

