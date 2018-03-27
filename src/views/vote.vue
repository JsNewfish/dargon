<template>
  <div class="vote pos-r">
    <main  class="pos-a">
      <a class="btn-act-center pos-a" :href="activeCenterUrl">活动中心</a>
      <a class="btn-act-rules pos-a" href="javascript:void(0);" v-on:click="rulerDialogIsShow = true">活动规则></a>
      <div class="cover pos-f" v-show="addDialogIsShow||prizeDialogIsShow||rulerDialogIsShow">

      </div>
      <div class="toast pos-f text-center" v-show="toastPrizeGotIsShow">
        {{subject}}
      </div>
      <div class="toast pos-f text-center" v-show="toastCouponGotIsShow">
        您已经领取过了！
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
      <div class="dialog get-prize pos-f text-center"
           v-show="prizeDialogIsShow"
        >
        <div class="btn-cancel pos-a" v-on:click="cancelUsePrize">
          <img src="../assets/images/activity/btn_cancel.png" alt=""/>
        </div>
        <h2>
          {{prizeInfo.detail}}
        </h2>
        <div class="btn clearfix">
          <button class="pull-left go-shop" v-on:click="jumpToShop">
            进店逛逛
          </button>
          <button class="pull-left use-method" v-on:click="prizeInfo.useMethod">
            {{prizeInfo.methodText}}
          </button>
        </div>
      </div>

      <div class="banner">
      </div>
      <div class="shop clearfix" v-if="voteType == 1 || voteType == 2">
        <div class="shop-logo pull-left" v-on:click="jumpToShop">
          <img :src="shopDto.shop.picPath" alt=""/>
        </div>
        <div class="shop-info">
          <h2 class="shop-name">
            {{shopDto.shop.name}}
          </h2>

          <p class="act-detail">
            活动还剩：<span>{{remainTimeArr[0]}}</span>天<span>{{remainTimeArr[1]}}</span>时<span>{{remainTimeArr[2]}}</span>分
          </p>

          <p class="purchase">
            已有<span>{{takePartInCount}}</span>人参加
          </p>
        </div>
      </div>

      <div class="goods-list" v-if="voteType == 1 || voteType == 2" v-on:scroll="scroll">
        <div class="title">
          活动主题：{{subject}}{{mode ? '（多选）' : '（单选）'}}
        </div>
        <ul class="clearfix">
          <li class="pull-left goods" v-for="(good,idx) in goodsList" v-on:click="function(){select(idx)}">
            <div class="goods-img">
              <img :src="good.option" alt="" />
            </div>
            <div class="vote-button pos-r">
              <div class="button pos-a">
                
              </div>
              <div class="pick pos-a">
                
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="vote-text"  v-if="voteType == 0">
        <div class="shop clearfix">
          <div class="wrap">
            <div class="shop-logo pull-left" v-on:click="jumpToShop">
              <img :src="shopDto.shop.picPath" alt=""/>
            </div>
            <div class="shop-info">
              <h2 class="shop-name">
                {{shopDto.shop.name}}
              </h2>

              <p class="act-detail">
                活动还剩：<span>{{remainTimeArr[0]}}</span>天<span>{{remainTimeArr[1]}}</span>时<span>{{remainTimeArr[2]}}</span>分
              </p>

              <p class="purchase">
                已有<span>{{takePartInCount}}</span>人参加
              </p>
            </div>
          </div>
        </div>
        <div class="text-list">
          <div class="title">
            活动主题：{{subject}}{{mode ? '（多选）' : '（单选）'}}
          </div>
          <ul>
            <li class="pos-r" v-for="(good,idx) in goodsList" v-on:click="function(){select(idx)}">
              <div class="button">
                
              </div>
              <div class="pick pos-a">
                
              </div>
              <span class="text">
                {{good.option}}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </main>

    <footer class="btn pos-f">
      <button class="btn-prize"
              v-bind:class="{active: prizeActive,prizeGot:prizeGot}"
              v-on:click="getPrize"
        >
        投票并领取奖品
      </button>
    </footer>

  </div>
</template>


