<template>
  <p>
    <span>Hello </span>
    <span>{{ msg }}</span>
  </P>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
}
</script>

<style scoped>
</style>
