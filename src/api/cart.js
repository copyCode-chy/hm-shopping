import request from '@/utils/request'
// 封装添加购物车接口
export const addCart = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/add', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

// 获取购物车列表
export const getCartList = () => request.get('/cart/list')

// 购物车商品更新
export const cartUpdata = (goodsId, goodsSkuId, goodsNum) => {
  return request.post('/cart/update', {
    goodsId,
    goodsSkuId,
    goodsNum
  })
}

// 删除购物车商品
export const delCartList = (cartIds) => {
  return request.post('/cart/clear', {
    cartIds
  })
}

// 添加默认地址
export const setDefaultAddress = (addressId) => {
  return request.post('/address/setDefault', {
    addressId
  })
}
