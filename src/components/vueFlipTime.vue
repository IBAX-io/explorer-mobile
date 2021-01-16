<!--
 * @Author: abc
 * @Date: 2020-12-01 11:18:07
 * @LastEditors: abc
 * @LastEditTime: 2020-12-29 18:09:50
 * @Description: time plugins
-->
<template>
  <div>
    <div class="clock" id="clock">
      <div class="header-time-year">
        <div class="flip down">
          <div class="digital front number0"></div>
          <div class="digital back number1"></div>
        </div>
        <div class="flip down">
          <div class="digital front number0"></div>
          <div class="digital back number1"></div>
        </div>
        <div class="flip down">
          <div class="digital front number0"></div>
          <div class="digital back number1"></div>
        </div>
        <div class="flip down">
          <div class="digital front number0"></div>
          <div class="digital back number1"></div>
        </div>
      </div>
      <div class="header-time-month">
        <div class="flip down">
          <div class="digital front number0"></div>
          <div class="digital back number1"></div>
        </div>
        <div class="flip down">
          <div class="digital front number0"></div>
          <div class="digital back number1"></div>
        </div>
      </div>
      <div class="header-time-day">
        <div class="flip down">
          <div class="digital front number0"></div>
          <div class="digital back number1"></div>
        </div>
        <div class="flip down">
          <div class="digital front number0"></div>
          <div class="digital back number1"></div>
        </div>
      </div>
      <div class="header-time-houre">
        <div class="flip down">
          <div class="digital front number0"></div>
          <div class="digital back number1"></div>
        </div>
        <div class="flip down">
          <div class="digital front number0"></div>
          <div class="digital back number1"></div>
        </div>
        <em style="left:35px">:</em>
        <div class="flip down" style="margin-left:6px;">
          <div class="digital front number0"></div>
          <div class="digital back number1"></div>
        </div>
        <div class="flip down" style="margin-right:5px;">
          <div class="digital front number0"></div>
          <div class="digital back number1"></div>
        </div>
        <em style="left:77px">:</em>
        <div class="flip down">
          <div class="digital front number0"></div>
          <div class="digital back number1"></div>
        </div>
        <div class="flip down">
          <div class="digital front number0"></div>
          <div class="digital back number1"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // this.initTime();
    this.initTable();
  },
  methods: {
    initTime() {
      var flip = document.getElementById('flip');
      var backNode = document.querySelector('.back');
      var frontNode = document.querySelector('.front');
      var btn1 = document.getElementById('btn1');
      var btn2 = document.getElementById('btn2');
      btn1.addEventListener('click', function() {
        flipDown();
      });
      btn2.addEventListener('click', function() {
        flipUp();
      });
      var count = 0;
      var isFlipping = false;
      function flipDown() {
        if (isFlipping) {
          return false;
        }
        frontNode.setAttribute('class', 'digital front number' + count);
        var nextCount = count >= 9 ? 0 : count + 1;
        backNode.setAttribute('class', 'digital back number' + nextCount);
        flip.setAttribute('class', 'flip down go');
        isFlipping = true;
        //
        setTimeout(function() {
          //  go
          flip.setAttribute('class', 'flip down');
          //  false
          isFlipping = false;
          //  +
          frontNode.setAttribute('class', 'digital front number' + nextCount);
          //
          count = nextCount;
        }, 1000);
      }
      function flipUp() {
        if (isFlipping) {
          return false;
        }
        frontNode.setAttribute('class', 'digital front number' + count);
        var nextCount = count <= 0 ? 9 : count - 1;
        backNode.setAttribute('class', 'digital back number' + nextCount);
        flip.setAttribute('class', 'flip up go');
        isFlipping = true;
        setTimeout(function() {
          flip.setAttribute('class', 'flip up');
          isFlipping = false;
          frontNode.setAttribute('class', 'digital front number' + nextCount);
          count = nextCount;
        }, 1000);
      }
    },

    initTable() {
      function Flipper(config) {
        //
        this.config = {
          //
          node: null,
          //
          frontText: 'number0',
          //
          backText: 'number1',
          //      CSS  animation-duratio  ）
          duration: 500
        }; //  class  htm      class
        this.nodeClass = {
          flip: 'flip',
          front: 'digital front',
          back: 'digital back'
        };
        //
        Object.assign(this.config, config);
        //  DO
        this.frontNode = this.config.node.querySelector('.front');
        this.backNode = this.config.node.querySelector('.back');
        //    ）
        this.isFlipping = false;
        //
        this._init();
      }
      Flipper.prototype = {
        constructor: Flipper,
        //
        _init: function() {
          //
          this._setFront(this.config.frontText);
          this._setBack(this.config.backText);
        },
        //
        _setFront: function(className) {
          this.frontNode.setAttribute(
            'class',
            this.nodeClass.front + ' ' + className
          );
        },
        //
        _setBack: function(className) {
          this.backNode.setAttribute(
            'class',
            this.nodeClass.back + ' ' + className
          );
        },
        _flip: function(type, front, back) {
          //
          if (this.isFlipping) {
            return false;
          }
          //  true
          this.isFlipping = true;
          //
          this._setFront(front);
          //
          this._setBack(back);
          //  typ
          let flipClass = this.nodeClass.flip;
          if (type === 'down') {
            flipClass += ' down';
          } else {
            flipClass += ' up';
          } //  class
          this.config.node.setAttribute('class', flipClass + ' go');
          //      clas
          setTimeout(() => {
            //  class
            this.config.node.setAttribute('class', flipClass);
            //  false
            this.isFlipping = false;
            //      。
            this._setFront(back);
          }, this.config.duration);
        }, //
        flipDown: function(front, back) {
          this._flip('down', front, back);
        }, //
        flipUp: function(front, back) {
          this._flip('up', front, back);
        }
      };
      //
      let clock = document.getElementById('clock');
      //
      let flips = clock.querySelectorAll('.flip');
      //
      let now = new Date();
      //    20:30:10  "203010
      let nowTimeStr = formatDate(now, 'yyyymmddhhiiss');
      //
      let nextTimeStr = formatDate(
        new Date(now.getTime() + 1000),
        'yyyymmddhhiiss'
      );
      //      Flippe
      let flipObjs = [];
      for (let i = 0; i < flips.length; i++) {
        //    Flippe    flipObjs
        flipObjs.push(
          new Flipper({
            //  Flippe  DO
            node: flips[i],
            //
            frontText: 'number' + nowTimeStr[i],
            backText: 'number' + nextTimeStr[i]
          })
        );
      }
      setInterval(function() {
        //
        let now = new Date(); //
        let nowTimeStr = formatDate(
          new Date(now.getTime() - 1000),
          'yyyymmddhhiiss'
        );
        //
        let nextTimeStr = formatDate(now, 'yyyymmddhhiiss');
        //
        for (let i = 0; i < flipObjs.length; i++) {
          //
          if (nowTimeStr[i] === nextTimeStr[i]) {
            continue;
          } //
          flipObjs[i].flipDown(
            'number' + nowTimeStr[i],
            'number' + nextTimeStr[i]
          );
        }
      }, 1000);
      //
      function formatDate(date, dateFormat) {
        /*           *  ：yyyy => 2019
         *      yy => 19
         *      y => 9
         */
        if (/(y+)/.test(dateFormat)) {
          dateFormat = dateFormat.replace(
            RegExp.$1,
            (date.getUTCFullYear() + '').substr(4 - RegExp.$1.length)
          );
        }
        //
        let o = {
          'y+': date.getUTCFullYear(),
          'm+': date.getUTCMonth() + 1,
          'd+': date.getUTCDate(),
          'h+': date.getUTCHours(),
          'i+': date.getUTCMinutes(),
          's+': date.getUTCSeconds()
        };
        for (let k in o) {
          if (new RegExp(`(${k})`).test(dateFormat)) {
            //
            let str = o[k] + '';
            /*
             *  :    ，hh => 08，h => 8
             *    >=1
             *  :  1  ，hh => 15, h => 15
             */
            dateFormat = dateFormat.replace(
              RegExp.$1,
              RegExp.$1.length === 1 ? str : padLeftZero(str)
            );
          }
        }
        //
        function padLeftZero(str) {
          return ('00' + str).substr(str.length);
        }
        return dateFormat;
      }
    }
  }
};
</script>
