<template>
  <div class="cart">
    <van-nav-bar title="购物车" fixed />
    <!-- 购物车开头 -->
    <div class="cart-title">
      <span class="all">共<i>{{ cartTotal }}</i>件商品</span>
      <span class="edit" @click="isEdit = !isEdit">
        <van-icon name="edit"/>
        编辑
      </span>
    </div>

    <!-- 购物车列表 -->
    <div class="cart-list" v-if="isLogin && cartList.length > 0">
      <div class="cart-item" v-for="item in cartList" :key="item.goods_id">
        <van-checkbox :value="item.isChecked" class="checkbox" @click="toggleCheck(item.goods_id)"></van-checkbox>
        <div class="show">
          <img :src="item.goods.goods_image" alt="">
        </div>
        <div class="info">
          <span class="tit text-ellipsis-2">{{ item.goods.goods_name}}</span>
          <span class="bottom">
            <div class="price">¥ <span>{{ item.goods.goods_price_min }}</span></div>
            <!-- 既希望保留原本的形参，又需要通过调用函数传参 => 箭头函数包装一层 -->
            <ContentBuy :value="item.goods_num" @input="(value) => changeCount(item.goods_id, item.goods_sku_id, value)"></ContentBuy>
          </span>
        </div>
      </div>
    </div>
    <!-- 购物车为空时 -->
    <div class="empty-cart" v-else>
      <img src="@/assets/empty.png" alt="">
      <div class="tips">
        您的购物车是空的, 快去逛逛吧
      </div>
      <div class="btn" @click="$router.push('/')">去逛逛</div>
    </div>

    <div class="footer-fixed">
      <div  class="all-check">
        <van-checkbox  icon-size="18" :value="isAllCheck" @click="isAllChecked"></van-checkbox>
        全选
      </div>

      <div class="all-total">
        <div class="price">
          <span>合计：</span>
          <span>¥ <i class="totalPrice">{{ selPrice }}</i></span>
        </div>
        <div v-if="!isEdit" class="goPay" :class="{disabled: selCount === 0}" @click="goPay">结算({{ selCount }})</div>
        <div v-else class="delete"     :class="{disabled: selCount === 0}" @click="clearCartList">删除</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import ContentBuy from '@/components/ContentBuy.vue'

export default {
  name: 'CartPage',
  data () {
    return {
      isEdit: false
    }
  },
  created () {
    if (this.isLogin) {
      this.$store.dispatch('cart/getCartAction')
    }
  },
  computed: {
    // 映射
    ...mapState('cart', ['cartList']),
    ...mapGetters('cart', ['cartTotal', 'selCartList', 'selCount', 'selPrice', 'isAllCheck']),
    isLogin () {
      return this.$store.getters.token
    }
  },
  components: {
    ContentBuy
  },
  // 由于store里的值不能随意修改，因此需要commit调用store里的mutations里的方法，修改值
  methods: {
    // 复选框点击事件
    toggleCheck (goodsId) {
      this.$store.commit('cart/toggleCheck', goodsId)
    },
    // 全选按钮点击事件
    isAllChecked () {
      this.$store.commit('cart/toggleAllCheck', !this.isAllCheck)
    },
    // 复用组件ContentBuy里的input值发生改变时，触发
    changeCount (goodsId, goodsSkuId, goodsNum) {
      this.$store.dispatch('cart/cgGoodsNum', {
        goodsId,
        goodsSkuId,
        goodsNum
      })
    },
    // 到cart子模块里执行删除购物车商品请求
    async clearCartList () {
      if (this.selCount === 0) return
      await this.$store.dispatch('cart/clearCartList')
      this.isEdit = false
    },
    // 购物车结算跳转传参
    goPay () {
      if (this.selCount > 0) {
        this.$router.push({
          path: '/pay',
          query: {
            mode: 'cart',
            cartIds: this.selCartList.map(item => item.id).join(',')
          }
        })
      }
    }
  },
  watch: {
    isEdit (newValue) {
      if (newValue) {
        this.$store.commit('cart/toggleAllCheck', false)
      } else {
        this.$store.commit('cart/toggleAllCheck', true)
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 主题 padding
.cart {
  padding-top: 46px;
  padding-bottom: 100px;
  background-color: #f5f5f5;
  min-height: 100vh;
  .cart-title {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    font-size: 14px;
    .all {
      i {
        font-style: normal;
        margin: 0 2px;
        color: #fa2209;
        font-size: 16px;
      }
    }
    .edit {
      .van-icon {
        font-size: 18px;
      }
    }
  }

  .cart-item {
    margin: 0 10px 10px 10px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    border-radius: 5px;

    .show img {
      width: 80px;
      height: 80px;
    }

    .info {
      width: 210px;
      padding: 10px 5px;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .bottom {
        display: flex;
        justify-content: space-between;
        .price {
          display: flex;
          align-items: flex-end;
          color: #fa2209;
          font-size: 12px;
          span {
            font-size: 16px;
          }
        }
        .count-box {
          display: flex;
          width: 110px;
          .add,
          .minus {
            width: 30px;
            height: 30px;
            outline: none;
            border: none;
          }
          .inp {
            width: 40px;
            height: 30px;
            outline: none;
            border: none;
            background-color: #efefef;
            text-align: center;
            margin: 0 5px;
          }
        }
      }
    }
  }
}

.footer-fixed {
  position: fixed;
  left: 0;
  bottom: 50px;
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  .all-check {
    display: flex;
    align-items: center;
    .van-checkbox {
      margin-right: 5px;
    }
  }

  .all-total {
    display: flex;
    line-height: 36px;
    .price {
      font-size: 14px;
      margin-right: 10px;
      .totalPrice {
        color: #fa2209;
        font-size: 18px;
        font-style: normal;
      }
    }

    .goPay, .delete {
      min-width: 100px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      background-color: #fa2f21;
      color: #fff;
      border-radius: 18px;
      &.disabled {
        background-color: #ff9779;
      }
    }
  }

}

.empty-cart {
  padding: 80px 30px;
  img {
    width: 140px;
    height: 92px;
    display: block;
    margin: 0 auto;
  }
  .tips {
    text-align: center;
    color: #666;
    margin: 30px;
  }
  .btn {
    width: 110px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background-color: #fa2c20;
    border-radius: 16px;
    color: #fff;
    display: block;
    margin: 0 auto;
  }
}
</style>
