<!--
 * @Author: abc
 * @Date: 2020-12-04 14:57:19
 * @LastEditors: abc
 * @LastEditTime: 2020-12-16 12:03:11
 * @Description: honor node 
-->
<template>
  <div class="home-node">
    <div class="home-node-left">
      <h2 class="home-node-title">
        {{ $t('home.honor')
        }}<span class="home-node-title-num">({{ long }})</span>
      </h2>

      <div class="home-node-left-box">
        <div
          class="home-node-left-item"
          v-for="item in nodeList"
          :key="item.key_id"
        >
          <div class="home-node-left-img">
            <img :src="item.icon_url" alt="item.icon" />
          </div>
          <div class="home-node-left-content">
            <a-tooltip placement="bottomLeft">
              <template slot="title">
                <span>{{ item.nodename }}</span>
              </template>
              <div class="home-node-left-text">{{ item.nodename }}</div>
            </a-tooltip>
            <a
              class="home-node-left-address"
              :href="item.api_address"
              target="_blank"
              >{{ item.api_address }}</a
            >
            <div class="home-node-left-status">
              <span class="home-node-left-status-lime"></span>
              <span class="home-node-left-status-text">Normal</span>
            </div>
            <div class="home-node-left-status" v-if="0">
              <span class="home-node-left-status-yellow"></span>
              <span class="home-node-left-status-text">Normal</span>
            </div>
          </div>
        </div>
      </div>
      <div class="home-node-page" v-if="long > 4">
        <a-pagination
          v-model="current"
          :total="long"
          :pageSize="pageSize"
          :defaultCurrent="defaultCurrent"
          show-less-items
          @change="handleChangePage"
        />
      </div>
    </div>
    <div class="home-node-right">
      <div id="myMap" style="width: 100%; height: 100%;"></div>
    </div>
  </div>
</template>
<script>
// const initBingMap = require('@/plugins/bingMap');
export default {
  props: {
    objNode: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      arrNode: [],
      current: 1,
      total: 10,
      pageSize: 4,
      defaultCurrent: 1,
      isShow: false,
      page: 1,
      nodeList: [],
      long: 0
    };
  },
  computed: {},
  watch: {
    'objNode.block_id': {
      handler(newValue) {
        this.$store.dispatch('honorNode').then(() => {
          const postNodeList = this.$store.getters.postNodeList;
          this.initNodeList(postNodeList);
          // console.log(JSON.stringify(postNodeList));
          this.long = postNodeList.length;
          console.log(this.objNode, newValue);
          this.objNode.pack = this.$t('home.packages');
          this.objNode.latest = this.$t('home.latest');
          postNodeList.map(item => {
            if (parseInt(item.block_id) === newValue) {
              this.objNode.latitude = item.latitude;
              this.objNode.longitude = item.longitude;
              this.objNode.city = item.city;
            } else {
              // this.objNode = postNodeList[0];
              this.objNode.latitude = postNodeList[0].latitude;
              this.objNode.longitude = postNodeList[0].longitude;
              this.objNode.city = postNodeList[0].city;
            }
          });
          this.loadMapScenario(this.objNode);
        });
      },
      immediate: true
    }
  },
  created() {
    /*  this.$store.dispatch('honorNode').then(() => {
      this.initNodeList(this.$store.getters.postNodeList);
      console.log(JSON.stringify(this.$store.getters.postNodeList));
      this.long = this.$store.getters.postNodeList.length;
    }); */
  },
  mounted() {},
  methods: {
    loadMapScenario(obj) {
      // console.log(obj);
      const bingUesrKey =
        'ApN1XkT2A0xYVCMN0mihGQWzQ4btN3v171jSV0BvrBRmsFDWe7pVnKu3o-tgXjox';
      const lang = this.$store.state.lang;
      console.log(lang);
      window.loadMapScenario = null;
      const BingMap_URL = `http://www.bing.com/api/maps/mapcontrol?setLang=${lang}&key=${bingUesrKey}&callback=loadMapScenario`;
      this.$loadScript(BingMap_URL)
        .then(() => {
          // eslint-disable-next-line no-unused-vars
          window.loadMapScenario = function(params) {
            // eslint-disable-next-line no-undef
            const map = new Microsoft.Maps.Map('#myMap', {
              // eslint-disable-next-line no-undef,
              center: new Microsoft.Maps.Location(obj.latitude, obj.longitude),
              // eslint-disable-next-line no-undef
              anchor: new Microsoft.Maps.Point(12, 39),
              // eslint-disable-next-line no-undef
              mapTypeId: Microsoft.Maps.MapTypeId.birdseye
            });
            const center = map.getCenter();
            // eslint-disable-next-line no-undef
            var pushpin = new Microsoft.Maps.Pushpin(center, {
              icon: 'https://node23.ibax.io:8800/api/v2/logo/icon/mark.png',
              title: '',
              // eslint-disable-next-line no-undef
              anchor: new Microsoft.Maps.Point(5, 5)
            });
            map.entities.push(pushpin);
            //Define an HTML template for a custom infobox.
            const infoboxTemplate =
              '<div class="customInfobox"><div class="title" >{title}</div>{description}</div>';
            //A title and description for the infobox.
            const title = obj.city;
            const description = `
            <p><span class="info-data" title="${obj.node_blocks}">${obj.node_blocks}</span>
            <span class="info-tip">${obj.pack}</span></p>
            <p><span class="info-data" title="${obj.block_id}">${obj.block_id}</span>
            <span class="info-tip">${obj.latest}</span></p>`;
            //Pass the title and description into the template and pass it into the infobox as an option.
            // eslint-disable-next-line no-undef
            const infobox = new Microsoft.Maps.Infobox(center, {
              htmlContent: infoboxTemplate
                .replace('{title}', title)
                .replace('{description}', description)
            });
            //Assign the infobox to a map instance.
            infobox.setMap(map);
          };
        })
        .catch(() => {
          // Failed to fetch script
          this.$message.warn({
            content: `Map loading failed!`
          });
        });
    },
    //loadMap(Microsoft) {},
    initNodeList(data) {
      if (data.length < 4) {
        this.nodeList = data;
      } else {
        const partData = data.slice(0, 4);
        this.nodeList = partData;
      }
    },
    handleChangePage(page) {
      const pageSize = parseInt(this.pageSize);
      const data = this.$store.getters.postNodeList;
      const long = this.long;
      let min = this.pageSize * (page - 1);
      let max = this.pageSize * page;
      const arr = [];
      if (long < page * pageSize) {
        for (let i = min; i < long; i++) {
          arr.push(data[i]);
        }
        this.nodeList = [...arr];
      } else {
        for (let i = min; i < max; i++) {
          arr.push(data[i]);
        }
        this.nodeList = [...arr];
      }
    }
  }
};
</script>
