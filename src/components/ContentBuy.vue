<template>
  <div class="count-box">
    <button @click="btnSub" class="minus">-</button>
    <input  class="inp" type="text" @change="handleChange" :value="value">
    <button @click="btnAdd" class="add">+</button>
  </div>
</template>

<script>
export default {
  // 父传子
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  methods: {
    // 增加
    btnAdd () {
      this.$emit('input', this.value + 1)
    },
    // 减少
    btnSub () {
      if (this.value <= 1) {
        return
      }
      this.$emit('input', this.value - 1)
    },
    // 对添加的商品数量进行判断
    handleChange (e) {
      // 转换为数字类型
      const num = +e.target.value
      // 如果num为NAN
      if (isNaN(num) || num < 1) {
        e.target.value = this.value
        return
      }
      // 传到父组件
      this.$emit('input', num)
    }
  }
}
</script>

<style lang="less" scoped>
.count-box {
  width: 110px;
  height: 30px;
  display: flex;
  .minus, .add {
    width: 30px;
    height: 30px;
    background-color: #efefef;
    cursor: pointer;
    border: none;
    outline: none;
    text-align: center;
  }
  .inp {
    width: 40px;
    height: 30px;
    background-color: #efefef;
    margin: 0 5px;
    border: none;
    text-align: center;
  }
}
</style>
