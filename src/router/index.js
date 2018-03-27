import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/Home'
import itemDetailCoupon from '../views/itemDetail-coupon'
import itemDetailFlow from '../views/itemDetail-flow'
import itemDetailRedPacket from '../views/itemDetail-red-packet'

import prizeDetail from '../views/prizeDetail'
import activityCenter from '../views/activityCenter'
import activityMiss from '../views/activityMiss'
import pageMiss from '../views/pageMiss'
import forceFollow from '../views/forceFollow'
import shoppingMall from '../views/shoppingMall'
import itemExchange from '../views/itemExchange.vue'
import exchangeRecord from '../views/exchangeRecord'
import myPoints from '../views/myPoints'
import pointRules from '../views/pointRules.vue'
import deliveryRecord from '../views/deliveryRecord'
import activityRecord from '../views/activityRecord'
import myPrize from '../views/myPrize'
import signPage from '../views/signPage'
import storeItem from '../views/storeItem'
import shoppingCar from '../views/shoppingCar'
import drawPage from '../views/drawPage'
import followShop from '../views/followShop'
import pointGoods from '../views/pointGoods'
import browseItem from '../views/browseItem'
import vote from '../views/vote'
import saveRed from '../views/saveRed'
import dailySign from '../views/dailySign'
import perfectPersonalInfo from '../views/perfectPersonalInfo'
import tradePoint from '../views/tradePoint'
import earnPoint from '../views/earnPoint'
import pointMoney from '../views/pointMoney'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    component: Home
  }, {
    path: "/home",
    component: Home
  }, {
    path: '/mall/point_coupon', //优惠券兑换详情
    component: itemDetailCoupon
  }, {
    path: '/mall/point_flow', //流量兑换详情
    component: itemDetailFlow
  }, {
    path: '/mall/point_alipay_red', //红包兑换详情
    component: itemDetailRedPacket
  }, {
    path: '/mall/point_goods', //商品兑换详情
    component: pointGoods
  }, {
    path: '/mall/point_money', //商品兑换详情
    component: pointMoney
  }, {
    path: '/prizeDetail', //奖品详情
    component: prizeDetail
  }, {
    path: '/interact', //活动中心
    component: activityCenter
  }, {
    path: '/activityMiss', //活动失效
    component: activityMiss
  }, {
    path: '/pageMiss', //活动失效
    component: pageMiss
  }, {
    path: '/mall', //积分商城
    component: shoppingMall
  }, {
    path: '/itemExchange', //商品兑换
    component: itemExchange
  }, {
    path: '/exchangeRecord', //兑换记录
    component: exchangeRecord
  }, {
    path: '/myPoints', //我的积分
    component: myPoints
  }, {
    path: '/pointRules', //积分规则
    component: pointRules
  }, {
    path: '/deliveryRecord', //发货记录
    component: deliveryRecord
  }, {
    path: '/activityRecord', //活动记录
    component: activityRecord
  }, {
    path: '/myPrize', //我的奖品
    component: myPrize
  }, {
    path: '/interact/sign', //签到
    component: signPage
  }, {
    path: '/interact/store_item', //收藏有礼
    component: storeItem
  }, {
    path: '/interact/shopping_car', //加购有礼
    component: shoppingCar
  }, {
    path: '/interact/draw', //抽奖
    component: drawPage
  }, {
    path: '/interact/follow_shop', //关注有礼
    component: followShop
  }, {
    path: '/interact/force_follow', //首页红包
    component: forceFollow
  }, {
    path: '/integral/browse_item', //浏览宝贝
    component: browseItem
  }, {
    path: '/interact/vote', //投票有礼
    component: vote
  }, {
    path: '/interact/red_envelope', //拯救红包
    component: saveRed
  },{
    path: '/integral/daily_rob', //每日抢
    component: dailySign
  },{
    path: '/integral/collection_info', //完善个人资料
    component: perfectPersonalInfo
  },{
  	path: '/integral/trade_point', //下单送积分
    component: tradePoint
  },{
  	path: '/integral', //赚取积分
    component: earnPoint
  }
  ]
})
