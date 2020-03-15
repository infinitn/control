import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '../views/HomePage'

import { resolve } from 'path';

import npminstall from './npminstall'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
      redirect: {
        name: 'ELementUi'
      },
      children: [
        {
          path: 'NpmInstall',
          name: 'NpmInstall',
          component: resolve => require(['../views/homepage/NpmInstall'],resolve),
          children: npminstall
        },
        {
          path: 'Vue',
          name: 'Vue',
          component: resolve => require(['../views/homepage/Vue'],resolve),
          children: [
            {
              path: 'Vuex',
              name: 'Vuex',
              component: resolve => require(['../views/homepage/vue/Vuex'],resolve)
            },
            {
              path: 'VueRouter',
              name: 'VueRouter',
              component: resolve => require(['../views/homepage/vue/VueRouter'],resolve)
            }
          ]
        },
        {
          path: 'Document',
          name: 'Document',
          component: resolve => require(['../views/homepage/Document'],resolve),
          children: [
            {
              path: 'DevelopGuidance',
              name: 'DevelopGuidance',
              component: resolve => require(['../views/homepage/document/DevelopGuidance'],resolve)
            },
            {
              path: 'DevelopStandard',
              name: 'DevelopStandard',
              component: resolve => require(['../views/homepage/document/DevelopStandard'],resolve)
            }
          ]
        },
        {
          path: 'Plugins',
          name: 'Plugins',
          component: resolve => require(['../views/homepage/Plugins'], resolve),
          children: [
            {
              path: 'Mp3Recording',
              name: 'Mp3Recording',
              component: resolve => require(['../views/homepage/plugins/Mp3Recording'], resolve)
            }
          ]
        }
      ]
    }
  ]
})
