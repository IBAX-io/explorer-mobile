/*
 * @Author: abc
 * @Date: 2020-12-07 10:04:06
 * @LastEditors: abc
 * @LastEditTime: 2020-12-21 13:08:27
 * @Description:vuescroll
 */
import Vue from 'vue';
import vuescroll from 'vuescroll/dist/vuescroll-native';
import 'vuescroll/dist/vuescroll.css';
Vue.use(vuescroll);
const obj = { mode: 'native' };
Vue.prototype.$vuescrollConfig = {
  vuescroll: obj,
  scrollPanel: {
    initialScrollY: false,
    initialScrollX: false,
    scrollingX: false,
    scrollingY: true,
    speed: 300,
    easing: 'easeInQuad',
    verticalNativeBarPos: 'right',
    maxHeight: undefined,
    maxWidth: undefined
  },
  rail: {
    opacity: 0,
    size: '6px',
    specifyBorderRadius: false,
    gutterOfEnds: null,
    gutterOfSide: '2px',
    keepShow: false
  },
  bar: {
    background: '#c4c5c7'
  }
};
