import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '../views/HomePage'

import { resolve } from 'path';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
      redirect: {
        name: 'NpmInstall'
      },
      children: [
        {
          path: 'NpmInstall',
          name: 'NpmInstall',
          component: resolve => require(['../views/homepage/NpmInstall'],resolve)
        }
      ]
    }
  ]
})
