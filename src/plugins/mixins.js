/*
 * @Author: abc
 * @Date: 2020-12-07 10:15:34
 * @LastEditors: abc
 * @LastEditTime: 2021-11-08 16:03:28
 * @Description:mixins
 */
import moment from 'moment';
import Centrifuge from 'centrifuge';
export default {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          echartsLoading: true,
          green: `color:green; font-size: 14px;`,
          blue: `color:blue; font-size: 14px;`,
          yellow: `background:#000;color:yellow; font-size: 14px;`
        };
      },
      methods: {
        isJSON(str) {
          if (typeof str == 'string') {
            try {
              var obj = JSON.parse(str);
              if (typeof obj == 'object' && obj) {
                return true;
              } else {
                return false;
              }
            } catch (e) {
              console.log('error：' + str + '!!!' + e);
              return false;
            }
          }
          console.log('It is not a string!');
        },
        handleChangeJson(str) {
          const boo = this.isJSON(str);
          let obj;
          if (boo) {
            obj = JSON.parse(str);
          } else {
            obj = str;
          }
          return obj;
        },
        handleIsType(account, record) {
          //  console.log(account, record);
          if (account === record.sender_id && account !== record.recipient_id) {
            return {
              sign: '-',
              color: '#FF0000',
              account: record.recipient_id
            };
          } else if (
            account === record.recipient_id &&
            account !== record.sender_id
          ) {
            return {
              sign: '+',
              color: '#4E8CF3',
              account: record.sender_id
            };
          } else {
            return { sign: '+-', color: '#55586f', account: record.sender_id };
          }
        },
        getSocket({ url, token }, fn, subscribe) {
          // console.log(url, token);
          this.centrifuge = new Centrifuge(url);
          this.centrifuge.setToken(token);
          // start contact
          let that = this;
          this.centrifuge.connect();
          var callbacks = {
            // See below description of message format
            publish: function(message) {
              fn(message.data);
              //that.homeLoading = false;
              //  console.log(message);
              const info = 'Data  successful';
              console.log(`%c${subscribe}:${info};`, that.green);
            },
            // See below description of join message format
            join: function(message) {
              console.log(222);
              console.log(message);
            },
            // See below description of leave message format
            leave: function(message) {
              console.log(333);
              console.log(message);
            },
            // See below description of subscribe callback context format
            subscribe: function(context) {
              const info = 'Subscribe Success';
              console.log(`%c${context.channel}:${info};`, that.blue);
            },
            // See below description of subscribe error callback context format
            error: function(context) {
              console.error(`${context.channel}:Subscription Success;`);
            },
            // See below description of unsubscribe event callback context format
            unsubscribe: function(context) {
              console.log(`%c${context.channel}:Break off;`, that.yellow);
            }
          };
          this.centrifuge.subscribe(subscribe, callbacks);
          this.$once('hook:beforeDestroy', () => {
            this.centrifuge.disconnect();
          });
        },
        echartsMap(arr, echarts, dom) {
          //  document.getElementById(dom).removeAttribute('_echarts_instance_');
          let chart = echarts.init(document.getElementById(dom));
          chart.clear();
          window.addEventListener('resize', function() {
            chart.resize();
          });
          var series = [];
          let arrLine = [[]];
          arr.map(item => {
            let coord = {
              coord: [item[0].value[0], item[0].value[1]]
            };
            arrLine[0].push(coord);
          });
          console.log(JSON.stringify(arrLine));
          var color = ['#446CAF', 'white'];
          if (arr.length === 2) {
            series.push(
              {
                type: 'lines',
                zlevel: 1,
                effect: {
                  show: true,
                  period: 2,
                  trailLength: 0.7,
                  color: color[0],
                  symbolSize: 6
                },
                lineStyle: {
                  normal: {
                    color: color[0],
                    width: 0,
                    curveness: -0.2
                  }
                },
                data: arrLine
              },
              {
                type: 'lines',
                zlevel: 2,
                symbolSize: 10,
                effect: {
                  show: true,
                  period: 2,
                  trailLength: 0,
                  symbolSize: 5
                },
                lineStyle: {
                  normal: {
                    color: color[0],
                    width: 2,
                    opacity: 0.6,
                    curveness: -0.2
                  }
                },
                data: arrLine,
                coords: arrLine
              }
            );
          }
          series.push(
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 3,
              rippleEffect: {
                brushType: 'stroke'
              },
              label: {
                normal: {
                  show: true,
                  position: 'left',
                  formatter: '{b}',
                  fontSize: 16
                },
                confine: true
              },
              itemStyle: {
                normal: {
                  color: color[0]
                }
              },
              symbolSize: function() {
                return 8;
              },
              data: arr[0]
            },
            {
              // type: 'scatter',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 3,
              rippleEffect: {
                brushType: 'stroke'
              },
              label: {
                normal: {
                  emphasis: {
                    show: false
                  },
                  show: true,
                  position: 'left',
                  formatter: '{b}',
                  fontSize: 16
                },
                confine: true
              },
              symbolSize: function() {
                return 14;
              },
              // symbol: './image/mark.png',
              roam: true,
              itemStyle: {
                normal: {
                  color: '#446CAF'
                }
              },
              data: arr[1]
            }
          );
          chart.setOption({
            title: {
              text: '',
              textStyle: {
                color: '#fff',
                fontSize: 20
              },
              top: '20px',
              left: '20px'
            },
            geo: {
              map: 'world',
              roam: false,
              itemStyle: {
                normal: {
                  areaColor: '#E8F0FF'
                },
                emphasis: {
                  areaColor: '#5281D0',
                  color: '#fff',
                  label: {
                    color: '#fff'
                  }
                }
              }
            },
            tooltip: {
              show: false,
              enterable: true,
              confine: true,
              backgroundColor: 'rgba(68,108,175)',
              position: function(point, params, dom, rect, size) {
                var x = point[0];
                var y = point[1];
                //var viewWidth = size.viewSize[0];
                // var viewHeight = size.viewSize[1];
                var boxWidth = size.contentSize[0];
                var boxHeight = size.contentSize[1];
                var posX = 0;
                var posY = 0;
                if (x < boxWidth) {
                  posX = 5;
                } else {
                  posX = x - 0;
                }
                if (y < boxHeight) {
                  posY = 5;
                } else {
                  posY = y - 10;
                }

                return [posX, posY];
              },
              formatter: function(params) {
                //console.log(params.data);
                if (params.data.value) {
                  let {
                    block_id,
                    latest,
                    node_blocks,
                    pack
                  } = params.data.value[2].info;
                  var htmlStr = `<div class="home-tooltip">
            <h3>${params.name}</h3>
            <div class="home-tooltip-box">
               <div class="home-tooltip-text">
                   <span title="${node_blocks}">${node_blocks}</span>
                   <span class="home-tooltip-text-show">${pack}</span>
                </div>
               <div class="home-tooltip-text">
                   <span title="${node_blocks}">${block_id}</span>
                   <span class="home-tooltip-text-show">${latest}</span>
               </div>
            </div>
            </div>`;
                  return htmlStr;
                }
              }
            },
            series: series,
            textStyle: {
              fontSize: 12
            }
          });
        }
      },
      filters: {
        formatTime(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
          return moment.unix(dataStr).format(pattern);
        },
        formatTimeCst(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
          return moment(dataStr).format(pattern);
        },
        formatTimeUtc(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
          return moment
            .unix(dataStr)
            .utc()
            .format(pattern);
        },
        formatTimeUtcCst(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
          return moment(dataStr)
            .utc()
            .format(pattern);
        }
      }
    });
  }
};
