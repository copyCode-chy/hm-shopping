import Vue from 'vue'
import Vuex from 'vuex'
// 导入分模块
import user from './modules/user'
import cart from './modules/cart'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: '陈'
  },
  getters: {
    token (state) {
      return state.user.userInfo.token
    }
  },
  mutations: {
  },
  actions: {
  },
  // 挂载分模块
  modules: {
    user,
    cart
  }
})
