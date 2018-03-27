<template>
  <div class="view-shoping-mail">
    <div class="h-block">
      <div class="h-title text-center">
        <span class="h-text">
          {{shopDto.shop.name}}
        </span>
        <span class="h-entry">
          <a target="_blank" v-bind:href="'https://shop'+shopDto.shop.outerShopId+'.taobao.com/'">
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
            <a  href="#/myPoints" class="points-num">{{"积分"|unitFormat}}:{{buyer.validPoint|centToDollar}}</a>
          </div>
        </div>
      </div>
      <div class="h-btnGroup">
        <a v-bind:href="shopDto.integralUrl" class="link">
          <img src="../assets/images/icon_activecenter@2x.png">
          <a>赚取{{'积分'|unitFormat}}</a>
        </a>
        <a href="#/exchangeRecord" class="link">
          <img src="../assets/images/icon_shop@2x.png">
          <span>兑换记录</span>
        </a>
      </div>
    </div>
    <scroller v-show="dataList.length>0" lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" height="11.04rem"  @on-pullup-loading="getList" v-model="loaderStatus">
      <div class="data-list">
        <a v-bind:href="listItem.url" class="list-item "  v-for="listItem in dataList">
          <div class="award-wrap">
            <award :value="listItem" size="little"> </award>
          </div>
          <div class="info">
            <div class="title">{{listItem.title}}</div>
            <div class="count">{{listItem.point|centToDollar}} <span class="unit">{{'积分'|unitFormat}}</span></div>
          </div>
        </a>
      </div>
    </scroller>
    <div class="no-items text-center" v-show="dataList.length==0" v-cloak>
      <img class="img" src="../assets/images/icon_record.png">
      <div class="remind-text">
        没有找到相关商品<br>尽请期待！！！
      </div>
    </div>
  </div>
</template>
<script>
import rest from '../scripts/restClient';
import {
  Scroller
} from 'vux';
import award from '../components/award';
import {
  getShop,
  doAuthorize,
  getShopDto
} from '../scripts/global';

export default {
  name: 'shoppingMall',
  data() {
    return {
      shopDto: getShopDto(),
      buyer:{},
      dataList: [],
      isFirstload: true,
      searchModel: $.extend({}, {
        type: null,
        onShelf: 1,
        title: null
      }, {
        pageSize: 10,
        pageNo: 0,
        count: "",
        column: "",
        orderby: ""
      }),
      loaderStatus: {
        pullupStatus: ''
      },
      pullupConfig: {
        content: '上拉加载更多',
        downContent: '松开进行加载',
        upContent: '上拉加载更多',
        loadingContent: '加载中...'
      },
      query: this.$route.query,
        bgImage:{
          isShow:0,
          picUrl:'/static/images/banner-bg@2x.a9a650f.png'
        }
    }
  },
  components: {
    award,
    Scroller
  },
  methods: {
    init() {
      var self = this;
      //获取列表
      this.getList();
      //获取店铺信息
      getShop({
        module: "mall"
      }).then(function(shopDto) {
        self.shopDto = shopDto;
        self.shopDto.homeSettings.forEach(function(item) {
          if (item.type == 'backgroundImage') {
            self.bgImage = item;
          }
        });
        //授权
        var params = $.extend({}, shopDto, self.$route.query);
        self.$vux.loading.show("加载中");
        doAuthorize(params).then(function(buyer) {
          self.buyer = buyer;
          self.$vux.loading.hide();
        })
      });
    },
    getList(searchModel) {
      var self = this;
      var searchModel = this.createSearchModel();
      this.$vux.loading.show("加载中");
      rest.post("common/mall", null, searchModel, function(data) {
        self.loaderStatus.pullupStatus = 'default';
        self.isFirstload = false; //是否第一次加载
        self.resolveList(data);
        self.$vux.loading.hide();
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
      this.dataList = this.dataList.concat(data.data);
      if (!data.data.length) {

        this.loaderStatus.pullupStatus = 'disabled';
      }
    }
  },
  mounted() {
    var self = this;
    this.$nextTick(function() {
      this.init();
    });
  }
}
</script>

