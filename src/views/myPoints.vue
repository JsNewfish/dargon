<template>
	<div class="myPoints ">
    <a class="btn-point-rules pos-a" href="#/pointRules" v-on:click="rulerDialogIsShow = true">{{'积分'|unitFormat}}规则</a>
    <div class="banner pos-r text-center">
      <h1 class="point-num">
        {{point|centToDollar}}
      </h1>
      <div class="title pos-r">
        <span>
           我的{{'积分'|unitFormat}}
        </span>
        <div class="stick stick-left pos-a"></div>
        <div class="stick stick-right pos-a"></div>
      </div>
    </div> 
    <nav class="clearfix text-center">
     <div class="pull-left nav-left">
       <a href="#/mall" v-bind:href="shopDto.mallUrl">
         {{'积分'|unitFormat}}商城
       </a>
     </div>
     <div class="pull-left nav-middle">
        <a href="#/mall" v-bind:href="shopDto.integralUrl">
         赚取{{'积分'|unitFormat}}
       </a>
     </div>
     <div class="pull-left nav-right">
       <a href="#/exchangeRecord">
         兑换记录
       </a>
     </div>
   </nav> 
    <div class="point-detail">
     <scroller class="list-wrap" height="12.32rem" lock-x scrollbar-y use-pullup :pullup-config="pullupConfig"   @on-pullup-loading="getList" v-model="loaderStatus">
       <ul>
         <li class="list clearfix" v-for="(data,idx) in dataList">
           <div class="list-right pull-right">
             <span class="point"  v-bind:class="{add: data.add}">
               <span v-show="data.add">+</span><span v-show="!data.add">-</span> {{data.point|centToDollar}}
             </span>
           </div>
           <div class="list-left pull-left">
             <p class="name">
               {{data.content}}
             </p>
             <p class="date">
               {{new Date(data.createTime).format("YYYY.MM.dd hh:mm:ss")}}
             </p>
           </div>
         </li>
       </ul>
     </scroller>
     <div class="no-items text-center" v-show="dataList.length==0">
        <img class="img" src="../assets/images/icon_record.png">
        <div class="remind-text">
          没有找到相关商品<br>尽请期待！！！
        </div>
      </div>
    </div>
	</div>
</template>
<script >
import rest from '../scripts/restClient';
import {
  Scroller,
  Countup
} from 'vux';
import {
  getShop,
  getShopDto
} from '../scripts/global';


export default {
  name: 'shoppingMall',
  data() {
    return {
      shopDto: getShopDto(),
      point: 0,
      dataList: [],
      isFirstload: true,
      searchModel: {
        pageSize: 10,
        pageNo: 0,
        count: "",
        column: "",
        orderby: ""
      },
      loaderStatus: {
        pullupStatus: ''
      },
      pullupConfig: {
        content: '上拉加载更多',
        downContent: '松开进行加载',
        upContent: '上拉加载更多',
        loadingContent: '加载中...'
      }
    }
  },
  components: {
    Scroller,
    Countup
  },
  methods: {
    init() {
      var self = this;
      this.getList();
      this.getPoint();
    },
    getList(searchModel) {
      var self = this;
      var searchModel = this.createSearchModel();
      rest.post("dragon/pointDetail/search", null, searchModel, function(data) {
        self.loaderStatus.pullupStatus = 'default';
        self.isFirstload = false; //是否第一次加载
        self.resolveList(data);
      });
    },
    getPoint() {
      var self = this;
      rest.get("dragon/point", null, function(data) {
        self.point = data.data.validPoint;
      });
    },
    createSearchModel() {
      if (this.isFirstload) {
        return this.searchModel;
      } else {
        return $.extend(this.searchModel, {
          pageNo: this.searchModel.pageNo + 1
        })
      }
    },
    resolveList(data) {
      this.searchModel = $.extend(this.searchModel, {
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        count: data.count
      });

      $.each(data.data, function(i, item) {
        item.add = (item.type === 1);
      });
      this.dataList = this.dataList.concat(data.data);


      if (!data.data.length) {
        this.loaderStatus.pullupStatus = 'disabled';
      }
    }
  },
  created: function() {
    var self=this;
    //获取全局单位
    getShop().then(function(data) {
      self.shopDto = data;
    });

    this.init();
  }
}
</script>
