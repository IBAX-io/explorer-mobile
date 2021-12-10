<!--
 * @Author: abc
 * @Date: 2020-11-05 18:45:50
 * @LastEditors: abc
 * @LastEditTime: 2021-11-08 16:37:18
 * @Description: data base
-->
<template>
  <div class="base">
    <a-spin :spinning="spinning">
      <div class="base-node">
        <div
          class="base-node-item"
          v-for="item in arrData"
          :key="item.id"
          @click="handleDataTabel(item, objBase)"
          :class="{ active: item.active }"
        >
          <img :src="item.icon_url" alt="logo" />
          <div class="base-node-item-content">
            <a-tooltip
              slot="suffix"
              :title="item.nodename"
              placement="bottomLeft"
            >
              <span class="base-node-item-text">{{ item.nodename }}</span>
            </a-tooltip>
            <span class="base-node-item-text base-node-item-text-color">
              {{ item.current_user }}
            </span>
            <span class="base-node-item-text">{{ item.pg_size_pretty }}</span>
            <span class="base-node-item-text">{{
              item.pg_postmaster_start_time
            }}</span>
          </div>
        </div>
      </div>
    </a-spin>
    <div class="base-page">
      <a-pagination
        v-model="dataNode.current_page"
        :total="dataNode.total"
        :pageSize="dataNode.page_size"
        show-less-items
        hideOnSinglePage
        @change="handleChangeNode"
      />
    </div>
    <div class="base-put">
      {{ $t('data.put') }}
    </div>
    <div class="base-query">
      <a-input v-model="queryName" :placeholder="$t('data.query')" allowClear>
        <a-tooltip slot="suffix" title="">
          <a-icon type="search" @click="handleSearch(queryName)" />
        </a-tooltip>
      </a-input>
    </div>
    <div class="base-box" v-if="arrBaseName.length">
      <a-spin :spinning="spinningName">
        <div class="base-content">
          <div
            class="base-content-item"
            v-for="(item, index) in arrBaseName"
            :key="index"
            @click="handleBaseDetails(item)"
          >
            <a-tooltip
              slot="suffix"
              placement="bottomLeft"
              :title="item.tablename"
            >
              {{ item.tablename }}
            </a-tooltip>
          </div>
        </div>
        <div class="base-page">
          <a-pagination
            v-model="dataName.current_page"
            :total="dataName.total"
            :pageSize="dataName.page_size"
            show-less-items
            hideOnSinglePage
            @change="handleChangePage"
          />
        </div>
      </a-spin>
    </div>
    <no-data v-else></no-data>
  </div>
</template>
<script>
import qs from 'qs';
export default {
  props: {},
  data() {
    return {
      arrDataNode: [],
      arrDataName: [],
      arrData: [],
      defaultCurrent: 1,
      isShow: false,
      spinning: true,
      spinningName: true,
      queryName: '',
      // Database node
      dataNode: {
        cmd: '001', // node
        page_size: 6,
        current_page: 1,
        order: 'id desc'
      },
      // Database table name
      dataName: {
        total: 1,
        page_size: 40,
        current_page: 1
      },
      objBase: {
        page: 1,
        order: '',
        table_name: '',
        limit: 40
      },
      arrBaseName: [],
      objNode: {}
    };
  },
  computed: {},
  watch: {},
  created() {
    const dataNode = this.dataNode;
    // const dataName = this.dataName;
    this.databaseNode(dataNode);
    // this.databaseName(dataName);
  },
  mounted() {},
  methods: {
    // get database node
    async databaseNode(data) {
      this.spinning = true;
      const res = await this.$http.post('/database', data);
      console.log(JSON.stringify(res));
      if (!res.data.data) {
        this.arrDataNode = [];
        this.dataNode.total = 0;
      } else {
        this.arrDataNode = res.data.data;
        this.dataNode.current_page = res.data.current_page;
        this.dataNode.total = res.data.total;
        this.arrDataName = [];
        this.arrDataNode.map(item => {
          this.handleApiAddrss(item);
        });
      }
      this.spinning = false;
    },
    async handleApiAddrss(obj) {
      // console.log(obj);
      const res = await fetch(`${obj.api_address}/api/v2/open/databaseInfo`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer' // *client, no-referrer
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        this.arrDataName.push(data);
        console.log(this.arrDataName);
        if (this.arrDataName.length === this.arrDataNode.length) {
          this.handleMap(this.arrDataName);
        }
      } else {
        this.$message.error('request error!');
      }
    },
    handleMap(arr) {
      this.arrData = [];
      arr.forEach((item, index) => {
        item.nodename = this.arrDataNode[index].nodename;
        item.api_address = this.arrDataNode[index].api_address;
        item.icon_url = this.arrDataNode[index].icon_url;
        item.id = this.arrDataNode[index].id;
        item.active = false;
        if (index === 0) {
          item.active = true;
        }
        this.arrData.push(item);
      });
      console.log(this.arrData);
      this.objNode = this.arrData[0];
      this.objBase.table_name = '';
      this.handleDataTabel(this.arrData[0], this.objBase);
    },
    // get database name
    async databaseName(data) {
      this.spinningName = true;
      const res = await this.$http.post('/database', data);
      console.log(JSON.stringify(res));
      if (!res.data.data) {
        this.isShow = false;
        this.arrDataName = [];
        // this.dataName.page_size = res.data.page_size;
      } else {
        this.arrDataName = res.data.data;
        this.dataName.current_page = res.data.current_page;
        this.dataName.total = res.data.total;
        this.dataName.nodeposition = res.data.nodeposition;
        this.isShow = true;
      }
      this.spinningName = false;
    },
    handleChangeNode(current) {
      this.dataNode.current_page = current;
      console.log(this.dataNode);
      this.databaseNode(this.dataNode);
    },
    handleChangePage(current) {
      this.handleDataTabel(this.objNode, this.objBase, '', current);
    },
    async handleDataName(obj) {
      this.handleApiAddrss(obj);
      /*  this.dataName.current_page = 1;
      this.dataName.nodeposition = parseInt(id);
      this.databaseName(this.dataName); */
    },
    async handleDataTabel(obj, objBase, table_name = '', page = 1) {
      this.arrData.map(item => {
        if (item.id === obj.id) {
          item.active = true;
        } else {
          item.active = false;
        }
        return item;
      });
      this.spinningName = true;
      this.objBase.page = page;
      this.objBase.table_name = table_name;
      this.objNode = obj;
      if (table_name === '') {
        this.queryName = '';
      }
      const res = await fetch(`${obj.api_address}/api/v2/open/tablesInfo`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify(objBase),
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer' // *client, no-referrer
      });
      this.spinningName = false;
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        if (!data.list) {
          this.arrBaseName = [];
          this.dataName.total = 0;
        } else {
          this.arrBaseName = data.list;
          this.arrBaseName.map(item => {
            item.api_address = obj.api_address;
            return item;
          });
          this.dataName.total = data.count;
        }
      } else {
        this.$message.error('request error!');
      }
    },
    handleBaseDetails(obj) {
      localStorage.removeItem('baseDetails');
      this.$router.push({
        name: 'DataDetails',
        params: { name: obj.tablename }
      });
      localStorage.setItem('baseDetails', JSON.stringify(obj));
    },
    handleSearch(queryName) {
      this.handleDataTabel(this.objNode, this.objBase, queryName, 1);
    }
  }
};
</script>
