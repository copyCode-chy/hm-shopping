<template>
  <div class="prodetail">
    <van-nav-bar fixed title="商品详情页" left-arrow @click-left="$router.go(-1)" />

    <van-swipe :autoplay="3000" @change="onChange">
      <van-swipe-item v-for="image in images" :key="image.file_id">
        <img :src="image.external_url" />
      </van-swipe-item>

      <template #indicator>
        <div class="custom-indicator">{{ current + 1 }} / {{ images.length }}</div>
      </template>
    </van-swipe>

    <!-- 商品说明 -->
    <div class="info">
      <div class="title">
        <div class="price">
          <span class="now">￥{{ goodsDetail.goods_price_min }}</span>
          <span class="oldprice">￥{{ goodsDetail.goods_price_max }}</span>
        </div>
        <div class="sellcount">已售{{ goodsDetail.goods_sales }}件</div>
      </div>
      <div class="msg text-ellipsis-2">
        {{ goodsDetail.goods_name }}
      </div>

      <div class="service">
        <div class="left-words">
          <span><van-icon name="passed" />七天无理由退货</span>
          <span><van-icon name="passed" />48小时发货</span>
        </div>
        <div class="right-icon">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <!-- 商品评价 -->
    <div class="comment">
      <div class="comment-title">
        <div class="left">商品评价 ({{commentList.length}}条)</div>
        <div class="right">查看更多 <van-icon name="arrow" /> </div>
      </div>
      <div class="comment-list">
        <div class="comment-item" v-for="item in commentList" :key="item.comment_id">
          <div class="top">
            <img :src="item.user.avatar_url || defaultImage" alt="">
            <div class="name">{{ item.user.nick_name }}</div>
            <van-rate :size="16" :value="item.score / 2" color="#ffd21e" void-icon="star" void-color="#eee"/>
          </div>
          <div class="content">
            {{ item.content }}
          </div>
          <div class="time">
            {{ item.create_time }}
          </div>
        </div>
      </div>
    </div>

    <!-- 商品描述 -->
    <div class="desc" v-html="goodsDetail.content">
    </div>

    <!-- 底部 -->
    <div class="footer">
      <div class="icon-home">
        <van-icon name="wap-home-o" @click="$router.push('/')"/>
        <span>首页</span>
      </div>
      <div class="icon-cart">
        <span v-if="cartTotal > 0" class="num">{{ cartTotal }}</span>
        <van-icon name="shopping-cart-o" @click="$router.push('/cart')"/>
        <span>购物车</span>
      </div>
      <div class="btn-add" @click="btn_add">加入购物车</div>
      <div class="btn-buy" @click="btn_buy">立刻购买</div>
    </div>

    <!-- 加入购物车与立即购买的弹层 -->
    <van-action-sheet v-model="show" :title="distinguish === 'cart' ? '加入购物车' : '立刻购买'">
      <div class="product">
        <div class="product-title">
          <div class="left">
            <img :src="goodsDetail.goods_image" alt="">
          </div>
          <div class="right">
            <div class="price">
              <span>¥</span>
              <span class="nowprice">{{ goodsDetail.goods_price_min }}</span>
            </div>
            <div class="count">
              <span>库存</span>
              <span>{{ goodsDetail.stock_total }}</span>
            </div>
          </div>
        </div>
        <div class="num-box">
          <span>数量</span>
          <ContentBuy v-model="total"></ContentBuy>
        </div>
        <div class="showbtn" v-if="goodsDetail.stock_total !== 0">
          <div class="btn" v-if="distinguish === 'cart'" @click="addCart">加入购物车</div>
          <div class="btn now" v-else @click="goBuyNow">立刻购买</div>
        </div>
        <div class="btn-none" v-else>该商品已抢完</div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { getGoodsComment, getProDetail } from '@/api/product'
import defaultImage from '@/assets/default-avatar.png'
import ContentBuy from '@/components/ContentBuy.vue'
import { addCart } from '@/api/cart'
import loginConfim from '@/mixins/loginConfim'

