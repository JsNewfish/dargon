<template>
	<div class="page-home">
		<div class="h-block">
			<div class="h-title text-center">
				<span class="h-text">
					{{shopDto.shop.name}}
				</span>
				<span class="h-entry">
					<a v-bind:href="'https://shop'+shopDto.shop.outerShopId+'.taobao.com/'">
						<img src="../assets/images/icon_entershop@2x.png">
						<span class="h-entry-text">进店</span>
					</a>
				</span>
			</div>
			<div class="h-banner" v-bind:style="{backgroundImage: 'url(' + bgImage.picUrl + ')'}" >
				<div class="h-userInfo">
					<div class="buyerNick">
						<span class="buyerNick-img" v-bind:style="{backgroundImage: 'url(' + buyer.picUrl + ')'}"></span>
						<span class="buyerNick-text">{{buyer.nick}}</span>
					</div>
					<div class="points" v-show="!bgImage.isShow">
						<img src="../assets/images/icon_integral@2x.png">
						<a   href="#/myPoints" class="points-num ">{{'积分'|unitFormat}}:{{buyer.validPoint|centToDollar}}</a>
					</div>
				</div>
			</div>
			<div class="h-btnGroup">
				<a v-bind:href="shopDto.interactUrl" class="link" >
					<img src="../assets/images/icon_activecenter@2x.png">
					<span>活动中心</span>
				</a>
				<a v-bind:href="shopDto.mallUrl" class="link">
					<img src="../assets/images/icon_shop@2x.png">
					<span>{{'积分'|unitFormat}}商城</span>
				</a>
			</div>
		</div>
		<div class="h-banner-custom" v-show="!topBanner.isShow" v-bind:style="{backgroundImage: 'url(' + topBanner.picUrl + ')'}" v-on:click="gotoLink(topBanner.link)">

		</div>
		<!-- 活动列表 -->
		<div class="display-box display-box-activity">
			<div class="title-bar">
				<div class="title-brand activity-brand">
					<span class="title-text">热门活动</span>
				</div>
				<a class="more" v-bind:href="shopDto.interactUrl" >更多 >></a>
			</div>
			<div style="min-height: 2rem;">
		        <ul class="activity-list" v-show="itemList.length>0">
		          <li class="activity-item" v-for="item in itemList">

		            <img v-show="item.type=='follow_shop'" class="activity-icon" src="../assets/images/gzyl@2x.png">
		            <img v-show="item.type=='draw'" class="activity-icon" src="../assets/images/cj@2x.png">
		            <img v-show="item.type=='shopping_car'" class="activity-icon" src="../assets/images/jgyl@2x.png">
		            <img v-show="item.type=='sign'" class="activity-icon" src="../assets/images/qd@2x.png">
		            <img v-show="item.type=='store_item'" class="activity-icon" src="../assets/images/scyl@2x.png">
		            <img v-show="item.type=='force_follow'" class="activity-icon" src="../assets/images/qzgz.png">
		            <div class="activity-detail">
		                <div class="activity-title">{{item.title}}</div>
		                <span class="activity-time">活动时间：{{item.startTime.split(" ")[0]}}-{{item.endTime.split(" ")[0]}}</span>
		            </div>

		            <button class="activity-btn btn-base">
		              <a v-bind:href="item.url">  参加活动</a>
		            </button>
		          </li>
		        </ul>
				<div class="no-items text-center" v-show="itemList.length==0">
		            <div class="remind-text">
		              未找到相关活动，<br>赶快去创建一下吧！
		            </div>
		        </div>
		    </div>
		</div>
		<!-- 商品列表 -->
		<div class="display-box display-box-goods">
			<div class="title-bar">
				<div class="title-brand">
					<span class="title-text">热门商品</span>
				</div>
				<a class="more" v-bind:href="shopDto.mallUrl">更多 >></a>
			</div>
			<div class="data-list"  v-show="goodsList.length>0">
				<a v-bind:href="listItem.url" class="list-item "  v-for="listItem in goodsList">
					<div class="award-wrap">
					<award :value="listItem" size="little"> </award>
					</div>
					<div class="info">
						<div class="title">{{listItem.title}}</div>
						<div class="count">{{listItem.point|centToDollar}} <span class="unit">{{'积分'|unitFormat}}</span></div>
					</div>
				</a>
			</div>
			<div class="no-items text-center" v-show="goodsList.length==0" style="min-height: 3rem;">
	            <div class="remind-text">
	              没有找到相关商品<br>尽请期待！！！
	            </div>
		    </div>
		</div>
		<div class="h-banner-custom" v-show="!bottomBanner.isShow" v-bind:style="{backgroundImage: 'url(' + bottomBanner.picUrl + ')'}" v-on:click="gotoLink(bottomBanner.link)">

		</div>

	</div>
</template>
<script >
	import rest from '../scripts/restClient';
	import award from '../components/award';
	import {
		getShop,
		doAuthorize,
		getShopDto
	} from '../scripts/global';
	export default {
		name: 'home',
		data() {
			return {
				shopDto: getShopDto(),
				buyer: {},
				goodsList: [],
				itemList: [],
				topBanner: {
					isShow: 1,
					picUrl: ''
				},
				bottomBanner: {
					isShow: 1,
					picUrl: ''
				},
				bgImage: {

					isShow: 0,
					picUrl: ''
				}
			}
		},
		methods: {
			init() {
				var self = this;
				this.getHome();
				this.getGooodsList();
				this.getActivityList();
				
				//获取店铺信息
				getShop().then(function(shopDto) {
					self.shopDto = shopDto;
					
					//遍历背景图片
					self.shopDto.homeSettings.forEach(function(item) {
						if (item.type == 'topBanner') {
							self.topBanner = item;
						}
						if (item.type == 'backgroundImage') {
							self.bgImage = item;
						}
						if (item.type == 'bottomBanner') {
							self.bottomBanner = item;
						}
					})
					//授权
					var params = $.extend({}, shopDto, self.$route.query);
					doAuthorize(params).then(function(buyer) {
						
						self.buyer = buyer;
					})
				});
			},
			getGooodsList() {
				var self = this;
				this.$vux.loading.show("加载中");
				rest.post("common/mall", null, {
					pageSize: 4,
					onShelf: 1,
					pageNo: 0
				}, function(data) {
					self.goodsList = data.data;
					self.$vux.loading.hide();
				});
			},
			getHome(){
			  rest.get("common/home", null, function(data) {

			  });
			},
			getActivityList() {
				var that = this;
				rest.post("common/interact", null, {
					pageSize: 2,
					status: 5,
					pageNo: 0
				}, function(data) {
					that.itemList = data.data;
				});
			},
			gotoLink(link){				
				if(link){
					event.stopPropagation();
					window.location.href = link;					
				}	
			}
		},
		mounted() {
			this.init();
		},
		components: {
			award
		}
	}
</script>
