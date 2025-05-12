// user分模块
import { setInfo, getInfo } from '@/utils/storage'

export default {
  // 开启命名空间
  namespaced: true,
  // state是所有组件共享的数据
  state () {
    // 分模块的state函数必须返回一个对象！
    return {
      userInfo: getInfo()
    }
  },
  mutations: {
    // 设置state里的值
    setUserInfo (state, obj) {
      state.userInfo = obj
      setInfo(obj)
    }
  },
  actions: {
    // 退出登录
    logout (context) {
      // 重置userInfo，用户信息
      context.commit('setUserInfo', {})
      // 重置购物车
      context.commit('cart/setCartList', [], { root: true })
    }
  },
  getters: {}
}
