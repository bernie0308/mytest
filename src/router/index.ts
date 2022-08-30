//现在创建router的方式与vue2.x的版本已经很不同了
import { createRouter, createWebHistory } from 'vue-router'
import { hasLoginToken } from '../sso'
import watermark from '@/utils/watermark'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'home',
    title: '首页',
    component: () => import('@/views/index.vue'),
    props: true
  },
  {
    path: '/error',
    component: () => import('@/views/error.vue')
  },
  {
    name: 'statistics',
    title: '统计中心',
    path: '/statistics',
    component: () => import('@/views/statistics/index.vue'),
    redpot: false,
    redirect: '/statistics/home',
    children: [
      {
        path: '/statistics/home',
        component: () => import('@/views/statistics/home/index.vue'),
        title: '首页',
        icon: 'bar-chart-outlined' 
      },
      {
        path: '/statistics/config',
        component: () => import('@/views/statistics/config/index.vue'),
        title: 'cross-sell 配置',
        icon: 'bar-chart-outlined'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(), // 替代之前的mode，是必须的
  routes
})

// router.beforeEach((to, from, next) => {
//   if (!hasLoginToken()) {
//     const storeInfo = localStorage.getItem('fn_userinfo')
//     console.log('storeInfo', storeInfo)
//     if (storeInfo) {
//       const userinfo = JSON.parse(storeInfo || '{}')
//       console.warn('userinfo', userinfo)
//       store.commit('user/setUserinfo', userinfo)
//       // 在飞书不显示水印
//       if (navigator.userAgent.indexOf('LarkLocale') === -1 && userinfo.name) {
//         watermark.set(`${userinfo.name}`)
//       }
//       console.warn('store.getters.name', store.getters.name)
//     } else {
//       if (to.path.indexOf('to-client') === -1) {
//         store.dispatch('user/getUser')
//       }
//     }
//   }
//   if (to.path === '/sso/login') {
//     next('/')
//   } else {
//     store.commit('base/setNavBarVisible', !to.path.includes('/to-client'))
//     next()
//   }
// })

export default router