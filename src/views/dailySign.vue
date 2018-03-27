<template>
  <div class="view view-daily-sign">
    <div class="content">
      <div class="top-banner">
        <div class="top-left-btn">
          <a  v-bind:href="shopDto.integralUrl">赚取{{'积分'|unitFormat}}</a>
        </div>
        <div class="top-right-btn" v-on:click="rulerDialogIsShow=true">活动规则></div>
      </div>
      <div class="time-box">
        <div class="hour">
          <div class="ten">{{entity.hourTens}}</div>
          <div class="single">{{entity.hourSingle}}</div>
        </div>
        <div class="minute">
          <div class="ten">{{entity.minuteTens}}</div>
          <div class="single">{{entity.minuteSingle}}</div>
        </div>
      </div>
      <a class="btn-submit" v-on:click="doTaskAward">点击抢积分</a>
    </div>
    <div class="dialog act-ruler pos-f text-center"
      v-show="rulerDialogIsShow"
      >
      <div class="btn-cancel pos-a" v-on:click="rulerDialogIsShow = false">
        <img src="../assets/images/activity/btn_cancel.png" alt=""/>
      </div>
      <h2>
        {{actRuler.title}}
      </h2>
      <hr/>
      <ul>
         <li v-for="item in actRuler.detail">
            {{item}}
          </li>
      </ul>
    </div>
    <activeModal v-show="prizeInfo.modalShow" v-bind:modalParams='prizeInfo' ></activeModal>
  </div>
</template>

<script>
  import rest from '../scripts/restClient';
  import activeModal from '../components/activeModal';
  import {
    getShopDto,
    getShop,
    doAuthorize
  } from '../scripts/global';

  export default {
    name: 'dailySign',
    data() {
      return {
        shopDto: getShopDto(),
        rulerDialogIsShow: false,
        entity:{  },
        prizeInfo: { //抽到奖品的信息
          type: 'point', //奖品类型
          subType: '', //子类型
          uuid: '', //奖品Id
          shopId: '', //店铺Id
          prizeRecordId: '', //奖品RecordId
          denomination: null, //面额
          useCondition: null, //优惠券使用条件,其它类型为null
          modalShow: false,
          modalStatus: true, //弹框显示状态，成功还是失败
          modalTitle: '恭喜，中奖啦', //成功弹框标题
          failContent: '很遗憾，您这次没有中奖哦！继续努力吧~' //失败弹框内容
        },
        actRuler: { //活动规则
          title: '活动规则',
          detail: []
        }
      }
    },
    methods: {
      init() {
        var self = this;
        //获取店铺信息
        getShop({
          module: "dailySign"
        }).then(function(shopDto) {
          self.shopDto = shopDto;
          //授权
          var params = $.extend({}, shopDto, self.$route.query);
          self.$vux.loading.show("加载中");
          doAuthorize(params).then(function(buyer) {
            self.buyer = buyer;
            self.$vux.loading.hide();
            //检查活动是否可用
            rest.get("dragon/dailyRob/check", {
              relationUuid:  this.$route.query.relationUuid
            }, ()=>{});
          });

        });

        //获取活动信息
        rest.get("common/activity",{relationType:"daily_rob",relationUuid:self.$route.query.relationUuid},function(data){
          var dailyRob = data.data.dailyRob;
          //拆分小时
          dailyRob.hourTens = dailyRob.hour < 10 ? 0 : String(dailyRob.hour)[0];
          dailyRob.hourSingle = dailyRob.hour < 10 ? dailyRob.hour : String(dailyRob.hour)[1];
          //拆分分钟
          dailyRob.minuteTens = dailyRob.minute < 10 ? 0 : String(dailyRob.minute)[0];
          dailyRob.minuteSingle = dailyRob.minute < 10 ? dailyRob.minute : String(dailyRob.minute)[1];

          self.entity=dailyRob;
          self.actRuler.detail = dailyRob.rule.split(/\n/);
        });
      },
      doTaskAward() {
        var self=this,
            relationUuid=this.$route.query.relationUuid;
        var action = {
          successCallback(data) {
             var result=data.data;
             var prizecost = (result.cost)/100;
             var prizeInfo={
                type: 'point', //奖品类型
                subType: '', //子类型
                uuid: self.$route.query.relationUuid, //奖品Id
                shopId: shopDto.shop.outerShopId, //店铺Id
                prizeRecordId: result.relationUuid, //奖品RecordId
                denomination: prizecost, //面额
                useCondition: null, //优惠券使用条件,其它类型为null
                modalShow: true,
                modalStatus: true, //弹框显示状态，成功还是失败
                modalTitle: '恭喜，中奖啦', //成功弹框标题
                failContent: '很遗憾，您这次没有中奖哦！继续努力吧~', //失败弹框内容
                url:self.shopDto.mallUrl
             }

             self.prizeInfo=prizeInfo;
          }
        };

        rest.post("dragon/dailyRob/doTakeAward", {relationUuid:relationUuid},null,action);
      }
    },
    components: {
      activeModal
    },
    mounted: function() {
      var self = this;
      this.$nextTick(function() {
         self.init();
      });
    }
  }
</script>
