import { cartUpdata, delCartList, getCartList } from '@/api/cart'
import { Toast } from 'vant'

export default {
  // 开启命名空间
  namespaced: true,
  state: {
    cartList: []
  },
  actions: {
    async getCartAction (context) {
      // 获取购物车列表请求
      const { data: { list } } = await getCartList()
      list.forEach(item => {
        item.isChecked = true
      })
      // 提交数据
      context.commit('setCartList', list)
    },
    // 改变goodsnum
    async cgGoodsNum (context, obj) {
      const { goodsId, goodsSkuId, goodsNum } = obj
      // 先本地修改
      context.commit('changeCount', { goodsId, goodsNum })
      // 再同步到后台
      const res = await cartUpdata(goodsId, goodsSkuId, goodsNum)
      console.log(res)
    },
    // 发送删除购物车商品请求
    async clearCartList (context) {
      // 首先获取购物车选中的商品的id,因此先调用getter里选中的商品列表selCartList，再遍历出存储id的数组
      const selCartListId = context.getters.selCartList.map(item => item.id)
      // 获取id即可发送请求
      const { message } = await delCartList(selCartListId)
      Toast(message)
      // 重新渲染购物车页面
      await context.dispatch('getCartAction')
    }
  },
  mutations: {
    // 设置购物车
    setCartList (state, newValue) {
      state.cartList = newValue
    },
    // 复选框取反
    toggleCheck (state, goodsId) {
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.isChecked = !goods.isChecked
    },
    // 全选按钮，flag(true/false)决定所有复选框是否选中
    toggleAllCheck (state, flag) {
      state.cartList.forEach(item => {
        item.isChecked = flag
      })
    },
    changeCount (state, value) {
      const { goodsId, goodsNum } = value
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.goods_num = goodsNum
    }
  },
  getters: {
    // 购物车商品总数
    cartTotal (state) {
      return state.cartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中商品列表
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked)
    },
    // 选中商品总数
    selCount (state, getters) {
      return getters.selCartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中商品总价
    selPrice (state, getters) {
      return getters.selCartList.reduce((sum, item) => {
        return sum + item.goods_num * item.goods.goods_price_min
      }, 0).toFixed(2)
    },
    isAllCheck (state) {
      return state.cartList.every(item => item.isChecked)
    }
  }
}
