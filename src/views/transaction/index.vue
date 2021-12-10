<!--
 * @Author: abc
 * @Date: 2020-12-04 18:24:31
 * @LastEditors: abc
 * @LastEditTime: 2021-05-26 18:54:07
 * @Description: Transaction Details
-->
<template>
  <div class="trans">
    <no-data v-if="transactionHistory.txhash === ''"></no-data>
    <!-- first content TransactionStatus-->
    <div v-else>
      <div class="block-content">
        <div class="block-content-single">
          <div class="block-content-single-item">
            <label class="block-content-label">{{
              $t('account.transaction')
            }}</label>
            <span class="block-content-light">
              {{ transactionHistory.txhash }}
              <a-icon
                type="copy"
                class="copy"
                v-if="transactionHistory.txhash"
                v-clipboard:copy="transactionHistory.txhash"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              />
            </span>
          </div>
          <div class="block-content-single-item" style="display: none;">
            <label class="block-content-label">{{ $t('trans.id') }}</label>
            <span class="block-content-text"></span>
          </div>
          <div class="block-content-single-item">
            <label class="block-content-label">{{
              $t('trans.ecosystem')
            }}</label>
            <span class="block-content-text">
              {{ transactionHistory.ecosystemname }}
            </span>
          </div>
          <div class="block-content-single-item">
            <label class="block-content-label">{{ $t('trans.ename') }}</label>
            <span class="block-content-text block-content-text-img">
              <span class="trans-text">
                {{ transactionHistory.ecosystem }}
              </span>
              <img
                :src="transactionHistory.logo_url"
                alt="logo"
                v-if="transactionHistory.logo_url"
              />
              <img
                src="../../assets/image/ibxc.png"
                alt="logo"
                v-else-if="transactionHistory.ecosystem === 1"
              />
              <img src="../../assets/image/other.png" alt="logo" v-else />
            </span>
          </div>
          <div class="block-content-single-item">
            <label class="block-content-label">{{ $t('home.block') }}</label>
            <span class="block-content-text">{{
              transactionHistory.blockid
            }}</span>
          </div>
          <div class="block-content-single-item">
            <label class="block-content-label">{{
              $t('wallet.address')
            }}</label>
            <span class="block-content-text" v-if="transactionHistory.sender_id"
              >{{ transactionHistory.sender_id }}
              <a-icon
                type="copy"
                class="copy"
                v-if="transactionHistory.sender_id"
                v-clipboard:copy="transactionHistory.sender_id"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              />
            </span>
          </div>
          <div class="block-content-single-item">
            <label class="block-content-label">{{ $t('trans.time') }}</label>
            <span
              class="block-content-text"
              v-if="transactionHistory.created_setup"
            >
              <a-tooltip
                slot="suffix"
                placement="bottomLeft"
                :title="transactionHistory.created_setup | formatTimeUtc"
              >
                {{ transactionHistory.created_setup | formatTime }}
              </a-tooltip>
            </span>
            <span v-else></span>
          </div>
          <div class="block-content-single-item">
            <label class="block-content-label">{{ $t('description') }}</label>
            <span class="block-content-text">{{
              transactionHistory.comment
            }}</span>
          </div>
        </div>
      </div>
      <!-- second content TransactionHistory-->
      <div class="block-content">
        <div class="block-content-single-item">
          <label class="block-content-label">{{ $t('trans.contract') }}</label>
          <span class="block-content-text">
            {{ txDetailedInfoHex.contract_name }}</span
          >
        </div>
        <div class="block-content-single-item">
          <label class="block-content-label">{{ $t('trans.amount') }}</label>
          <span class="block-content-text" v-if="transactionHistory.transfer">
            <strong style="color:#4e8cf3;">{{
              handleMoneyFormat(transactionHistory.transfer.amount)
            }}</strong>
            {{ transactionHistory.token_title }}
          </span>
        </div>
        <div class="block-content-single-item">
          <label class="block-content-label">{{ $t('trans.miner') }}</label>
          <div class="block-content-label" v-if="transactionHistory.fees">
            <strong style="color:#4e8cf3;">{{
              handleMoneyFormat(transactionHistory.fees.amount)
            }}</strong>
            {{ $t('money') }}
          </div>
          <div class="block-content-label" v-if="transactionHistory.fees">
            <span>{{ transactionHistory.fees.sender_id }}</span>
            to
            <span>{{ transactionHistory.fees.recipient_id }}</span>
          </div>
        </div>
        <div class="block-content-single-item">
          <label class="block-content-label">
            {{ $t('trans.commission') }}
          </label>
          <div class="block-content-label" v-if="transactionHistory.commission">
            <strong style="color:#4e8cf3;">{{
              handleMoneyFormat(transactionHistory.commission.amount)
            }}</strong>
            {{ $t('money') }}
          </div>
          <div>
            <span>{{ transactionHistory.commission.sender_id }}</span>
            to
            <span>{{ transactionHistory.commission.recipient_id }}</span>
          </div>
        </div>
        <div class="block-content-single-item" v-if="isPack">
          <label class="block-content-label">{{ $t('package.fee') }}</label>
          <div class="block-content-label" v-if="transactionHistory.pack_fees">
            <strong style="color:#4e8cf3;">{{
              handleMoneyFormat(transactionHistory.pack_fees.amount)
            }}</strong>
            {{ $t('money') }}
          </div>
          <div class="block-content-label">
            <span>{{ transactionHistory.pack_fees.sender_id }}</span>
            to
            <span>{{ transactionHistory.pack_fees.recipient_id }}</span>
          </div>
        </div>
      </div>
      <!-- second content TxDetailedInfoHex-->
      <div class="block-content">
        <div class="block-content-single-item">
          <label class="block-content-label">{{ $t('home.execute') }}</label>
          <span class="block-content-text">
            {{ txDetailedInfoHex.contract_name }}
          </span>
        </div>
        <div class="block-content-single-item">
          <label class="block-content-label">{{ $t('parameters') }}</label>
          <span class="block-content-text trans-json">
            <vue-scroll class="global" style="height: 100%" :ops="ops">
              <json-viewer
                :value="jsonViewer"
                :expand-depth="5"
                :copyable="copyable"
                boxed
                sort
                @copied="onCopy"
              ></json-viewer>
            </vue-scroll>
          </span>
        </div>
        <div class="block-content-single-item">
          <label class="block-content-label">{{
            $t('block.generation')
          }}</label>
          <span class="block-content-text" v-if="txDetailedInfoHex.time">
            <a-tooltip
              slot="suffix"
              placement="bottomLeft"
              :title="txDetailedInfoHex.time | formatTimeUtc"
            >
              {{ txDetailedInfoHex.time | formatTime }}
            </a-tooltip>
          </span>
          <span v-else></span>
        </div>
        <div class="block-content-single-item">
          <label class="block-content-label">{{ $t('trans.ecosystem') }}</label>
          <span class="block-content-text">
            {{ txDetailedInfoHex.ecosystemname }}
          </span>
        </div>
        <div class="block-content-single-item">
          <label class="block-content-label">{{ $t('trans.currency') }}</label>
          <span class="block-content-text">
            {{ txDetailedInfoHex.token_title }}
          </span>
        </div>
        <div class="block-content-single-item">
          <label class="block-content-label">{{ $t('trans.ename') }}</label>
          <span class="block-content-text">
            {{ txDetailedInfoHex.ecosystem }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { handleMoneyFormat } from '../../assets/js/common.js';

export default {
  props: {},
  data() {
    return {
      jsonViewer: {},
      copyable: {
        copyText: this.$t('share'),
        copiedText: this.$t('shared'),
        timeout: 2000
      },
      isPack: true,
      objTrans: {},
      transactionStatus: '',
      transactionHistory: {},
      txDetailedInfoHex: '',
      ops: {
        vuescroll: {},
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
          background: '#f0f2f5',
          opacity: 1,
          size: '10px',
          specifyBorderRadius: false,
          gutterOfEnds: null,
          gutterOfSide: '2px',
          keepShow: false
        },
        bar: {
          background: 'Lavender'
        }
      }
    };
  },
  computed: {},
  components: {},
  watch: {
    $route() {
      const transaction = this.$route.params.transaction;
      this.getTransactionHistory(transaction);
    }
  },
  created() {
    const transaction = this.$route.params.transaction;
    this.getTransactionHistory(transaction);
  },
  mounted() {
    console.log(this.transactionHistory);
  },
  methods: {
    handleMoneyFormat,
    onCopy() {
      const copy = this.$t('copySucceeded');
      this.$message.success({ content: copy });
    },
    onError() {
      this.$message.error(this.$t('copyFailed'));
    },
    async getTransactionHistory(hash) {
      const objTrans = await this.$http.get(`/transaction_detail/${hash}`);
      this.objTrans = objTrans.data;
      console.log(JSON.stringify(this.objTrans));
      if (this.objTrans.TransactionHistory) {
        const { TransactionHistory } = this.objTrans;
        // this.transactionHistory = Object.assign({}, TransactionHistory);
        for (let key in TransactionHistory) {
          this.$set(this.transactionHistory, key, TransactionHistory[key]);
        }
        console.log(JSON.stringify(this.transactionHistory));
        if (this.transactionHistory.pack_fees.amount === '0') {
          this.isPack = false;
        } else {
          this.isPack = true;
        }
      }
      if (this.objTrans.TransactionStatus) {
        const { TransactionStatus } = this.objTrans;
        this.transactionStatus = TransactionStatus;
      }
      if (this.objTrans.TxDetailedInfoHex) {
        const { TxDetailedInfoHex } = this.objTrans;
        this.txDetailedInfoHex = Object.assign({}, TxDetailedInfoHex);
        const obj = this.handleChangeJson(this.txDetailedInfoHex.params);
        this.jsonViewer = obj;
      }
    }
  }
};
</script>
