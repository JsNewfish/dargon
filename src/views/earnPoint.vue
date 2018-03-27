<template>
  <div class="activityCenter ">
    <div class="h-block">
      <div class="h-title text-center">
        <span class="h-text">
          {{shopData.shop.name}}
        </span>
        <span class="h-entry">
          <a v-bind:href="'https://shop'+shopData.shop.outerShopId+'.taobao.com/'">
          <img src="../assets/images/icon_entershop@2x.png">
          <span class="h-entry-text">进店</span>
          </a>
        </span>
      </div>
      <div class="h-banner" v-bind:style="{backgroundImage: 'url(' + bgImage.picUrl + ')'}">
        <div class="h-userInfo">
          <div class="buyerNick">
            <span class="buyerNick-img" v-bind:style="{backgroundImage: 'url(' + buyer.picUrl + ')'}"></span>
            <span >{{buyer.nick}}</span>
          </div>
          <div class="points" v-show="!bgImage.isShow">
            <img src="../assets/images/icon_integral@2x.png">
            <a  href="#/myPoints" class="points-num">{{'积分'|unitFormat}}:{{buyer.validPoint|centToDollar}}</a>
          </div>
        </div>
      </div>
      <div class="h-btnGroup">
        <a href="#/mall" v-bind:href="shopData.mallUrl" class="link">
          <img src="../assets/images/icon_gift.png">
          <span>{{'积分'|unitFormat}}商城</span>
        </a>
        <a href="#/exchangeRecord" class="link">
          <img src="../assets/images/icon_shop@2x.png">
          <span>兑换记录</span>
        </a>
      </div>
    </div>
    <scroller lock-x scrollbar-y ref="demo" use-pullup :pullup-config="pullupConfig" @on-pullup-loading="getList" height="11.04rem" v-show="itemList.length>0">
      <div>
        <ul class="activity-list">
          <li class="activity-item" v-for="item in itemList">
            <img v-show="item.type=='trade_point'" class="activity-icon" src="../assets/images/trade_point.png">
            <img v-show="item.type=='collection_info'" class="activity-icon" src="../assets/images/collection_info.png">
            <img v-show="item.type=='daily_rob'" class="activity-icon" src="../assets/images/daily_rob.png">
            <img v-show="item.type=='browse_item'" class="activity-icon" src="../assets/images/browse_item.png">
            <div class="activity-detail">
                <div class="activity-title">{{item.title}}</div>
                <span class="activity-time">活动时间：{{item.startTime.split(" ")[0]}}-{{item.endTime.split(" ")[0]}}</span>
            </div>

            <button class="activity-btn btn-base">
              <a v-bind:href="item.url">  参加活动</a>
            </button>

          </li>
        </ul>
      </div>
    </scroller>
    <div class="no-items text-center" v-show="itemList.length==0" style="background-color: #fff;">
      <img class="img" src="../assets/images/icon_record.png">
      <div class="remind-text">
        您还未创建过活动，<br>赶快去创建一下吧！
      </div>
    </div>
  </div>
</template>
<script>
  import $jq from "../lib/jquery.min";
  import rest from '../scripts/restClient';
  import {Scroller} from 'vux';
  import {getShop,
    doAuthorize,
    getShopDto} from '../scripts/global';

  export default {
    name: 'earnPoint',
    data(){
      return {
        shopData:getShopDto(),
        buyer: {},
        pullupConfig: {
          content: '上拉加载更多',
          downContent: '松开进行加载',
          upContent: '上拉加载更多',
          loadingContent: '加载中...'
        },
        itemList:[],
        count:0,
        query:this.$route.query,
        pageNo:0,
        bgImage:{
          isShow:0,
          picUrl:'/static/images/banner-bg@2x.a9a650f.png'
        }
      }
    },
    methods:{
      getList:function(){
        var that = this;

        var params = {
          status:5,
          pageNo:that.pageNo++,
          pageSize:10
        };
        that.$vux.loading.show("加载中");
        rest.post('common/listIntegral',null,params,function(data){
          that.$vux.loading.hide();
          that.count = data.count;
          that.itemList = that.itemList.concat(data.data);

          if(that.count==that.itemList.length){   //最后一页时
              setTimeout(() => {
                that.$refs.demo.disablePullup()
              }, 100)
          }else{
              setTimeout(() => {
                that.$refs.demo.donePullup()
              }, 100)
          }
        })
      }
    },
    mounted:function(){
      var that = this;
      this.$nextTick(function(){
        that.getList();
        getShop().then(function(data) {
          that.shopData=data;
          //遍历背景图片
            that.shopData.homeSettings.forEach(function(item){

              if(item.type=='backgroundImage'){
                that.bgImage = item;
              }

            })
            //授权
            var params = $.extend({}, data, that.$route.query);
            doAuthorize(params).then(function(buyer) {
              that.buyer = buyer;
            })
        });
      })
    },
    components:{
      Scroller
    }
  }
</script>
