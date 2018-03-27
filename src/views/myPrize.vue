<template>
     <div class="myPrize">
        <div class="cover pos-f" v-if="showCover" v-on:click="hideNav"></div>
        <nav class="clearfix text-center" >
          <div class="pull-left nav-left" v-on:click="showLeftNav">
            <span v-bind:class="{ active: showNav.left }">
              奖品类型
            </span>
            <img v-if="!showNav.left" src="../assets/images/down.png">
            <img v-if="showNav.left" src="../assets/images/up-choose.png">
            <div class="nav-list pos-a" v-if="showNav.left">
              <ul>
                <li
                  v-for="(items,idx) in navLeftList"
                  v-bind:class="{ active: items.isActive }"
                  v-on:click="function(){activateNavLeftList(idx)}">
                    {{items.name}}
                  <img class="" src="../assets/images/choose.png">
                </li>
              </ul>
            </div>
          </div>
          <div class="pull-left nav-middle" v-on:click="showMiddleNav">
            <span v-bind:class="{ active: showNav.middle }">
              奖品状态
            </span>
            <img v-if="!showNav.middle" src="../assets/images/down.png">
            <img v-if="showNav.middle" src="../assets/images/up-choose.png">
            <div class="nav-list pos-a" v-if="showNav.middle">
              <ul>
                <li
                  v-for="(items,idx) in navMiddleList"
                  v-bind:class="{ active: items.isActive }"
                  v-on:click="function(){activateNavMiddleList(idx)}"
                  >
                  {{items.name}}
                  <img class="" src="../assets/images/choose.png">
                </li>
              </ul>
            </div>
          </div>
          <div class="pull-left nav-right" v-on:click="showRightNav">
            <span v-bind:class="{ active: showNav.right }">
              领取时间
            </span>
            <img v-if="!showNav.right" src="../assets/images/down.png">
            <img v-if="showNav.right" src="../assets/images/up-choose.png">
            <div class="nav-list pos-a" v-if="showNav.right">
              <ul>
                <li
                  v-for="(items,idx) in navRightList"
                  v-bind:class="{ active: items.isActive }"
                  v-on:click="function(){activateNavRightList(idx)}"
                  >
                  {{items.name}}
                  <img class="" src="../assets/images/choose.png">
                </li>
              </ul>
            </div> 
          </div>
        </nav>
        <main>
          <scroller lock-x scrollbar-y ref="record" use-pullup :pullup-config="pullupConfig" @on-pullup-loading="getList()" height="-79" v-show="itemList.length>0">
            <ul >
              <li class="clearfix" v-for="(item,idx) in itemList" @click="goToDetail(item)">
                <div class="wrap pull-left">
                  <div class="prize-img prize-img-little" 
                       v-bind:class="{'prize-coupon':item.subPrizeType=='coupon_shop','prize-coupon2':item.subPrizeType=='coupon_goods',
                        'prize-flow':item.prizeType=='flow','prize-lottery':item.prizeType=='ticket','prize-integral':item.prizeType=='point',
                        'prize-red-packet':item.prizeType=='alipay_red','prize-lose':item.overTime}">
                    <span class="prize-detail-top">
                      <i v-show="item.prizeType=='coupon'||item.prizeType=='alipay_red'">
                        ￥
                      </i>
                      {{item.cost|centToDollar}}
                      <em v-show="item.prizeType=='flow'">
                        M
                      </em>
                      <em v-show="item.prizeType=='ticket'">
                        注
                      </em>
                      <em v-show="item.prizeType=='point'">
                        {{'积分'|unitFormat}}
                      </em>
                    </span>
                    <span class="prize-detail-bottom" v-show="item.prizeType=='coupon'">
                      <span v-show="item.usePrizeCondition">满{{item.usePrizeCondition|centToDollar}}元使用</span>
                      <span v-show="!item.usePrizeCondition">无门槛使用</span>
                    </span>
                    <span class="prize-detail-right" >
                      <span v-show="item.subPrizeType=='coupon_shop'">店铺优惠券</span>
                      <span v-show="item.prizeType=='coupon_goods'">商品优惠券</span>
                      <span v-show="item.prizeType!='coupon'">{{item.prizeType|prizeSubType}}</span>
                    </span>
                  </div>
                </div>
                <div class="prize-desc pull-left">
                  <h2>
                    <span v-show="item.prizeType=='coupon'&&item.subPrizeType=='coupon_shop'">店铺{{item.prizeType|prizeSubType}}</span>
                    <span v-show="item.prizeType=='coupon'&&item.subPrizeType=='coupon_goods'">商品{{item.prizeType|prizeSubType}}</span>
                    <span v-show="item.prizeType!='coupon'">{{item.prizeType|prizeSubType}}</span>
                  </h2>
                  <p>有效期：{{item.prizeStartTime.split(" ")[0]}}-{{item.prizeEndTime.split(" ")[0]}}</p>
                </div>
              </li>
            </ul>
          </scroller>
          
        </main>
        <div class="no-items text-center" v-show="itemList.length==0" style="background-color: #fff;">
            <img class="img" src="../assets/images/icon_giftList.png">
            <div class="remind-text">
              还没有已获得的奖品，<br>快去参加活动吧！
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
  import $jq from "../lib/jquery.min";
  import rest from '../scripts/restClient';
  import {getShop} from '../scripts/global';
  import {Scroller} from 'vux';

	export default{
		name:'myPrize',
		data(){
			return {
        showCover: false,
        showNav: {
          left: false,
          middle: false,
          right: false
        },
        navLeftList: [
          {name: '全部',isActive: true},
          {name: '优惠券',isActive: false},
          {name: '手机流量包',isActive: false},
          {name: '支付宝红包',isActive: false},
          {name: '彩票',isActive: false}
        ],
        navMiddleList: [
          {name: '全部',isActive: true},
          {name: '未失效',isActive: false},
          {name: '已失效',isActive: false}
        ],
        navRightList: [
          {name: '领取时间',isActive: true},
          {name: '到期时间',isActive: false}
        ],
        pullupConfig: {
          content: '上拉加载更多',
          downContent: '松开进行加载',
          upContent: '上拉加载更多',
          loadingContent: '加载中...'
        },
        itemList: [],
        prizeType:null,
        prizeStatus:null,
        isObtainTime:0,
        shopData:{},
        count:0,
        pageNo:0
			}
		},
		methods: {
      goToDetail:function(item){
        var router = this.$router;
        
        router.push({ path:'/prizeDetail', query: { id: item.prizeUuid ,relationType:item.relationType}});
      },
      getList:function(pageNo){
        var that = this;
        pageNo==0&&(that.pageNo = pageNo);
        that.$vux.loading.show("加载中");
        var params = {
          prizeType:that.prizeType,
          prizeStatus:that.prizeStatus,
          isObtainTime:that.isObtainTime,
          pageNo:that.pageNo++,
          pageSize:10
        };
        rest.post('dragon/prizeRecord/search',null,params,function(data){
          that.count = data.count;
          that.$vux.loading.hide();
          //判断奖品是否过期
          $.each(data.data,function(index,item){
            
            item.prizeEndTime&&(item.overTime = (new Date()> new Date(Date.parse(item.prizeEndTime))))
            
          });
          
          if(pageNo==0){
            that.itemList =[];
            //回到顶部
            that.$refs.record.reset({top: 0});
            //启用上拉加载
            that.$refs.record.enablePullup();
            that.itemList = data.data;
          }else{
            that.itemList = that.itemList.concat(data.data);
          }
          
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
      },
      hideNav: function (){
        this.showCover = false;
        for (var key in this.showNav) {
          this.showNav[key] = false
        }
      },
      showLeftNav: function () {
        this.showCover = !this.showNav.left;
        this.showNav.left = !this.showNav.left;
        this.showNav.middle = false;
        this.showNav.right = false;
      },
      showMiddleNav: function () {
        this.showCover = !this.showNav.middle;
        this.showNav.middle = !this.showNav.middle;
        this.showNav.left = false;
        this.showNav.right = false;
      },
      showRightNav: function () {
        this.showCover = !this.showNav.right;
        this.showNav.right = !this.showNav.right;
        this.showNav.middle = false;
        this.showNav.left = false;
      },
      activateNavLeftList: function (idx) {
        var prizeType;
        this.navLeftList.forEach(function(item){
          item.isActive = false;
        })
        this.navLeftList[idx].isActive = true;
        switch (idx) {
          case 0:
          {
              prizeType = null;
              break;
          }
          case 1:
          {
              prizeType = "coupon";
              break;
          }
          case 2:
          {
              prizeType = 'flow';
              break;
          }
          case 3:
          {
              prizeType = "alipay_red";
              break;
          }
          case 4:
          {
              prizeType = "ticket";
              break;
          }
        };
        this.prizeType = prizeType;
        this.getList(0);
      },
      activateNavMiddleList: function (idx) {
        var prizeStatus;
        this.navMiddleList.forEach(function(item){
          item.isActive = false;
        })
        this.navMiddleList[idx].isActive = true;
        switch (idx) {
          case 0:
          {
              prizeStatus = null;
              break;
          }
          case 1:
          {
              prizeStatus = 0;
              break;
          }
          case 2:
          {
              prizeStatus = 1;
              break;
          }
        };
        this.prizeStatus = prizeStatus;
        this.getList(0);
      },
      activateNavRightList: function (idx) {
        var isObtainTime;
        this.navRightList.forEach(function(item){
          item.isActive = false;
        })
        this.navRightList[idx].isActive = true;
        switch (idx) {
          case 0:
          {
              isObtainTime = 0;
              break;
          }
          case 1:
          {
              isObtainTime = 1;
              break;
          }
        };
        this.isObtainTime = isObtainTime;
        this.getList(0);
      }
		},
    mounted:function(){
      var that = this;
      this.$nextTick(function(){
        getShop().then(function(data){
          that.shopData = data;
        });
        that.getList();
      })
    },
    components:{
      Scroller
    },
    filters:{
      prizeSubType:function(value){
        var result = "";
        switch (value) {
            case 'coupon':
            {
                result = '优惠券';
                break;
            }
            case 'alipay_red':
            {
                result = "支付宝红包";
                break;
            }
            case 'flow':
            {
                result = "手机流量包";
                break;
            }
            case 'ticket':
            {
                result = "双色球";
                break;
            }
           
          }
          return result;  
      }  
    }
	}
</script>

