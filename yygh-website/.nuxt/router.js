import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _7f65a7ab = () => interopDefault(import('..\\pages\\hospital\\detail\\_hoscode.vue' /* webpackChunkName: "pages/hospital/detail/_hoscode" */))
const _5b43adf2 = () => interopDefault(import('..\\pages\\hospital\\notice\\_hoscode.vue' /* webpackChunkName: "pages/hospital/notice/_hoscode" */))
const _091fad9a = () => interopDefault(import('..\\pages\\hospital\\_hoscode.vue' /* webpackChunkName: "pages/hospital/_hoscode" */))
const _6cfbba48 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/hospital/detail/:hoscode?",
    component: _7f65a7ab,
    name: "hospital-detail-hoscode"
  }, {
    path: "/hospital/notice/:hoscode?",
    component: _5b43adf2,
    name: "hospital-notice-hoscode"
  }, {
    path: "/hospital/:hoscode?",
    component: _091fad9a,
    name: "hospital-hoscode"
  }, {
    path: "/",
    component: _6cfbba48,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
