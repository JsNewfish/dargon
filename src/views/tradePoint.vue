<template>
  <div class="shoppingCar pos-r">
    <main class="pos-a">
      <a class="btn-act-center pos-a" v-bind:href="shopDto.integralUrl">赚取{{'积分'|unitFormat}}</a>
      <a class="btn-act-rules pos-a" href="javascript:void(0)" v-on:click="rulerDialogIsShow = true">活动规则></a>
      <div class="dialog act-ruler pos-f text-center" v-show="rulerDialogIsShow">
        <div class="btn-cancel pos-a" v-on:click="rulerDialogIsShow = false">
          <img src="../assets/images/activity/btn_cancel.png" alt="" />
        </div>
        <h2>{{actRuler.title}}</h2>
        <hr/>
        <ul>
          <li v-for="item in actRuler.detail">
            {{item}}
          </li>
        </ul>
      </div>
      <div class="point-banner"></div>
      <div class="shop clearfix">
        <div class="shop-logo pull-left" v-on:click="jumpToShop">
          <img :src="shopDto.shop.picPath" alt="" />
        </div>
        <div class="shop-info">
          <h2 class="shop-name">
                {{shopDto.shop.name}}
              </h2>
          <p class="act-detail">
            下单本活动页面中的宝贝，即可获得积分！
          </p>
          <p class="purchase">
            交易成功后，积分将自动发放到账户上。
          </p>
        </div>
      </div>
      <div class="goods-list">
        <ul class="clearfix" v-on:scroll="scroll">
          <li class="pull-left goods" v-for="(goods,idx) in goodsList">
            <div class="goods-img" v-on:click="jumpToGood(goods)">
              <img :src="goods.picUrl" alt="" />
            </div>
            <div class="goods-title" v-on:click="jumpToGood(goods)">
              {{goods.title}}
            </div>
            <div class="goods-detail clearfix">
              <span class="price-current">
                  <i>
                    ￥
                  </i>
                  {{goods.price/100}}
                </span>
              <span class="price-cost">

                </span>
            </div>
          </li>
        </ul>
      </div>
    </main>
    <footer class="btn pos-f clearfix">
      <button class="btn-prize pull-left" v-on:click="jumpToEarn">
        赚取{{'积分'|unitFormat}}
      </button>
      <button class="btn-shop pull-left" v-on:click="jumpToShop">
        进店逛逛
      </button>
    </footer>
  </div>
</template>
<script>
import rest from '../scripts/restClient';
import {
  getShopDto,
  getShop,
  doAuthorize
} from '../scripts/global';
export default {
  name: 'tradePoint',
  data() {
    return {
      shopDto: getShopDto(),
      buyer: {},
      goodsList: [],
      query: this.$route.query,
      actRuler: { //活动规则
        title: '活动规则',
        detail: [

        ]
      },
      rulerDialogIsShow: false //显示活动规则 
    }
  },
  methods: {
    jumpToGood: function(goods) { //查看宝贝
      window.location.href = 'https://item.taobao.com/item.htm?id=' + goods.id;
    },
    jumpToShop: function() { //进店逛逛
      window.location.href = 'https://shop' + this.shopDto.shop.outerShopId + '.taobao.com/';
    },
    jumpToEarn: function() { //赚取积分
      window.location.href = this.shopDto.integralUrl;
    },
    getList: function() {
      var that = this;
      var params = {
        relationUuid: that.query.relationUuid,
        relationType: "trade_point"
      };

      that.$vux.loading.show("加载中");
      rest.get('common/activity', params, function(data) {
        that.$vux.loading.hide();
        that.goodsList = that.goodsList.concat(data.data.tradePoint.itemList);
        that.actRuler.detail = data.data.tradePoint.rule.split(/\n/);
      })
    },
    check: function() { //检查活动是否有效
      var self = this;

      return new Promise(function(resolve, reject) {
        var action = {
          successCallback: function(data) {
            resolve();
          },
          failCallback: function(data) {
            window.location.href = '/#/activityMiss';
          }
        };
        rest.get("dragon/tradePoint/check", { relationUuid: self.query.relationUuid }, action);
      })

    },
    scroll: function(e) { //页面滚动
      if (e.target.scrollTop > 10) {
        $('.shoppingCar>main').css({
          top: -3.466666 + 'rem'
        })
      }
      if (e.target.scrollTop == 0) {
        $('.shoppingCar>main').css({
          top: 0
        })
      }
    }
  },
  mounted: function() {
    var that = this;
    this.$nextTick(function() {
      that.getList();
      getShop().then(function(data) {
        that.shopDto = data;

        //授权
        var params = $.extend({}, data, that.$route.query);
        doAuthorize(params).then(function(buyer) {
          that.check();
        })
      });
    })
  }
}

</script>
