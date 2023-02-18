<template>
  <div class="home">
    <HelloWorld msg="medium"/>
    <p>
      <router-link to="/about">hoge</router-link>
    </p>
    <p>
      <router-link to="/melody">melody</router-link>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
})
export default class HomeView extends Vue {}
</script>
