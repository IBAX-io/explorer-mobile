/*
 * @Author: abc
 * @Date: 2020-11-03 10:54:28
 * @LastEditors: abc
 * @LastEditTime: 2020-12-29 18:12:44
 * @Description:main config file
 */
import Vue from 'vue';
import App from './App.vue';
import './plugins/ant-ui';
import './plugins/http';
import './components/global';
import './plugins/icons';
import './registerServiceWorker';
import router from './router';
import store from './store';
import './plugins/vuescroll';
import 'echarts/theme/macarons.js';
import mixins from './plugins/mixins';
import './plugins/copy';
import './plugins/jsonViewer';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import zhTW from 'ant-design-vue/lib/locale-provider/zh_TW';
import zhBG from 'ant-design-vue/lib/locale-provider/en_GB';
import VueI18n from 'vue-i18n';
import LoadScript from 'vue-plugin-load-script';
import 'babel-polyfill';
const en = require('@/lang/en-us.json');
const zh = require('@/lang/zh-cn.json');
const tw = require('@/lang/zh-tw.json');
const mergeZH = Object.assign({}, zhCN, zh);
const mergeEN = Object.assign({}, zhBG, en);
const mergeTW = Object.assign({}, zhTW, tw);
Vue.use(VueI18n);
Vue.use(mixins);
Vue.use(LoadScript);
Vue.config.productionTip = false;
// console.log(store);
const i18n = new VueI18n({
  locale: store.state.lang,
  messages: {
    'en-US': mergeEN,
    'zh-CN': mergeZH,
    'zh-TW': mergeTW
  }
});
/* router.beforeEach(async (to, from, next) => {
  console.log(to.name);
  // 
  //  next()  next  
  next();
  // 
  const token = store.state.token;
  if (to.path !== '/login' && !token) {
    next({ path: '/login' });
  } else {
    if (to.path === '/login' && token) {
      next('/');
    } else {
      next();
    }
  }
}); */
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
