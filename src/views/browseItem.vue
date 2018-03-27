<template>
  <div class="browseItem">
    <div class="cover pos-f" v-show="rulerDialogIsShow"></div>
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
    <div class="content">
      <div class="top-banner">
        <div class="top-left-btn">
          <a v-bind:href="shopInfo.integralUrl">赚取{{'积分'|unitFormat}}</a>
        </div>
        <div class="top-right-btn" v-on:click="rulerDialogIsShow = true">活动规则></div>
      </div>
      <div class="shop-info">
        <div class="shop-pic">
          <img
            src="//gw1.alicdn.com/bao/uploaded/i3/595397331/TB1sEJDXm8YBeNkSnb4XXaevFXa_!!0-item_pic.jpg_250x250.jpg">
        </div>
        <div class="shop-content">
          <div class="shop-name">{{shopInfo.shop.name}}</div>
          <div class="text-yellow">每浏览一个宝贝，既可以获得{{browseItem.unitPoint / 100 || 0}}积分！</div>
          <div class="">已浏览<span class="text-yellow">{{browseNum}}/{{itemModels.length}}</span></div>
        </div>
      </div>
      <div class="browse-item-list">
        <div class="browse-item" v-for="item in itemModels">
          <div class="inner" v-on:click="browseItemLog(item)">
            <div class="item-pic">
              <a href="javascript:void(0)">
                <img class="pic-img" v-bind:src="item.picUrl + '_250x250.jpg'">
              </a>
            </div>
            <div class="item-operation text-center">
              <button v-if="item.isAdd" class="btn disabled"><em></em>已浏览</button>
              <button v-if="!item.isAdd" class="btn"><em></em>未浏览</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-operation">
      <a v-bind:href="'https://shop' + shopInfo.shop.outerShopId+'.taobao.com'"
         class="footer-operation-item yellow">进店逛逛</a>
      <div class="footer-operation-item orange" v-on:click="awardPoint()">领取积分</div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import $jq from "../lib/jquery.min";
  import rest from '../scripts/restClient';
  import {Scroller} from 'vux';
  import {
    getShop,
    doAuthorize,
    getShopDto
  } from '../scripts/global';

  import  {AlertPlugin} from 'vux';

  Vue.use(AlertPlugin);

  export default{
    components: {},
    name: 'browseItem',
    data () {
      return {
        uuid: "", //1c445bcc47b448c2b712afa9d15ecf06
        module: "integral",
        relationType:"browse_item",
        browseItem: {},
        itemModels: [],
        browseNum: 0,
        rulerDialogIsShow: false,
        actRuler: {
          title: '活动规则',
          detail: []    //规则明细
        },
        shopInfo: {
          shop: {}
        },
        buyer: {}
      }
    },
    methods: {
      getActRule(data){    //获取活动规则
        var actRuleDetail = null,
            detailStr = data.data.browseItem.rule;
        actRuleDetail = detailStr.split(/\n/);
        this.actRuler.detail = actRuleDetail;
      },
      browseItemLog(item){
        const self = this;
        rest.post("dragon/browseItemLog", {relationUuid: self.uuid, itemId: item.id}, null, function (data) {
          item.isAdd = true;
          window.location.href = "https://item.taobao.com/item.htm?id=" + item.id;
        });
      },
      awardPoint(){
        const self = this;
        rest.post("dragon/browseItem/awardPoint", {relationUuid: self.uuid}, null, function (data) {
          if (!data.data) {
            application.dialog = {
              content: "浏览商品后才能领取积分哦~",
              show: true,
              link: "",
              btnText: "确定",
              action(event) {
                application.dialog.show = false;
              }
            }
          } else {
            application.dialog = {
              content: "你领取了" + data.data / 100 + "积分！~",
              show: true,
              link: "",
              btnText: "确定",
              action(event) {
                application.dialog.show = false;
              }
            }
          }
        });
      },
      getBrowseItem(){
        const self = this;
        rest.get("dragon/browseItem", {relationUuid: self.uuid}, function (data) {
          self.browseItem = data.data.browseItem;
          self.itemModels = data.data.itemModels;
          self.browseNum = self.getBrowseNum();
        });
      },
      getBrowseNum(){
        var num = 0;
        this.itemModels.forEach(function (item) {
          num += item.isAdd;
        });
        return num;
      },
      getShopInfo() {
        const that = this;
        getShop().then(function (data) {
          that.shopInfo = data;
        });
      },
      doAuthorize() {
        //授权
        const self = this;
        const params = $.extend({}, {
          uuid: self.uuid,
          module: self.module,
          relationType: self.relationType
        }, self.$route.query);
        doAuthorize(params).then(function (buyer) {
          self.buyer = buyer;
          self.getBrowseItem();
        })
      },
      getIntegralActivity(){
        const self = this;
        rest.get("common/integral", {relationType: self.relationType, relationUuid: self.uuid}, function (data) {
          self.browseItem = data.data.browseItem;
          self.getActRule(data);
        });
      },
      init() {
        const self = this;
        self.uuid = self.$route.query.relationUuid;
        self.getIntegralActivity();
        getShop().then(function (data) {
          self.shopInfo = data;
          //授权
          var params = $.extend({}, data, self.$route.query);
          doAuthorize(params).then(function(buyer) {
              self.buyer = buyer;
            });
        });
        this.uuid && this.getBrowseItem();
      }
    },
    mounted() {
      const that = this;
      this.$nextTick(function () {
        that.init();
      });
    }
  }
</script>
