<template>
  <div class="exchangeRecord">
     <scroller class="data-list" v-show="dataList.length>0" lock-x scrollbar-y use-pullup :pullup-config="pullupConfig"   @on-pullup-loading="getList" v-model="loaderStatus">
      <ul class="data-list">
        <li class="clearfix pos-r" v-for="listItem in dataList" v-on:click="">
          <div class="item-hd">
            <div class="award-wrap">
              <award v-bind:value="listItem" size="little"></award>
            </div>
            <div class="prize-desc">
              <div v-if="listItem.pointRewardType == 'point_goods'">
                 <h2>{{listItem.content}}</h2>
                 <p>{{listItem.prize.description}}</p>
              </div>
              <div v-if="listItem.pointRewardType != 'point_goods'">
                <h2>{{listItem.content}}</h2>
                <p>有效期：{{new Date(listItem.prize.startTime).format("YYYY.MM.dd")}} - {{new Date(listItem.prize.endTime).format("YYYY.MM.dd")}}</p>
              </div>
            </div>
          </div>
          <div class="item-ft">
            <div class="record-time ">
              兑换时间：{{new Date(listItem.created).format("YYYY.MM.dd hh.mm.ss")}}
            </div>
            <div class="record-status">
              <span class="text">{{listItem.statusText}}</span>
              <img src="../assets/images/right.png" alt="" v-if="listItem.showNav" v-on:click="nav(listItem)"/>
            </div>
          </div>
        </li>
      </ul>
    </scroller>
    <div class="no-items text-center" v-show="dataList.length==0">
      <img class="img" src="../assets/images/icon_record.png">
      <div class="remind-text">
        您还未兑换过商品<br>赶快去尝试一下吧！
      </div>
      <button class="activity-btn btn-warning">
        <a v-bind:href="shopDto.mallUrl" class="link-a" style="color:#fff;">
          去积分商城
        </a>
      </button>
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
  getShopDto,
  getShop
} from '../scripts/global';

export default {
  name: 'shoppingMall',
  data() {
    return {
      shopDto:getShopDto(),
      dataList: [],
      isFirstload: true,
      searchModel: $.extend({}, {
        type: null,
        name: null,
        
        nick: null,
        isSend: null,
        minPoint: null,
        maxPoint: null,
        startTime: null,
        endTime: null,
      }, {
        pageSize: 10,
        pageNo: 0,
        count: 0,
        column: null,
        orderby: null
      }),
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
    award,
    Scroller
  },
  methods: {
    init() {
      var self = this;
      this.getList();
      getShop().then(function(shopDto){
        self.shopDto=shopDto;
      })
    },
    getList(searchModel) {
      var self = this;
      var searchModel = this.createSearchModel();
      this.$vux.loading.show("加载中");
      rest.post("dragon/pointRewardOrder/search", null, searchModel, function(data) {
        self.$vux.loading.hide();
        self.loaderStatus.pullupStatus = 'default';
        self.isFirstload = false; //是否第一次加载
        self.resolveList(data);
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
      $.each(this.dataList, function(i, item) {
        if (item.pointRewardType == "point_coupon") {
          item.statusText = item.status ? "已领取" : "待领取";
          item.showNav=!item.status;
        } else if (item.pointRewardType == "point_alipay_red") {
          item.statusText = item.status ? "已发放" : "未发放";
        } else if (item.pointRewardType == "point_flow") {
          item.statusText = item.status ? "已发放" : "未发放";
        } else if (item.pointRewardType == "point_goods") {
          item.statusText = item.isSend ? (item.isSend=="2"?"已发货" : "未发货"):"无需发货";
          item.showNav=item.isSend;
        }
      })

      if (!data.data.length) {
        this.loaderStatus.pullupStatus = 'disabled';
      }
    },
    nav(item) {
      if (item.pointRewardType == "point_coupon") {
        rest.get("dragon/deliveryRecord", {
          prizeRecordId: item.id
        }, function(data) {
          this.$vux.toast.show({
            text: "领取成功！",
            position: "center"
          })
        })
      }else if(item.pointRewardType == "point_goods"){
        this.$router.push({
          path: "deliveryRecord",
          query: {
            id: item.id
          }
        })
      }
    }
  },
  created: function() {
    this.init();
  }
}
</script>

