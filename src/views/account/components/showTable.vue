<!--
 * @Author: abc
 * @Date: 2020-12-09 18:56:31
 * @LastEditors: abc
 * @LastEditTime: 2020-12-30 17:02:16
 * @Description: show table
-->
<template>
  <div class="block-content">
    <div style="padding-bottom:10px;" class="account-query">
      <span>{{ $t('account.record') }}</span>
      <a-button
        style="margin-left:auto;"
        @click="handleExpenditure('income')"
        :type="isIncome ? primary : ''"
        >{{ $t('transfer.in') }}</a-button
      >
      <a-button
        @click="handleExpenditure('outcome')"
        :type="isOutcome ? primary : ''"
        >{{ $t('transfer.out') }}</a-button
      >
    </div>
    <div class="account-query">
      <a-input
        v-model="currency"
        :placeholder="$t('account.currency')"
        allowClear
      >
        <a-tooltip slot="suffix" title="">
          <a-icon type="search" @click="handleSearch" /> </a-tooltip
      ></a-input>
    </div>
    <a-table
      :columns="columns"
      :data-source="accountList"
      :rowKey="record => record.id"
      @change="handlePage"
      :pagination="pagination"
      :loading="tableLoading"
      :scroll="{ x: 300 }"
    >
      <span slot="transactionHASH">{{ $t('block.value') }}</span>
      <span slot="relatedAccount">{{ $t('account') }}</span>
      <span slot="generationTime">{{ $t('block.generation') }}</span>
      <span slot="transferAmount">{{ $t('amount') }}</span>
      <span slot="execute">{{ $t('contract') }}</span>
      <span slot="txhash" slot-scope="text">
        <a-tooltip slot="suffix" placement="bottomLeft" :title="text">
          <router-link
            :to="{ name: 'Transaction', params: { transaction: text } }"
          >
            {{ text }}
          </router-link>
        </a-tooltip>
      </span>
      <span slot="recipient_id" slot-scope="text, record">
        <a-tooltip
          slot="suffix"
          placement="bottomLeft"
          :title="handleIsType(objQuery.account, record).account"
        >
          <router-link
            :to="{
              name: 'Account',
              params: {
                account: handleIsType(objQuery.account, record).account
              }
            }"
          >
            {{ handleIsType(objQuery.account, record).account }}
          </router-link>
        </a-tooltip>
      </span>
      <span slot="created_at" slot-scope="text">
        <a-tooltip
          slot="suffix"
          :title="text | formatTimeUtcCst"
          placement="bottomLeft"
        >
          {{ text | formatTimeCst }}
        </a-tooltip>
      </span>
      <span slot="amount" slot-scope="text, record">
        <a-tooltip slot="suffix" placement="bottomLeft">
          <template slot="title">
            <span>
              {{ handleIsType(objQuery.account, record).sign
              }}{{ handleMoneyFormat(text) }}&nbsp;{{ record.token_title }}
            </span>
          </template>
          <span class="account-money">
            <span
              :style="{ color: handleIsType(objQuery.account, record).color }"
              class="account-money-text"
            >
              {{ handleIsType(objQuery.account, record).sign }}
              {{ handleMoneyFormat(text) }}
            </span>
            &nbsp;
            {{ record.token_title }}
          </span>
        </a-tooltip>
      </span>
      <span slot="contract_name" slot-scope="text">
        <a-tooltip slot="suffix" placement="bottomLeft" :title="text">
          {{ text }}
        </a-tooltip>
      </span>
    </a-table>
  </div>
