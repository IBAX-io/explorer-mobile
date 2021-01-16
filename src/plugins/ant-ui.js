/*
 * @Author: abc
 * @Date: 2020-11-03 11:50:42
 * @LastEditors: abc
 * @LastEditTime: 2020-12-28 16:10:07
 * @Description:t
 */
import Vue from 'vue';
import {
  Button,
  Icon,
  Layout,
  Menu,
  FormModel,
  Input,
  Row,
  Col,
  ConfigProvider,
  Select,
  Calendar,
  Dropdown,
  Tooltip,
  Pagination,
  Table,
  message,
  Modal,
  BackTop,
  Skeleton,
  Spin,
  Card
} from 'ant-design-vue';
Vue.use(Button)
  .use(Input)
  .use(Icon)
  .use(Layout)
  .use(Menu)
  .use(FormModel)
  .use(Row)
  .use(Col)
  .use(ConfigProvider)
  .use(Select)
  .use(Calendar)
  .use(Dropdown)
  .use(Tooltip)
  .use(Pagination)
  .use(Table)
  .use(message)
  .use(Modal)
  .use(BackTop)
  .use(Skeleton)
  .use(Spin)
  .use(Card);
Vue.prototype.$message = message;
