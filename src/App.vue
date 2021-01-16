<!--
 * @Author: abc
 * @Date: 2020-11-03 10:54:28
 * @LastEditors: abc
 * @LastEditTime: 2021-01-13 18:01:09
 * @Description: main page
-->
<template>
  <vue-scroll id="global" class="global" style="height: 100%">
    <a-config-provider :locale="locale">
      <a-layout>
        <!-- header -->
        <a-layout-header>
          <header-global></header-global>
        </a-layout-header>
        <!-- content -->
        <a-layout-content>
          <a-row type="flex" justify="center" align="top">
            <a-col :lg="16" :xs="22" class="mainBox">
              <router-view v-if="isRouterAlive" />
              <div class="mainBox-right">
                <div
                  class="mainBox-right_blue"
                  @click="handleNetWork('test')"
                  v-show="isNetWork"
                >
                  {{ $t('main') }}
                </div>
                <div
                  class="mainBox-right_orange"
                  @click="handleNetWork('main')"
                  v-show="!isNetWork"
                >
                  {{ $t('test') }}
                </div>
              </div>
            </a-col>
          </a-row>
        </a-layout-content>
        <!-- footer -->
        <a-layout-footer>
          <a-row type="flex" justify="center" align="top">
            <a-col :lg="16" :xs="22">
              <footer-global></footer-global>
            </a-col>
          </a-row>
        </a-layout-footer>
      </a-layout>
    </a-config-provider>
  </vue-scroll>
</template>
<script>
import footerGlobal from './components/footerGlobal.vue';
import baseUrl from './baseUrl';
export default {
  components: { footerGlobal },
  data() {
    return {
      collapsed: false,
      login: true,
      locale: '',
      domHeaderTop: '',
      isRouterAlive: true,
      isNetWork: false
    };
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  watch: {
    $route(newVlue) {
      document.getElementById('global').firstChild.scrollTop = 0;
      console.log(newVlue);
      document.title = `${this.$t(newVlue.meta.title)}-IBAX`;
    },
    handlePostLang: function(newVal) {
      this.locale = this.$i18n.messages[newVal];
    }
  },
  created() {
    const lang = this.handlePostLang;
    this.locale = this.$i18n.messages[lang];
  },
  updated() {},
  mounted() {
    const baseUrl = localStorage.getItem('baseUrl');
    if (baseUrl) {
      const type = JSON.parse(baseUrl).type;
      if (type === 'main') {
        this.isNetWork = true;
      } else {
        this.isNetWork = false;
      }
    }
    document.getElementById('global').firstChild.scrollTop = 0;
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
    handleNetWork(str) {
      const { main, test } = baseUrl;
      console.log(str);
      if (str === 'main') {
        if (main) {
          this.$store.commit('changeBaseUrl', main);
          this.isNetWork = true;
          const objMain = { type: 'main', url: main };
          localStorage.setItem('baseUrl', JSON.stringify(objMain));
          this.$message.success("Now it's the main network");
          this.reload();
        } else {
          this.$message.error('No main network, please look forward to it');
        }
      } else {
        if (test) {
          this.$store.commit('changeBaseUrl', test);
          this.isNetWork = false;
          const objTest = { type: 'test', url: test };
          localStorage.setItem('baseUrl', JSON.stringify(objTest));
          this.$message.success("Now it's the test network");
          this.reload();
        } else {
          this.$message.error('No test network, please look forward to it');
        }
      }
    }
  },
  computed: {
    handlePostLang() {
      return this.$store.getters.postLang;
    }
  }
};
</script>
<style lang="less">
@import './assets/less/index.less';
</style>