</template>
<script>
import { handleMoneyFormat } from '../../../assets/js/common';
const columns = [
  {
    dataIndex: 'txhash',
    scopedSlots: { customRender: 'txhash' },
    ellipsis: true,
    width: 200,
    slots: { title: 'transactionHASH' }
  },
  {
    dataIndex: 'recipient_id',
    ellipsis: true,
    width: 200,
    scopedSlots: { customRender: 'recipient_id' },
    slots: { title: 'relatedAccount' }
  },
  {
    dataIndex: 'created_at',
    ellipsis: true,
    width: 200,
    scopedSlots: { customRender: 'created_at' },
    slots: { title: 'generationTime' }
  },
  {
    dataIndex: 'amount',
    // ellipsis: true,
    width: 200,
    scopedSlots: { customRender: 'amount' },
    slots: { title: 'transferAmount' }
  },
  {
    dataIndex: 'contract_name',
    ellipsis: true,
    width: 200,
    scopedSlots: { customRender: 'contract_name' },
    slots: { title: 'execute' }
  }
];
export default {
  props: {
    objQuery: {
      type: Object,
      default: () => {}
    },
    arrCurrency: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currency: '',
      columns,
      tableLoading: true,
      primary: 'primary',
      accountList: [],
      inputQuery: '',
      isIncome: false,
      isOutcome: false,
      isPage: false,
      query: {
        where: {},
        order: 'id desc',
        page: 1,
        limit: 10,
        wallet: '',
        ecosystem: 1,
        search: '' //income outcome
      },
      pagination: {
        total: 10,
        pageSize: 10,
        current: 1
      }
    };
  },
  computed: {},
  watch: {
    objQuery: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal);
        this.isIncome = false;
        this.isOutcome = false;
        this.handleRequest(newVal, 1, '');
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleMoneyFormat,
    handleSearch() {
      // console.log(JSON.stringify(this.arrCurrency));
      const currency = this.currency;
      if (currency === '') {
        const ecosystem = this.arrCurrency[0].ecosystem;
        const account = this.objQuery.account;
        this.isIncome = false;
        this.isOutcome = false;
        this.handleRequest({ account, ecosystem }, 1, '');
        this.$emit('changecolor', ecosystem);
      } else {
        let ecosystem;
        let boo = this.arrCurrency.some(item => {
          if (item.token_title === currency) {
            ecosystem = item.ecosystem;
          }
          return item.token_title === currency;
        });
        console.log(boo, ecosystem);
        if (boo) {
          this.query.ecosystem = ecosystem;
          // this.ecosytemHistory(this.query);
          this.$emit('changecolor', ecosystem);
        } else {
          this.$message.warning(this.$t('account.exist'));
        }
      }
      // console.log(this.arrCurrency);
    },
    onDelete(text) {
      console.log(text);
    },
    handleChangParent(obj) {
      this.isIncome = false;
      this.isOutcome = false;
      this.handleRequest(obj, 1, '');
    },
    handlePage({ current }) {
      this.query.page = current;
      console.log(current);
      const search = this.query.search;
      this.handleRequest(this.objQuery, current, search);
    },
    // Request ecosytem_transaction_history
    handleRequest({ account, ecosystem }, page, search) {
      this.query.wallet = account;
      this.query.page = page;
      this.query.ecosystem = ecosystem;
      this.query.search = search;
      this.ecosytemHistory(this.query);
    },
    // income or outcome
    handleExpenditure(str) {
      this.query.page = 1;
      this.query.search = str;
      if (str === 'income') {
        this.isIncome = true;
        this.isOutcome = false;
      } else {
        this.isIncome = false;
        this.isOutcome = true;
      }
      this.ecosytemHistory(this.query);
    },
    async ecosytemHistory(data) {
      this.tableLoading = true;
      const res = await this.$http.post(`/ecosytem_transaction_history`, data);
      console.log(JSON.stringify(res));
      if (res.code === 0) {
        this.accountList = res.data.rets;
        this.pagination.total = res.data.total;
        this.pagination.pageSize = res.data.limit;
        this.pagination.current = res.data.page;
      } else {
        this.accountList = [];
        this.pagination.total = 0;
      }
      this.tableLoading = false;
    }
  }
};
</script>
