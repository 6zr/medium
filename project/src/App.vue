<template>
  <v-app>
    <v-app-bar app dense color="primary" dark>
        <span>shirokuma_bot 表現ツール</span>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  data: () => ({
    //
  }),
});
</script>
