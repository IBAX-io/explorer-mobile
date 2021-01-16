<!--
 * @Author: abc
 * @Date: 2020-11-06 14:33:09
 * @LastEditors: abc
 * @LastEditTime: 2021-01-13 19:23:00
 * @Description: nav 
-->
<template>
  <div class="header">
    <nav
      ref="headerNav"
      :class="{
        'global-fixed': isFixed
      }"
    >
      <a-row type="flex" justify="center" align="top">
        <a-col :lg="16" :xs="22">
          <!-- computer -->
          <div class="computer">
            <div class="header-nav">
              <router-link
                class="header-nav__logo header-nav__one"
                :to="{ name: 'Index' }"
                ><img src="../assets/image/logo.png" alt="logo"
              /></router-link>
              <template v-for="item in routes">
                <router-link
                  class="header-nav__link"
                  :to="{ name: item.name }"
                  exact
                  :key="item.key"
                  v-if="item.key === 1"
                  >{{ item.label }}</router-link
                >
                <router-link
                  class="header-nav__link"
                  :to="{ name: item.name }"
                  :key="item.key"
                  v-else-if="item.key !== 4"
                  >{{ item.label }}</router-link
                >
                <a
                  class="header-nav__link"
                  :href="item.name"
                  :key="item.key"
                  v-else
                  >{{ item.label }}</a
                >
              </template>
            </div>
          </div>
        </a-col>
      </a-row>
      <!-- mobile -->
      <div class="mobile">
        <a-row type="flex" justify="center" align="top">
          <a-col :lg="16" :xs="22">
            <div class="header-nav">
              <router-link
                class="header-nav__logo header-nav__one"
                :to="{ name: 'Index' }"
                ><img src="../assets/image/logo.png" alt="logo"
              /></router-link>
              <span class="mobile-active">{{ title }}</span>
              <a-icon
                :type="typePull"
                class="header-nav__pull"
                @click="handlePulldown"
              />
            </div>
          </a-col>
        </a-row>
        <div class="mobile-card" :style="{ width: width }" v-show="isShow">
          <a-card :bordered="false">
            <p
              v-for="item in routes"
              :key="item.key"
              @click="handleRoute(item.label)"
            >
              <router-link
                class="header-nav__link"
                :to="{ name: item.name }"
                exact
                v-if="item.key === 1"
                >{{ item.label }}</router-link
              >
              <router-link
                class="header-nav__link"
                :to="{ name: item.name }"
                v-else-if="item.key !== 4"
                >{{ item.label }}</router-link
              >
              <a class="header-nav__link" :href="item.name" v-else>{{
                item.label
              }}</a>
            </p>
          </a-card>
        </div>
      </div>
    </nav>
    <a-row type="flex" justify="center" align="top">
      <a-col :lg="16" :xs="22">
        <div class="computer" v-if="isTime">
          <div class="header-content">
            <div class="header-query">
              <label class="header-query-title">{{ $t('home.query') }}:</label>
              <a-input
                v-model="strQuery"
                :placeholder="$t('home.condition')"
                allowClear
              >
                <a-tooltip slot="suffix" title="">
                  <a-icon type="search" @click="handleSearch" />
                </a-tooltip>
              </a-input>
            </div>
            <!-- time -->
            <div class="header-time">
              <div class="header-time-utc">UTC</div>
              <vue-flip-time class="header-time-flip"></vue-flip-time>
            </div>
          </div>
        </div>
        <div class="mobile" v-else>
          <div class="header-content">
            <!-- time -->
            <div class="header-time">
              <div class="header-time-utc">UTC</div>
              <vue-flip-time class="header-time-flip"></vue-flip-time>
            </div>
          </div>
          <div class="home-title">{{ $t('home.query') }}</div>
          <div class="mobile_query">
            <a-input
              v-model="strQuery"
              :placeholder="$t('home.condition')"
              allowClear
            >
              <a-tooltip slot="suffix" title="">
                <a-icon
                  type="search"
                  @click="handleSearch"
                  style="color:#fff"
                />
              </a-tooltip>
            </a-input>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-back-top :target="handleBackTop" :visibilityHeight="visibilityHeight" />
  </div>
</template>
<script>
export default {
  name: 'SubMenu',
  data() {
    return {
      strQuery: '',
      domGlobal: '',
      isFixed: false,
      width: '400px',
      isTime: false,
      isShow: false,
      title: this.$t('home'),
      typePull: 'unordered-list',
      visibilityHeight: 100,
      routes: [
        {
          key: 1,
          name: 'Index',
          label: this.$t('home')
        },
        {
          key: 2,
          name: 'BlockReader',
          label: this.$t('block')
        },
        {
          key: 3,
          name: 'Database',
          label: this.$t('database')
        },
        {
          key: 4,
          name: 'javascript:;',
          label: this.$t('wallet')
        }
      ]
    };
  },
  mounted() {
    console.log(window.screen.width);
    const width = window.screen.width;
    this.width = `${width}px`;
    if (width <= 992) {
      this.isTime = false;
    } else {
      this.isTime = true;
    }
    this.domHeaderTop = this.$refs.headerNav;
    this.domGlobal = document.getElementById('global').firstChild;
    // console.log(this.domGlobal);
    // console.log(this.domHeaderTop);
    this.domGlobal.addEventListener('scroll', this.handleScroll);
  },
  created() {
    console.log(this.$route.meta);
  },
  watch: {
    $route(newVlue) {
      this.title = `${this.$t(newVlue.meta.title)}`;
    }
  },
  methods: {
    handlePulldown() {
      if (this.typePull === 'unordered-list') {
        this.typePull = 'close';
        this.isShow = true;
      } else {
        this.typePull = 'unordered-list';
        this.isShow = false;
      }
    },
    handleRoute(label) {
      console.log(label);
      this.typePull = 'unordered-list';
      this.isShow = false;
      this.title = label;
    },
    handleBackTop() {
      return document.getElementById('global').firstChild;
    },
    handleScroll() {
      const scrollTop = this.domGlobal.scrollTop;
      //  console.log(scrollTop);
      if (scrollTop > 300) {
        this.back = true;
      } else {
        this.back = false;
      }
      const topHeight = this.domHeaderTop.offsetTop;
      this.isFixed = scrollTop > topHeight;
      this.isInUp = scrollTop === topHeight;
    },
    handleSearch() {
      const strQuery = this.strQuery;
      const hash = /^[a-f0-9]{64}$/;
      const block = /^[0-9]*$/;
      const address = /^\d{4}-\d{4}-\d{4}-\d{4}-\d{4}$/;
      if (strQuery === '') {
        this.$message.warning({
          content: this.$t('home.enter')
        });
        return false;
      } else if (block.test(strQuery)) {
        this.$router.push({
          name: 'BlockHeight',
          params: { block: strQuery }
        });
        return false;
      } else if (hash.test(strQuery)) {
        this.$router.push({
          name: 'Transaction',
          params: { transaction: strQuery }
        });
        return false;
      } else if (address.test(strQuery)) {
        this.$router.push({
          name: 'Account',
          params: { account: strQuery }
        });
        return false;
      } else {
        this.$message.warning({
          content: this.$t('home.enter')
        });
        return false;
      }
    }
  },
  props: {
    // Cannot overlap with properties within Menu.SubMenu.props
    menuInfo: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>
