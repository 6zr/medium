<template>
  <div class="gotcha" :class="rarity">
    <v-container class="fg">
      <v-row class="content rarity">{{ rarity }}</v-row>
      <v-row class="content gift">{{ gift }}</v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import VantaFog from 'vanta/dist/vanta.fog.min';
import '@fontsource/condiment';

const VANTA_CONFIG_BASE = {
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    // minHeight: 200.00,
    // minWidth: 200.00,
    blurFactor: 0.5,
    speed: 1.0,
    zoom: 1.2,
    baseColor: 0xffffff,
};

const VANTA_CONFIG_RARITY: {
    key: string,
    highlightColor: number,
    midtoneColor: number,
    lowlightColor: number,
}[] = [{
    key: 'SS',
    highlightColor: 0xffff00,
    midtoneColor: 0xf5e400,
    lowlightColor: 0xaa5010,
}, {
    key: 'S',
    highlightColor: 0xf0f0ff,
    midtoneColor: 0xc0c0d0,
    lowlightColor: 0x9999aa,
}, {
    key: 'A',
    highlightColor: 0xff8855,
    midtoneColor: 0xeeaa33,
    lowlightColor: 0x995522,
}];

@Component
export default class extends Vue {
    vantaEffect: any = null;

    get gift() {
        if (typeof this.$route.query.gift !== 'string') {
            return '';
        }
        return this.$route.query.gift;
    }

    get rarity() {
        if (typeof this.$route.query.rarity !== 'string') {
            return '';
        }
        if (!(VANTA_CONFIG_RARITY.map(config => config.key)).includes(this.$route.query.rarity)) {
            return '';
        }
        return this.$route.query.rarity;
    }


    get rarityConfig() {
        return VANTA_CONFIG_RARITY.find(config => config.key === this.rarity) || {};
    }

    mounted() {
        this.vantaEffect = VantaFog({
            ...VANTA_CONFIG_BASE,
            ...this.rarityConfig,
            ...{
                el: this.$el,
                THREE: THREE,
            },
        })

    }

    beforeDestroy() {
        if (this.vantaEffect != null) {
            this.vantaEffect.destroy();
        }
    }
}
</script>


<style scoped>
.gotcha {
    height: 100%;
}

.fg {
    position: relative;
    z-index: 1;
    top: 40px;
    left: 0;
    width: 100%;
    height: 100%;
}

.fg .content {
    margin: 0;
    padding: 0;
    display: block;
    font-weight: bold;
    color: #FFF;
    text-align: center;
    position: absolute;
    letter-spacing: .1em;
    width: 100%;
}

.fg .content.gift {
    font-size: 96px;
    top: 64px;
    opacity: 0;
    animation: fromright 1.0s ease-in-out 2.0s forwards;
}

.fg .content.rarity {
    font-family: "condiment";
    font-size: 64px;
    top: 0;
    opacity: 0;
    animation: fromleft 1.0s ease-in-out 1.0s forwards;
}

.SS .fg .content.gift {
    text-shadow: 0 0 20px orange, 1px 1px 20px orange, 2px 2px 20px orange, -1px -1px 20px orange, -2px -2px 20px orange;
}

.SS .fg .content.rarity {
    text-shadow: 0 0 2px orange, 1px 1px 2px orange, 2px 2px 2px orange, -1px -1px 2px orange, -2px -2px 2px orange;
}

.S .fg .content.gift {
    text-shadow: 0 0 20px silver, 1px 1px 20px silver, 2px 2px 20px silver, -1px -1px 20px silver, -2px -2px 20px silver;
}

.S .fg .content.rarity {
    text-shadow: 0 0 2px silver, 1px 1px 2px silver, 2px 2px 2px silver, -1px -1px 2px silver, -2px -2px 2px silver;
}

.A .fg .content.gift {
    text-shadow: 0 0 20px maroon, 1px 1px 20px maroon, 2px 2px 20px maroon, -1px -1px 20px maroon, -2px -2px 20px maroon;
}

.A .fg .content.rarity {
    text-shadow: 0 0 2px maroon, 1px 1px 2px maroon, 2px 2px 2px maroon, -1px -1px 2px maroon, -2px -2px 2px maroon;
}

@keyframes fromleft {
  from { left: -100%; opacity: 0; }
  to { left: 0; opacity: 1; }
}

@keyframes fromright {
  from { left: 100%; opacity: 0; }
  to { left: 0; opacity: 1; }
}
</style>
