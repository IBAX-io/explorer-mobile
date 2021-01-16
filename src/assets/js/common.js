/*
 * @Author: abc
 * @Date: 2020-11-10 10:05:03
 * @LastEditors: abc
 * @LastEditTime: 2020-12-24 15:47:55
 * @Description:common function
 */
const Decimal = require('decimal.js');
export const handleRouterFilter = (arr, role) => {
  const showList = arr.filter(items => {
    if (items.meta.roles.includes(role)) {
      if (items.children) {
        const firstItems = items.children.filter(item => {
          if (item.meta.roles.includes(role)) {
            if (item.children) {
              const secondItem = item.children.filter(sub => {
                return sub.meta.roles.includes(role);
              });
              item.children = secondItem;
              return secondItem;
            }
          }
          return item.meta.roles.includes(role);
        });
        items.children = firstItems;
        return items;
      }
    }
    return items.meta.roles.includes(role);
  });
  return showList;
};
/**
 *
 *@param{Object}num
 */
export function handleDelcommafy(num) {
  if ((num + '').Trim() == '') {
    return '';
  }
  num = num.replace(/,/gi, '');
  return num;
}
/**
 * @name: handleRandomNumBoth
 * @description:
 * @param {*} Min
 * @param {*} Max
 * @return {*}num
 */
export function handleRandomNumBoth(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range);
  return num;
}
/**
 * @name: handleThousandth
 * @description:Thousand percentile format
 * @param {*} num
 * @return {*}num
 */
export function handleThousandFormat(num) {
  if (num != undefined) {
    var arr = num.toString().split('.');
    return (
      (arr[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') +
      (arr[1] ? '.' + arr[1] : '')
    );
  } else {
    return num;
  }
}
export function handleMoneyFormat(money, fixed = 12, format = 1) {
  // console.log(money);
  try {
    if (money > 0) {
      money = new Decimal(money).div(new Decimal(1000000000000));
      //var money =  money/1000000000000;
      if (fixed != undefined) {
        money = money.toFixed(fixed);
      }
      return format ? handleCutZero(handleThousandFormat(money)) : money;
    } else {
      return 0;
    }
  } catch (e) {
    //console.log(e);
  }
}
/**
 * @name: handleCutZero
 * @description:
 * @param {*} old
 * @return {*}
 */
export function handleCutZero(old) {
  let newstr = old;
  console.log(old.indexOf('.') - 1);
  var leng = old.length - old.indexOf('.') - 1;
  if (old.indexOf('.') > -1) {
    for (let i = leng; i > 0; i--) {
      if (
        newstr.lastIndexOf('0') > -1 &&
        newstr.substr(newstr.length - 1, 1) == 0
      ) {
        var k = newstr.lastIndexOf('0');
        if (newstr.charAt(k - 1) == '.') {
          return newstr.substring(0, k - 1);
        } else {
          newstr = newstr.substring(0, k);
        }
      } else {
        return newstr;
      }
    }
  }
  return old;
}
/**
 *
 *
 * @param num
 * @param cent
 * @param isThousand
 * @return '1,234,567.45'
 * @type String
 */
export function handleFormatNumber(num, cent, isThousand) {
  num = num.toString().replace(/\$|,/g, '');
  if (isNaN(num)) num = '0';
  let sign = num == (num = Math.abs(num));

  num = Math.floor(num * Math.pow(10, cent) + 0.50000000001);
  let cents = num % Math.pow(10, cent);
  num = Math.floor(num / Math.pow(10, cent)).toString();
  cents = cents.toString();
  while (cents.length < cent) cents = '0' + cents;
  if (isThousand) {
    for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
      num =
        num.substring(0, num.length - (4 * i + 3)) +
        ',' +
        num.substring(num.length - (4 * i + 3));
  }
  if (cent > 0) return (sign ? '' : '-') + num + '.' + cents;
  else return (sign ? '' : '-') + num;
}
