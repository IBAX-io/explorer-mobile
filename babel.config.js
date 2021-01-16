/*
 * @Author: abc
 * @Date: 2020-11-03 10:54:28
 * @LastEditors: abc
 * @LastEditTime: 2020-11-27 18:07:17
 * @Description:babel
 */
const plugins = [];
// console
if (process.env.NODE_ENV === 'production') {
  plugins.push('transform-remove-console');
}
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    /*  [
      'import',
      { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: true }
    ], */
    ...plugins,
    'equire'
  ]
};