<script >
  import rest from '../scripts/restClient';
  import { Scroller } from 'vux';
  import {
    getShopDto,
    getShop,
    doAuthorize
  } from '../scripts/global';

  export default{
    name:'vote',
    data () {
      return {
        searchParam: {    //查询信息
          module: "",
          relationType:"",
          relationUuid:""
        },
        query: this.$route.query,
        activeCenterUrl:'',
        shopDto:getShopDto(),    //用户信息
        actRuler: {    //活动规则
          title: '活动规则',
          detail: [

          ]
        },
        actDetail: '收藏本活动页面中0个宝贝，即可获得xxx！',    //加购获奖规则
        prizeInfo: {    //奖品信息
          detail: '恭喜您获得xxx',
          useMethod: function(){},
          methodText: '立即使用',
          prizeRecordId: null
        },
        goodIndex: 0,    //被选中宝贝序号
        toastPrizeGotIsShow: false,    //奖品已领取
        toastCouponGotIsShow: false,    //优惠券已领取
        rulerDialogIsShow: false,    //显示活动规则
        addDialogIsShow: false,   //显示是否加购Dialog
        prizeDialogIsShow: false,   //显示领取奖品Dialog

        takePartInCount: 0,
        remainTimeArr: [],
        mode: null,
        subject: null,
        prizeActive: false,
        voteType: null,
        prizeGot: false,    //奖品是否已领取
        actStatus: false,    //活动是否有效
        goodsList: [    //宝贝列表

        ]
      }
    },
    computed: {
/*      getPrizeBtnText: function () {    //底部按钮文字
        return this.prizeGot ? '已领取' : '领取奖品';
      }*/
    },
    methods: {
      init: function(){

        var self=this;
        self.$vux.loading.show('加载中');
        this.getList();
        getShop(self.query).then(function(shopDto) {
          self.shopDto = shopDto;
          self.activeCenterUrl = shopDto.interactUrl;
          self.$vux.loading.hide();
          //授权
          var params=$.extend({},self.query,shopDto);
          doAuthorize(params).then(function(){
            self.check().then(self.activateAct);
          });
        });
      },
      getUrlParam: function() {    //获取URL参数
        var self = this
        return new Promise(function(resolve,reject){
          self.searchParam.module = self.query.module;
          self.searchParam.relationType = self.query.relationType;
          self.searchParam.relationUuid = self.query.relationUuid;
          resolve();
        })

      },
      getList: function(){    //初始化活动列表、奖品信息
        var self=this;
        var searchParam = self.searchParam;

        return new Promise (function(resolve,reject){
          var action = {
            successCallback: function(data) {
              self.voteType = data.data.vote.voteType;

              var _goodsList = [];
              self.goodsList = _goodsList.concat(data.data.vote.options);
              self.goodsList.forEach(function(good){
                good.isSelect = 0;
              });

              self.subject = data.data.vote.subject;
              self.mode = data.data.vote.mode;
              self.remainTimeArr = data.data.vote.remainTime.split(/[^0-9]+/);
              self.getActDetailAndPrizeInfo(data);
              self.getActRule(data);
              resolve ();
            },
            failCallback: function (data) {
            }
          };
          rest.get("common/activity", searchParam, action);
        })

      },
      getActDetailAndPrizeInfo: function(data){    //获取活动详情
        var self = this,
            _actDetail = '',
            _prizeInfo = {
              detail: '恭喜您获得xxx',
              useMethod: function(){
                window.location.href='https://h5.m.taobao.com/app/cpkg/portal.html';
              },
              methodText: '立即使用',
              prizeRecordId: null
            },
            prizeData = data.data.vote.prizes[0];

        switch(prizeData.type)
        {
        case 'coupon':
          _prizeInfo.useMethod = function () {
            var action = {
              successCallback: function (data) {
                window.location.href= data.data;
                self.$vux.toast.show({
                  text: "操作成功，请在跳出的新页面最下方点击领取优惠券",
                  position: "center"
                })
              },
              failCallback: function (data) {
                self.toastCouponGotIsShow = true;
                setTimeout(function(){
                  self.toastCouponGotIsShow = false;
                },1000)
              }
            };
            rest.get("dragon/prizeRecord", {prizeRecordId: self.prizeInfo.prizeRecordId}, action);
          };
          _prizeInfo.methodText = '马上领取';
          if(prizeData.subType == 'coupon_shop'){
            _prizeInfo.detail = '恭喜您获得' + prizeData.denomination/100 + '元店铺优惠券！'
          }else if(prizeData.subType == 'coupon_goods'){
            _prizeInfo.detail = '恭喜您获得' + prizeData.denomination/100 + '元商品优惠券！';
          }
          break;
        case 'alipay_red':
          _prizeInfo.detail = '恭喜您获得' + prizeData.denomination/100 + '元支付宝红包！';
          break;
        case 'flow':
          _prizeInfo.detail = '恭喜您获得' + prizeData.denomination/100 + 'M手机流量包！';
          break;
        case 'point':
          _prizeInfo.detail = '恭喜您获得' + prizeData.denomination/100 + (self.shopDto.unit||'积分') + '！';
          _prizeInfo.methodText = '去兑换商品';
          _prizeInfo.useMethod = function () {
            window.location.href=self.shopDto.mallUrl;
          };
          break;
        case 'ticket':
          _prizeInfo.detail = '恭喜您获得' + prizeData.denomination/100 + '注彩票！';
          _prizeInfo.methodText = '去兑换商品';
          _prizeInfo.useMethod = function () {
            window.location.href=self.shopDto.mallUrl;
          };
          break;
        default:

        }

        this.actDetail = _actDetail;
        this.prizeInfo = _prizeInfo;

      },
      getActRule: function(data){    //获取活动规则
        var actRuleDetail = null,
            detailStr = data.data.vote.rule;

        actRuleDetail = detailStr.split(/\n/);
        this.actRuler.detail = actRuleDetail;

      },
      check: function(){    //检查活动是否有效
        var self = this;

        return new Promise (function(resolve,reject){
          var action = {
            successCallback: function (data) {
              self.takePartInCount = data.data.takePartInCount;
              resolve ();
            },
            failCallback: function (data) {
              //window.location.href='https://qnzg.ews.m.jaeapp.com/#/activityMiss';
            }
          };
          rest.get("dragon/vote", {relationUuid: self.searchParam.relationUuid}, action);
        })

      },
      activateAct: function(){    //激活活动
        var self = this;
        this.actStatus = true;

      },
      select: function (idx) { //选择选项
        this.goodIndex = idx;
        var self = this;
        if(self.mode == 0){
          if(self.goodsList[self.goodIndex].isSelect){
            return;
          }
          self.prizeActive = true;
          if(self.voteType == 0){
            self.goodsList.forEach(function(good){
              good.isSelect = 0;
              $('.text-list>ul>li .pick').removeClass('active');
            });
            $('.text-list>ul>li .pick').eq(self.goodIndex).addClass('active');
          }else{
            self.goodsList.forEach(function(good){
              good.isSelect = 0;
              $('.goods-list>ul>li .pick').removeClass('active');
            });
            $('.goods-list>ul>li .pick').eq(self.goodIndex).addClass('active');
          }
          self.goodsList[self.goodIndex].isSelect = 1;
          
        }else if(self.mode == 1){
          if(self.goodsList[self.goodIndex].isSelect){
            self.goodsList[self.goodIndex].isSelect = 0;
            if(self.voteType == 0){
              $('.text-list>ul>li .pick').eq(self.goodIndex).removeClass('active');
            }else{
              $('.goods-list>ul>li .pick').eq(self.goodIndex).removeClass('active');
            }
          }else{
            self.goodsList[self.goodIndex].isSelect = 1;
            if(self.voteType == 0){
              $('.text-list>ul>li .pick').eq(self.goodIndex).addClass('active');
            }else{
              $('.goods-list>ul>li .pick').eq(self.goodIndex).addClass('active');
            }
          }
          var bool = self.goodsList.some(function(good){
            return good.isSelect;
          });
          if(bool){
            self.prizeActive = true;
          }else{
            self.prizeActive = false;
          }
        }
      },
      getPrize: function () {    //获取奖品
        var self = this;
        if(!this.prizeActive){
          this.toastPrizeGotIsShow = true;
          setTimeout(function(){
            self.toastPrizeGotIsShow = false;
          },1000)
          return;
        }else{
          var _goodsList = [];
          var length = self.goodsList.length;
          for(var i=0; i<length; i++){
            _goodsList.push({});
            for(var key in self.goodsList[i]){
              _goodsList[i][key] = self.goodsList[i][key];
            }
          }
          for(var i=_goodsList.length; i>0; i--){
            if(!_goodsList[i-1].isSelect){
              _goodsList.splice(i-1,1)
            }
          }
          _goodsList.forEach(function(good){
            delete good.isSelect;
            good.relationUuid = self.searchParam.relationUuid;
          });

          
          var action = {
            successCallback: function (data) {
              self.prizeDialogIsShow = true;
              self.prizeInfo.prizeRecordId = data.data.prizeRecordId;
            }
          };
          rest.post("dragon/vote/doTakeAward", null, _goodsList, action)

        }
      },
      cancelUsePrize: function () {    //暂不使用奖品
        this.prizeDialogIsShow = false;
      },
      jumpToShop: function () {    //进店逛逛
        window.location.href='https://shop' + this.shopDto.shop.outerShopId + '.taobao.com/';
      },
      jumpToGood: function (idx) {    //查看宝贝
        window.location.href='https://item.taobao.com/item.htm?id=' + this.goodsList[idx].id;
      },
      scroll: function (e) {    //页面滚动
        if(e.target.scrollTop > 5) {
          $('.vote>main').css({
            top: -3.466666 + 'rem'
          })
        }
        if(e.target.scrollTop == 0) {
          $('.vote>main').css({
            top: 0
          })
        }
      },
      stop: function (e) {
        e.stopPropagation();
      }
    },
    created:function(){
      var self = this;
      this.getUrlParam().then(self.init);
    }
  }
</script>
