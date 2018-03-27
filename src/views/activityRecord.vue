<template>
  <div class="activityRecord">
    <scroller lock-x scrollbar-y ref="record" use-pullup :pullup-config="pullupConfig" @on-pullup-loading="getList" v-show="itemList.length>0">
      <ul >
        <li class="list clearfix" v-for="(item,idx) in itemList">
          <div class="list-right pull-right">
            <span class="point">
              <span v-show="item.cost">
                {{item.cost|centToDollar}}
              </span>
              <span v-show="item.prizeType!='coupon'">
                {{item.prizeType|prizeType}}
              </span>
              <span v-show="item.prizeType=='coupon'">
                {{item.subPrizeType|prizeType}}
              </span>
              <span v-show="!item.prizeType&&item.relationType=='draw'">
                未中奖
              </span>
            </span>
          </div>
          <div class="list-left pull-left">
            <p class="name">
              {{item.relationTitle}}
            </p>
            <p class="date">
              {{item.createTime}}
            </p>
          </div>
        </li>
      </ul>
    </scroller>
    <div class="no-items text-center" v-show="itemList.length==0">
      <img class="img" src="../assets/images/icon_record.png">
      <div class="remind-text">
        您还未参加过活动，<br>赶快去尝试一下吧！
      </div>
      <button class="activity-btn btn-warning">
        <a v-bind:href="shopData.interactUrl" class="link-a" style="color:#fff;">
          去活动中心
        </a>
      </button>
    </div>

  </div>
</template>
<script >
  import Vue from 'vue';
  import $jq from "../lib/jquery.min";
  import rest from '../scripts/restClient';
  import {Scroller} from 'vux';
  import {getShop} from '../scripts/global';

  export default{
    name:'activityRecord',
    data(){
      return {
        pullupConfig: {
          content: '上拉加载更多',
          downContent: '松开进行加载',
          upContent: '上拉加载更多',
          loadingContent: '加载中...'
        },
        itemList: [],
        shopData:{},
        count:0,
        pageNo:0
      }
    },
    methods:{
      getList:function(){
        var that = this;
        var params = {
          pageNo:that.pageNo++,
          pageSize:10
        };
        that.$vux.loading.show("加载中");
        rest.post('dragon/activityLog/search',null,params,function(data){
          that.count = data.count;
          that.itemList = that.itemList.concat(data.data);
          that.$vux.loading.hide();

          if(that.count==that.itemList.length){   //最后一页时
              setTimeout(() => {
                that.$refs.record.disablePullup()
              }, 100)         
          }else{
              setTimeout(() => {
                that.$refs.record.donePullup()
              }, 100)
          }            
        })
      }
    },
    mounted:function(){
      var that = this;
      this.$nextTick(function(){
        that.getList();
        getShop().then(function(data){
          that.shopData = data;
        });
      })
    },
    components:{
      Scroller
    }
  }
</script>
