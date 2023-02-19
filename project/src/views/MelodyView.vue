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

        const values = this.scaleList.map(x => x.scale);
        const mo = values[Math.floor(Math.random() * values.length)];

        const melodyList = this.scoreInner.map((x) => {
            const isMo = x.character === 'モ';
            const len = (lenList.find(y => x.len === y.len))?.value || '16n';
            console.log(x);
            const scaleBase = isMo? mo : (this.scaleList.find(y => x.character === y.key))?.scale;


            const scale = scaleBase == null ? null
                : scaleBase!.shift(octaveArrowsCount(x.octaveArrows), x.sharp);

            return { scale, len };
        });

        let time = Tone.now();
        melodyList.forEach((item) => {
            if (item.scale != null) {
                synth.triggerAttackRelease(item.scale.scaleText, item.len, time);
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

