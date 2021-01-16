<!--
 * @Author: abc
 * @Date: 2020-12-04 17:07:54
 * @LastEditors: abc
 * @LastEditTime: 2020-12-30 17:00:33
 * @Description: table transaction
-->
<template>
  <div class="home-table">
    <div class="mobile-query">
      <div class="mobile-query-title">{{ $t('home.query') }}:</div>
      <a-input
        v-model="inputQuery"
        :placeholder="$t('home.condition')"
        allowClear
      >
        <a-tooltip slot="suffix" title="">
          <a-icon type="search" @click="handleQuery(inputQuery)" />
        </a-tooltip>
      </a-input>
    </div>
    <!--  <div style="overflow-x:auto;">
      <div style="width:1200px"> -->
    <a-table
      :columns="columns"
      :data-source="transactionList"
      :rowKey="record => record.hash"
      @change="handlePage"
      :pagination="pagination"
      :loading="tableLoading"
      :scroll="{ x: 300 }"
    >
      <span slot="block_id" slot-scope="text">
        <a-tooltip slot="suffix" placement="bottomLeft" :title="text">
          <router-link :to="{ name: 'BlockHeight', params: { block: text } }">
            {{ text }}
          </router-link>
        </a-tooltip>
      </span>
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
      <span slot="ecosystemname" slot-scope="text">
        <a-tooltip slot="suffix" placement="bottomLeft" :title="text">
          {{ text }}
        </a-tooltip>
      </span>
    </a-table>
    <!--  </div>
    </div> -->
  </div>
</template>
<script>
const columns = [
  {
    title: 'Block',
    dataIndex: 'block_id',
    width: 150,
    ellipsis: true,
    scopedSlots: { customRender: 'block_id' }
  },
  {
    title: 'HASH',
    dataIndex: 'hash',
    scopedSlots: { customRender: 'hash' },
    width: 200,
    ellipsis: true
  },
  {
    title: 'Address',
    dataIndex: 'key_id',
    ellipsis: true,
    width: 200,
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
    title: 'Contract',
    dataIndex: 'contract_name',
    ellipsis: true,
    width: 200,
    scopedSlots: { customRender: 'contract_name' }
  },
  {
    title: 'EcoLib',
    dataIndex: 'ecosystemname',
    ellipsis: true,
    width: 200,
    scopedSlots: { customRender: 'ecosystemname' }
  }
];

export default {
  props: {},
  data() {
    return {
      columns,
      record: [],
      isRecord: false,
      transactionList: [],
      inputQuery: '',
      isPage: false,
      tableLoading: true,
      pagination: {
        total: 10,
        pageSize: 10,
        defaultPageSize: 1
      },
      query: {
        where: {},
        order: 'time desc',
        page: 1,
        limit: 10,
        ecosystem: 1,
        search: ''
      },
      isAtive: false
    };
  },
  computed: {},
  watch: {},
  created() {
    const data = this.query;
    this.postTransactionList(data);
    this.record = JSON.parse(window.localStorage.getItem('record')) || [];
    if (this.record.length === 0) {
      this.isRecord = false;
    } else {
      this.isRecord = true;
    }
  },
  mounted() {},
  methods: {
    handleQuery(str) {
      this.query.search = str;
      this.inputQuery = str;
      this.query.page = 1;
      this.postTransactionList(this.query);
    },
    handlePage({ current }) {
      this.query.page = current;
      this.postTransactionList(this.query);
    },
    /* post  transactionList*/
    postTransactionList(data) {
      this.tableLoading = true;
      this.$http.post('/common_transaction_search', data).then(res => {
        // console.log(JSON.stringify(res.data));
        if (!res.data) {
          this.transactionList = [];
          this.pagination.total = 0;
        } else {
          this.transactionList = res.data.rets;
          this.pagination.total = res.data.total;
          this.pagination.pageSize = res.data.limit;
          const record = this.record;
          if (data.search) {
            if (this.record.length < 4) {
              record.unshift(data.search);
            } else if (this.record.length === 4) {
              const i = record.indexOf(data.search);
              record.splice(i, 1);
              record.unshift(data.search);
            }
            const arr = record.filter((item, index, self) => {
              return self.indexOf(item) === index;
            });
            this.record = [...arr];
            if (this.record.length === 0) {
              this.isRecord = false;
            } else {
              this.isRecord = true;
            }
            const str = JSON.stringify(this.record);
            window.localStorage.setItem('record', str);
            this.isAtive = true;
          } else {
            this.isAtive = false;
          }
        }
        this.tableLoading = false;
      });
    },
    handleRecord() {
      window.localStorage.removeItem('record');
      this.record = [];
      this.isRecord = false;
      this.handleQuery('');
    }
  }
};
</script>
