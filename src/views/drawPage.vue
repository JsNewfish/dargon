<template>
  <div class="drawPage pos-r">
    <a class="btn-act-center pos-a" :href="activeCenterUrl">活动中心</a>
    <a class="btn-act-rules pos-a" href="javascript:void(0)" v-on:click="rulerDialogIsShow = true">活动规则></a>
    <div class="cover pos-f" v-show="rulerDialogIsShow">
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
    <div class="toast pos-f text-center" v-show="chanceEmptyToastIsShow">
      抽奖机会用完啦
    </div>
    <div class="toast pos-f text-center" v-show="chanceGotToastIsShow">
      恭喜您获得{{getDrawTimeNum}}次抽奖机会
    </div>
    <div class="toast pos-f text-center" v-show="dailyChanceFailedToastIsShow">
      您已经获得过今日抽奖机会了
    </div>
    <div class="toast pos-f text-center" v-show="followChanceFailedToastIsShow">
      您已经关注过店铺了哦
    </div>
    <div class="toast pos-f text-center" v-show="shareChanceFailedToastIsShow">
      您已经获得过今日抽奖机会了
    </div>
    <div class="toast pos-f text-center" v-show="tradeChanceFailedToastIsShow">
      您没有符合的订单哦
    </div>
    <div class="act-chance pos-r">
      <img class="pos-a" src="../assets/images/activity/icon_gift.png">
      <p>
        您有
        <span>{{validDrawTime}}</span>
        次机会
      </p>
    </div>

    <div class="act-panel">
      <ul>
        <li class="act-btn pull-left" v-bind:class="{select: selectNum%8 === 0}">
          <div class="wrap">
            <div class="prize-img prize-img-less1" v-bind:class="[prizes[0].typeClass]">
              <span class="prize-detail-top">
                <i>
                  {{prizes[0].detail.unitBefore}}
                </i>
                {{prizes[0].detail.top}}
                <em>
                  {{prizes[0].detail.unitAfter}}
                </em>
              </span>
              <span class="prize-detail-bottom">
                {{prizes[0].detail.bottom}}
              </span>
              <span class="prize-detail-right">
                {{prizes[0].detail.right}}
              </span>
              <span class="prize-detail-left">
                {{prizes[0].detail.left}}
              </span>
            </div>
          </div>

          <div class="prize-title">
            <span>
              {{prizes[0].title}}
            </span>
          </div>
        </li>
        <li class="act-btn pull-left" v-bind:class="{select: selectNum%8 === 1}">
          <div class="wrap">
            <div class="prize-img prize-img-less1" v-bind:class="[prizes[1].typeClass]">
              <span class="prize-detail-top">
                <i>
                  {{prizes[1].detail.unitBefore}}
                </i>
                {{prizes[1].detail.top}}
                <em>
                  {{prizes[1].detail.unitAfter}}
                </em>
              </span>
              <span class="prize-detail-bottom">
                {{prizes[1].detail.bottom}}
              </span>
              <span class="prize-detail-right">
                {{prizes[1].detail.right}}
              </span>
              <span class="prize-detail-left">
                {{prizes[1].detail.left}}
              </span>
            </div>
          </div>
          <div class="prize-title">
            <span>
              {{prizes[1].title}}
            </span>
          </div>
        </li>
        <li class="act-btn pull-left" v-bind:class="{select: selectNum%8 === 2}">
          <div class="wrap">
            <div class="prize-img prize-img-less1" v-bind:class="[prizes[2].typeClass]">
              <span class="prize-detail-top">
                <i>
                  {{prizes[2].detail.unitBefore}}
                </i>
                {{prizes[2].detail.top}}
                <em>
                  {{prizes[2].detail.unitAfter}}
                </em>
              </span>
              <span class="prize-detail-bottom">
                {{prizes[2].detail.bottom}}
              </span>
              <span class="prize-detail-right">
                {{prizes[2].detail.right}}
              </span>
              <span class="prize-detail-left">
                {{prizes[2].detail.left}}
              </span>
            </div>
            <div class="prize-title">
              <span>
                {{prizes[2].title}}
              </span>
            </div>
          </div>
        </li>
        <li class="act-btn pull-left" v-bind:class="{select: selectNum%8 === 7}">
          <div class="wrap">
            <div class="prize-img prize-img-less1" v-bind:class="[prizes[3].typeClass]">
              <span class="prize-detail-top">
                <i>
                  {{prizes[3].detail.unitBefore}}
                </i>
                {{prizes[3].detail.top}}
                <em>
                  {{prizes[3].detail.unitAfter}}
                </em>
              </span>
              <span class="prize-detail-bottom">
                {{prizes[3].detail.bottom}}
              </span>
              <span class="prize-detail-right">
                {{prizes[3].detail.right}}
              </span>
              <span class="prize-detail-left">
                {{prizes[3].detail.left}}
              </span>
            </div>
          </div>
          <div class="prize-title">
            <span>
              {{prizes[3].title}}
            </span>
          </div>
        </li>
        <li class="btn-default pull-left text-center"
          v-on:click="drawStart"
        >
          <span>
            立即
          </span>
          <span>
            抽奖
          </span>
        </li>
        <li class="act-btn pull-left" v-bind:class="{select: selectNum%8 === 3}">
          <div class="wrap">
            <div class="prize-img prize-img-less1" v-bind:class="[prizes[4].typeClass]">
              <span class="prize-detail-top">
                <i>
                  {{prizes[4].detail.unitBefore}}
                </i>
                {{prizes[4].detail.top}}
                <em>
                  {{prizes[4].detail.unitAfter}}
                </em>
              </span>
              <span class="prize-detail-bottom">
                {{prizes[4].detail.bottom}}
              </span>
              <span class="prize-detail-right">
                {{prizes[4].detail.right}}
              </span>
              <span class="prize-detail-left">
                {{prizes[4].detail.left}}
              </span>
            </div>
          </div>
          <div class="prize-title">
            <span>
              {{prizes[4].title}}
            </span>
          </div>
        </li>
        <li class="act-btn pull-left" v-bind:class="{select: selectNum%8 === 6}">
          <div class="wrap">
            <div class="prize-img prize-img-less1" v-bind:class="[prizes[5].typeClass]">
              <span class="prize-detail-top">
                <i>
                  {{prizes[5].detail.unitBefore}}
                </i>
                {{prizes[5].detail.top}}
                <em>
                  {{prizes[5].detail.unitAfter}}
                </em>
              </span>
              <span class="prize-detail-bottom">
                {{prizes[5].detail.bottom}}
              </span>
              <span class="prize-detail-right">
                {{prizes[5].detail.right}}
              </span>
              <span class="prize-detail-left">
                {{prizes[5].detail.left}}
              </span>
            </div>
            <div class="prize-title">
              <span>
                {{prizes[5].title}}
              </span>
            </div>
          </div>
        </li>
        <li class="act-btn pull-left" v-bind:class="{select: selectNum%8 === 5}">
          <div class="wrap">
            <div class="prize-img prize-img-less1" v-bind:class="[prizes[6].typeClass]">
              <span class="prize-detail-top">
                <i>
                  {{prizes[6].detail.unitBefore}}
                </i>
                {{prizes[6].detail.top}}
                <em>
                  {{prizes[6].detail.unitAfter}}
                </em>
              </span>
              <span class="prize-detail-bottom">
                {{prizes[6].detail.bottom}}
              </span>
              <span class="prize-detail-right">
                {{prizes[6].detail.right}}
              </span>
              <span class="prize-detail-left">
                {{prizes[6].detail.left}}
              </span>
            </div>
          </div>
          <div class="prize-title">
            <span>
              {{prizes[6].title}}
            </span>
          </div>
        </li>
        <li class="act-btn pull-left" v-bind:class="{select: selectNum%8 === 4}">
          <div class="wrap">
            <div class="prize-img prize-img-less1" v-bind:class="[prizes[7].typeClass]">
              <span class="prize-detail-top">
                <i>
                  {{prizes[7].detail.unitBefore}}
                </i>
                {{prizes[7].detail.top}}
                <em>
                  {{prizes[7].detail.unitAfter}}
                </em>
              </span>
              <span class="prize-detail-bottom">
                {{prizes[7].detail.bottom}}
              </span>
              <span class="prize-detail-right">
                {{prizes[7].detail.right}}
              </span>
              <span class="prize-detail-left">
                {{prizes[7].detail.left}}
              </span>
            </div>
          </div>
          <div class="prize-title">
            <span>
              {{prizes[7].title}}
            </span>
          </div>
        </li>

      </ul>
    </div>

    <div class="act-news pos-r">
      <img class="pos-a" src="../assets/images/activity/icon_trumpet.png">
      <ul class="wrap pos-a">
        <li v-for="log in drawLogList">
          <span>
            {{log}}
          </span>
        </li>
        <li>

        </li>
      </ul>
    </div>
    <div class="act-methods text-center">
      <p>
        您可以通过以下方式获取抽奖次数：
      </p>
      <div class="wrap">
        <ul>
          <li class="act-btn pull-left" v-on:click="getDailyChance" v-show="addDrawTime.daily.isActive">
            每日抽奖
          </li>
          <li class="act-btn pull-left" v-on:click="getFollowChance" v-show="addDrawTime.follow.isActive">
            关注店铺
          </li>
          <li class="act-btn pull-left" v-on:click="getShareChance" v-show="addDrawTime.share.isActive">
            分享抽奖
          </li>
          <li class="act-btn pull-left" v-on:click="getTradeChance" v-show="addDrawTime.trade.isActive">
            订单抽奖
          </li>
        </ul>
      </div>
    </div>

    <activeModal v-show="prizeInfo.modalShow" v-bind:modalParams='prizeInfo' v-on:message="recieveMessage"></activeModal>
  </div>
