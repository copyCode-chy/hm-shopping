import Vue from 'vue'
import App from './App.vue'
// 导入router路由
import router from './router'
// 导入Store仓库
import store from './store'
// 导入通用样式comments,重置默认样式
import comments from '@/style/comments.css'
import '@/utils/vant-ui'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('@/assets/loading-file.png'), // 加载失败时显示的图片
  loading: require('@/assets/loading-file.png'), // 加载中显示的图片
  attempt: 1
})

new Vue({
  router,
  store,
  comments,
  render: h => h(App)
}).$mount('#app')
