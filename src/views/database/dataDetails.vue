<!--
 * @Author: abc
 * @Date: 2020-12-11 14:18:24
 * @LastEditors: abc
 * @LastEditTime: 2021-11-08 15:25:22
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
import qs from 'qs';
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
      // Database table content
      dataContent: {
        table_name: '',
        limit: 10,
        page: 1,
        order: 'id asc',
        where: ''
      },
      pagination: {
        total: 10,
        pageSize: 10,
        defaultPageSize: 1
      },
      objColumns: {
        table_name: ''
      },
      objLoacl: {}
    };
  },
  computed: {},
  watch: {},
  created() {
    // this.getDataHeader(this.dataHeader);
  },
  mounted() {
    const obj = JSON.parse(localStorage.getItem('baseDetails'));
    this.objLoacl = obj;
    this.handleHeaderName(obj);
  },
  methods: {
    async handleHeaderName(obj) {
      this.isTable = false;
      this.tableLoading = true;
      this.objColumns.table_name = obj.tablename;
      const res = await fetch(`${obj.api_address}/api/v2/open/columnsInfo`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify(this.objColumns),
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer' // *client, no-referrer
      });
      this.isTable = true;
      this.tableLoading = false;
      if (res.ok) {
        const data = await res.json();
        data.list.map(item => {
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
        this.handleConetentData(obj);
      } else {
        this.$message.error('request error!');
      }
    },
    async handleConetentData(obj, page = 1) {
      this.dataContent.table_name = obj.tablename;
      this.dataContent.page = page;
      const res = await fetch(`${obj.api_address}/api/v2/open/rowsInfo`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify(this.dataContent),
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer' // *client, no-referrer
      });
      this.isTable = true;
      this.tableLoading = false;
      if (res.ok) {
        const data = await res.json();
        //  console.log(data);
        this.arrDataContent = data.list;
        this.pagination.total = data.count;
      } else {
        this.$message.error('request error!');
      }
    },
    handlePage({ current }) {
      this.handleConetentData(this.objLoacl, current);
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
