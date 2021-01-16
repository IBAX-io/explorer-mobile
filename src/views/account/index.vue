<!--
 * @Author: abc
 * @Date: 2020-12-04 18:26:08
 * @LastEditors: abc
 * @LastEditTime: 2020-12-24 17:06:22
 * @Description: account Details
-->
<template>
  <div class="account">
    <!-- no data -->
    <no-data v-if="isShow"></no-data>
    <div class="account-box" v-else>
      <!-- first content -->
      <div class="account-top">
        <div class="account-top-item">
          <img
            :src="sysecosy.member_url"
            alt="logo"
            v-if="sysecosy.member_url"
          />
          <img src="../../assets/image/well.png" alt="well" v-else />
        </div>
        <div class="account-top-item" v-if="sysecosy.member_name">
          <label for="">Nickname:</label>
          <span>{{ sysecosy.member_name }}</span>
        </div>
        <div class="account-top-item">
          {{ account }}
          <span
            v-if="account"
            class="Copy"
            v-clipboard:copy="account"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >
            {{ $t('share') }}
          </span>
        </div>
        <!-- <div class="account-top-item">Created at Jun-10-2018, 21:09:04</div> -->
      </div>
      <!-- second content -->
      <div class="block-content">
        <div class="block-content-single">
          <div class="block-content-single-item">
            <span class="block-content-bold">
              {{ $t('account.asset') }}
            </span>
          </div>
          <div class="account-top-logo">
            <img src="../../assets/image/ibxc.png" alt="logo" />
            <span>{{ sysecosy.token_title }}</span>
          </div>
          <div class="account-top-logo">
            <strong>{{ handleMoneyFormat(sysecosy.total_amount) }}</strong>
            <span>{{ sysecosy.token_title }}</span>
          </div>
        </div>
        <div class="account-content">
          <div class="account-content-item">
            <div class="account-content-item-text">
              {{ $t('account.balance') }}
            </div>
            <div class="account-content-item-text">
              {{ handleMoneyFormat(sysecosy.amount) }}&nbsp;{{
                sysecosy.token_title
              }}
            </div>
          </div>
          <div class="account-content-item">
            <div class="account-content-item-text">
              {{ $t('account.stake') }}
            </div>
            <div class="account-content-item-text">
              {{ handleMoneyFormat(sysecosy.stake_amount) }}&nbsp;
              {{ sysecosy.token_title }}
            </div>
          </div>
          <div class="account-content-item">
            <div class="account-content-item-text">
              {{ $t('account.frozen') }}
            </div>
            <div class="account-content-item-text">
              {{ handleMoneyFormat(sysecosy.freeze_amount) }}&nbsp;{{
                sysecosy.token_title
              }}
            </div>
          </div>
        </div>
        <div class="account-content">
          <div class="account-content-flex">
            <img src="../../assets/image/transfer.png" alt="transfer" />
            <div>
              <div class="account-content-item-text">
                {{ $t('transfer.in') }}
              </div>
              <div class="account-content-item-text">
                {{ handleMoneyFormat(sysecosy.inamount) }}&nbsp;{{
                  sysecosy.token_title
                }}
              </div>
            </div>
          </div>
          <div class="account-content-flex">
            <img src="../../assets/image/out.png" alt="transfer" />
            <div>
              <div class="account-content-item-text">
                {{ $t('transfer.out') }}
              </div>
              <div class="account-content-item-text">
                {{ handleMoneyFormat(sysecosy.outamount) }}&nbsp;{{
                  sysecosy.token_title
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- third content -->
    <div class="block-content" v-if="rets.length !== 0">
      <div class="account-content-box">
        <div
          class="account-content-box-item"
          v-for="item in rets"
          :key="item.ecosystem"
          :class="{ 'account-content-box-item-active': item.active }"
          @click="handleAtive(item.ecosystem)"
        >
          <div class="account-content-box-top">
            <img :src="item.logo_url" alt="logo" />
            <div class="account-content-box-top-text">
              <p>{{ item.ecosystemname }}</p>
              <p>
                {{ handleMoneyFormat(item.amount) }}&nbsp;{{ item.token_title }}
              </p>
            </div>
          </div>
          <div class="account-content-box-bottom">
            <div class="account-content-box-bottom-text">
              <img src="../../assets/image/transfer.png" alt="transfer" />
              <span>
                {{ handleMoneyFormat(item.inamount) }}&nbsp;{{
                  item.token_title
                }}</span
              >
            </div>
            <div class="account-content-box-bottom-text">
              <img src="../../assets/image/out.png" alt="out" />
              <span>
                {{ handleMoneyFormat(item.outamount) }}&nbsp;{{
                  item.token_title
                }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- fourth content -->
    <show-table
      :objQuery="objQuery"
      :arrCurrency="currency"
      @changecolor="handleAtive"
      ref="childTable"
    ></show-table>
  </div>
</template>
<script>
import { handleMoneyFormat } from '../../assets/js/common.js';
import ShowTable from './components/showTable';
export default {
  props: {},
  components: {
    ShowTable
  },
  data() {
    return {
      isShow: false,
      sysecosy: {},
      rets: [],
      currency: [],
      account: '',
      objQuery: {
        account: '',
        ecosystem: 1
      },
      query: {
        where: {},
        order: 'id desc',
        page: 1,
        limit: 10,
        wallet: ''
      }
    };
  },
  computed: {},
  watch: {
    $route() {
      const account = (this.objQuery.account = this.account = this.$route.params.account);
      this.query.wallet = account;
      this.objQuery.ecosystem = 1;
      this.getWallettotal(this.query);
    }
  },
  created() {
    console.log(this.$route.params.account);
    const account = (this.objQuery.account = this.account = this.$route.params.account);
    this.query.wallet = account;
    this.objQuery.ecosystem = 1;
    this.getWallettotal(this.query);
  },
  mounted() {},
  methods: {
    handleMoneyFormat,
    onCopy() {
      const copy = this.$t('copySucceeded');
      this.$message.success({ content: copy });
    },
    onError() {
      this.$message.error(this.$t('copyFailed'));
    },
    handleAtive(ecosystem) {
      console.log(ecosystem);
      if (ecosystem === this.objQuery.ecosystem) {
        this.$refs.childTable.handleChangParent(this.objQuery);
      }
      const rets = this.rets;
      rets.map(item => {
        if (item.ecosystem === ecosystem) {
          item.active = true;
        } else {
          item.active = false;
        }
        return item;
      });
      this.rets = [...rets];
      // console.log(this.rets);
      this.objQuery.ecosystem = ecosystem;
    },
    async getWallettotal(data) {
      const res = await this.$http.post(`/wallettotal`, data);
      // console.log(JSON.stringify(res));
      if (!res.data) {
        this.isShow = true;
        this.rets = [];
      } else {
        this.isShow = false;
        const { sysecosy, rets } = res.data;
        this.sysecosy = sysecosy;
        let { ecosystem, token_title } = sysecosy;
        this.rets = rets;
        const currency = [];
        rets.map(item => {
          let { ecosystem, token_title } = item;
          currency.push({ ecosystem, token_title });
          item.active = false;
          return item;
        });
        console.log(JSON.stringify(rets));
        this.currency = [{ ecosystem, token_title }, ...currency];
      }
    }
  }
};
</script>
