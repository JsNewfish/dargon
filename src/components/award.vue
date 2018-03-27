<template>
  <div class="award-elem-warp">
    <div class="prize-img  prize-coupon" v-bind:class="'prize-img-'+size" v-if="value.type=='point_coupon'">
      <span class="prize-detail-top">
        <i>￥</i>
        {{value.prize.denomination|centToDollar}}
      </span>
      <span class="prize-detail-bottom">
        满{{value.prize.useCondition|centToDollar}}元使用
      </span>
      <span class="prize-detail-right" >
        店铺优惠券
      </span>
    </div>
    <div class="prize-img  prize-red-packet " v-bind:class="'prize-img-'+size" v-if="value.type=='point_alipay_red'">
      <span class="prize-detail-top">
        <i>
        ￥
        </i>
        {{value.prize.denomination|centToDollar}}
      </span>
      <span class="prize-detail-right">
        支付宝红包
      </span>
    </div>
    <div class="prize-img  prize-flow" v-bind:class="'prize-img-'+size" v-if="value.type=='point_flow'">
      <span class="prize-detail-top">
        {{value.prize.denomination|centToDollar}}
        <em>
        M
        </em>
      </span>
      <span class="prize-detail-right">
        手机流量包
      </span>
    </div>
    <div class="prize-goods" v-if="value.type=='point_goods'||value.type=='point_money'" >
      <img v-bind:src="value.prize.url" alt="" >
    </div>
  </div>
</template>
<script >
	export default{
		name:'award',
    props:{
      value:Object,
      size:""
    },
		data(){
			return {

			}
		},
		method:function(){

		}
	}
</script>
