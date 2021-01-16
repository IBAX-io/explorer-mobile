<!--
 * @Author: abc
 * @Date: 2020-12-11 14:18:24
 * @LastEditors: abc
 * @LastEditTime: 2020-12-29 18:11:47
 * @Description:  darabase details
-->
<template>
  <div class="base-details">
    <div class="base-details-box" v-if="isTable">
      <div class="base-details-title">{{ tableName }}</div>
      <div class="base-details-table">
        <a-table
          :columns="arrDataHeader"
          :data-source="arrDataContent"
          :rowKey="record => record[order]"
          @change="handlePage"
          :pagination="pagination"
          :loading="tableLoading"
          :scroll="numScroll"
        >
          <template
            :slot="item.dataIndex"
            slot-scope="text, record"
            v-for="item in arrDataHeader"
          >
            <a
              href="javascript:;"
              @click="handleModel(item.dataIndex, text)"
              :key="item[order]"
              >{{ text }}</a
            >
          </template>
        </a-table>
      </div>
    </div>
    <no-data v-else></no-data>
    <model-visible
      :objModal="objModal"
      @changevisible="handleVisible"
    ></model-visible>
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      isTable: false,
      tableLoading: true,
      tableName: '',
      objModal: {},
      numScroll: { x: 200, y: 350 },
      arrDataHeader: [],
      arrDataContent: [],
      order: 'id',
      //  Database table header
      dataHeader: {
        cmd: '003', //
        nodeposition: 1, // ID
        page_size: 100,
        current_page: 1,
        order: 'id desc',
        table_name: 'transactions_status' //
      },
      //  Database table content
      dataContent: {
        cmd: '004',
        nodeposition: 1, // ID
        page_size: 10,
        current_page: 1,
        order: 'id asc',
        table_name: 'transactions_status' //
      },
      pagination: {
        total: 10,
        pageSize: 10,
        defaultPageSize: 1
      }
    };
  },
  computed: {},
  watch: {
    $route: {
      handler(newVal) {
        console.log(newVal.params);
        const params = newVal.params;
        this.tableName = this.dataHeader.table_name = params.name;
        this.dataHeader.current_page = 1;
        this.dataHeader.nodeposition = parseInt(params.node);
        console.log(JSON.stringify(this.dataHeader));
        this.getDataHeader(this.dataHeader);
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.getDataHeader(this.dataHeader);
  },
  mounted() {},
  methods: {
    handlePage({ current }) {
      this.dataContent.current_page = current;
      this.handleDataContent(this.dataContent);
    },
    //  Database table header
    async getDataHeader(data) {
      const res = await this.$http.post('/database', data);
      // console.log(JSON.stringify(res));
      if (res.code === 0) {
        const arrHeader = res.data.data;
        this.dataHeader.current_page = res.data.current_page;
        this.dataHeader.total = res.data.total;
        this.isTable = true;
        arrHeader.map(item => {
          let obj = {
            title: item.column_name,
            dataIndex: item.column_name,
            ellipsis: true,
            width: 200,
            key: item.column_name,
            scopedSlots: { customRender: item.column_name }
          };
          this.arrDataHeader.push(obj);
        });
        this.dataContent.table_name = data.table_name;
        this.dataContent.nodeposition = data.nodeposition;
        const dataContent = this.dataContent;
        this.handleDataContent(dataContent);
      } else {
        this.arrDataName = [];
        this.isTable = false;
      }
    },
    async handleDataContent(data) {
      this.tableLoading = true;
      const resContent = await this.$http.post('/database', data);
      // console.log(JSON.stringify(resContent));
      if (resContent.code === 0) {
        if (!resContent.data.data === 0) {
          this.arrDataContent = [];
          this.pagination.pageSize = 0;
          this.pagination.total = 0;
          // console.log(JSON.stringify(this.arrDataContent));
        } else {
          const data = resContent.data.data;
          this.pagination.pageSize = resContent.data.page_size;
          if (resContent.data.order) {
            this.order = resContent.data.order.split(' ')[0];
          }
          console.log(this.order);
          this.pagination.defaultPageSize = resContent.data.current_page;
          this.arrDataContent = data;
          this.pagination.total = resContent.data.total;
        }
      } else {
        this.arrDataContent = [];
        this.pagination.pageSize = 0;
        this.pagination.total = 0;
      }
      this.tableLoading = false;
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
