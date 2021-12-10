/*
 * @Author: abc
 * @Date: 2020-11-06 10:47:41
 * @LastEditors: abc
 * @LastEditTime: 2021-11-08 14:54:25
 * @Description:page route
 */
const routes = [
  {
    path: '/',
    name: 'Index',
    component: () =>
      import(/* webpackChunkName: "index" */ '../views/home/index.vue'),
    meta: {
      key: '1',
      title: 'home'
    }
  },
  {
    path: '/blockReader',
    name: 'BlockReader',
    component: () =>
      import(
        /* webpackChunkName: "blockReader" */ '../views/blockReader/index.vue'
      ),
    meta: {
      key: '2',
      title: 'block'
    }
  },
  {
    path: '/database',
    component: () =>
      import(/* webpackChunkName: "database" */ '../views/database/index.vue'),
    children: [
      {
        path: '',
        name: 'Database',
        component: () =>
          import(
            /* webpackChunkName: "database" */ '../views/database/dataBase.vue'
          ),
        meta: {
          key: '3',
          title: 'database'
        }
      },
      {
        path: ':name',
        name: 'DataDetails',
        component: () =>
          import(
            /* webpackChunkName: "database" */ '../views/database/dataDetails.vue'
          ),
        meta: {
          key: '3-1',
          title: 'data.details'
        }
      }
    ]
  },
  {
    path: '/blockHeight/:block',
    name: 'BlockHeight',
    component: () =>
      import(
        /* webpackChunkName: "blockHeight" */ '../views/blockHeight/index.vue'
      ),
    meta: {
      key: '5',
      title: 'block.info'
    }
  },
  {
    path: '/transaction/:transaction',
    name: 'Transaction',
    component: () =>
      import(
        /* webpackChunkName: "transaction" */ '../views/transaction/index.vue'
      ),
    meta: {
      key: '6',
      title: 'transaction.details'
    }
  },
  {
    path: '/account/:account',
    name: 'Account',
    component: () =>
      import(/* webpackChunkName: "account" */ '../views/account/index.vue'),
    meta: {
      key: '7',
      title: 'account.details'
    }
  }
];
export default routes;
