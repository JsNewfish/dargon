<template>
  <div class="followShop pos-r">
    <a class="btn-act-center pos-a" v-bind:href="activeCenterUrl">活动中心</a>
    <a class="btn-act-rules pos-a" href="javascript:void(0)" v-on:click="rulerDialogIsShow = true">活动规则></a>
    <div class="cover pos-f" v-show="rulerDialogIsShow"></div>
    <div class="dialog act-ruler pos-f text-center" v-show="rulerDialogIsShow">
      <div class="btn-cancel pos-a" v-on:click="rulerDialogIsShow = false">
        <img src="../assets/images/activity/btn_cancel.png" alt=""/>
      </div>
      <h2>
        <!-- {{actRuler.title}} -->
        活动规则
      </h2>
      <hr/>
      <ul>
        <li v-for="(item,idx) in actRuler.detail">
          {{item}}
        </li>
      </ul>
    </div>

    <activeModal v-show="modalParams.modalShow" v-bind:modalParams='modalParams' v-on:message="recieveMessage"></activeModal>

    <div class="shop-name pos-a text-center">
      <span>
        {{shopName}}
      </span>
    </div>
    <button class="pos-a" v-on:click="toDoTaobao">
      关注店铺，领取好礼
    </button>
  </div>
</template>


<script >
  import activeModal from '../components/activeModal';
  import rest from '../scripts/restClient';
  import {
    getShopDto,
    getShop,
    doAuthorize
  } from '../scripts/global';

  export default{
    components: { activeModal },
    name:'followShop',
    data () {
      return {
        shopName: '',
        actRuler: {
          title: '活动规则',
          detail: []
        },
        shopDto:getShopDto(),
        rulerDialogIsShow: false,
        modalShow:false,
        modalParams:{
          shopId:800599960801,//店铺Id
          prizeRecordId:"4f1006ed01754c3fa749ddb64975000d",//奖品Id
          name:"aaa",//奖品名称
          type:"coupon",//奖品类型
          subType:"coupon_shop",//子类型
          url:"https://taoquan.taobao.com/coupon/unify_apply.htm?sellerId=2409576533&activityId=7cf1d423ab654f60873f431e4a957ccc",//商品时为图片url，优惠券时为优惠券url，其它类型为null
          denomination:10000,//面额
          useCondition:10000,//优惠券使用条件,其它类型为null
          modalShow:false,//弹框是否显示
          modalStatus:true,//弹框显示状态，成功还是失败
          modalTitle:'关注店铺成功',//成功弹框标题
          failContent:'亲，您已经关注过店铺了，把机会留给别人吧！'//失败弹框内容
        },
        query: this.$route.query,
        module:'',
        relationType:'',
        relationUuid:'',
        outerShopId:'',
        activeCenterUrl:''
      }
    },
    methods: {
      //初始化
      init(){
        this.module = this.getUrlParam("module");
        this.relationType = this.getUrlParam("relationType");
        this.relationUuid = this.getUrlParam("relationUuid");
        this.$vux.loading.show('加载中');
        var self=this;
        this.getActive();
        // getShop().then(function(data) {
        //   self.shopDto=data;
        //   self.shopName = data.shop.name;
        //   self.outerShopId = data.shop.outerShopId;
        //   self.modalParams.shopId = self.outerShopId;
        //   self.getActiveInfo();
        //   self.$vux.loading.hide();
        //   self.activeCenterUrl = data.interactUrl;
        //   self.modalParams.url = data.mallUrl;
        // });
        //授权
        getShop(self.query).then(function(shopDto) {
          self.shopDto = shopDto;
          self.shopName = shopDto.shop.name;
          self.outerShopId = shopDto.shop.outerShopId;
          self.modalParams.shopId = self.outerShopId;
          self.activeCenterUrl = shopDto.interactUrl;
          self.modalParams.url = shopDto.mallUrl;
          self.$vux.loading.hide();
          //授权
          var params=$.extend({},self.query,shopDto);
          doAuthorize(params).then(function(){
            self.getActiveInfo();
          });          
        });
      },
      //获取URL参数
      getUrlParam(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'); //构造一个含有目标参数的正则表达式对象
        var str = window.location.href.split("?")[1];
        var r = str.match(reg); //匹配目标参数
        if (r != null){
          return unescape(r[2]);//返回参数值
        }else{
          return null;
        }
      },
      //获取活动信息
      getActive(){
        var params = {
          relationType:this.relationType,
          relationUuid:this.relationUuid
        };
        var self = this;
        var action = {
          successCallback: function (data) {
            self.actRuler.title = data.data.followShop.title;
            self.actRuler.detail = data.data.followShop.rule.split(/\n/);
          },
          failCallback: function (data) {
            self.$router.push('/activityMiss');
          }
        };
        var promise = rest.get("common/activity", params, action);
        return promise;
      },
      //再次获取活动信息
      getActiveInfo(){
        var params = {
          relationUuid:this.relationUuid
        };
        var self = this;
        var action = {
          successCallback: function (data) {
          },
          failCallback: function (data) {
            alert(data.resultMessage);
          }
        };
        rest.get("dragon/followShop/check", params, action);
      },
      //关注店铺淘宝接口
      toDoTaobao(){
        var self = this;
        if(self.shopDto.env == "local"){//本地
          self.focusStore();
        }else{//淘宝
          Tida.ready({}, function () {
            Tida.subscribe.add({
              accountId:self.shopDto.shop.ownerId +""
            },function(data){
              self.focusStore();
            },function (e) {
              self.$vux.toast.show({
                text: "淘宝关注店铺组件调用失败，请刷新重试:"+JSON.stringify(e),
                position: "center"
              })
            })
          })
        }
      },
      //关注店铺领取奖品
      focusStore(){
        var params = {
          relationUuid:this.relationUuid
        };
        var self = this;
        var action = {
          successCallback: function (data) {
            self.modalParams = $.extend({}, self.modalParams, data.data);
            self.modalParams.denomination = self.modalParams.denomination/100;
            self.modalParams.useCondition = self.modalParams.useCondition/100;
            self.modalParams.shopId = self.outerShopId;
            self.modalParams.modalShow = true;
            self.modalParams.modalStatus = true;
            self.modalParams.prizeRecordId = data.data.prizeRecordId;
          }
        };
        rest.post("dragon/followShop/doFollow",params,null, action);
      },

      recieveMessage: function (text) {
        this.modalParams.modalShow = text;
      }
    },
    created:function(){
      this.init();
    }
  }
</script>
