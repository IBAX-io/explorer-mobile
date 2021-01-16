<!--
 * @Author: abc
 * @Date: 2020-12-15 10:35:15
 * @LastEditors: abc
 * @LastEditTime: 2020-12-29 18:11:13
 * @Description: 
-->
<template>
  <div class="map-container">
    <div id="localMap"></div>
  </div>
</template>

<script>
import initBingMap from '@/plugins/bingMap';

export default {
  data() {
    return {
      lngNum: null, //
      latNum: null //
    };
  },
  created: function() {
    let _this = this;
    initBingMap.init().then(Microsoft => {
      console.log(Microsoft);
      _this.initMap(Microsoft);
    });
  },
  methods: {
    initMap(Microsoft) {
      let _this = this;
      let map = new Microsoft.Maps.Map('#localMap', {
        credentials:
          'AgzeobkGvmpdZTFuGa7_6gkaHH7CXHKsFiTQlBvi55x-QLZLh1rSjhd1Da9bfPhD'
      });
      Microsoft.Maps.Events.addHandler(map, 'click', _this.getClickLocation);
    },
    getClickLocation(e) {
      let [_this, loc] = [this, null];
      if (e.targetType == 'pushpin') {
        loc = e.target.getLocation();
      } else {
        // eslint-disable-next-line no-undef
        var point = new Microsoft.Maps.Point(e.pageX, e.pageY);
        loc = e.target.tryPixelToLocation(
          point,
          // eslint-disable-next-line no-undef
          Microsoft.Maps.PixelReference.page
        );
      }
      console.log(loc.latitude + ', ' + loc.longitude);
      console.log(loc);
      _this.lngNum = loc.longitude;
      _this.latNum = loc.latitude;
      let data = {
        lngNum: _this.lngNum,
        latNum: _this.latNum
      };
      this.$emit('getLocationNums', data);
    }
  }
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
  border: 1px solid #000;
}
</style>
