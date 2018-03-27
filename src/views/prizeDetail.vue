<template>
  <div class="prizeDetail">
    <main>
      <!-- 优惠券 -->
      <div v-show='itemData.type=="coupon"'>
        <div class="wrap">    
          <div class="prize-img prize-img-big" v-bind:class="{'prize-lose': itemData.losePrize,'prize-coupon':itemData.subType=='coupon_shop','prize-coupon2':itemData.subType=='coupon_goods',}" >
            <span class="prize-detail-top">
              <i>
                ￥
              </i>
              {{itemData.denomination|centToDollar}}
            </span>
            <span class="prize-detail-bottom">
              有效期：{{itemData.startTime&&itemData.startTime.split(" ")[0]}}-{{itemData.endTime&&itemData.endTime.split(" ")[0]}}
            </span>
            <span class="prize-detail-middle">
              <span v-show="itemData.useCondition">满{{itemData.useCondition|centToDollar}}元使用</span>
              <span v-show="!itemData.useCondition">无门槛使用</span>
            </span>
            <span class="prize-detail-right">
              <span v-show="itemData.subType=='coupon_goods'">
                商品优惠券
              </span>
              <span v-show="itemData.subType=='coupon_shop'">
                店铺优惠券
              </span>
            </span>
          </div>
        </div>
        
        <div class="prize-detail">
          <h3 class="title">
            {{itemData.name}}
          </h3>
          <p>
            面额：{{itemData.denomination|centToDollar}}元
          </p>
          <p>
            类型：
            <span v-show="itemData.subType=='coupon_goods'">
              商品优惠券
            </span>
            <span v-show="itemData.subType=='coupon_shop'">
              店铺优惠券
            </span>
          </p>
          <p>
            使用条件：
            <span v-show="itemData.useCondition">订单满{{itemData.useCondition|centToDollar}}元使用</span>
            <span v-show="!itemData.useCondition">无门槛使用</span>
          </p>
          <p>
            有效期：{{itemData.startTime&&itemData.startTime.split(" ")[0]}}-{{itemData.endTime&&itemData.endTime.split(" ")[0]}}
          </p>
          <p>
            奖品来源：{{query.relationType|relationType}}
          </p>
        </div>
        <div class="prize-detail prize-title-bar">
          <h3 class="title">
            使用说明：
          </h3>
        </div>
          <hr />
        <div class="prize-detail">
          <p>
            1.仅限于优惠券所在店铺购物，在设置的有效期内，订单金额（不包括邮费）满足时才能使用；
          </p>
          <p>
            2.一笔订单只限于使用一张优惠券，不可拆分，超过有效期即作废。如果买家产生多笔订单，且均符合使用要求时，则可以分别使用；
          </p>
          <h3 class="title">
            优惠券叠加规则：
          </h3>
          <p>
            1.优惠券可以同店铺宝（原满就送，满件优惠），单品宝（原限时打折），搭配宝（原搭配套餐），会员卡，淘金币抵扣叠加使用，除淘金币抵扣外，其他先计算以上优惠（如先计算店铺宝），再计算优惠券。
          </p>
          <p>
            2.优惠券和店铺红包不可同时使用。
          </p>
        </div>
      </div>
      <!-- 彩票 -->
      <div v-show='itemData.type=="ticket"'>
          <div class="wrap">
            <div class="prize-img prize-lottery prize-img-big" v-bind:class="{'prize-lose': itemData.losePrize}">
              <span class="prize-detail-top">
                {{itemData.denomination|centToDollar}}
                <em>
                  注
                </em>
              </span>
              <span class="prize-detail-bottom">
                每周二、四、日晚上21:30开奖
              </span>
              <span class="prize-detail-right">
                双色球
              </span>
            </div>
          </div>

          <div class="prize-detail">
            <h3 class="title">
              {{itemData.name}}
            </h3>
            <p>
              大小：{{itemData.denomination|centToDollar}}注
            </p>
            <p>
              每周二、四、日晚上21:30开奖
            </p>
            <p>
              奖品来源：{{query.relationType|relationType}}
            </p>
          </div>
          <div class="prize-detail prize-title-bar">
            <h3 class="title">
              使用说明：
            </h3>
          </div>
          <hr />
          <div class="prize-detail">
            <p>
              1.双色球彩票每周二，周四，周日 晚上21:30开奖；
            </p>
            <p>
              2.彩票开奖日开奖后消费者将收到手机淘宝客户端消息提醒；
            </p>
            <p>
              3.彩票一旦赠送成功后，不会退回
            </p>
            <p>
              4.可在“我的淘宝-卡包券-彩票”中查看。
            </p>
          </div>
      </div>
      <!-- 积分 -->
      <div v-show="itemData.type=='point'">
          <div class="wrap">
            <div class="prize-img prize-integral prize-img-big" v-bind:class="{'prize-lose': itemData.losePrize}">
              <span class="prize-detail-top">
                {{itemData.denomination|centToDollar}}
                <span class="prize-detail-right">
                  {{'积分'|unitFormat}}
                </span>
              </span>
              <span class="prize-detail-bottom">
                有效期：{{itemData.startTime&&itemData.startTime.split(" ")[0]}}-{{itemData.endTime&&itemData.endTime.split(" ")[0]}}
              </span>
              <span class="prize-detail-middle">

              </span>
              
            </div>
          </div>

          <div class="prize-detail">
            <h3 class="title">
              {{itemData.name|unitFormat}}
            </h3>
            <p>
              有效期：{{itemData.startTime&&itemData.startTime.split(" ")[0]}}-{{itemData.endTime&&itemData.endTime.split(" ")[0]}}
            </p>
            <p>
              奖品来源：{{query.relationType|relationType}}
            </p>
          </div>
          <div class="prize-detail">
            <h3 class="title">
              使用说明：
            </h3>
          </div>
          <hr />
          <div class="prize-detail">
            <p>
              1.{{'积分'|unitFormat}}可用于兑换积分商城中的礼品；
            </p>
            <p>
              2.从本店获得的{{'积分'|unitFormat}}仅可在本店使用；
            </p>
            <p>
              3.{{'积分'|unitFormat}}有使用期限，请在到期前使用，过期失效；
            </p>
            <p>
              4.实际可兑换商品，会根据店铺运营情况调整。
            </p>
          </div>  
      </div>
      <!-- 流量 -->
      <div v-show="itemData.type=='flow'">
          <div class="wrap">
            <div class="prize-img prize-flow prize-img-big" v-bind:class="{'prize-lose': itemData.losePrize}">
              <span class="prize-detail-top">
                {{itemData.denomination|centToDollar}}
                <em>
                  M
                </em>
              </span>
              <span class="prize-detail-bottom">
                有效期：{{itemData.startTime&&itemData.startTime.split(" ")[0]}}-{{itemData.endTime&&itemData.endTime.split(" ")[0]}}
              </span>
              <span class="prize-detail-right">
                手机流量包
              </span>
            </div>
          </div>

          <div class="prize-detail">
            <h3 class="title">
              {{itemData.name}}
            </h3>
            <p>
              大小：{{itemData.denomination|centToDollar}}M
            </p>
            <p>
              有效期：{{itemData.startTime&&itemData.startTime.split(" ")[0]}}-{{itemData.endTime&&itemData.endTime.split(" ")[0]}}
            </p>
            <p>
            奖品来源：{{query.relationType|relationType}}
          </p>
          </div>
          <div class="prize-detail">
            <h3 class="title">
              使用说明：
            </h3>
          </div>
          <hr />
          <div class="prize-detail">
            <p>
              1.仅限在淘宝、天猫、支付宝APP充值中心充流量使用；
            </p>
            <p>
              2.流量券可在“我的淘宝-卡包券”中查看；
            </p>
            <p>
              3.单笔订单仅限使用1张，仅限在有效期内使用，过期失效；
            </p>
            <p>
              4.仅支持普通流量包使用，不支持定向流量、限时流量；
            </p>
            <p>
              5.无法转赠他人，仅限本账户使用。
            </p>
          </div>
      </div>
      <!-- 红包 -->
      <div v-show="itemData.type=='alipay_red'">
          <div class="wrap">
            <div class="prize-img prize-red-packet prize-img-big" v-bind:class="{'prize-lose': itemData.losePrize}">
              <span class="prize-detail-top">
                <i>
                ￥
              </i>
                {{itemData.denomination|centToDollar}}
              </span>
              <span class="prize-detail-bottom">
                有效期：{{itemData.startTime&&itemData.startTime.split(" ")[0]}}-{{itemData.endTime&&itemData.endTime.split(" ")[0]}}
              </span>
              <span class="prize-detail-right">
                支付宝红包
              </span>
            </div>
          </div>

          <div class="prize-detail">
            <h3 class="title">
              {{itemData.name}}
            </h3>
            <p>
              面额：{{itemData.denomination|centToDollar}}元
            </p>
            <p>
              有效期：{{itemData.startTime&&itemData.startTime.split(" ")[0]}}-{{itemData.endTime&&itemData.endTime.split(" ")[0]}}
            </p>
            <p>
            奖品来源：{{query.relationType|relationType}}
          </p>
          </div>
          <div class="prize-detail">
            <h3 class="title">
              使用说明：
            </h3>
          </div>
          <hr />
          <div class="prize-detail">
            <p>
              1.红包仅允许在淘宝、天猫、聚划算等平台使用，不允许购买虚拟商品；
            </p>
            <p>
              2.一个红包可以拆分多次使用；
            </p>
            <p>
              3.红包不得提现（包括支付宝余额和余额宝），不得转赠他人，不得为他人代付；
            </p>
            <p>
              4.如果有多个红包，可以叠加使用，叠加上限以支付宝为准；
            </p>
            <p>
              5.使用本次活动发放的红包购物，使用红包的订单（包括运费险）发生退款时，在有效期内红包可以退还；
            </p>
            <p>
              6.红包展期为30天。
            </p>
          </div>
      </div>

      <div class="prize-detail store clearfix pos-r" >
        <a target="_blank" v-bind:href="'https://shop'+shopBuyerDto.shop.outerShopId+'.taobao.com/'" class="link-a" style="display: block;overflow: hidden;">
          <img v-show="shopBuyerDto.shop.picPath" class="pull-left store-logo" v-bind:src="shopBuyerDto.shop.picPath">
          <img v-show="!shopBuyerDto.shop.picPath" class="pull-left store-logo" src="../assets/images/gzyl@2x.png">
          <p class="pull-left">
            {{shopBuyerDto.shop.name}}
          </p>
          <img class="pos-a img-right" src="../assets/images/next.png">
        </a>
      </div>
    </main>
    <footer v-bind:class="{losePrize:itemData.losePrize}">
      <p class="text-center">
        <a v-show="!itemData.losePrize&&itemData.type!='point'" href="https://h5.m.taobao.com/app/cpkg/portal.html" target="_blank" class="link-a">
        立即使用
        </a>
        <a v-show="!itemData.losePrize&&itemData.type=='point'" v-bind:href="shopBuyerDto.mallUrl" target="_blank" class="link-a">
        立即使用
        </a>
        <span v-show="itemData.losePrize">立即使用</span>
      </p>
    </footer>
  </div>
</template>
<script >
  import $jq from "../lib/jquery.min";
  import rest from '../scripts/restClient';
  import {getShop,
    doAuthorize,
    getShopDto} from '../scripts/global';
  export default{
    name:'prizeDetail',
    data(){
      return {
        shopBuyerDto:getShopDto(),
        losePrize: false,
        itemData:{},
        query:this.$route.query
      }
    },
    methods:{
      getPrize:function(){
        var that =this;
        var param = {
          prizeUuid:that.query.id    
        };
        that.$vux.loading.show("加载中");
        rest.get('dragon/prize',param,function(data){
           //console.log(data);
           that.itemData = data.data.prize; 
           that.$vux.loading.hide();
           //判断奖品是否过期
          $.each(data.data.prize,function(index,item){
            item.endTime&&(item.losePrize = (new Date()> new Date(Date.parse(item.endTime))));
          });
        });
      }
    },
    mounted:function(){
      var that = this;
      this.$nextTick(function(){
        that.getPrize();
        getShop().then(function(data){
          that.shopBuyerDto = data;  
                    
        });
      })
    }
  }
</script>
