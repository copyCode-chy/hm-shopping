// 此处用于导入所有登录相关的接口请求
import request from '@/utils/request'

// 发送获取图形验证码请求
export const getPict = () => {
  return request.get('/captcha/image')
}

// 获取短信验证码
export const getMsgCode = (captchaCode, captchaKey, mobile) => {
  return request.post('/captcha/sendSmsCaptcha', {
    form: {
      captchaCode, // 图形验证码
      captchaKey, // 图形验证唯一标识(key)
      mobile // 手机号
    }
  })
}

// 登录接口
export const codeLogin = (smsCode, mobile) => {
  return request.post('/passport/login', {
    form: {
      smsCode, // 手机短信验证码
      mobile, // 手机号
      isParty: false, // 是否存在第三方用户信息
      partyData: {} // 第三方登录信息，默认{}
    }
  })
}
