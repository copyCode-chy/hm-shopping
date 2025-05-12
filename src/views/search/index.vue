<template>
  <div class="search">
    <van-nav-bar title="商品搜索" left-arrow @click-left="$router.go(-1)" />

    <!-- v-model绑定search获取用户输入的内容 -->
    <van-search show-action placeholder="请输入搜索关键词" clearable v-model="search">
      <template #action>
        <div @click="goSearch(search)">搜索</div>
      </template>
    </van-search>

    <!-- 搜索历史 -->
    <div v-if= "history.length>0" class="search-history">
      <div class="title">
        <span>最近搜索</span>
        <van-icon class="icon" name="delete-o" @click="clear"/>
      </div>
      <div class="list">

        <!-- v-for遍历 -->
        <div class="list-item" @click="goSearch(item)" v-for="item in history" :key="item">
          {{item}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setHistory, getHistory } from '@/utils/storage'

export default {
  name: 'SearchIndex',
  data () {
    return {
      // 创建一个数组存储历史搜索,从本地存储中获取
      history: getHistory(),
      // 创建用于存储用户输入的搜索内容的变量
      search: ''
    }
  },
  methods: {
    goSearch (n) {
      // 获取指定元素在数组中的索引位置
      const index = this.history.indexOf(n)
      // 先判断用户是通过搜索按钮搜索还是通过点击历史搜索进行搜索操作！！此处用于判断用户点击的是历史搜索还是搜索按钮
      this.search = n
      // 如果用户点击搜索按钮没有输入搜索内容
      if (this.search === '') {
        this.$toast('请输入内容！')
        return
      }
      // 如果n在history中已经存在
      if (index !== -1) {
        // 先删除该数组元素
        this.history.splice(index, 1)
      }
      // 添加到首位
      this.history.unshift(n)
      // 搜索后清除搜索框里的内容
      this.search = ''
      // 最后添加到本地存储
      setHistory(this.history)
      // 跳转页面
      this.$router.push(`/searchlist?search=${n}`)
    },
    // 清除
    clear () {
      this.history = []
      setHistory([])
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  .searchBtn {
    background-color: #fa2209;
    color: #fff;
  }
  ::v-deep .van-search__action {
    background-color: #c21401;
    color: #fff;
    padding: 0 20px;
    border-radius: 0 5px 5px 0;
    margin-right: 10px;
  }
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
  }
  .list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 10px;
    gap: 5%;
  }
  .list-item {
    width: 30%;
    text-align: center;
    padding: 7px;
    line-height: 15px;
    border-radius: 50px;
    background: #fff;
    font-size: 13px;
    border: 1px solid #efefef;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 10px;
  }
  .icon {
    cursor: pointer;
    size: 25px;
  }
}
</style>
