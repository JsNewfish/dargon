<template>
  <div class="itemDetail itemDetail-goods">
    <main>
      <div class="wrap" v-on:click="buyGood">
        <award :value="entity" size="medium"> </award>
      </div>
      <div class="item-bg">
      </div>
      <div class="item-detail">
        <h3 class="title">
          {{entity.title}}
        </h3>
        <p>
          价值：{{entity.item.price|centToDollar}}元
        </p>
        <p>
          有效期：{{entity.prize.endTime|dateConvert}}
        </p>
      </div>
      <div class="item-bg">
      </div>
      <div class="item-detail">
        <h3 class="title">
          商品简介：
        </h3>
        <p>
          {{entity.prize.description}}
        </p>
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
        <span style="color:#666;font-size: 0.4rem;margin: auto;">+{{entity.item.price/100 - entity.prize.denomination/100}}元现金</span>
      </p>
      <img v-on:click="confirm.show=true" v-show="!pointExchanged" class="pos-a btn-redeem" src="../assets/images/duihuan-test.png">
      <img v-show="pointExchanged" class="pos-a" v-on:click="buyGood" src="../assets/images/xiadan.png">
    </footer>
    <x-dialog v-model="dialog.show" class="dg-dialog">
      <div class="dialog-content">
         <p>兑换成功！</p>
         <p>恭喜您获得“特价换购”资格！</p>
         <small class="text-danger">请点击“前往下单”优惠购买</small>
         <a v-on:click="dialog.show=false" class="dialog-btn-close"></a>
      </div>
    </x-dialog>
    <confirm v-model="confirm.show" class="dg-confirm"
      @on-confirm="redeem">
      <p style="text-align:center;">确定要用{{entity.point|centToDollar}}{{"积分"|unitFormat}}兑换“特价换购”资格？ </p>
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
    name: 'pointMoney',
    filters: {
      dateConvert: function(value){
        if(!value){
          return '';
        }
        var arr = value.split(' ');
        var arr1 = arr[0].split('\/');
        var arr2 = arr[1].split(':');
        return arr1[0] + '年' + arr1[1] + '月' + arr1[2] + '日' + arr2[0] + '点前';
      }
    },
    data() {
      return {
        shopDto: getShopDto(),
        pointExchanged: false,
        entity: {
          prize: {},
          item: {}
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
        var self=this;
        rest.post("dragon/pointReward/redeem",null, {
          pointRewardUuid: this.query.relationUuid
        }, function(data) {
           self.prizeRecordId=data.data.prizeRecordId;
           self.dialog.show=true;
           self.pointExchanged = true;
        })
      },
      buyGood() {
        window.location.href = this.entity.item.detailUrl;
      }
    },
    created() {
      this.init();
    }
  }
</script>
