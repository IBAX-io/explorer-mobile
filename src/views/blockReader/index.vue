<!--
 * @Author: abc
 * @Date: 2020-11-03 10:54:28
 * @LastEditors: abc
 * @LastEditTime: 2020-12-29 16:12:04
 * @Description: 
-->
<template>
  <div class="param">
    <div class="param-title">
      <div class="mobile-query-title">{{ $t('param.modify') }}</div>
      <a-input v-model="conditions" :placeholder="$t('name')" allowClear>
        <a-tooltip slot="suffix" title="">
          <a-icon type="search" @click="handleSearch" />
        </a-tooltip>
      </a-input>
    </div>
    <a-table
      :columns="columns"
      :data-source="paramList"
      :rowKey="record => record.ID"
      @change="handlePage"
      :pagination="pagination"
      :loading="tableLoading"
      :scroll="{ x: 300 }"
    >
      <span slot="name">{{ $t('name') }}</span>
      <span slot="value">{{ $t('value') }}</span>
      <span slot="conditions">{{ $t('condition') }}</span>
      <span slot="Name" slot-scope="text">
        <a href="javascript:;" @click="handleModel('Name', text)">{{ text }}</a>
      </span>
      <span slot="Value" slot-scope="text">
        <a href="javascript:;" @click="handleModel('Value', text)">{{
          text
        }}</a>
      </span>
      <span slot="Conditions" slot-scope="text">
        <a href="javascript:;" @click="handleModel('Conditions', text)">{{
          text
        }}</a>
      </span>
    </a-table>
    <model-visible
      :objModal="objModal"
      @changevisible="handleVisible"
    ></model-visible>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: 'Name',
    scopedSlots: { customRender: 'Name' },
    ellipsis: true,
    width: 200,
    slots: { title: 'name' }
  },
  {
    dataIndex: 'Value',
    ellipsis: true,
    width: 200,
    scopedSlots: { customRender: 'Value' },
    slots: { title: 'value' }
  },
  {
    dataIndex: 'Conditions',
    ellipsis: true,
    width: 200,
    scopedSlots: { customRender: 'Conditions' },
    slots: { title: 'conditions' }
  }
];
export default {
  props: {},
  data() {
    return {
      columns,
      paramList: [],
      pagination: {
        total: 10,
        pageSize: 10,
        defaultPageSize: 1,
        current: 1
      },
      conditions: '',
      objModal: {},
      tableLoading: true,
      query: {
        search: '',
        order: 'name asc',
        page: 1,
        limit: 10,
        ecosystem: 1
      }
    };
  },
  computed: {},
  watch: {},
  created() {
    this.ecosystemParam(this.query);
  },
  mounted() {},
  methods: {
    async ecosystemParam(data) {
      this.tableLoading = true;
      const res = await this.$http.post('/ecosystem_param', data);
      console.log(JSON.stringify(res));
      if (res.code === 0) {
        this.paramList = res.data.rets;
        this.pagination.total = res.data.total;
        this.pagination.pageSize = res.data.limit;
        this.pagination.current = res.data.page;
      } else {
        this.paramList = [];
        this.pagination.total = 0;
      }
      this.tableLoading = false;
    },
    handlePage({ current }) {
      this.query.page = current;
      this.ecosystemParam(this.query);
    },
    handleSearch() {
      this.query.search = this.conditions;
      this.query.page = 1;
      this.ecosystemParam(this.query);
    },
    handleModel(val, text) {
      this.objModal = {
        title: val,
        visible: true,
        content: text
      };
    },
    handleVisible(boo) {
      this.objModal = {
        title: '',
        content: '',
        visible: boo
      };
    }
  }
};
</script>
