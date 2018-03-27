<template>
  <div class="itemDetail itemDetail-coupon">
    <main>
      <div class="wrap">
        <award :value="entity" size="medium"> </award>
      </div>
      <div class="item-bg">
      </div>
      <div class="item-detail">
        <h3 class="title">
          {{entity.prize.denomination|centToDollar}}元优惠券
        </h3>
        <p>
          面额：{{entity.prize.denomination|centToDollar}}元
        </p>
        <p>
          类型：店铺优惠券
        </p>
        <p>
          使用条件：订单满{{entity.prize.useCondition|centToDollar}}元可使用
        </p>
        <p>
         有效期：{{moment(entity.prize.startTime).format("YY.MM.DD")}}-{{moment(entity.prize.endTime).format("YY.MM.DD")}}
        </p>
      </div>
      <div class="item-bg">
      </div>
      <div class="item-detail">
        <h3 class="title">
          兑换规则：
        </h3>
        <p v-html="$options.filters.ruleFormat(entity.rule)">
        </p>
      </div>
    </main>
    <footer class="pos-r">
      <p>
        <span>
          {{entity.point|centToDollar}}
        </span>
        {{"积分"|unitFormat}}
      </p>
      <img v-on:click="confirm.show=true"  class="pos-a btn-redeem" src="../assets/images/duihuan-test.png">
    </footer>
    <x-dialog v-model="dialog.show" class="dg-dialog">
      <div class="dialog-content">
         <p>兑换成功！</p>
         <p>恭喜您获得{{entity.prize.denomination|centToDollar}}元店铺优惠券</p>
         <small class="text-danger">请点击“马上领取”在领取页面上领取优惠券</small>
      </div>
      <div class="dialog-operation">
        <a v-on:click.prevent="getCoupon" class="dialog-btn">马上领取</a>
      </div>
      <a v-on:click="dialog.show=false" class="dialog-btn-close"></a>
    </x-dialog>
    <confirm v-model="confirm.show" class="dg-confirm"
      @on-confirm="redeem">
      <p style="text-align:center;">确定要用{{entity.point|centToDollar}}{{"积分"|unitFormat}}兑换该商品吗？ </p>
    </confirm>
  </div>
</template>
<script >
  import rest from '../scripts/restClient';
  import Vue from 'vue'
  import award from '../components/award';
  import moment from "moment";
  import {
    getShopDto,
    getShop,
    doAuthorize
  } from '../scripts/global';
  import {
    Confirm,
    XDialog,
    Loading
  } from 'vux';


  export default {
    name: 'itemDetail',
    data() {
      return {
        shopDto: getShopDto(),
        entity: {
          prize: {}
        },
        confirm: {
          show: false
        },
        dialog: {
          show: false
        },
        prizeRecordId:"",
        query: this.$route.query,
        moment:moment
      }
    },
    components: {
      Confirm,
      XDialog,
      Loading,
      award
    },
    methods: {
      init() {
        var self = this;
        this.$vux.loading.show({
          text: '加载中'
        });

       //授权
        getShop().then(function(shopDto) {
          self.shopDto = shopDto;
           //授权
          var params=$.extend({},self.query,shopDto);
          doAuthorize(params);          
          //活动检查
          rest.get("dragon/pointReward/check", {
            relationUuid: self.query.relationUuid
          }, function(data) {
            //console.log(data.data);
          });
        });
        //商品信息
        rest.get("common/pointReward", this.query, function(data) {
          self.$vux.loading.hide({
            text: '加载中'
          });
          self.entity = data.data;
        })
      },
      redeem() {
        var self=this;
        rest.post("dragon/pointReward/redeem",null, {
          pointRewardUuid: this.query.relationUuid
        }, function(data) {
           self.prizeRecordId=data.data.prizeRecordId;
           self.dialog.show=true;
        })
      },
      //领取优惠券
      getCoupon(){
        var self=this;
        rest.get("dragon/prizeRecord",{prizeRecordId:this.prizeRecordId},function(data){
          window.location.href=data.data;
          console.log(data.data)
          self.$vux.toast.show({
            text: "操作成功，请在跳出的新页面最下方点击领取优惠券",
            position: "center"
          })
        })
      }
    },
    mounted() {
      this.init();
    }
  }
</script>
