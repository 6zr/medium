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
        { scale: 'ド',   value: 'C4' },
        { scale: 'レ',   value: 'D4' },
        { scale: 'ミ',   value: 'E4' },
        { scale: 'ファ', value: 'F4' },
        { scale: 'ソ',   value: 'G4' },
        { scale: 'ラ',   value: 'A4' },
        { scale: 'シ',   value: 'B4' },
        { scale: 'モ',   value: 'E5' }, // ミ相当
    ],
    '琉球': [
        { scale: 'ド',   value: 'C4' },
        { scale: 'レ',   value: 'E4' }, // 本来は無いのでミと同じにしておく
        { scale: 'ミ',   value: 'E4' },
        { scale: 'ファ', value: 'F4' },
        { scale: 'ソ',   value: 'G4' },
        { scale: 'ラ',   value: 'B4' }, // 本来は無いのでシと同じにしておく
        { scale: 'シ',   value: 'B4' },
        { scale: 'モ',   value: 'E5' }, // ミ相当
    ],
    'ジプシー': [
        { scale: 'ド',   value: 'C4' },
        { scale: 'レ',   value: 'C#4' },
        { scale: 'ミ',   value: 'E4' },
        { scale: 'ファ', value: 'F4' },
        { scale: 'ソ',   value: 'G4' },
        { scale: 'ラ',   value: 'G#4' },
        { scale: 'シ',   value: 'B4' },
        { scale: 'モ',   value: 'E5' }, // ミ相当
    ],
    'アラビア': [
        { scale: 'ド',   value: 'C4' },
        { scale: 'レ',   value: 'D4' },
        { scale: 'ミ',   value: 'D#4' },
        { scale: 'ファ', value: 'F#4' },
        { scale: 'ソ',   value: 'G#4' },
        { scale: 'ラ',   value: 'B4' }, // 本来は無いのでシと同じにしておく
        { scale: 'シ',   value: 'B4' },
        { scale: 'モ',   value: 'E5' }, // ミ相当
    ],
    'ハンガリー': [
        { scale: 'ド',   value: 'C4' },
        { scale: 'レ',   value: 'D4' },
        { scale: 'ミ',   value: 'D#4' },
        { scale: 'ファ', value: 'F#4' },
        { scale: 'ソ',   value: 'G4' },
        { scale: 'ラ',   value: 'G#4' },
        { scale: 'シ',   value: 'B4' },
        { scale: 'モ',   value: 'D#5' }, // ミ相当
    ],
    'スペイン': [
        { scale: 'ド',   value: 'C4'  },
        { scale: 'レ',   value: 'C#4' },
        { scale: 'ミ',   value: 'E4'  },
        { scale: 'ファ', value: 'F4'  },
        { scale: 'ソ',   value: 'G4'  },
        { scale: 'ラ',   value: 'G#4' },
        { scale: 'シ',   value: 'A#4' },
        { scale: 'モ',   value: 'E5'  }, // ミ相当
    ],
    'ヨナ抜き短調': [
        { scale: 'ド',   value: 'C4'  },
        { scale: 'レ',   value: 'D4'  },
        { scale: 'ミ',   value: 'D#4' },
        { scale: 'ファ', value: 'G4'  },
        { scale: 'ソ',   value: 'G4'  },
        { scale: 'ラ',   value: 'G#4' },
        { scale: 'シ',   value: 'G#4' },
        { scale: 'モ',   value: 'D#5' }, // ミ相当
    ],
    '宮調式': [
        { scale: 'ド',   value: 'C4'  },
        { scale: 'レ',   value: 'D4'  },
        { scale: 'ミ',   value: 'E4' },
        { scale: 'ファ', value: 'G4'  },
        { scale: 'ソ',   value: 'G4'  },
        { scale: 'ラ',   value: 'A4' },
        { scale: 'シ',   value: 'A4' },
        { scale: 'モ',   value: 'E5' }, // ミ相当
    ],
    'メジャーブルース': [
        { scale: 'ド',   value: 'C4'  },
        { scale: 'レ',   value: 'D4'  },
        { scale: 'ミ',   value: 'D#4' },
        { scale: 'ファ', value: 'E4'  },
        { scale: 'ソ',   value: 'G4'  },
        { scale: 'ラ',   value: 'A4'  },
        { scale: 'シ',   value: 'A4'  },
        { scale: 'モ',   value: 'D#5' }, // ミ相当
    ],
    'マイナーブルース': [
        { scale: 'ド',   value: 'C4'  },
        { scale: 'レ',   value: 'D#4'  },
        { scale: 'ミ',   value: 'F4' },
        { scale: 'ファ', value: 'F#4'  },
        { scale: 'ソ',   value: 'G4'  },
        { scale: 'ラ',   value: 'A#4' },
        { scale: 'シ',   value: 'A#4' },
        { scale: 'モ',   value: 'F5' }, // ミ相当
    ],
};

const lenList = [
    { len: 1, value: '8n' },
    { len: 2, value: '4n' },
    { len: 3, value: '4n.' },
    { len: 4, value: '2n' },
    { len: 5, value: '1n' },
];

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

        const melodyList = this.scoreInner.map((x) => ({
            scale: (this.scaleList.find(y => x.scale === y.scale))?.value,
            len: (lenList.find(y => x.len === y.len))?.value || '16n',
        }));

        // console.log(melodyList);

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
        const str = this.score.replaceAll(/(ド|レ|ミ|ファ|ソ|ラ|シ|モ|・)/g, `${separetor}$1`)

        const arr: string[] = str.split(separetor);

        // [{scale: 'ド', len: 3},
        //  {scale: 'レ', len: 2},
        //  {scale: '・', len: 1},
        //  {scale: 'ミ', len: 2}], みたいな
        return arr
            .filter(x => x != null && x !== '')
            .map(x => ({
              scale: x.match(/(^ド|^レ|^ミ|^ファ|^ソ|^ラ|^シ|^モ|^・)/)![0],
              len: (x.match(/ー/g) || []).length + 1,
            }))
        ;
    }
}
</script>

<style scoped>
</style>

