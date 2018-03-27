<template>
  <div class="shoppingCar pos-r">
    <main  class="pos-a">
      <a class="btn-act-center pos-a" :href="activeCenterUrl">活动中心</a>
      <a class="btn-act-rules pos-a" href="javascript:void(0)" v-on:click="rulerDialogIsShow = true">活动规则></a>
      <div class="cover pos-f" v-show="addDialogIsShow||rulerDialogIsShow">

      </div>
      <div class="toast pos-f text-center" v-show="toastPrizeGotIsShow">
        加购{{minAddNum}}个宝贝才可领取奖品
      </div>
      <div class="toast pos-f text-center" v-show="toastGetPrize">
        获得折扣，可点击宝贝下单
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
      <div class="banner">
      </div>
      <div class="shop clearfix">
        <div class="shop-logo pull-left" v-on:click="jumpToShop">
          <img :src="shopDto.shop.picPath" alt=""/>
        </div>
        <div class="shop-info">
          <h2 class="shop-name">
            {{shopDto.shop.name}}
          </h2>

          <p class="act-detail">
            {{actDetail}}
          </p>

          <p class="purchase">
            已加购
            <span>
             {{addNum}}/{{minAddNum}}
            </span>
            个
          </p>
        </div>
      </div>

      <div class="goods-list">
        <ul class="clearfix" v-on:scroll="scroll">
          <li class="pull-left goods" v-for="(goods,idx) in goodsList">
            <div class="goods-img" v-on:click="function(){jumpToGood(idx)}">
              <img :src="goods.picUrl" alt="" />
            </div>
            <div class="goods-title" v-on:click="function(){jumpToGood(idx)}">
              {{goods.title}}
            </div>
            <div class="goods-detail clearfix">
              <button class="pull-right" v-bind:class="{addCar: !!goods.isAdd}"
                v-on:click="function(){sureAdd(idx)}"
                >
                {{!!goods.isAdd ? '已加购' : '加购宝贝'}}
              </button>
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
      <button class="btn-shop pull-left"
        v-on:click="jumpToShop"
      >
        进店逛逛
      </button>
      <button class="btn-prize pull-left"
        v-bind:class="{active: prizeActive,prizeGot:prizeGot}"
        v-on:click="getPrize"
      >
        {{getPrizeBtnText}}
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
    name:'shoppingCar',
    data () {
    return {
      searchParam: {    //查询信息
        module: "interact",
        relationType:"shopping_car",
        relationUuid:"ebaa87f69a58422e9565e3ece86eea6c"
      },
      query: this.$route.query,
      activeCenterUrl:'',
      shopDto:getShopDto(),    //用户信息
      actRuler: {    //活动规则
        title: '活动规则',
        detail: [

        ]
      },
      actDetail: '加购本活动页面中0个宝贝，即可获得折扣价！',    //加购获奖规则
      prizeInfo: {    //奖品信息
        detail: '恭喜您获得xxx',
        useMethod: function(){},
        methodText: '立即使用',
        prizeRecordId: null
      },
      goodIndex: null,    //被选中宝贝序号
      toastPrizeGotIsShow: false,    //加购数量不够
      rulerDialogIsShow: false,    //显示活动规则
      addDialogIsShow: false,    //显示是否加购Dialog
      toastGetPrize:false,   //领取奖品

      prizeGot: false,    //奖品是否已领取
      minAddNum: 0,    //最少加购宝贝个数
      addNum: 0,    //已加购宝贝个数
      actStatus: false,    //活动是否有效
      goodsList: [    //宝贝列表

      ]
    }
  },
  computed: {
    prizeActive: function () {    //满足领奖条件
      if (this.addNum >= this.minAddNum) {
        return true;
      }
      return false;
    },
    getPrizeBtnText: function () {    //底部按钮文字
      return this.prizeGot ? '已领取' : '领取折扣';
    },
  },
  methods: {
    init: function(){

      var self=this;
      self.$vux.loading.show('加载中');
      this.getList()    //初始化活动列表
           .then(self.check)    //检查活动是否有效
           .then(self.activateAct);    //激活活动
      //授权
        getShop(self.query).then(function(shopDto) {
          self.shopDto = shopDto;
          self.activeCenterUrl = shopDto.interactUrl;
          self.$vux.loading.hide();
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
    getList: function(){    //初始化活动列表
      var self=this;
      var searchParam = self.searchParam;

      return new Promise (function(resolve,reject){
        var action = {
          successCallback: function(data) {
          var _goodsList = self.goodsList.concat([])
          self.goodsList = _goodsList.concat(data.data.shoppingCarModel.itemModels);
          self.minAddNum = data.data.shoppingCarModel.shoppingCar.minStoreNum;
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
    getAddNum: function (data) {    //获取已加购数目
      var _addNum = 0;
      this.goodsList = data.data.itemModels;
      this.goodsList.forEach(function(good){
        if (good.isAdd) {
          _addNum += 1;
        }
      })
      this.addNum = _addNum;
    },
    getActDetailAndPrizeInfo: function(data){    //获取活动详情、奖品信息
      var self = this,
          _minAddNum = this.minAddNum,
          _actDetail = '',
          _prizeInfo = {
            detail: '恭喜您获得xxx',
            useMethod: function(){
              window.location.href='https://h5.m.taobao.com/app/cpkg/portal.html';
            },
            methodText: '立即使用',
            prizeRecordId: null
          }

      this.actDetail = '加购本页面中' + _minAddNum + '个宝贝，即可获得折扣价！';
      this.prizeInfo = _prizeInfo;
    },
    getActRule: function(data){    //获取活动规则
      var actRuleDetail = null,
          detailStr = data.data.shoppingCarModel.shoppingCar.rule;

      actRuleDetail = detailStr.split(/\n/);
      this.actRuler.detail = actRuleDetail;

    },
    check: function(){    //检查活动是否有效
      var self = this;

      return new Promise (function(resolve,reject){
        var action = {
          successCallback: function (data) {
            self.prizeGot = data.data.obtained;
            self.getAddNum(data);
            resolve ();
          }
        };
        rest.get("dragon/shoppingCar/check", {relationUuid: self.searchParam.relationUuid}, action);
      })

    },
    activateAct: function(){    //激活活动
      var self = this;
      this.actStatus = true;

    },
    addToCar: function (idx) {    //加购宝贝
      this.goodIndex = idx;
      if(!!this.goodsList[this.goodIndex].isAdd){
        return;
      }
      this.addDialogIsShow = true;
    },
    cancelAdd: function(){    //取消加购
      this.addDialogIsShow = false;
    },
    sureAdd: function(idx){    //确定加购
      this.goodIndex = idx;
      if(!!this.goodsList[this.goodIndex].isAdd){
        return;
      }
      var self = this,
          obj = {itemId:self.goodsList[self.goodIndex].id,relationUuid: self.searchParam.relationUuid};

      if(this.shopDto.env == "local"){//本地
        store();
      }else{//淘宝
        Tida.ready({}, function () {
          Tida.cart({
            sellerNick: self.shopDto.shop.ownerNick,
            itemId: obj.itemId
          },function(data){
            if(data.businissType == 0 && data.ret[0] == "HY_SUCCESS"){//ios成功
              store();
            } else if (data.businissType == 0 && data.ret == "HY_SUCCESS"){//安卓成功
              store();
            }else if (data.data == "businissType:0" && data.ret == "HY_SUCCESS"){//安卓成功
              store();
            }else if((data.businissType == 2 || data.businissType == 1) && data.ret[0] == "HY_SUCCESS"){
              self.$vux.toast.show({
                text: "请操作加入购物车",
                position: "center"
              })
            } else if(data.errorCode == 6 && data.errorMsg == "加入购物车失效"){
              self.$vux.toast.show({
                text: "购物车已满，请清理后重试",
                position: "center"
              })
            } else{
              self.$vux.alert.show({
                title: "提示",
                content: "加入购物车失败，请刷新重试"
              })
            }
          },function () {
            self.$vux.alert.show({
              title: "提示",
              content: "淘宝组件调用失败，请刷新重试"
            })
          })
        })
      };

      function store() {
        self.addDialogIsShow = false;
        var action = {
          successCallback: function (data) {
            self.goodsList[self.goodIndex].isAdd = 1;
            self.addNum += 1;
          }

        };
        rest.post("dragon/shoppingCar/doShoppingCar", obj, null, action);
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
        var action = {
          successCallback: function (data) {
            self.toastGetPrize = true;
            self.prizeGot = true;
            self.prizeInfo.prizeRecordId = data.data.prizeRecordId;
            setTimeout(function(){
              self.toastGetPrize = false;
            },1000)
          }
        };
        rest.post("dragon/shoppingCar/doTakeAward", {relationUuid: self.searchParam.relationUuid}, null, action)

      }
    },
    jumpToShop: function () {    //进店逛逛
      window.location.href='https://shop' + this.shopDto.shop.outerShopId + '.taobao.com/';
    },
    jumpToGood: function (idx) {    //查看宝贝
      window.location.href='https://item.taobao.com/item.htm?id=' + this.goodsList[idx].id;
    },
    scroll: function (e) {    //页面滚动
      if(e.target.scrollTop > 10) {
        $('.shoppingCar>main').css({
          top: -3.466666 + 'rem'
        })
      }
      if(e.target.scrollTop == 0) {
        $('.shoppingCar>main').css({
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
  },
  }
</script>
