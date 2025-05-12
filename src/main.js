import Vue from 'vue'
import App from './App.vue'
// 导入router路由
import router from './router'
// 导入Store仓库
import store from './store'
// 导入通用样式comments,重置默认样式
import comments from '@/style/comments.css'
import '@/utils/vant-ui'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  comments,
  render: h => h(App)
}).$mount('#app')
