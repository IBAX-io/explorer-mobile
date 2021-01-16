/*
 * @Author: abc
 * @Date: 2020-11-03 10:54:28
 * @LastEditors: abc
 * @LastEditTime: 2020-12-20 11:41:23
 * @Description:
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'lick-active',
  routes: [
    ...routes,
    {
      path: '403',
      name: '403',
      component: () =>
        import(/* webpackChunkName: "403" */ '../views/other/403.vue'),
      meta: {
        key: '403',
        title: '403'
      }
    },
    {
      path: '*',
      name: '404',
      component: () =>
        import(/* webpackChunkName: "404" */ '../views/other/404.vue'),
      meta: {
        key: '404',
        title: '404'
      }
    }
  ]
});
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
export default router;
