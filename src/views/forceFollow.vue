<template>
  <div class="receiveCoupons">
    <div class="forceBanner" v-show="itemList.forceFollow.prizes.length==1">
      <div class="coupon coupon1" v-show="couponStatus"></div>
      <div class="coupon coupon2" v-show="couponStatus"></div>
      <a class="couponBtn" v-bind:href="couponurl">立即领取</a>
      <div class="couponPrice">
        ￥
        <span>{{couponprice}}</span>
      </div>
      <div class="couponLimit">
        满{{couponlimit}}元使用
      </div>
      <div class="couponType">
        {{coupontype}}
      </div>
    </div>
    <div class="listBanner" v-show="itemList.forceFollow.prizes.length>1"></div>
    <ul v-show="itemList.forceFollow.prizes.length>1">
      <li class=" pos-r" v-bind:class="{'coupon-shop':item.subType=='coupon_shop','coupon-item':item.subType=='coupon_goods'}" 
      v-for="item in itemList.forceFollow.prizes">
        <span class="prize-detail-top">
          <i>
            ￥
          </i>
          {{item.denomination|centToDollar}}
        </span>
        <span class="prize-detail-bottom">
          有效期：{{item.startTime&&item.startTime.split(" ")[0]}}-{{item.endTime&&item.endTime.split(" ")[0]}}
        </span>
        <span class="prize-detail-middle">
          <em v-show="item.useCondition">满{{item.useCondition|centToDollar}}元使用</em>
          <em v-show="!item.useCondition">无门槛使用</em>
        </span>
        <span class="prize-detail-left">
          <span v-show="item.subType=='coupon_goods'">
            商品优惠券
          </span>
          <span v-show="item.subType=='coupon_shop'">
            店铺优惠券
          </span>
        </span>
        <span class="prize-detail-right" >
          <a v-bind:href="item.url"  class="link-a">
            立即领取
          </a>
        </span>
      </li>
      <!-- <li class="coupon-item pos-r">
        <span class="prize-detail-top">
          <i>
            ￥
          </i>
          1000
        </span>
        <span class="prize-detail-bottom">
          有效期：2016.10.13-2017.12.31
        </span>
        <span class="prize-detail-middle">
          满10000元使用
        </span>
        <span class="prize-detail-left">
          商品优惠券
        </span>
        <span class="prize-detail-right">
          立即领取
        </span>
      </li> -->
    </ul>
  </div>
</template>
<script >
  import $jq from "../lib/jquery.min";
  import rest from '../scripts/restClient';
  import {getShop,
    getShopDto} from '../scripts/global';

  export default{
    name:'forceFollow',
    data(){
      return {
        shopBuyerDto:getShopDto(),
        itemList:{
          forceFollow:{
            prizes:[]
          }
        },
        couponStatus:true,
        couponurl:'',
        couponprice:0,
        couponlimit:0,
        coupontype:'',
        query:this.$route.query
      }
    },
    methods:{
      getList:function(){
        var that = this;
        var params = {
          relationType:that.query.relationType,
          relationUuid:that.query.relationUuid
        };
        rest.get('common/activity',params,function(data){
          that.count = data.count;
          that.itemList = data.data;
          that.couponurl = that.itemList.forceFollow.prizes[0].url;
          that.couponprice = that.itemList.forceFollow.prizes[0].denomination/100;
          that.couponlimit = that.itemList.forceFollow.prizes[0].useCondition/100;
          if(that.itemList.forceFollow.prizes[0].subType=='coupon_shop'){
            that.coupontype = '店铺优惠券';
          }
          if(that.itemList.forceFollow.prizes[0].subType=='coupon_goods'){
            that.coupontype = '商品优惠券';
          }
          var forcelength = that.itemList.forceFollow.prizes;
          if(forcelength==1){
            if(that.itemList.forceFollow.prizes[0].subType=='coupon_shop'){
              that.couponStatus = true;
            }else{
              that.couponStatus = false;
            }
          }
        })   
      },
      followShop:function(sellerId){
        Tida && Tida.ready({}, function () {
                Tida.follow2({
                    sellerId: sellerId
                },function(data){
                    //alert(JSON.stringify(data));
                });
        });
      },
      //再次获取活动信息
      getActiveInfo(){
        var params = {
          relationUuid:this.query.relationUuid
        };
        var self = this;
        var action = {
          successCallback: function (data) {
          },
          failCallback: function (data) {
            alert(data.resultMessage);
          }
        };
        rest.get("common/forceFollowCheck", params, action);
      }
    },
    mounted(){
      var that = this;
      this.$nextTick(function(){
        
        that.getList();
        getShop().then(function(data) {
          that.shopBuyerDto=data;
          that.followShop(that.shopBuyerDto.shop.ownerId);
          that.getActiveInfo();
        })

      })
    }
    
  }
</script>
