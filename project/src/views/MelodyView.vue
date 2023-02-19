<template>
  <v-container class="melody">

    <v-card class="mt-4">
        <v-card-subtitle class="pb-1">音階 [{{scale}}]</v-card-subtitle>
        <v-card-text>{{score}}</v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small block color="primary" @click="tone">
                <v-icon small>mdi-music</v-icon>
                <span class="font-weight-bold ml-1">演奏</span>
            </v-btn>
        </v-card-actions>
    </v-card>

  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as Tone from 'tone'; // @ is an alias to /src

type Scale = {
    scale: string;
    value: string;
};

const allScaleList: {
    [key: string]: Scale[],
} = {
    '通常': [
        { scale:  'ド↓', value: 'C3' },
        { scale:  'レ↓', value: 'D3' },
        { scale:  'ミ↓', value: 'E3' },
        { scale:'ファ↓', value: 'F3' },
        { scale:  'ソ↓', value: 'G3' },
        { scale:  'ラ↓', value: 'A3' },
        { scale:  'シ↓', value: 'B3' },
        { scale:  'ド',   value: 'C4' },
        { scale:  'レ',   value: 'D4' },
        { scale:  'ミ',   value: 'E4' },
        { scale:'ファ',   value: 'F4' },
        { scale:  'ソ',   value: 'G4' },
        { scale:  'ラ',   value: 'A4' },
        { scale:  'シ',   value: 'B4' },
        { scale:  'ド↑', value: 'C5' },
        { scale:  'レ↑', value: 'D5' },
        { scale:  'ミ↑', value: 'E5' },
        { scale:'ファ↑', value: 'F5' },
        { scale:  'ソ↑', value: 'G5' },
        { scale:  'ラ↑', value: 'A5' },
        { scale:  'シ↑', value: 'B5' },

        { scale: 'モ',  value: 'E5' },
    ],
    '琉球': [
        { scale:  'ド↓', value: 'C3' },
        { scale:  'レ↓', value: 'E3' },
        { scale:  'ミ↓', value: 'E3' },
        { scale:'ファ↓', value: 'F3' },
        { scale:  'ソ↓', value: 'G3' },
        { scale:  'ラ↓', value: 'B3' },
        { scale:  'シ↓', value: 'B3' },
        { scale:  'ド',   value: 'C4' },
        { scale:  'レ',   value: 'E4' },
        { scale:  'ミ',   value: 'E4' },
        { scale:'ファ',   value: 'F4' },
        { scale:  'ソ',   value: 'G4' },
        { scale:  'ラ',   value: 'B4' },
        { scale:  'シ',   value: 'B4' },
        { scale:  'ド↑', value: 'C5' },
        { scale:  'レ↑', value: 'E5' },
        { scale:  'ミ↑', value: 'E5' },
        { scale:'ファ↑', value: 'F5' },
        { scale:  'ソ↑', value: 'G5' },
        { scale:  'ラ↑', value: 'B5' },
        { scale:  'シ↑', value: 'B5' },

        { scale: 'モ',  value: 'E5' }, // ミ相当
    ],
    'ジプシー': [
        { scale:  'ド↓', value:  'C3' },
        { scale:  'レ↓', value: 'C#3' },
        { scale:  'ミ↓', value:  'E3' },
        { scale:'ファ↓', value:  'F3' },
        { scale:  'ソ↓', value:  'G3' },
        { scale:  'ラ↓', value: 'G#3' },
        { scale:  'シ↓', value:  'B3' },
        { scale:  'ド',   value:  'C4' },
        { scale:  'レ',   value: 'C#4' },
        { scale:  'ミ',   value:  'E4' },
        { scale:'ファ',   value:  'F4' },
        { scale:  'ソ',   value:  'G4' },
        { scale:  'ラ',   value: 'G#4' },
        { scale:  'シ',   value:  'B4' },
        { scale:  'ド↑', value:  'C5' },
        { scale:  'レ↑', value: 'C#5' },
        { scale:  'ミ↑', value:  'E5' },
        { scale:'ファ↑', value:  'F5' },
        { scale:  'ソ↑', value:  'G5' },
        { scale:  'ラ↑', value: 'G#5' },
        { scale:  'シ↑', value:  'B5' },

        { scale: 'モ',  value: 'E5' }, // ミ相当
    ],
    'アラビア': [
        { scale:  'ド↓', value:  'C3' },
        { scale:  'レ↓', value:  'D3' },
        { scale:  'ミ↓', value: 'D#3' },
        { scale:'ファ↓', value: 'F#3' },
        { scale:  'ソ↓', value: 'G#3' },
        { scale:  'ラ↓', value:  'B3' },
        { scale:  'シ↓', value:  'B3' },
        { scale:  'ド',   value:  'C4' },
        { scale:  'レ',   value:  'D4' },
        { scale:  'ミ',   value: 'D#4' },
        { scale:'ファ',   value: 'F#4' },
        { scale:  'ソ',   value: 'G#4' },
        { scale:  'ラ',   value:  'B4' },
        { scale:  'シ',   value:  'B4' },
        { scale:  'ド↑', value:  'C5' },
        { scale:  'レ↑', value:  'D5' },
        { scale:  'ミ↑', value: 'D#5' },
        { scale:'ファ↑', value: 'F#5' },
        { scale:  'ソ↑', value: 'G#5' },
        { scale:  'ラ↑', value:  'B5' },
        { scale:  'シ↑', value:  'B5' },

        { scale: 'モ',   value: 'E5' }, // ミ相当
    ],
    'ヨナ抜き短調': [
        { scale:  'ド↓', value:  'C3' },
        { scale:  'レ↓', value:  'D3' },
        { scale:  'ミ↓', value: 'D#3' },
        { scale:'ファ↓', value:  'G3' },
        { scale:  'ソ↓', value:  'G3' },
        { scale:  'ラ↓', value: 'G#3' },
        { scale:  'シ↓', value: 'G#3' },
        { scale:  'ド',   value:  'C4' },
        { scale:  'レ',   value:  'D4' },
        { scale:  'ミ',   value: 'D#4' },
        { scale:'ファ',   value:  'G4' },
        { scale:  'ソ',   value:  'G4' },
        { scale:  'ラ',   value: 'G#4' },
        { scale:  'シ',   value: 'G#4' },
        { scale:  'ド↑', value:  'C5' },
        { scale:  'レ↑', value:  'D5' },
        { scale:  'ミ↑', value: 'D#5' },
        { scale:'ファ↑', value:  'G5' },
        { scale:  'ソ↑', value:  'G5' },
        { scale:  'ラ↑', value: 'G#5' },
        { scale:  'シ↑', value: 'G#5' },

        { scale: 'モ',   value: 'D#5' }, // ミ相当
    ],
    '宮調式': [
        { scale:  'ド↓', value: 'C3' },
        { scale:  'レ↓', value: 'D3' },
        { scale:  'ミ↓', value: 'E3' },
        { scale:'ファ↓', value: 'G3' },
        { scale:  'ソ↓', value: 'G3' },
        { scale:  'ラ↓', value: 'A3' },
        { scale:  'シ↓', value: 'A3' },
        { scale:  'ド',   value: 'C4' },
        { scale:  'レ',   value: 'D4' },
        { scale:  'ミ',   value: 'E4' },
        { scale:'ファ',   value: 'G4' },
        { scale:  'ソ',   value: 'G4' },
        { scale:  'ラ',   value: 'A4' },
        { scale:  'シ',   value: 'A4' },
        { scale:  'ド↑', value: 'C5' },
        { scale:  'レ↑', value: 'D5' },
        { scale:  'ミ↑', value: 'E5' },
        { scale:'ファ↑', value: 'G5' },
        { scale:  'ソ↑', value: 'G5' },
        { scale:  'ラ↑', value: 'A5' },
        { scale:  'シ↑', value: 'A5' },

        { scale: 'モ',   value: 'E5' }, // ミ相当
    ],
    'メジャーブルース': [
        { scale:  'ド↓', value:  'C3' },
        { scale:  'レ↓', value:  'D3' },
        { scale:  'ミ↓', value: 'D#3' },
        { scale:'ファ↓', value:  'E3' },
        { scale:  'ソ↓', value:  'G3' },
        { scale:  'ラ↓', value:  'A3' },
        { scale:  'シ↓', value:  'A3' },
        { scale:  'ド',   value:  'C4' },
        { scale:  'レ',   value:  'D4' },
        { scale:  'ミ',   value: 'D#4' },
        { scale:'ファ',   value:  'E4' },
        { scale:  'ソ',   value:  'G4' },
        { scale:  'ラ',   value:  'A4' },
        { scale:  'シ',   value:  'A4' },
        { scale:  'ド↑', value:  'C5' },
        { scale:  'レ↑', value:  'D5' },
        { scale:  'ミ↑', value: 'D#5' },
        { scale:'ファ↑', value:  'E5' },
        { scale:  'ソ↑', value:  'G5' },
        { scale:  'ラ↑', value:  'A5' },
        { scale:  'シ↑', value:  'A5' },

        { scale: 'モ',   value: 'D#5' }, // ミ相当
    ],
    'マイナーブルース': [
        { scale:  'ド↓', value:  'C3' },
        { scale:  'レ↓', value: 'D#3' },
        { scale:  'ミ↓', value:  'F3' },
        { scale:'ファ↓', value: 'F#3' },
        { scale:  'ソ↓', value:  'G3' },
        { scale:  'ラ↓', value: 'A#3' },
        { scale:  'シ↓', value: 'A#3' },
        { scale:  'ド',   value:  'C4' },
        { scale:  'レ',   value: 'D#4' },
        { scale:  'ミ',   value:  'F4' },
        { scale:'ファ',   value: 'F#4' },
        { scale:  'ソ',   value:  'G4' },
        { scale:  'ラ',   value: 'A#4' },
        { scale:  'シ',   value: 'A#4' },
        { scale:  'ド↑', value:  'C5' },
        { scale:  'レ↑', value: 'D#5' },
        { scale:  'ミ↑', value:  'F5' },
        { scale:'ファ↑', value: 'F#5' },
        { scale:  'ソ↑', value:  'G5' },
        { scale:  'ラ↑', value: 'A#5' },
        { scale:  'シ↑', value: 'A#5' },

        { scale: 'モ',   value: 'F5' }, // ミ相当
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
    ',': '・',
};

@Component
export default class extends Vue {
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

    tone() {
        const synth = new Tone.Synth().toDestination();

        console.log(this.scoreInner);

        const melodyList = this.scoreInner.map((x) => ({
            scale: (this.scaleList.find(y => x.scale === y.scale))?.value,
            len: (lenList.find(y => x.len === y.len))?.value || '16n',
        }));

        let time = Tone.now();
        melodyList.forEach((item) => {
            if (item.scale != null) {
                synth.triggerAttackRelease(item.scale, item.len, time);
            }
            time = time + Tone.Time(item.len).toSeconds();
        });
    }

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
        const str = this.score.replaceAll(/(ド|レ|ミ|ファ|ソ|ラ|シ|モ|ﾄﾞ|ﾚ|ﾐ|ﾌｧ|ｿ|ﾗ|ｼ|・|,)/g, `${separetor}$1`)

        const arr: string[] = str.split(separetor);

        const joined = [
            'ド', 'レ', 'ミ', 'ファ', 'ソ', 'ラ', 'シ', 'モ', '・',
            'ﾄﾞ', 'ﾚ', 'ﾐ', 'ﾌｧ', 'ｿ', 'ﾗ', 'ｼ', ','].join('|');
        const regExpOnkai = new RegExp(`^(${joined})([↑↓])?`);

        // [{scale: 'ド', len: 3},
        //  {scale: 'レ', len: 2},
        //  {scale: '・', len: 1},
        //  {scale: 'ミ', len: 2}], みたいな
        return arr
            .filter(x => x != null && x !== '')
            .map(x => {
                const hit = x.match(regExpOnkai);
                const isHankaku = Object.keys(hankaku).includes(hit![1]);
                const character = isHankaku ? hankaku[hit![1]] : hit![1];
                const scale = `${character}${hit![2] || ''}`;
                const len = isHankaku ? 0.5 : (x.match(/ー/g) || []).length +1;
                return { scale, len };
            })
        ;
    }
}
</script>

<style scoped>
</style>

