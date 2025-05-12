<template>
  <div class="login">
    <van-nav-bar title="会员登录" left-arrow @click-left="$router.back()" />
    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input class="inp" maxlength="11" placeholder="请输入手机号码" type="text" v-model="mobile">
        </div>
        <div class="form-item">
          <input class="inp" maxlength="5" placeholder="请输入图形验证码" type="text" v-model="picCode">
          <img :src=picUrl alt="" @click="getPict" v-if="picUrl">
        </div>
        <div class="form-item">
          <input class="inp" placeholder="请输入短信验证码" type="text" v-model="msgCode">
          <button @click="verify">{{ seconds === timerSeconds? '获取验证码' : timerSeconds + '秒后重新发送'}}</button>
        </div>
      </div>

      <div class="login-btn" @click="login">登录</div>
    </div>
  </div>
</template>

<script>
import { getPict, getMsgCode, codeLogin } from '@/api/login'
import { Toast } from 'vant'
export default {
  data () {
    return {
      picUrl: '', // 存储请求渲染的图片地址
      picKey: '', // 将来请求传递的图形验证码唯一标识
      seconds: 60, // 计时器总秒数
      timerSeconds: 60, // 当前倒计时秒数
      timeId: null, // 定时器Id
      picCode: '', // 用户输入的图形验证码
      msgCode: '', // 用户输入的手机验证码
      mobile: '' // 用户输入的手机号
    }
  },
  name: 'loginPart',
  // 在渲染创建阶段调用一次获取验证码getPict,这样用户第一次进入页面时验证码不会为空白
  created () {
    this.getPict()
  },
  methods: {
    async getPict () {
      const { data: { base64, key } } = await getPict()
      this.picUrl = base64
      this.picKey = key
      console.log(this.picKey)
    },
    // vant2轻提示
    check () {
      Toast('验证码获取成功')
    },
    // 计时器
    async timer () {
      // 发送获取短信验证码请求
      const res = await getMsgCode(this.picCode, this.picKey, this.mobile)
      console.log(res)
      this.$toast('短信验证码已发送')
      // 开启倒计时
      this.timeId = setInterval(() => {
        // 递减
        this.timerSeconds--
        // 当计时器小于等于零时
        if (this.timerSeconds <= 0) {
          // 关闭定时器  注意：定时器关闭了但是计时器id不会自动清除需要手动设其为null
          clearInterval(this.timeId)
          // 清空计时器id
          this.timeId = null
          // 重置倒计时
          this.timerSeconds = this.seconds
        }
      }, 1000)
    },
    // 调用校验方法以及轻提示和定时器
    verify () {
      // 校验手机号和验证码，若两者不通过则return
      if (!this.validFn()) {
        return
      }
      // 判断条件当计时器为空且计时器总数与当前计时器相等时执行两个方法
      if (this.timeId === null && this.seconds === this.timerSeconds) {
        // 发送短信验证码请求
        this.timer()
        // 轻提示
        this.check()
      }
    },
    // 离开页面清除计时器
    destroyed () {
      clearInterval(this.timeId)
    },

    // 校验输入框的内容
    validFn () {
      // test()用于测试字符串是否与正则表达式匹配。
      if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
        this.$toast('请输入正确手机号')
        return false
      }
      if (!/^\w{4}/.test(this.picCode)) {
        this.$toast('请输入正确的图形验证码')
        return false
      }
      return true
    },
    // 点击登录触发
    async login () {
      // 效验手机号与图形验证码
      if (!this.validFn()) {
        return
      }
      // 校验用户输入的验证码
      if (!/^\d{6}$/.test(this.msgCode)) {
        this.$toast('请输入正确的手机验证码')
        return
      }
      const res = await codeLogin(this.msgCode, this.mobile)

      // 调用mutations方法
      this.$store.commit('user/setUserInfo', res.data)
      this.$toast('登录成功')
      console.log(res.data)

      // 判断是否有回跳地址
      // 如果有，说明是拦截到登录来的，需要回跳
      // 如果没有，正常去首页
      const url = this.$route.query.backUrl || '/'
      this.$router.replace(url)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;
  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
      cursor: pointer;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
      cursor: pointer;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
