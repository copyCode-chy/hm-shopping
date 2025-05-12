export default {
  methods: {
    // 判断用户是否登录
    loginConfim () {
      // 判断有无token
      if (!this.$store.getters.token) {
        // 弹确认框
        this.$dialog.confirm({
          title: '温馨提示',
          message: '需要登录才能继续操作哦',
          cancelButtonText: '再逛逛',
          confirmButtonText: '去登录',
          confirmButtonColor: '#008000'
        })
          .then(() => {
            this.$router.replace({
              path: '/login',
              query: {
                backUrl: this.$route.fullPath
              }
            })
          })
          .catch(() => { })
        return true
      }
      return false
    }
  }
}
