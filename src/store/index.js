/*
 * @Author: abc
 * @Date: 2020-11-03 10:54:28
 * @LastEditors: abc
 * @LastEditTime: 2021-01-13 17:59:34
 * @Description:
 */
import Vue from 'vue';
import Vuex from 'vuex';
import { get } from '../plugins/http';
import baseUrl from '../baseUrl';
Vue.use(Vuex);
const lang = localStorage.getItem('lang');
const objUrl = localStorage.getItem('baseUrl');
let url = baseUrl.test;
if (objUrl) {
  url = JSON.parse(objUrl).url;
}
console.log(objUrl);
export default new Vuex.Store({
  // store.js
  state: {
    token: window.localStorage.getItem('token'),
    auth: false,
    userInfo: {},
    route: {},
    user: '',
    baseUrl: url,
    nodeList: '',
    nodePage: '',
    lang: lang || 'en-US',
    websocketData: {}
  },
  mutations: {
    changeBaseUrl(state, url) {
      console.log(url);
      state.baseUrl = url;
    },
    setWebsocket(state, websocket) {
      state.websocketData = websocket.data;
    },
    honorNodelist(state, nodeList) {
      const list = nodeList.data.map(item => {
        item.active = false;
        return item;
      });
      nodeList.data = list;
      state.nodeList = nodeList;
    }
  },
  actions: {
    async honorNode({ commit }) {
      const honorNode = await get('/honor_nodelist');
      commit('honorNodelist', honorNode);
      // console.log(JSON.stringify(honorNode));
    },
    async websocketToken({ commit }) {
      const websocket_token = await get('/websocket_token');
      commit('setWebsocket', websocket_token);
    }
  },
  getters: {
    postNodeList(state) {
      const nodeList = state.nodeList.data;
      return nodeList;
    },
    postLang(state) {
      return state.lang;
    },
    postWebsocket(state) {
      return state.websocketData;
    }
  }
});
