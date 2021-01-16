/*
 * @Author: abc
 * @Date: 2020-12-01 16:49:19
 * @LastEditors: abc
 * @LastEditTime: 2021-01-13 18:02:55
 * @Description:axios
 */
import Vue from 'vue';
import VueAxiosPlugin from 'vue-axios-plugin';
import { message } from 'ant-design-vue';
// import baseUrl from '../baseUrl';
import store from '../store/index';
// console.log(VueAxiosPlugin);
Vue.use(VueAxiosPlugin, {
  //abcd
  reqHandleFunc: config => {
    //console.log(config);
    if (config.method == 'post') {
      config.data = {
        ...config.data,
        _t: Date.parse(new Date()) / 1000
      };
    } else if (config.method == 'get') {
      config.params = {
        _t: Date.parse(new Date()) / 1000,
        ...config.params
      };
    }
    config.headers['Cache-Control'] = 'no-cache';
    //  console.log(config.interfaceType === 'first');
    config.baseURL = `${store.state.baseUrl}/api/v2`;
    config.headers['Content-Type'] = 'application/json';
    config.headers.Accept = 'application/json';
    config.retry = 4;
    config.retryDelay = 1000;
    config.timeout = 60000;
    return config;
  },
  //abcd
  reqErrorFunc: error => {
    message.success({ content: error, duration: 0 });
  },
  //abcd
  resHandleFunc: response => response.data,
  //abcd
  resErrorFunc: error => {
    // console.log(error && error.response);
    if (error.response) {
      const code = parseInt(error.response && error.response.status);
      const url = error.response.request.responseURL;
      message.error({
        content: `Error：${url};Code：${code}`,
        duration: 0
      });
    } else {
      /*  message.error({
        content: `${error}!`,
        duration: 0
      }); */
    }
  }
});
export const { get } = new Vue().$http;
export const { post } = new Vue().$http;