</template>

<script>
  import activeModal from '../components/activeModal';
  import rest from '../scripts/restClient';
  import {
    getShopDto,
    getShop,
    doAuthorize
  } from '../scripts/global';

  export default {
    components: {
      activeModal
    },
    computed: {

    },
    name: 'drawPage',
    data () {
      return {
        searchParam: {    //查询信息
          module: "interact",
          relationType:"draw",
          relationUuid:"abaee278cfcd476fac941da0673c3fc1"
        },
        query: this.$route.query,
        activeCenterUrl:'',    //活动中心链接
        activityInfo: {    //活动信息
          content: '我分享了一个抽奖给你，拼手气，抽出你的人品，快点开看看吧！',
          imgUrl: 'http://qnzg.image.alimmdn.com/wxhd/bg1.png?t=1515639094060'
        },
        itemInfo: null,    //分享商品信息
        shopDto:getShopDto(),    //用户信息
        actRuler: {
          title: '活动规则',
          detail: []    //规则明细
        },
        prizes: [
          {
            type: '',
            subPrizeType: '',
            cost: '',
            hasPrize: 0,
            level: 0,
            percent: 0,
            typeClass: '',
            title: '',
            detail: {
              unitBefore: '',
              unitAfter: '',
              top: '',
              bottom: '',
              right: '',
              left: ''
            }
          },
          {
            type: '',
            subPrizeType: '',
            cost: '',
            hasPrize: 0,
            level: 0,
            percent: 0,
            typeClass: '',
            title: '',
            detail: {
              unitBefore: '',
              unitAfter: '',
              top: '',
              bottom: '',
              right: '',
              left: ''
            }
          },
          {
            type: '',
            subPrizeType: '',
            cost: '',
            hasPrize: 0,
            level: 0,
            percent: 0,
            typeClass: '',
            title: '',
            detail: {
              unitBefore: '',
              unitAfter: '',
              top: '',
              bottom: '',
              right: '',
              left: ''
            }
          },
          {
            type: '',
            subPrizeType: '',
            cost: '',
            hasPrize: 0,
            level: 0,
            percent: 0,
            typeClass: '',
            title: '',
            detail: {
              unitBefore: '',
              unitAfter: '',
              top: '',
              bottom: '',
              right: '',
              left: ''
            }
          },
          {
            type: '',
            subPrizeType: '',
            cost: '',
            hasPrize: 0,
            level: 0,
            percent: 0,
            typeClass: '',
            title: '',
            detail: {
              unitBefore: '',
              unitAfter: '',
              top: '',
              bottom: '',
              right: '',
              left: ''
            }
          },
          {
            type: '',
            subPrizeType: '',
            cost: '',
            hasPrize: 0,
            level: 0,
            percent: 0,
            typeClass: '',
            title: '',
            detail: {
              unitBefore: '',
              unitAfter: '',
              top: '',
              bottom: '',
              right: '',
              left: ''
            }
          },
          {
            type: '',
            subPrizeType: '',
            cost: '',
            hasPrize: 0,
            level: 0,
            percent: 0,
            typeClass: '',
            title: '',
            detail: {
              unitBefore: '',
              unitAfter: '',
              top: '',
              bottom: '',
              right: '',
              left: ''
            }
          },
          {
            type: '',
            subPrizeType: '',
            cost: '',
            hasPrize: 0,
            level: 0,
            percent: 0,
            typeClass: '',
            title: '',
            detail: {
              unitBefore: '',
              unitAfter: '',
              top: '',
              bottom: '',
              right: '',
              left: ''
            }
          }    //转盘奖品列表
        ],
        validDrawTime: 0,    //剩余可抽奖次数
        getDrawTimeNum: 0,    //单次可获取的抽奖次数
        drawLogList: [    //获奖日志

        ],
        addDrawTime: {    //获得抽奖次数的方法
          daily: {isActive: false},
          follow: {isActive: false},
          share: {isActive: false},
          trade: {isActive: false}
        },
        prizeInfo: {    //抽到奖品的信息
          type: '',//奖品类型
          subType: '',//子类型
          uuid: '',//奖品Id
          shopId: '',//店铺Id
          prizeRecordId: '',//奖品RecordId
          denomination: null,//面额
          useCondition: null,//优惠券使用条件,其它类型为null
          modalShow: false,
          modalStatus: true,//弹框显示状态，成功还是失败
          modalTitle: '恭喜，中奖啦',//成功弹框标题
          failContent: '很遗憾，您这次没有中奖哦！继续努力吧~'//失败弹框内容
        },

        actStatus: false,    //活动是否有效
        selectNum: -1,    //转盘激活位置
        actIsStarted: false,    //转盘运行状态
        actTimer: null,
        dailyChanceGot: false,    //每日抽奖获取状态
        followChanceGot: false,    //关注店铺状态
        shareChanceGot: false,    //分享抽奖状态
        tradeChanceGot: false,    //订单抽奖状态
        rulerDialogIsShow: false,    //显示活动规则
        chanceGotToastIsShow: false,    //抽奖次数获取成功
        chanceEmptyToastIsShow: false,    //抽奖次数为空
        dailyChanceFailedToastIsShow: false,    //每日抽奖已用
        followChanceFailedToastIsShow: false,    //关注店铺已用
        shareChanceFailedToastIsShow: false,    //分享抽奖已用
        tradeChanceFailedToastIsShow: false    //订单抽奖已用

      }
    },
    methods: {
      init: function(){

        var self=this;
        self.$vux.loading.show('加载中');
        this.getList();    //初始化渲染
            //.then(self.check)    //检查活动是否有效
        // getShop({    //获取店铺信息、授权
        //   module: self.searchParam.module,
        //   relationType: self.searchParam.relationType,
        //   relationUuid: self.searchParam.relationUuid
        // }).then(function(data) {    //更新买家信息
        //   self.shopDto=data;
        //   console.log(data)
        //   self.activeCenterUrl = data.interactUrl;
        //   self.prizeInfo.url = data.mallUrl;
        //   self.prizeInfo.shopId = self.shopDto.shop.outerShopId;
        // });
        //授权
        getShop(self.query).then(function(shopDto) {
          self.shopDto = shopDto;
          self.activeCenterUrl = shopDto.interactUrl;
          self.prizeInfo.url = shopDto.mallUrl;
          self.prizeInfo.shopId = self.shopDto.shop.outerShopId;
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


        // var self = this,
        //     href = window.location.href;
        // return new Promise(function(resolve,reject){
        //   if(!href){reject()};
        //   self.searchParam.module = href.match(/(module)=[^&]*/)[0].split('=')[1];
        //   self.searchParam.relationType = href.match(/(relationType)=[^&]*/)[0].split('=')[1];
        //   self.searchParam.relationUuid = href.match(/(relationUuid)=[^&]*/)[0].split('=')[1];
        //   resolve();
        // })
      },
      getList: function(){    //初始化活动页面
        var self=this;
        var searchParam = self.searchParam;

        return new Promise (function(resolve,reject){
          var action = {
            successCallback: function(data) {
            self.getActRule(data);
            self.getPrizes(data);
            self.activityInfo.title = data.data.draw.title;
            self.activityInfo.url = data.data.draw.url;
            resolve ();
            },
            failCallback: function (data) {
              console.log(data);
            }
          };
          rest.get("common/activity", searchParam, action);
        })

      },
      check: function(){    //检查活动是否有效
        var self = this;

        return new Promise (function(resolve,reject){
          var action = {
            successCallback: function (data) {
              self.getDrawTime(data);
              self.getLogList(data);
              self.getAddDrawTime(data);
              self.itemInfo = data.data.item;
              resolve ();
            },
            failCallback: function (data) {
              console.log('fail',data);
              window.location.href='/dist/index.html#/activityMiss';
            }
          };
          rest.get("dragon/draw/check", {relationUuid: self.searchParam.relationUuid}, action);
        })

      },
      activateAct: function(){    //激活活动
        this.actStatus = true;

      },
      getActRule: function(data){    //获取活动规则
        var actRuleDetail = null,
            detailStr = data.data.draw.rule;

        actRuleDetail = detailStr.split(/\n/);
        this.actRuler.detail = actRuleDetail;

      },
      getPrizes: function(data){    //获取奖品列表
        var self = this,
            _prizes = [],
            prizeList = data.data.draw.drawPrizeList;

        prizeList.forEach(function(item){
          var prize = {
            type: item.prizeType,
            subPrizeType: item.subPrizeType,
            cost: item.cost/100,
            hasPrize: item.hasPrize,
            level: item.level,
            typeClass: '',
            title: '',
            detail: {
              unitBefore: '',
              unitAfter: '',
              top: '',
              bottom: '',
              right: '',
              left: ''
            }
          };

          getPrizeInfo (prize);

          function getPrizeInfo(prize){

            switch (item.prizeType) {
              case 'coupon':
              prize.detail.unitBefore = '￥';
              prize.detail.top = item.cost/100;
              if (item.useCondition){
                prize.detail.bottom = '满' + item.useCondition/100 + '元使用';
              } else {
                prize.detail.bottom = '无门槛';
              }
              prize.detail.right = '优惠券';
              if(item.subPrizeType == 'coupon_shop'){
                prize.title = item.cost/100 + '元店铺优惠券';
                prize.typeClass = 'prize-coupon';
              }else if(item.subPrizeType == 'coupon_goods'){
                prize.title = item.cost/100 + '元商品优惠券';
                prize.typeClass = 'prize-coupon2';
              }else{

              }
              break;

              case 'alipay_red':
              prize.detail.unitBefore = '￥';
              prize.detail.top = item.cost/100;
              prize.detail.right = '支付宝红包';
              prize.title = item.cost/100 + '元支付宝红包';
              prize.typeClass = 'prize-red-packet';
              break;

              case 'flow':
              prize.detail.unitAfter = 'M';
              prize.detail.top = item.cost/100;
              prize.detail.right = '流量券';
              prize.title = item.cost/100 + 'M手机流量包';
              prize.typeClass = 'prize-flow';
              break;

              case 'point':
              prize.detail.unitAfter = (self.shopDto.unit||'积分');
              prize.detail.top = item.cost/100;
              prize.title = item.cost/100 + (self.shopDto.unit||'积分');
              prize.typeClass = 'prize-integral';
              break;

              case 'ticket':
              prize.title = '双色球1注';
              prize.typeClass = 'prize-lottery';
              break;

              default:
              prize.title = '谢谢参与';
              prize.typeClass = 'prize-smile';
            }
          }

          _prizes.push(prize);
        })

        self.prizes = _prizes;
      },
      getDrawTime: function(data){    //获取可抽奖次数
        this.validDrawTime = data.data.buyerDrawTime.validDrawTime;
      },
      getLogList: function(data){    //获取获奖日志

        var self = this,
            _drawLogList = data.data.drawLogList;


        /*function encryptName(name){
          var _name = name.replace(/(^\s*)|(\s*$)/g,"");
          return _name[0] + '***';
        };
        function encrypPrize(type,cost){
          var _cost = cost/100,
              prize = '';

          switch (type) {
            case 'coupon':
            prize = _cost + '元优惠券';
            break;

            case 'alipay_red':
            prize = _cost + '元支付宝红包';
            break;

            case 'flow':
            prize = _cost + 'M手机流量包';
            break;

            case 'point':
            prize = _cost + (self.shopBuyerDto.unit||'积分');
            break;

            case 'ticket':
            prize = _cost + '注彩票';
            break;

            default:
          }
          return prize;
        };*/


        /*if(!data.data.isShowPrize){
          return;
        }else if(!_drawLogList.length){
          return;
        }else if(_drawLogList.length == 1){
          self.drawLogIsShow = true;
          self.drawLogList = [
            {
              name: encryptName(_drawLogList[0].nick),
              prize: encrypPrize(_drawLogList[0].prizeType,_drawLogList[0].cost)
            }
          ]
        }else{
          self.drawLogIsShow = true;
          self.drawLogList = [];
          _drawLogList.forEach(function(log){
            var _log = {
              name: encryptName(_drawLogList[0].nick),
              prize: encrypPrize(_drawLogList[0].prizeType,_drawLogList[0].cost)
            };
            self.drawLogList.push(_log);
          });
        };*/

        self.drawLogList = _drawLogList;
        if(self.drawLogList.length == 1 || self.drawLogList.length == 0){return};
        var num = self.drawLogList.length,
          time = 5000,
          height = $('.drawPage .act-news li').innerHeight();
        console.log(height,num)
        $('.drawPage .act-news li:last-child').remove();
        carousel();
        setInterval(carousel,time);

        function carousel () {
          $('.act-news>.wrap').animate(
            {top: -height*(num - 1)},
            time,
            'linear',
            function () {
              $('.act-news>.wrap').css({top: 0})
            }
          );
        }

      },
      getAddDrawTime: function(data){    //获取获得抽奖次数的方法
        var self = this,
            drawTimeList = data.data.drawTimeList;
        drawTimeList.forEach(function(drawTime){
          switch (drawTime.timeType) {
            case 'daily':
            self.addDrawTime.daily = {
              timeType: "daily",
              tradeStatus: drawTime.tradeStatus,
              drawTime: drawTime.drawTime,
              isActive: true
            };
            break;

            case 'follow_shop':
            self.addDrawTime.follow = {
              timeType: "follow_shop",
              tradeStatus: drawTime.tradeStatus,
              drawTime: drawTime.drawTime,
              isActive: true
            };
            break;

            case 'share':
            self.addDrawTime.share = {
              timeType: "share",
              tradeStatus: drawTime.tradeStatus,
              drawTime: drawTime.drawTime,
              isActive: true,
              shareType: drawTime.shareType
            };
            break;

            case 'trade':
            self.addDrawTime.trade = {
              timeType: "trade",
              tradeStatus: drawTime.tradeStatus,
              drawTime: drawTime.drawTime,
              isActive: true
            };
            break;

            default:

          }
        })
      },
      drawStart: function () {    //抽奖
        if(!this.actStatus){
          self.$vux.toast.show({
            text: "抽奖失败，请刷新重试",
            position: "center"
          })
          return;
        }
        var self = this;
        if(this.validDrawTime === 0){
          this.chanceEmptyToastIsShow = true;
          var _this = this;
          setTimeout(function(){
            _this.chanceEmptyToastIsShow = false;
          },1000)
        }else{
          if(this.actIsStarted){
            return;
          }

          var action = {
            successCallback: function (data) {
              function getPrizeNum (level) {
                var _prizeNum = level;
                if(level == 4){
                  _prizeNum = 8;
                }else if(level == 5){
                  _prizeNum = 4;
                }else if(level == 6){
                  _prizeNum = 7;
                }else if(level == 7){
                  _prizeNum = 6;
                }else if(level == 8){
                  _prizeNum = 5;
                }else{};
                return _prizeNum;
              };
              function setPrize () {
                if(data.data.hasPrize){
                  self.prizeInfo.modalStatus = true;
                  self.prizeInfo.type = data.data.prizeType;
                  self.prizeInfo.subType = data.data.subType;
                  self.prizeInfo.denomination = data.data.cost/100;
                  self.prizeInfo.useCondition = data.data.useCondition/100;
                  self.prizeInfo.uuid = data.data.prizeUuid;
                  self.prizeInfo.prizeRecordId = data.data.prizeRecordId;
                }else {
                  self.prizeInfo.modalStatus = false;
                };
              };
              var prizeNum = getPrizeNum(data.data.level),
                  circleNum = 8,
                  stepTime = 50,
                  totalTime = 2000,
                  totalNum = null;
              totalNum = Math.floor((totalTime/stepTime)/circleNum)*circleNum + prizeNum;
              self.validDrawTime -= 1;
              self.selectNum = -1;
              self.actTimer = setInterval(function(){
                self.selectNum += 1;
                totalNum -= 1;
                if(totalNum === 0){
                  clearInterval(self.actTimer);
                  var times = stepTime;
                  for(var i=1; i<=circleNum; i++){
                    times += i*50;
                    (function(j){
                      return(setTimeout(function(){
                        self.selectNum += 1;
                        if(j == circleNum){
                          self.actIsStarted = false;
                          setTimeout(function(){
                            self.prizeInfo.modalShow = true;
                          },700);
                        };
                      },times));
                    })(i);
                  };
                };
              },stepTime);
              setPrize ();
            },
            failCallback: function (data) {
              self.actIsStarted = false;
            }
          };
          self.actIsStarted = true;
          rest.get("dragon/draw/doDraw", {relationUuid: self.searchParam.relationUuid}, action);
        }
      },

      getDailyChance: function () {    //每日抽奖
        var self = this;

        var action = {
          successCallback: function (data) {
            self.getDrawTimeNum = self.addDrawTime.daily.drawTime;
            self.chanceGotToastIsShow = true;
            self.validDrawTime += self.addDrawTime.daily.drawTime;
            self.dailyChanceGot = true;
            setTimeout(function(){
              self.chanceGotToastIsShow = false;
            },1000);
          },
          /*failCallback: function (data) {
            self.dailyChanceFailedToastIsShow = true;
            setTimeout(function(){
              self.dailyChanceFailedToastIsShow = false;
            },1000)
          }*/
        };

        rest.get("dragon/draw/doAddBuyerDrawTime", {
          relationUuid: self.searchParam.relationUuid,
          drawTimeType: self.addDrawTime.daily.timeType
        }, action);

      },
      getFollowChance: function () {    //关注抽奖
        var self = this;

        if(self.shopDto.env == "local"){//本地
          focusStore();
        }else{//淘宝
          Tida.ready({}, function () {
            Tida.subscribe.add({
              accountId:self.shopDto.shop.ownerId +""
            },function(data){
              focusStore();
            },function (e) {
              self.$vux.toast.show({
                text: "淘宝组件调用失败，请刷新重试:"+JSON.stringify(e),
                position: "center"
              })
            })
          })
        }

        function focusStore(){
          var action = {
            successCallback: function (data) {
              self.getDrawTimeNum = self.addDrawTime.follow.drawTime;
              self.chanceGotToastIsShow = true;
              self.validDrawTime += self.addDrawTime.follow.drawTime;
              self.followChanceGot = true;
              setTimeout(function(){
                self.chanceGotToastIsShow = false;
              },1000);
            }
          };

          rest.get("dragon/draw/doAddBuyerDrawTime", {
            relationUuid: self.searchParam.relationUuid,
            drawTimeType: self.addDrawTime.follow.timeType
          }, action);

        }

        /*if(this.followChanceGot){
          self.followChanceFailedToastIsShow = true;
          setTimeout(function(){
            self.followChanceFailedToastIsShow = false;
          },1000)
        }else{
          var action = {
            successCallback: function (data) {
              self.getDrawTimeNum = self.addDrawTime.follow.drawTime;
              self.chanceGotToastIsShow = true;
              self.validDrawTime += self.addDrawTime.follow.drawTime;
              self.followChanceGot = true;
              setTimeout(function(){
                self.chanceGotToastIsShow = false;
              },1000);
            }
          };

          rest.get("dragon/draw/doAddBuyerDrawTime", {
            relationUuid: self.searchParam.relationUuid,
            drawTimeType: self.addDrawTime.follow.timeType
          }, action);
        }*/
      },
      /*toShare: function () {
        this.shareDialogIsShow = true;
      },
      cancelShare: function(){
        this.shareDialogIsShow = false;
      },*/
      getShareChance: function () {    //分享抽奖
        var self = this;

        if(self.shopDto.env == "local"){//本地
          share();
        }else{//淘宝
          Tida.ready({}, function () {
            var shareObj = {};
            if(self.addDrawTime.share.shareType == 0){
              shareObj.title = self.activityInfo.title;
              shareObj.content = self.activityInfo.content;
              shareObj.url = self.activityInfo.url;
              shareObj.image = self.activityInfo.imgUrl;
            }else if (self.addDrawTime.share.shareType == 1) {
              shareObj.title = self.activityInfo.title;
              shareObj.content = self.itemInfo.title;
              shareObj.url = 'https://item.taobao.com/item.htm?id=' + self.itemInfo.id;
              shareObj.image = self.itemInfo.picUrl;
            }else{

            }

            Tida.share(shareObj, function(data){
                share();
            },function (e){
              self.$vux.toast.show({
                text: "淘宝组件调用失败，请刷新重试:"+JSON.stringify(e),
                position: "center"
              })
            });
          });



        }



        function share(){
          var action = {
            successCallback: function (data) {
              self.getDrawTimeNum = self.addDrawTime.share.drawTime;
              self.chanceGotToastIsShow = true;
              self.validDrawTime += self.addDrawTime.share.drawTime;
              self.shareChanceGot = true;
              setTimeout(function(){
                self.chanceGotToastIsShow = false;
              },1000);
            }
          };

          rest.get("dragon/draw/doAddBuyerDrawTime", {
            relationUuid: self.searchParam.relationUuid,
            drawTimeType: self.addDrawTime.share.timeType
          }, action);
        }

      },
      getTradeChance: function () {    //订单抽奖
        var self = this;

        var action = {
          successCallback: function (data) {
            self.getDrawTimeNum = self.addDrawTime.trade.drawTime;
            self.chanceGotToastIsShow = true;
            self.validDrawTime += self.addDrawTime.trade.drawTime;
            self.tradeChanceGot = true;
            setTimeout(function(){
              self.chanceGotToastIsShow = false;
            },1000);
          },
          /*failCallback: function (data) {
            self.orderChanceFailedToastIsShow = true;
            setTimeout(function(){
              self.orderChanceFailedToastIsShow = false;
            },1000)
          }*/
        };

        rest.get("dragon/draw/doAddBuyerDrawTime", {
          relationUuid: self.searchParam.relationUuid,
          drawTimeType: self.addDrawTime.trade.timeType
        }, action);

      },
      recieveMessage: function (text) {
        this.prizeInfo.modalShow = text;
      }
    },
    created:function(){
      var self = this;
      this.getUrlParam().then(self.init);
    }
  }
</script>

