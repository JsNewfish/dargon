<template>
	<div class="activeModal">
		<div class="cover pos-f">
			<div class="dialog failed pos-f text-center" v-show="!modalParams.modalStatus">
	      		<div class="btn-cancel pos-a" v-on:click="modalParams.modalShow = false">
	        		<img src="../assets/images/activity/btn_cancel.png" alt=""/>
	      		</div>
	      		<h2>
	        		{{modalParams.failContent}}
	      		</h2>
	      		<a class="go-shop" v-bind:href="'https://shop'+modalParams.shopId+'.m.taobao.com/'">
	            	进店逛逛
	          	</a>
	    	</div>
			<div class="dialog prize-active pos-r text-center" v-show="modalParams.modalStatus">
			    <div class="btn-cancel pos-a" v-on:click="cancel">
			        <img src="../assets/images/activity/btn_cancel.png" alt=""/>
			    </div>
			    <header class="pos-a">
			        <h2>
			          {{modalParams.modalTitle}}
			        </h2>
			    </header>
			    <main class="">
			      	<!-- 优惠券 -->
			      	<div v-show="couponShow">
			      		<div class="prize-img prize-coupon prize-img-less2" style="margin: 0 auto;">
			              	<span class="prize-detail-top">
			                	<i>
			                  		￥
			                	</i>
			                	{{modalParams.denomination}}
			              	</span>
			              	<span class="prize-detail-bottom">
			                	满{{modalParams.useCondition}}元使用
			              	</span>
			              	<span class="prize-detail-right">
			                	{{modalParams.subType}}
			              	</span>
			            </div>
			            <div class="prize-noticeone">
				          	恭喜您获得{{content}}
				        </div>
				        <div class="prize-subnotice">
				          	请点击‘马上领取’在领取页面上领取优惠券
				        </div>
				        <div class="btn clearfix">
				          	<a class="pull-left go-shop" v-bind:href="'https://shop'+modalParams.shopId+'.m.taobao.com/'">
				            	进店逛逛
				          	</a>
				          	<button class="pull-left use-method go-use" v-on:click.prevent="getCoupon">
				            	马上领取
				          	</button>
				        </div>
			      	</div>

		            <!-- 流量包 -->
		            <div v-show="flowShow">
		            	<div class="prize-img prize-flow prize-img-less2" style="margin: 0 auto;">
			              	<span class="prize-detail-top">
			                	{{modalParams.denomination}}
			                	<em>
			                  		M
			                	</em>
			              	</span>
			              	<span class="prize-detail-bottom">
			              	</span>
			              	<span class="prize-detail-right">
			                	流量券
			              	</span>
			            </div>
			            <div class="prize-notice">
				          	恭喜您获得{{content}}
				        </div>
				        <div class="btn clearfix">
				          	<a class="pull-left go-shop" v-bind:href="'https://shop'+modalParams.shopId+'.m.taobao.com/'">
				            	进店逛逛
				          	</a>
				          	<a class="pull-left use-method go-use" href="https://h5.m.taobao.com/app/cpkg/portal.html">
				            	立即使用
				          	</a>
				        </div>
		            </div>

		            <!-- 彩票 -->
		            <div v-show="ticketShow">
		            	<div class="prize-img prize-lottery prize-img-less2" style="margin: 0 auto;">

			            </div>
			            <div class="prize-notice">
				          	恭喜您获得1注彩票
				        </div>
				        <div class="btn clearfix">
				          	<a class="pull-left go-shop" v-bind:href="'https://shop'+modalParams.shopId+'.m.taobao.com/'">
				            	进店逛逛
				          	</a>
				          	<a class="pull-left use-method go-use" href="https://h5.m.taobao.com/app/cpkg/portal.html">
				            	立即使用
				          	</a>
				        </div>
		            </div>


		            <!-- 支付宝红包 -->
		            <div v-show="alipayShow">
		            	<div class="prize-img prize-img-less2 prize-red-packet pos-r" style="margin: 0 auto;">
				          	<span class="prize-detail-top pos-a">
				            	{{modalParams.denomination}}
				            	<em>
				              		元
				            	</em>
				          	</span>
				          	<span class="prize-detail-right pos-a">
				            	支付宝红包
				          	</span>
				          	<span class="prize-detail-bottom pos-a">
				          	</span>
				        </div>
				        <div class="prize-notice">
				          	恭喜您获得{{content}}
				        </div>
				        <div class="btn clearfix">
				          	<a class="pull-left go-shop" v-bind:href="'https://shop'+modalParams.shopId+'.m.taobao.com/'">
				            	进店逛逛
				          	</a>
				          	<a class="pull-left use-method go-use" href="https://h5.m.taobao.com/app/cpkg/portal.html">
				            	立即使用
				          	</a>
				        </div>
		            </div>

			        <!-- 积分 -->
			        <div v-show="pointShow">
			        	<div class="prize-img prize-integral prize-img-less2" style="margin: 0 auto;">
				            <span class="prize-detail-top">
				                {{modalParams.denomination}}
				                <em>
				                  {{'积分'|unitFormat}}
				                </em>
				            </span>
				            <span class="prize-detail-bottom">
				            </span>
				            <span class="prize-detail-right">
				            </span>
				        </div>
				        <div class="prize-notice">
				          	恭喜您获得{{content}}{{'积分'|unitFormat}}
				        </div>
				        <div class="btn clearfix">
				          	<a class="pull-left go-shop" v-bind:href="'https://shop'+modalParams.shopId+'.m.taobao.com/'">
				            	进店逛逛
				          	</a>
				          	<!-- <button class="pull-left use-method" v-on:click="goMain">
				            	去兑换商品
				          	</button> -->
				          	<a class="pull-left use-method  go-use" v-bind:href="modalParams.url">
				            	去兑换商品
				          	</a>
				        </div>
			        </div>

			    </main>
		    </div>
		</div>

	</div>
