<template>
  <div class="saveRed pos-r">
    <a class="btn-act-center pos-a" v-bind:href="activeCenterUrl">我的红包</a>
    <a class="btn-act-rules pos-a" href="javascript:void(0)" v-on:click="rulerShow">活动规则></a>
    <!-- 弹窗浮层 -->
    <div class="cover pos-f" v-show="coverShow"></div>
    <!-- 规则弹窗 -->
    <div class="dialog act-ruler pos-f text-center" v-show="rulerDialogIsShow">
      <div class="btn-cancel pos-a" v-on:click="rulerHide">
        <img src="../assets/images/activity/btn_cancel.png" alt=""/>
      </div>
      <h2>
        活动规则
      </h2>
      <hr/>
      <ul>
        <li v-for="(item,idx) in actRuler.detail">
          {{item}}
        </li>
      </ul>
    </div>
    <!-- 开始游戏弹窗 -->
    <div class="red-start pos-f" v-show="gameStartShow">
      <div class="red-close-btn" v-on:click="saveClose"></div>
      <div class="red-start-btn" v-on:click="saveStart"></div>
    </div>
    <!-- 关注店铺弹窗 -->
    <div class="red-attention pos-f" v-show="attentionShow">
      <!-- <div class="attention-close" v-on:click="attentionClose"></div> -->
      <div class="attention-shopName">{{shopName}}</div>
      <div class="attention-img">
        <img src="" alt="">
      </div>
      <div class="attention-determine" v-on:click="attentionClick"></div>
    </div>
    <!-- 领取奖品弹窗 -->
    <div class="prizeModel pos-f" v-show="alipayShow">
      <div class="btn-cancel pos-a" v-on:click="prizeModelClose">
          <img src="../assets/images/activity/btn_cancel.png" alt=""/>
      </div>
      <header class="pos-a">
          <h2>
            拯救成功
          </h2>
      </header>
      <main class="pos-a">
        <div>
          <div class="prize-img prize-img-less2 prize-red-packet pos-r" style="margin: 0 auto;">
            <span class="prize-detail-top pos-a">
              {{prizeInfo.denomination}}
              <em>
                  元
              </em>
            </span>
            <span class="prize-detail-right pos-a">
              支付宝红包
            </span>
            <span class="prize-detail-bottom pos-a">
            </span>
          </div>
          <div class="prize-notice">
            恭喜您获得{{prizeInfo.denomination}}元支付宝红包
          </div>
          <div class="btn clearfix">
            <a class="pull-left go-shop" v-bind:href="'https://shop'+activeInfo.shopId+'.m.taobao.com/'">
              进店逛逛
            </a>
            <a class="pull-left use-method go-use" href="https://h5.m.taobao.com/app/cpkg/portal.html">
              立即使用
            </a>
          </div>
        </div>
      </main>
    </div>
    <!-- 帮拆成功弹窗 -->
    <div class="helpModel pos-f" v-show="helpModelShow">
      <div class="attention-close" v-on:click="helpModelClose"></div>
      <div class="attention-determine" v-on:click="againHelp"></div>
    </div>
    <!-- 内容 -->
    <div class="red_banner pos-r">
      <img v-show='bannerShow' src="../assets/images/activity/saveRed_bannner1.png">
      <img v-show='!bannerShow' src="../assets/images/activity/saveRed_bannner3.png">
      <div class="shop_img pos-a">
        <img v-bind:src="shopPic">
      </div>
      <div class="shop_title pos-a">
        {{shopName}}
      </div>
      <div class="save_time pos-a">
        {{hours}}:{{minutes}}:{{second}}
      </div>
      <!-- 创建者 -->
      <div class="save_creator pos-a" v-show="statusShow">
        <div class="schedule_left">
          <p>({{totalNum}}/{{activeInfo.attendNum}}个好友已帮我拆炸弹)</p>
          <div class="schedule">
            <div class="progressbar"></div>
          </div>
        </div>
        <div class="schedule_right pos-r" v-on:click="shareRed">
          <img src="../assets/images/activity/saveRed_btn.png">
          <p class="share_btn pos-a">拉好友拆炸弹</p>
        </div>
      </div>
      <!-- 帮助者 -->
      <div class="save_creator save_partner pos-a" v-show="!statusShow">
        <div class="schedule_left">
          <p>"<span>{{creatName}}</span>邀请你帮TA救红包"</p>
          <p>已有{{totalNum}}个好友帮TA拆炸弹</p>
        </div>
        <div class="schedule_right pos-r">
          <img src="../assets/images/activity/saveRed_btn.png">
          <p class="share_btn pos-a" v-show="helpBtnShow" v-on:click="removeBomb">帮忙拆炸弹</p>
          <p class="share_btn pos-a" v-show="!helpBtnShow" v-on:click="againHelp">我要救红包</p>
        </div>
      </div>
    </div>
    <!-- 曝光宝贝 -->
    <div class="goods-list" v-show="goodsList">
      <div class="title text-center pos-r">
        <h2>
          精选宝贝
        </h2>
        <div class="stick stick-left pos-a"></div>
        <div class="stick stick-right pos-a"></div>
      </div>
      <ul class="clearfix">
        <li class="pull-left goods" v-for="(goods,idx) in activeInfo.itemList">
          <div class="goods-img">
            <a v-bind:href="goods.detailUrl" style="display: block;text-decoration: none;">
              <img v-bind:src="goods.picUrl" alt="" />
            </a>
          </div>
          <div class="goods-name">
            <a v-bind:href="goods.detailUrl" style="color: #333;">{{goods.title}}</a>
          </div>
          <div class="goods-detail">
            <span class="price-current">
              <i>
                ￥
              </i>
              {{goods.price/100}}
            </span>
          </div>
        </li>
      </ul>
    </div>

  </div>

