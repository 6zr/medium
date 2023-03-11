import qs from 'qs';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import MelodyView from '../views/MelodyView.vue';
import GotchaView from '../views/GotchaView.vue';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    component: HomeView,
  },
  {
    path: '/melody',
    component: MelodyView,
  },
  {
    path: '/gotcha',
    component: GotchaView,
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  // https://kimagureneet.hatenablog.com/entry/2018/04/22/224623
  // parseQuery: (query) => {
  //   return queryString.parse(query, {
  //     arrayFormat: 'bracket'
  //   })
  // },
  parseQuery: qs.parse,
  stringifyQuery: function(query) {
      return `?${qs.stringify(query)}`;
  },
  routes,
})

export default router
