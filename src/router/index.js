import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

import layout from '@/views/layout'
import pay from '@/views/pay'
import category from '@/views/layout/category.vue'
import home from '@/views/layout/home.vue'
import user from '@/views/layout/user.vue'

// 懒加载
const login = () => import('@/views/login')
const cart = () => import('@/views/layout/cart.vue')
const search = () => import('@/views/search')
const prodetail = () => import('@/views/prodetail')
const searchlist = () => import('@/views/search/list.vue')
const myorder = () => import('@/views/myorder')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: layout,
      // 在一级路由layout里配置二级路由
      redirect: '/home',
      children: [
        { path: '/cart', component: cart },
        { path: '/category', component: category },
        { path: '/home', component: home },
        { path: '/user', component: user }
      ]
    },
    // 配置一级路由
    { path: '/login', component: login },
    { path: '/myorder', component: myorder },
    { path: '/pay', component: pay },
    { path: '/prodetail/:id?', component: prodetail },
    { path: '/search', component: search },
    { path: '/searchlist', component: searchlist }
  ]
})

// 首先创建一个数组存储需要权限才能访问的页面
const pmsUrl = ['/pay', '/myorder']

// 创建全局前置守卫
router.beforeEach((to, from, next) => {
  // 先判断当前页面是否为非权限页面
  if (!pmsUrl.includes(to.path)) {
    // 非权限访问页面直接放行
    next()
    return
  }

  // 若当前访问的是权限页面，则判断是否存在token
  if (store.state.user.userInfo.token) {
    next()
  } else {
    next('/login')
  }
})

export default router
