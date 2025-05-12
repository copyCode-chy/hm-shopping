import store from '@/store'
import axios from 'axios'

import { Toast } from 'vant'
// 创建axios实例，将来对创建出来的实例，进行自定义配置
const instance = axios.create({
  baseURL: 'http://smart-shop.itheima.net/index.php?s=/api',
  timeout: 5000
})

// 添加请求拦截器
// config 就是存储和描述 HTTP 请求配置信息的地方，它包括请求的所有元数据和具体的参数。
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 加载提示
  Toast.loading({
    message: '加载中...',
    // 开启禁止背景点击
    forbidClick: true,
    // 加载图标
    loadingType: 'spinner',
    // 展示时长，为0则不会自动关闭
    duration: 0
  })

  // 只要有token，就在请求时携带，便于请求需要授权的接口
  const token = store.getters.token
  if (token) {
    // 并配置header里的参数
    config.headers['Access-Token'] = token
    config.headers.platform = 'H5'
  }

  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
// response 是服务器处理完请求后返回给客户端（如浏览器、前端应用等）的数据。
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么(默认axios会多包装一层data，需要响应拦截器中处理一下)
  const res = response.data
  if (res.status !== 200) {
    // 错误提示
    Toast(res.message)
    // 抛出一个错误的Promise
    return Promise.reject(res.message)
  } else {
    // 在返回响应数据前，关闭加载提示
    Toast.clear()
  }
  return res
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default instance
