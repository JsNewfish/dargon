<template>
  <div class="signPage pos-r">

    <a class="btn-act-center pos-a" v-bind:href="activeCenterUrl">活动中心</a>
    <a class="btn-act-rules pos-a" href="javascript:void(0)" v-on:click="rulerDialogIsShow = true">活动规则></a>
    <div class="cover pos-f" v-show="rulerDialogIsShow"></div>

    <div class="dialog act-ruler pos-f text-center"
         v-show="rulerDialogIsShow"
      >
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

    <div class="banner pos-r">
      <div class="btn-sign pos-a text-center"
        v-on:click="signIn"
        v-bind:class="{haveSigned: haveSigned}"
      >
        {{signBtnText}}
      </div>
      <div class="sign-days continue-days text-center pos-a">
        <span>
          {{signInLog.seriesDay}}
        </span>
        <h2>
          连续签到天数
        </h2>
      </div>
      <div class="sign-days total-days text-center pos-a">
        <span>
          {{signInLog.historyDay}}
        </span>
        <h2>
          累计签到天数
        </h2>
      </div>
    </div>

    <div class="sign-ruler">
      <h2>
        签到奖励
      </h2>
      <p>
        1、每日签到可获得
        <span>
          {{shortSignIn.num}}
        </span>
        {{shortSignIn.type|unitFormat}}；
      </p>

      <p v-for="(prize,index) in longSignIn">
        {{index+2}}、连续签到
        <span>
          {{prize.serialDay}}天
        </span>
        可获得
        <span>
          {{prize.num}}
        </span>
        {{prize.type|unitFormat}}；
      </p>
    </div>

    <div class="date-picker">
      <div class="date-header">
        <span class="current-date">{{nowYear}}年{{nowMonth}}月{{nowDay}}日</span>
      </div>
      <div class="date-body">
        <div class="date-title">
          <span>日</span>
          <span>一</span>
          <span>二</span>
          <span>三</span>
          <span>四</span>
          <span>五</span>
          <span>六</span>
        </div>
        <ul class="qiandao-list" id="js-qiandao-list">

        </ul>
      </div>
    </div>

    <div class="goods-list" v-show="goodsList">
      <div class="title text-center pos-r">
        <h2>
          精选宝贝
        </h2>
        <div class="stick stick-left pos-a"></div>
        <div class="stick stick-right pos-a"></div>
      </div>
      <ul class="clearfix">
        <li class="pull-left goods" v-for="(goods,idx) in goodsList">
          <div class="goods-img">
            <img v-bind:src="goods.picUrl" alt="" />
          </div>
          <div class="goods-name">
            {{goods.title}}
          </div>
          <div class="goods-detail">
            <span class="price-current">
              <i>
                ￥
              </i>
              {{goods.price}}
            </span>
          </div>
        </li>
      </ul>
    </div>

    

    <activeModal v-show="modalParams.modalShow" v-bind:modalParams='modalParams' v-on:message="recieveMessage"></activeModal>

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
        shortSignIn:{
          type:'',
          num:null
        },//日常签到
        longSignIn:[],//连续签到
        signInLog:{},//签到记录
        dateArray:[],//本月已签到
        goodsList: [],
        haveSigned: false,
        signBtnText: '签到',
        rulerDialogIsShow: false,
        prizeDialogIsShow: false,

        count:0,
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
          modalTitle:'签到成功',//成功弹框标题
          failContent:'您已签到过，请明天再来！'//失败弹框内容
        },
        $dateBox:'',
        $currentDate:'',
        $qiandaoBnt:'',
        monthFirst:null,
        totalDay:null,
        nowDay:null,
        nowMonth:null,
        nowYear:null,
        $dateLi:'',
        module:'',
        relationType:'',
        relationUuid:'',
        outerShopId:'',
        unit:'',//单位
        activeCenterUrl:'',
        query: this.$route.query,
        shopDto:getShopDto()
      }
    },
    mounted(){

      this.$dateBox = $("#js-qiandao-list");
      this.$currentDate = $(".date-title");
      this.$qiandaoBnt = $("#js-just-qiandao");
      var _html = '',
          _handle = true,
          myDate = new Date();
      this.monthFirst = new Date(myDate.getFullYear(), parseInt(myDate.getMonth()), 1).getDay();//获取当前是一周第几天
      var d = new Date(myDate.getFullYear(), parseInt(myDate.getMonth() + 1), 0);
      this.totalDay = d.getDate(); //获取当前月的天数
      this.nowDay = myDate.getDate();//获取当前是第几天
      this.nowMonth = myDate.getMonth() + 1;//获取当前月份
      this.nowYear = myDate.getFullYear();//获取当前年份
      for (var i = 0; i < 42; i++) {
        _html += ' <li></li>';
      }
      this.$dateBox.html(_html); //生成日历网格
      this.$dateLi = this.$dateBox.find("li");
      for (var i = 0; i < this.totalDay; i++) {
          this.$dateLi.eq(i + this.monthFirst).text(parseInt(i + 1));
          if (i == this.nowDay) {//当前天添加选中样式
            this.$dateLi.eq(i - 1 + this.monthFirst).removeClass("qiandaotwo").addClass("qiandaoone");
          }
      } //生成当月的日历且含已签到
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
        //   self.unit = window.unit;
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
          self.unit = window.unit;
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
        var self = this;
        var params = {
          relationType:self.relationType,
          relationUuid:self.relationUuid
        };
        var action = {
          successCallback: function (data) {
            self.actRuler.title = data.data.signIn.title;
            self.actRuler.detail = data.data.signIn.rule.split(/\n/);
            self.setDailySignIn(data.data.signIn.dailyPrize);
            self.setLongSignIn(data.data.signIn.seriesDetails);
            self.goodsList = data.data.signIn.itemList;
            if(self.goodsList){
              self.goodsList.forEach(function(value,index,arry){
                arry[index].price = arry[index].price/100;
              });
            }
          },
          failCallback: function (data) {
            self.$router.push('/activityMiss');
          }
        };
        rest.get("common/activity", params, action);
      },
      //获取日常签到奖励规则数据转换
      setDailySignIn(data){
        switch(data.type){
          case "coupon":
            if (data.subType == 'coupon_shop') {
              this.shortSignIn.type = '店铺优惠券';
              this.shortSignIn.num = data.denomination/100+'元';
            } else {
              this.shortSignIn.type = '商品优惠券';
              this.shortSignIn.num = data.denomination/100+'元';
            }
            break;
          case "flow":
            this.shortSignIn.type = '流量券';
            this.shortSignIn.num = data.denomination/100+'M';
            break;
          case "alipay_red":
            this.shortSignIn.type = '支付宝红包';
            this.shortSignIn.num = data.denomination/100+'元';
            break;
          case "point":
            this.shortSignIn.type = '积分';
            this.shortSignIn.num = data.denomination/100;
            break;
        }
      },
      //获取连续签到奖励规则数据转换
      setLongSignIn(data){
        var obj = {
          type:'',
          num:null,
          serialDay:null
        }
        if(data){
          for (var j = 0; j < data.length; j++) {
            this.longSignIn.push($.extend({}, obj, obj));
          }
          for (var i = 0; i < data.length; i++) {
            switch(data[i].prize.type){
              case "coupon":
                if (data[i].prize.subType == 'coupon_shop') {
                  this.longSignIn[i].type = '店铺优惠券';
                  this.longSignIn[i].num = data[i].prize.denomination/100+'元';
                  this.longSignIn[i].serialDay = data[i].serialDay;
                } else {
                  this.longSignIn[i].type = '商品优惠券';
                  this.longSignIn[i].num = data[i].prize.denomination/100+'元';
                  this.longSignIn[i].serialDay = data[i].serialDay;
                }
                break;
              case "flow":
                this.longSignIn[i].type = '流量券';
                this.longSignIn[i].num = data[i].prize.denomination/100+'M';
                this.longSignIn[i].serialDay = data[i].serialDay;
                break;
              case "alipay_red":
                this.longSignIn[i].type = '支付宝红包';
                this.longSignIn[i].num = data[i].prize.denomination/100+'元';
                this.longSignIn[i].serialDay = data[i].serialDay;
                break;
              case "point":
                this.longSignIn[i].type = '积分';
                this.longSignIn[i].num = data[i].prize.denomination/100;
                this.longSignIn[i].serialDay = data[i].serialDay;
                break;
            }
          } 
        }
          
      },
      //再次获取活动信息
      getActiveInfo(){
        var self = this;
        var params = {
          relationUuid:self.relationUuid
        };
        var action = {
          successCallback: function (data) {
            self.signInLog = $.extend({}, self.signInLog, data.data);
            for (var i = 0; i < self.signInLog.days.length; i++) {
              self.signInLog.days[i] = new Date(self.signInLog.days[i].replace(/-/g,"/")).getDate();
            }
            self.dateArray = self.signInLog.days.sort();
            for (var k = 0; k < self.totalDay; k++) {
              self.dateArray.forEach(function(value,index,arry){
                if (k == arry[index]) {
                  self.$dateLi.eq(k - 1 + self.monthFirst).removeClass("qiandaoone").addClass("qiandaotwo");
                }
              });
            }
            if(self.signInLog.signed){
              self.haveSigned = true;
              self.signBtnText = '已签到';
              self.count = 1;
            }
          },
          failCallback: function (data) {
            alert(data.resultMessage);
          }
        };
        rest.get("dragon/checkSignIn", params, action);
      },
      //签到领取奖品
      signIn(){
        var self = this;
        var params = {
          relationUuid:self.relationUuid
        };
        var action = {
          successCallback: function (data) {
            self.modalParams = $.extend({}, self.modalParams, data.data.prize);
            self.modalParams.denomination = self.modalParams.denomination/100;
            self.modalParams.useCondition = self.modalParams.useCondition/100;
            self.modalParams.shopId = self.outerShopId;
            self.prizeDialogIsShow = true;
            self.failedDialogIsShow = false;
            self.haveSigned = true;
            if(self.count != 1){
              self.count = self.count + 1;
            }
            if(data.data.isPrize){
              self.modalParams.modalShow = true;
            }else{
              application.$vux.toast.show({
                text: "签到成功！",
                position: 'middle'
              });
            }
            self.modalParams.modalStatus = true;
            if(data.data.prize){
              self.modalParams.prizeRecordId = data.data.prize.prizeRecordId;
            }
            self.getActiveInfo();
          },
          failCallback: function (data) {
            alert(data.resultMessage);
          }
        };
        if(this.count != 1){
          rest.post("dragon/signInLog",params,null, action);
        }
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
