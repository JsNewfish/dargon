<template>
  <div class="itemDetail itemDetail-goods">
    <main>
      <div class="wrap">
        <award :value="entity" size="medium"> </award>
      </div>
      <div class="item-bg">
      </div>
      <div class="item-detail">
        <h3 class="title">
          {{entity.title}}元优惠券
        </h3>
        <p>
          价值：{{entity.prize.denomination|centToDollar}}元
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
         <small>请点击“马上领取”在领取页面上领取优惠券</small>
      </div>
      <div class="dialog-operation">
        <a v-bind:href="dialog.link" class="dialog-btn">马上领取</a>
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
          content: "兑换成功！<br>恭喜您获取",
          link: "",
          btnText: "",
          show: false
        },
        query: this.$route.query,
        show1: false,
        isCheck: false
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
        })

        //授权
        getShop(self.query).then(function(shopDto) {
          self.shopDto = shopDto;
          //授权
          var params=$.extend({},self.query,shopDto);
          doAuthorize(params).then(function(){
            //活动检查
            rest.get("dragon/pointReward/check", {
              relationUuid: self.query.relationUuid
            });
          });          
        });
        //商品信息
        rest.get("common/pointReward", this.query, function(data) {
          self.$vux.loading.hide();
          self.entity = data.data;
        })
      },
      redeem() {
        this.$router.push({ path:'/itemExchange', query: $.extend(this.query,{point:this.entity.point})});;
      }
    },
    created() {
      this.init();
    }
  }
</script>