export default {
  name: 'ProDetail',
  mixins: [loginConfim],
  components: {
    ContentBuy
  },
  data () {
    return {
      images: [],
      commentList: [],
      current: 0,
      goodsDetail: '',
      defaultImage,
      // 控制弹层显示隐藏
      show: false,
      // 区分购买弹层与立即购买弹层
      distinguish: '',
      // 购物车默认商品数量
      total: 1,
      cartTotal: 0 // 购物车角标
    }
  },
  computed: {
    // 动态路由传参获取goodsid
    goodsId () {
      return this.$route.params.id
    }
  },
  created () {
    // 调用获取商品详情方法
    this.getProDe()
    // 调用获取商品评论方法
    this.getComment()
  },
  methods: {
    onChange (index) {
      this.current = index
    },
    // 封装获取商品详情方法
    async getProDe () {
      const { data: { detail } } = await getProDetail(this.goodsId)
      this.goodsDetail = detail
      this.images = detail.goods_images
      console.log(this.goodsDetail)
    },
    // 封装获取商品评论方法
    async getComment () {
      const { data: { list } } = await getGoodsComment(this.goodsId, 999999)
      this.commentList = list
    },
    // 加入购物车弹层
    btn_add () {
      this.show = true
      this.distinguish = 'cart'
    },
    // 购买弹层
    btn_buy () {
      this.show = true
      this.distinguish = 'buy'
    },
    // 点击加入购物车事件
    async addCart () {
      // 判断用户登录
      if (this.loginConfim()) {
        return
      }
      // 添加到购物车
      // 注意：此处第三个参数(goodsSkuId)有问题，暂时无法解决 2025年2月26日14:06:38
      // ---- 2025年3月3日16:26:33 问题已解决，由于老师视频里的参数是detail，自己的参数是goodsDetail。。。。
      const { data } = await addCart(this.goodsId, this.total, this.goodsDetail.skuList[0].goods_sku_id)
      // 购物车角标
      this.cartTotal = data.cartTotal
      this.$toast('加入购物车成功')
      // 关闭弹框
      this.show = false
    },
    // 立即购买
    goBuyNow () {
      // 判断用户登录
      if (this.loginConfim()) {
        return
      }
      this.$router.push({
        path: '/pay',
        query: {
          mode: 'buyNow',
          goodsId: this.goodsId,
          goodsSkuId: this.goodsDetail.skuList[0].goods_sku_id,
          goodsNum: this.total
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.prodetail {
  padding-top: 46px;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  img {
    display: block;
    width: 100%;
  }
  .custom-indicator {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 5px 10px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 15px;
  }
  .desc {
    width: 100%;
    overflow: scroll;
    ::v-deep img {
      display: block;
      width: 100%!important;
    }
  }
  .info {
    padding: 10px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    .now {
      color: #fa2209;
      font-size: 20px;
    }
    .oldprice {
      color: #959595;
      font-size: 16px;
      text-decoration: line-through;
      margin-left: 5px;
    }
    .sellcount {
      color: #959595;
      font-size: 16px;
      position: relative;
      top: 4px;
    }
  }
  .msg {
    font-size: 16px;
    line-height: 24px;
    margin-top: 5px;
  }
  .service {
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    margin-top: 10px;
    font-size: 16px;
    background-color: #fafafa;
    .left-words {
      span {
        margin-right: 10px;
      }
      .van-icon {
        margin-right: 4px;
        color: #fa2209;
      }
    }
  }

  .comment {
    padding: 10px;
  }
  .comment-title {
    display: flex;
    justify-content: space-between;
    .right {
      color: #959595;
    }
  }

  .comment-item {
    font-size: 16px;
    line-height: 30px;
    .top {
      height: 30px;
      display: flex;
      align-items: center;
      margin-top: 20px;
      img {
        width: 20px;
        height: 20px;
      }
      .name {
        margin: 0 10px;
      }
    }
    .time {
      color: #999;
    }
  }

  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 55px;
    background-color: #fff;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .icon-home, .icon-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      .van-icon {
        font-size: 24px;
      }
    }
    .btn-add,
    .btn-buy {
      height: 36px;
      line-height: 36px;
      width: 120px;
      border-radius: 18px;
      background-color: #ffa900;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
    .btn-buy {
      background-color: #fe5630;
    }
    .icon-cart {
    position: relative;
    padding: 0 6px;
      .num {
        z-index: 999;
        position: absolute;
        top: -2px;
        right: 0;
        min-width: 16px;
        padding: 0 4px;
        color: #fff;
        text-align: center;
        background-color: #ee0a24;
        border-radius: 50%;
      }
    }
  }
}

.tips {
  padding: 10px;
}
.content {
    padding: 16px 16px 160px;
}

// 弹层样式
.product {
  .product-title {
    display: flex;
    .left {
      img {
        width: 90px;
        height: 90px;
      }
      margin: 10px;
    }
    .right {
      flex: 1;
      padding: 10px;
      .price {
        font-size: 14px;
        color: #fe560a;
        .nowprice {
          font-size: 24px;
          margin: 0 5px;
        }
      }
    }
  }
  .num-box {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    align-items: center;
  }

  .btn, .btn-none {
    height: 40px;
    line-height: 40px;
    margin: 20px;
    border-radius: 20px;
    text-align: center;
    color: rgb(255, 255, 255);
    background-color: rgb(255, 148, 2);
  }
  .btn.now {
    background-color: #fe5630;
  }
  .btn-none {
    background-color: #cccccc;
  }
}
</style>
