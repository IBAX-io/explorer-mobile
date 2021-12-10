<!--
 * @Author: abc
 * @Date: 2020-12-03 14:34:34
 * @LastEditors: abc
 * @LastEditTime: 2021-11-08 16:07:22
 * @Description: echarts line
-->
<template>
  <div>
    <a-skeleton active :loading="echartsLoading">
      <div>
        <no-data v-if="isShow"></no-data>
        <div id="blockEcharts" class="blockEcharts" v-else></div>
      </div>
    </a-skeleton>
  </div>
</template>
<script>
import echarts from '@/plugins/echarts';
export default {
  props: {
    websocketData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      value: true,
      isShow: false
    };
  },
  computed: {},
  watch: {},
  created() {
    this.handleBlockTpslist();
  },
  mounted() {},
  methods: {
    async handleBlockTpslist() {
      const res = await this.$http.get(`/block_tpslist`);
      console.log(res);
      if (res.code === 0) {
        const { data } = res;
        if (data.length) {
          this.handleDataSocket(data);
        } else {
          this.handleDataSocket([]);
        }
        this.getSocket(
          this.websocketData,
          this.handleDataSocket,
          'blocktransactionlist'
        );
      }
    },
    handleDataSocket(data) {
      console.log(data);
      this.echartsLoading = false;
      if (!this.echartsLoading) {
        this.$nextTick(() => {
          const chartData = this.arrDataCharts(data);
          this.drow(chartData);
        });
      }
    },
    arrDataCharts(arr) {
      //console.log(JSON.stringify(obj));
      if (!arr.length) {
        return [];
      } else {
        const arrBlockCharts = {
          transcations: [],
          size: [],
          xAxis: []
        };
        for (let i = 0; i < arr.length; i++) {
          arrBlockCharts.transcations.push(arr[i].block_transcations);
          arrBlockCharts.size.push(arr[i].block_size);
          arrBlockCharts.xAxis.push(arr[i].block_id);
        }
        return arrBlockCharts;
      }
    },
    drow(data) {
      const blockEcharts = document.getElementById('blockEcharts');

      //   console.log(blockEcharts);
      const myChart = echarts.init(blockEcharts, 'macarons');
      window.addEventListener('resize', function() {
        myChart.resize();
      });
      const that = this;
      myChart.setOption({
        legend: {
          data: [that.$t('home.handled'), that.$t('home.size')],
          bottom: 0
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: function(params) {
            var relVal = params[1].name;
            for (var i = 0, l = params.length; i < l; i++) {
              if (i === 1) {
                relVal +=
                  '<br/>' +
                  params[i].marker +
                  params[i].seriesName +
                  ' : ' +
                  params[i].value +
                  ' (Byte)';
              } else {
                relVal +=
                  '<br/>' +
                  params[i].marker +
                  params[i].seriesName +
                  ' : ' +
                  params[i].value;
              }
            }
            return relVal;
          },
          confine: true
        },
        grid: {
          x: 30,
          y: 50,
          x2: 60,
          y2: 50
        },
        xAxis: {
          type: 'category',
          data: data.xAxis,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#555',
              fontSize: 14
            }
          }
        },
        yAxis: [
          {
            //  name: that.$t('home.handled'),
            type: 'value',
            nameTextStyle: {
              padding: [0, 0, 0, 100]
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#C3D7F8'],
                width: 0.5,
                type: 'solid'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#555',
                fontSize: 14
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          },
          {
            // name: that.$t('home.size') + ' (' + that.$t('byte') + ')',
            name: that.$t('byte'),
            type: 'value',
            nameTextStyle: {
              padding: [0, 0, 0, 0]
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#C3D7F8'],
                width: 1,
                type: 'solid'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#555',
                fontSize: 14
              }
              /* formatter: function(value) {
                if (value >= 1024 && value < 1048576) {
                  value = value / 10000 + 'KB';
                } else if (value >= 1048576) {
                  value = value / 1048576 + 'M';
                }
                return value;
              } */
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: that.$t('home.handled'),
            data: data.transcations,
            type: 'line',
            yAxisIndex: 0,
            smooth: true,
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: '#4E8CF3',
                lineStyle: {
                  color: '#4E8CF3'
                }
              }
            }
          },
          {
            name: that.$t('home.size'),
            data: data.size,
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: '#FF6262',
                lineStyle: {
                  color: '#FF6262'
                }
              }
            }
          }
        ]
      });
    }
  }
};
</script>
