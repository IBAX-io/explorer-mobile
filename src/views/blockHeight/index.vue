<!--
 * @Author: abc
 * @Date: 2020-12-04 18:21:25
 * @LastEditors: abc
 * @LastEditTime: 2021-05-26 18:48:52
 * @Description: block height details
-->
<template>
  <div class="block">
    <!-- no data -->
    <no-data v-if="isShow"></no-data>
    <div class="block-box" v-else>
      <div class="block-info">
        <img src="../../assets/image/icon.png" alt="icon" />
        <span>{{ $t('block.header') }}</span>
      </div>
      <!-- first content -->
      <div class="block-content">
        <div class="block-content-single">
          <div class="block-content-single-item">
            <label class="block-content-label">{{ $t('home.block') }}</label>
            <span class="block-content-text block-content-bold">
              {{ objBlockHeader.block_id }}
            </span>
          </div>
        </div>
        <div class="block-content-many">
          <div class="block-content-many-item padding-bootom-20">
            <label class="block-content-label">{{
              $t('block.generation')
            }}</label>
            <a-tooltip
              slot="suffix"
              placement="bottomLeft"
              :title="objBlockHeader.time | formatTimeUtc"
            >
              <span class="block-content-text">
                {{ objBlockHeader.time | formatTime }}
              </span>
            </a-tooltip>
          </div>
          <div class="block-content-many-item padding-bootom-20">
            <label class="block-content-label">{{ $t('block.account') }}</label>
            <span class="block-content-text">
              {{ objBlockHeader.key_id }}
              <a-icon
                type="copy"
                class="copy"
                v-clipboard:copy="objBlockHeader.key_id"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              />
            </span>
          </div>
          <div class="block-content-many-item">
            <label class="block-content-label">{{ $t('block.package') }}</label>
            <span class="block-content-text">
              {{ nodeInfo.nodename }}
            </span>
            <img
              :src="nodeInfo.icon_url"
              alt="node"
              class="block-content-img"
            />
          </div>
        </div>
        <div class="block-content-single">
          <div class="block-content-single-item">
            <label class="block-content-label">{{
              $t('block.previous')
            }}</label>
            <span class="block-content-light">{{
              objBlockHeader.prehash
            }}</span>
          </div>
          <div class="block-content-single-item">
            <label class="block-content-label">{{
              $t('block.signature')
            }}</label>
            <span class="block-content-light">{{ objBlockHeader.sign }}</span>
          </div>
        </div>
        <div class="block-content-single">
          <div class="block-content-single-item">
            <label class="block-content-label">{{ $t('block.version') }}</label>
            <span class="block-content-text">{{ objBlockHeader.version }}</span>
          </div>
        </div>
        <!-- content right -->
        <div class="block-content-right">
          <h5 class="block-content-right-header">{{ $t('block.header') }}</h5>
          <div
            class="block-content-right-item"
            style="border-bottom: 2px solid #9cc1ff;"
          >
            <span>{{ $t('block.content') }}</span>
            <span>{{ objBlock.blocksize }}&nbsp;{{ $t('byte') }}</span>
          </div>
          <div class="block-content-right-item">
            <span>{{ $t('block.quantity') }}</span>
            <span>{{ objBlock.tx_count }}</span>
          </div>
        </div>
      </div>
      <!-- second content -->
      <div class="block-info">
        <img src="../../assets/image/icon-1.png" alt="icon-1" />
        <span>{{ $t('block.content') }}</span>
      </div>
      <div class="block-content">
        <div class="block-content-single" style="border:none;">
          <div class="block-content-single-item">
            <label class="block-content-label">{{ $t('block.value') }}</label>
            <span class="block-content-light">
              {{ objBlock.hash }}
              <a-icon
                type="copy"
                class="copy"
                v-clipboard:copy="objBlock.hash"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              />
            </span>
          </div>
          <div class="block-content-single-item">
            <label class="block-content-label">{{
              $t('block.transactions')
            }}</label>
            <span class="block-content-text block-content-bold">
              {{ objBlock.tx_count }}
            </span>
          </div>
          <div class="block-content-single-item">
            <label class="block-content-label">{{
              $t('block.rollback')
            }}</label>
            <span class="block-content-light">
              {{ objBlock.rollbacks_hash }}
              <a-icon
                type="copy"
                class="copy"
                v-clipboard:copy="objBlock.rollbacks_hash"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              />
            </span>
          </div>
          <div class="block-content-single-item">
            <label class="block-content-label">{{ $t('block.root') }}</label>
            <span class="block-content-light">
              {{ objBlock.mrkl_root }}
              <a-icon
                type="copy"
                class="copy"
                v-clipboard:copy="objBlock.mrkl_root"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              />
            </span>
          </div>
          <div class="block-content-many-borderNone">
            <div class="block-content-many-item padding-bootom-20">
              <label class="block-content-label">{{ $t('home.size') }}</label>
              <span class="block-content-text block-content-bold">
                {{ objBlock.blocksize }}&nbsp;{{ $t('byte') }}
              </span>
            </div>
            <div class="block-content-many-item">
              <label class="block-content-label">{{ $t('block.size') }}</label>
              <span class="block-content-text block-content-bold">
                {{ objBlock.trantotalsize }}&nbsp;{{ $t('byte') }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- third content -->
      <div class="block-content block-content-bottom">
        <div class="block-content-bold" style="margin-bottom: 20px;">
          {{ $t('block.quantity') }}
        </div>
        <a-table
          :columns="columns"
          :data-source="transactions"
          :rowKey="record => record.hash"
          @change="handlePage"
          :pagination="pagination"
          :loading="tableLoading"
          :scroll="{ x: 300 }"
        >
          <span slot="hash" slot-scope="text">
            <a-tooltip slot="suffix" placement="bottomLeft" :title="text">
              <router-link
                :to="{ name: 'Transaction', params: { transaction: text } }"
              >
                {{ text }}
              </router-link>
            </a-tooltip>
          </span>
          <span slot="key_id" slot-scope="text">
            <a-tooltip slot="suffix" placement="bottomLeft" :title="text">
              <router-link :to="{ name: 'Account', params: { account: text } }">
                {{ text }}
              </router-link>
            </a-tooltip>
          </span>
          <span slot="time" slot-scope="text">
            <a-tooltip
              slot="suffix"
              :title="text | formatTimeUtc"
              placement="bottomLeft"
            >
              {{ text | formatTime }}
            </a-tooltip>
          </span>
          <span slot="contract_name" slot-scope="text">
            <a-tooltip slot="suffix" placement="bottomLeft" :title="text">
              {{ text }}
            </a-tooltip>
          </span>
        </a-table>
      </div>
    </div>
  </div>
</template>
<script>
const columns = [
  {
    title: 'Transaction HASH',
    dataIndex: 'hash',
    scopedSlots: { customRender: 'hash' },
    width: 200,
    ellipsis: true
  },
  {
    title: 'Address of things',
    dataIndex: 'key_id',
    ellipsis: true,
    width: 150,
    scopedSlots: { customRender: 'key_id' }
  },
  {
    title: 'Time',
    dataIndex: 'time',
    ellipsis: true,
    width: 200,
    scopedSlots: { customRender: 'time' }
  },
  {
    title: 'Contract name',
    dataIndex: 'contract_name',
    ellipsis: true,
    width: 200,
    scopedSlots: { customRender: 'contract_name' }
  }
];
export default {
  props: {},
  data() {
    return {
      columns,
      objBlock: '',
      objBlockHeader: '',
      tableLoading: true,
      nodeInfo: '',
      isShow: false,
      transactions: [],
      query: {
        page: 1,
        limit: 10,
        block_id: 50
      },
      pagination: {
        total: 10,
        pageSize: 10,
        current: 1
      }
    };
  },
  computed: {
    nodeList() {
      console.log(JSON.stringify(this.$store.getters.postNodeList));
      return this.$store.getters.postNodeList;
    }
  },
  watch: {
    $route() {
      const blockId = (this.query.block_id = parseInt(
        this.$route.params.block
      ));
      this.getBlockDetai(blockId);
      this.postBlockDetail(this.query);
    }
  },
  created() {
    const blockId = (this.query.block_id = parseInt(this.$route.params.block));
    this.$store.dispatch('honorNode');
    this.getBlockDetai(blockId);
    this.postBlockDetail(this.query);
    this.getHash();
  },
  mounted() {},
  methods: {
    onCopy() {
      const copy = this.$t('copySucceeded');
      this.$message.success({ content: copy });
    },
    onError() {
      this.$message.error(this.$t('copyFailed'));
    },
    handlePage({ current }) {
      this.query.page = current;
      this.postBlockDetail(this.query);
    },
    handleNodeInfo(id) {
      console.log(id);
      let obj = {};
      this.nodeList.map(item => {
        if (item.node_position === id) {
          obj = item;
        }
      });
      return obj;
    },
    async postBlockDetail(data) {
      this.tableLoading = true;
      const res = await this.$http.post(`/block_detail`, data);
      // console.log(JSON.stringify(res));
      if (res.code === 0) {
        this.transactions = res.data.transactions;
        this.pagination.total = res.data.total;
        this.pagination.pageSize = res.data.limit;
        this.pagination.current = res.data.page;
      } else {
        this.transactions = [];
        this.pagination.total = 0;
      }
      this.tableLoading = false;
    },
    async getBlockDetai(blockId) {
      const res = await this.$http.get(`/block_detail/${blockId}`);
      // console.log(JSON.stringify(res));
      if (!res.data) {
        this.isShow = true;
      } else {
        this.isShow = false;
        this.objBlockHeader = res.data.header;
        this.objBlock = res.data;
        this.nodeInfo = this.handleNodeInfo(this.objBlockHeader.node_position);
      }
    },
    async getHash() {
      const res = await this.$http.get(
        `http://rap2api.taobao.org/app/mock/118538/hash`
      );
      console.log(JSON.stringify(res));
      /* if (!res.data) {
        this.isShow = true;
      } else {
        this.isShow = false;
        this.objBlockHeader = res.data.header;
        this.objBlock = res.data;
        this.nodeInfo = this.handleNodeInfo(this.objBlockHeader.node_position);
      } */
    }
  }
};
</script>
