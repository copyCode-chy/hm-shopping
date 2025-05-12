import request from '@/utils/request'

// 获取用户收货地址
export const getAddress = () => {
  return request.get('/address/list')
}