</template>

<script >
  import rest from '../scripts/restClient';
  import {
    getShopDto,
    getShop,
    doAuthorize
  } from '../scripts/global';

  export default{
    name:'saveRed',
    data () {
      return {
        shopPic: '',
        shopName: '',
        actRuler: {
          title: '活动规则',
          detail: []
        },
        shopDto:getShopDto(),
        rulerDialogIsShow: false,//活动规则
        coverShow:false,//浮层
        gameStartShow:false,//游戏开始弹框
        statusShow:true,//创建者和帮助者内容展示
        attentionShow:false,//关注店铺弹窗
        bannerShow:true,//背景展示
        alipayShow:false,//领取奖品弹窗显示
        helpBtnShow:true,//帮拆和我要救按钮展示
        helpModelShow:false,//帮拆成功弹窗
        activeInfo:{},
        gameInfo:{},
        query: this.$route.query,
        outerShopId:'',
        activeCenterUrl:'',
        goodsList: false,
        prizeInfo: '',
        days:0,
        hours:0,
        minutes:0,
        second:0,
        totalNum:0,//邀请成功人数
        shareLink:'',//分享链接
        creatName:''
      }
    },
    methods: {
      //初始化
      init(){
        this.$vux.loading.show('加载中');

        var self=this;
        if(self.query.shareBuyerUuid!='null'){
          self.statusShow = false;
        }
        this.getActive();
        //授权
        getShop(self.query).then(function(shopDto) {
          self.shopDto = shopDto;
          self.shopName = shopDto.shop.name;
          self.shopPic = shopDto.shop.picPath;
          self.outerShopId = shopDto.shop.outerShopId;
          self.activeCenterUrl = shopDto.interactUrl;
          self.$vux.loading.hide();
          //授权
          var params=$.extend({},self.query,shopDto);
          doAuthorize(params).then(function(){
            self.getActiveInfo();
          });
        });
      },
      //活动规则显示
      rulerShow(){
        this.rulerDialogIsShow = true;
        this.coverShow = true;
      },
      //活动规则隐藏
      rulerHide(){
        this.rulerDialogIsShow = false;
        this.coverShow = false;
      },
      //关闭开始游戏
      saveClose(){
        this.gameStartShow = false;
        this.coverShow = false;
      },
      //点击开始游戏
      saveStart(){
        if(this.activeInfo.isShop){
          this.gameStartShow = false;
          this.attentionShow = true;
          this.coverShow = true;
        }else{
          this.gameStartShow = false;
          this.coverShow = false;
          this.startRedGame();
        }
      },
      //关闭关注店铺弹窗
      attentionClose(){
        this.attentionShow = false;
        this.coverShow = false;
      },
      //关闭领取奖品弹窗
      prizeModelClose(){
        this.alipayShow = false;
        this.coverShow = false;
      },
      //关注店铺
      attentionClick(){
        var self = this;
        if(self.shopDto.env == "local"){//本地
          self.attentionShow = false;
          self.coverShow = false;
          if(self.query.shareBuyerUuid=='null'){
            self.startRedGame();
          }else{
            self.getGameInfo();
          }
        }else{//淘宝
          Tida.ready({}, function () {
            Tida.subscribe.add({
              accountId:self.shopDto.shop.ownerId +""
            },function(data){
              self.attentionShow = false;
              self.coverShow = false;
              if(self.query.shareBuyerUuid=='null'){
                self.startRedGame();
              }else{
                self.getGameInfo();
              }
            },function (e) {
              self.$vux.toast.show({
                text: "淘宝关注店铺组件调用失败，请刷新重试:"+JSON.stringify(e),
                position: "center"
              })
            })
          })
        }
      },
      //开始游戏
      startRedGame(){
        var params = this.query.relationUuid;
        var self = this;
        var action = {
          successCallback: function (data) {
            self.getGameInfo();
          }
        };
        rest.post("dragon/redEnvelope/create",null,params,action);
      },
      //实时获取游戏信息
      getGameInfo(){
        var self = this;
        var interval = setInterval(function(){
          var params = {};
          if(self.query.shareBuyerUuid == 'null'){
            params = {
              relationUuid:self.query.relationUuid
            };
          }else{
            params = {
              relationUuid:self.query.relationUuid,
              buyerUuid:self.query.shareBuyerUuid
            };
          }
          var action = {
            successCallback: function (data) {
              self.gameInfo = data.data;
              self.totalNum = data.data.totalNum;
              self.setGameTime(data.data.endTime);

              if(self.query.shareBuyerUuid=='null'){//活动为创建者时
                self.scheduleStatus();
                var date4 = (new Date(data.data.endTime))-(new Date());
                if(date4>=0){//游戏进行中
                  self.bannerShow = true;
                  if(self.totalNum >= self.activeInfo.attendNum){//完成
                    if(!self.gameInfo.isPrize){//未领取
                      self.getPrizeInfo();
                    }
                  }
                }else if(date4<0){//游戏已结束
                  if(self.totalNum >= self.activeInfo.attendNum){//完成
                    if(!self.gameInfo.isPrize){//未领取
                      self.getPrizeInfo();
                    }
                  }else{//未完成
                    self.bannerShow = false;
                  }
                }
              }else{//活动为帮拆者时
                // self.statusShow = false;
                // if(self.activeInfo.isShop){
                //   this.attentionShow = true;
                //   this.coverShow = true;
                // }
              }
            },
            failCallback: function (data) {

            }
          };
          rest.get("dragon/redEnvelope/check", params, action);
        },1000)
      },
      //获取奖品信息
      getPrizeInfo(){
        var params = {
            relationUuid:this.query.relationUuid
          };
        var self = this;
        var action = {
          successCallback: function (data) {
            self.prizeInfo = data.data;
            self.prizeInfo.denomination = (self.prizeInfo.denomination)/100;
            self.alipayShow = true;
            self.coverShow = true;
          },
          failCallback: function (data) {

          }
        };
        rest.get("dragon/redEnvelope/doTakeAward", params, action);
      },
      //获取分享链接
      getShareLink(){
        var params = {
            relationUuid:this.query.relationUuid
          };
        var self = this;
        var action = {
          successCallback: function (data) {
            self.shareLink = data.data;
          },
          failCallback: function (data) {

          }
        };
        var promise = rest.get("dragon/redEnvelope/sharing", params, action);
        return promise;
      },
      //拉好友拆弹
      shareRed(){
        var self = this;
        this.getShareLink().then(function(){
          if(self.shopDto.env == "local"){//本地

          }else{//淘宝
            Tida.ready({}, function () {
              var shareObj = {};
              shareObj.title = '拯救红包';
              shareObj.content = '一个红包，被炸弹给包围了，赶快前往帮好友拯救他吧！';
              shareObj.url = self.shareLink;
              shareObj.image = 'http://qnzg.image.alimmdn.com/wxhd/00406810-CACA-45ee-A6FE-084138532B8D.png?t=1520219796210';
              Tida.share(shareObj, function(data){

              },function (e){
                self.$vux.toast.show({
                  text: "淘宝组件调用失败，请刷新重试:"+JSON.stringify(e),
                  position: "center"
                })
              });
            });
          }
        }); 
      },
      //时间转换为时分秒
      setGameTime(time){
        var date1 = new Date();
        var date2 = new Date(time);
        var date3 = date2-date1;
        console.log(date3);
        if(date3>0){
          this.days = parseInt(date3 / 1000 / 60 / 60 / 24 , 10); //计算剩余的天数
          // this.hours = parseInt(date3 / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时
          // this.minutes = parseInt(date3 / 1000 / 60 % 60, 10);//计算剩余的分钟
          this.hours = parseInt(date3 / 1000 / 60 / 60, 10);
          this.minutes = parseInt(date3 / 1000 / 60 % 60, 10);
          this.second = parseInt(date3 / 1000 % 60, 10);
          if(this.hours<10){
            this.hours = "0"+this.hours;
          }
          if(this.minutes<10){
            this.minutes = "0"+this.minutes;
          }
          if(this.second<10){
            this.second = "0"+this.second;
          }
        }
      },
      //帮忙拆炸弹
      removeBomb(){
        var params = {
            buyerUuid:this.query.shareBuyerUuid,
            uuid:this.query.relationUuid
          };
        var self = this;
        var action = {
          successCallback: function (data) {
            self.helpBtnShow = false;
            self.helpModelShow = true;
            self.coverShow = true;
          },
          failCallback: function (data) {
            if(data.resultCode == 70005){
              application.dialog = {
                content: "<p>您已帮助过该用户</p>",
                show: true,
                link: "",
                btnText: "确定",
                action(event) {
                  application.dialog.show = false;
                  self.helpBtnShow = false;
                }
              }
            }
          }
        };
        rest.get("dragon/redEnvelope/help", params, action);
      },
      //关闭帮拆成功弹窗
      helpModelClose(){
        this.helpModelShow = false;
        this.coverShow = false;
      },
      //我也要救红包
      againHelp(){
        this.$router.push({
            path: '/interact/red_envelope',
            query: {
              module:'interact',
              relationType:'red_envelope',
              relationUuid:this.query.relationUuid,
              shareBuyerUuid:'null',
            }
        });
        window.location.reload();
      },
      //获取活动信息
      getActive(){
        var params = {
          relationType:this.query.relationType,
          relationUuid:this.query.relationUuid
        };
        var self = this;
        var action = {
          successCallback: function (data) {
            self.activeInfo = data.data.redEnvelope;
            self.actRuler.title = data.data.redEnvelope.title;
            self.actRuler.detail = data.data.redEnvelope.rule.split(/\n/);
            if(self.activeInfo.itemList){
              self.goodsList = true;
            }
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
        var params = {};
        if(this.query.shareBuyerUuid == 'null'){
          params = {
            relationUuid:this.query.relationUuid
          };
        }else{
          params = {
            relationUuid:this.query.relationUuid,
            buyerUuid:this.query.shareBuyerUuid
          };
        }
        var self = this;
        var action = {
          successCallback: function (data) {
            console.log(self.$route);
            self.gameInfo = data.data;
            self.totalNum = data.data.totalNum;
            self.setGameTime(data.data.endTime);
            if(self.query.shareBuyerUuid=='null'){
              self.statusShow = true;
              self.scheduleStatus();
              self.timeStatus(data.data.endTime);
            }else{
              self.creatName = data.data.mixNick;
              self.creatName = self.creatName.substr(0,1) + "***";
              self.statusShow = false;
              self.attentionShow = true;
              self.coverShow = true;
              self.getGameInfo();
            }
          },
          failCallback: function (data) {
            self.checkStatus(data.resultCode);
          }
        };
        rest.get("dragon/redEnvelope/check", params, action);
      },
      //进度条展示
      scheduleStatus(){
        var num = ($(".schedule").css("width").replace('px',''))/(this.activeInfo.attendNum);
        var allnum = num*(this.totalNum);
        $(".progressbar").css("width",allnum+"px");
      },
      //时间操作判断
      timeStatus(gametime){
        var date5 = (new Date(gametime))-(new Date());
        if(date5>=0){//游戏进行中
          this.bannerShow = true;
          if(this.totalNum >= this.activeInfo.attendNum){//完成
            if(!this.gameInfo.isPrize){//未领取
              this.getPrizeInfo();
            }
          }else{//未完成
            this.getGameInfo();
          }
        }else if(date5<0){//游戏已结束
          if(this.totalNum >= this.activeInfo.attendNum){//完成
            if(!this.gameInfo.isPrize){//未领取
              this.getPrizeInfo();
            }
          }else{//未完成
            this.bannerShow = false;
          }
        }
      },
      //校验状态判断
      checkStatus(num){
        switch(num){
          case '70001':
            application.dialog = {
              content: "<p>活动已失效</p>",
              show: true,
              link: "",
              btnText: "确定",
              action(event) {
                application.dialog.show = false;
              }
            }
            break;
          case '70002':
            this.coverShow = true;
            this.gameStartShow = true;
            break;
          case '70004':
            application.dialog = {
              content: "<p>活动已失效</p>",
              show: true,
              link: "",
              btnText: "确定",
              action(event) {
                application.dialog.show = false;
              }
            }
            break;
          case '70005':
            application.dialog = {
              content: "<p>游戏已参与</p>",
              show: true,
              link: "",
              btnText: "确定",
              action(event) {
                application.dialog.show = false;
              }
            }
            break;
          case '70006':
            application.dialog = {
              content: "<p>游戏已结束</p>",
              show: true,
              link: "",
              btnText: "确定",
              action(event) {
                application.dialog.show = false;
              }
            }
            break;
        }
      }
    },
    created:function(){
      this.init();
    }
  }
</script>