</template>
<script>
  import rest from '../scripts/restClient';
	export default{
		name:'activeModal',
		props: [
            'modalParams'
        ],
		data(){
			return {
				couponShow:true,
				flowShow:false,
				alipayShow:false,
				pointShow:false,
				ticketShow:false,
				content:''
			}
		},
		mounted: function(){

		},
		methods:{
			//初始化
		    init(){
		    	this.setModalStatus()	
		    },
		    //领取优惠券
		    getCoupon(){
		        var self=this;
		        rest.get("dragon/prizeRecord",{prizeRecordId:this.modalParams.prizeRecordId},function(data){
              window.location.href= data.data;
              self.$vux.toast.show({
		            	text: "操作成功，请在跳出的新页面最下方点击领取优惠券",
		            	position: "center"
		          	})
		        })
		    },

			cancel: function() {
				this.modalParams.modalShow = false;
		        this.$emit('message', this.modalParams.modalShow);
	      	},
	      	//弹出框状态改变
	      	setModalStatus:function() {
	      		switch(this.modalParams.type){
					case "coupon":
						this.couponShow = true;
						this.flowShow = false;
						this.alipayShow = false;
						this.pointShow = false;
						this.ticketShow = false;
						if (this.modalParams.subType == 'coupon_shop') {
							this.modalParams.subType = '店铺优惠券';
							this.content = this.modalParams.denomination+'元店铺优惠券';
						} else {
							this.modalParams.subType = '商品优惠券';
							this.content = this.modalParams.denomination+'元商品优惠券';
						}
						break;
					case "flow":
						this.content = this.modalParams.denomination+'M流量券';
						this.flowShow = true;
						this.couponShow = false;
						this.alipayShow = false;
						this.pointShow = false;
						this.ticketShow = false;
						break;
					case "alipay_red":
						this.content = this.modalParams.denomination+'元支付宝红包';
						this.alipayShow = true;
						this.flowShow = false;
						this.couponShow = false;
						this.pointShow = false;
						this.ticketShow = false;
						break;
					case "point":
						this.content = this.modalParams.denomination;
						this.pointShow = true;
						this.flowShow = false;
						this.alipayShow = false;
						this.couponShow = false;
						this.ticketShow = false;
						break;
					case "ticket":
						this.pointShow = false;
						this.flowShow = false;
						this.alipayShow = false;
						this.couponShow = false;
						this.ticketShow = true;
						break;
				}
	      	}
		},
		watch:{
			'modalParams.type': 'setModalStatus',
			'modalParams.subType': 'setModalStatus',
			'modalParams.denomination': 'setModalStatus',
			'modalParams.useCondition': 'setModalStatus'
		},
		mounted:function(){
	      	this.init();
	    }
	}
</script>
<style>

</style>
