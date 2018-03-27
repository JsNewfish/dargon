<template>
	<div class="page-personal-info">
		<div class="info-bar">
			<div class="info-img">
				<img src="../assets/images/buyerInfo.png" alt="">
			</div>
			<div class="info-text">
				<div class="pull-left activity"><a v-bind:href="shopDto.integralUrl">赚取{{'积分'|unitFormat}}</a></div>
				<div class="pull-right rule" v-on:click="showRule()"><a href="#">活动规则></a></div>
			</div>
		</div>
		<div class="info-container">
			<form class="form-container">
				<div class="form-group" v-if="hasActive.name == 'name'">
					<!-- <x-input title="姓名" placeholder="你的名字" v-model="info.name"></x-input> -->

					<label class="control-label">姓名</label>
					<div class="controls">
						<input class="text-inp" type="text" required placeholder="" v-model="info.name">
					</div>
				</div>
				<div class="form-group" v-if="hasActive.sex">
					<group>
						<popup-radio title="性别" :options="sex" v-model="info.sex"></popup-radio>
					</group>
				</div>
				<div class="form-group" v-if="hasActive.birthday">
						<div class="data-time">
							<datetime
								v-model="info.birthday"
								:title="'生日'" format="YYYY/MM/DD">
							</datetime>
						</div>
				</div>
				<div class="form-group" v-if="hasActive.qq">
					<label class="control-label">QQ</label>
					<div class="controls">
						<input class="text-inp" type="text" required placeholder="你的QQ号" v-model="info.QQ">
					</div>
				</div>
				<div class="form-group" v-if="hasActive.weChat">
					<label class="control-label">微信</label>
					<div class="controls">
						<input class="text-inp" type="text" required placeholder="你的微信号" v-model="info.micro">
					</div>
				</div>
				<div class="form-group" v-if="hasActive.mobile">
					<label class="control-label">手机号</label>
					<div class="controls">
						<input class="text-inp" type="text" required placeholder="你的手机号" v-model="info.phone">
					</div>
				</div>
				<div class="form-group" v-if="hasActive.email">
					<label class="control-label">邮箱</label>
					<div class="controls">
						<input class="text-inp" type="text" required placeholder="你的邮箱" v-model="info.email">
					</div>
				</div>
				<!-- <div class="form-group">
					<label class="control-label">地址</label>
					<div class="controls">
						<input class="text-inp" type="text" required placeholder="" v-model="info.address">
					</div>
				</div> -->
				<div class="form-group" v-if="hasActive.childName">
					<label class="control-label">宝贝姓名</label>
					<div class="controls">
						<input class="text-inp" type="text" required placeholder="" v-model="info.babyName">
					</div>
				</div>
				<div class="form-group" v-if="hasActive.childSex">
					<group>
						<popup-radio title="宝贝性别" :options="sex" v-model="info.babySex"></popup-radio>
					</group>
				</div>
				<div class="form-group" v-if="hasActive.childBirthDay">
					<div class="data-time">
							<datetime
								v-model="info.babyBirthday"
								:title="'宝贝生日'" format="YYYY/MM/DD">
							</datetime>
						</div>
				</div>
			</form>
			<div class="info-btn">
				<div class="error" v-if="isShowError">{{errorText}}</div>
				<button class="btn-save" v-on:click="save()">提&nbsp;交</button>
			</div>
		</div>
		<div class="popup-window" v-show="isShow">
			<div class="dialog act-ruler pos-f text-center"
				v-show="ruleIsShow"
				>
				<div class="btn-cancel pos-a" v-on:click="ruleIsShow = false,isShow=false;">
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
			<!-- 提交完成 -->
			<div class="pop-success" v-show="successIsShow">
				<div class="close-btn" v-on:click="close('success')">
					<img src="../assets/images/pop-rule-close.png" alt="">
				</div>
				<div class="container">
					<div class="title">提交成功</div>
					<div class="body">
						<div class="body-img"><div class="img">{{point}}<span>积分</span></div></div>
						<div class="body-text">恭喜您获得{{point}}积分!</div>
					</div>
					<div class="footer clearfix">
						<div class="foot-btn foot-btn-1"><a v-bind:href="'https://shop' + this.shopDto.shop.outerShopId + '.taobao.com/'">进店逛逛</a></div>
						<div class="foot-btn foot-btn-2"><a v-bind:href="shopDto.mallUrl">去兑换商品</a></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<i18n>

</i18n>
<script>
	import Vue from 'vue'
	import $jq from "../lib/jquery.min";
	import restClient from '../scripts/restClient';
	import {
		Group,
		PopupRadio,
		XInput,
		Datetime
	} from 'vux';
	import {
		getShopDto,
		getShop,
		doAuthorize
	} from '../scripts/global';
	export default {
		name: 'perfectPersonalInfo',
		data() {
			return {
				actRuler: { //活动规则
					title: '活动规则',
					detail: []
				},
				info: {
					name: '',
					sex: '',
					birthday: this.setToday(),
					QQ: '',
					micro: '',
					phone: '',
					email: '',
					address: '',
					childName: '',
					childName: '',
					childBirthDay: this.setToday()

				},
				sex: ['男', '女'],
				rule: null,
				isShowError: false,
				errorText: '',
				data: {},
				url: null,
				activeData: '',
				nowDate: '',
				relationType: '',
				relationUuid: '',
				point: 1,
				shopId: '',
				hasActive: {
					name: false,
					sex: false,
					birthday: false,
					qq: false,
					weChat: false,
					mobile: false,
					email: false,
					address: false,
					childName: false,
					childSex: false,
					childBirthDay: false
				},
				isShow: false,
				successIsShow: false,
				ruleIsShow: false,
				query: this.$route.query,
				shopDto: getShopDto()
			}
		},
		methods: {
			// 获取参数
			getUrlParam(name) {
				var param=this.$route.query[name];
				return param&&unescape(param);
			},
			//弹出规则
			showRule: function() {
				this.isShow = true;
				this.ruleIsShow = true;
			},
			// 关闭错误提示
			closeError: function() {
				setTimeout(function() {
					this.isShowError = false;
				}.bind(this), 2000);
			},
			// 关闭按钮
			close: function(type) {
				if (type == 'success') {
					this.successIsShow = false;
					this.isShow = false;
				} else if (type == 'rule') {
					this.ruleIsShow = false;
					this.isShow = false;
				}
			},
			save: function() {
				var data = {};
				if (!this.info.name && this.hasActive.name) {

					this.$vux.toast.text('请输入您的姓名')	
					return;
				} else if (this.hasActive.name && this.info.name) {
					data.name = this.info.name;
				}

				if (!this.info.sex && this.hasActive.sex) {

					this.$vux.toast.text('请输入您的性别')

					return;
				} else if (this.hasActive.sex && this.info.sex) {
					this.info.sex == '男' ? data.sex = 'male' : data.sex = 'female';
				}

				if (!this.info.birthday && this.hasActive.birthday) {

					this.$vux.toast.text('请输入您的生日')

					return;
				} else if (this.hasActive.birthday && this.info.birthday) {
					data.birthday = this.info.birthday + " 00:00:00"; //moment($scope.modifyList.startTime)._d
				}

				if (!this.info.QQ && this.hasActive.qq) {

					
					this.$vux.toast.text('请输入您的QQ号')	
					return;
				} else if (this.hasActive.qq && this.info.QQ) {
					data.qq = this.info.QQ;
				}

				if (!this.info.micro && this.hasActive.weChat) {

					this.$vux.toast.text('请输入您的微信号')		
					return;
				} else if (this.hasActive.weChat && this.info.micro) {
					data.weChat = this.info.micro;
				}

				if (!this.info.phone && this.hasActive.mobile) {

					this.$vux.toast.text('请输入您的手机号')		


					return;
				} else if (this.hasActive.mobile && this.info.phone) {
					data.mobile = this.info.phone;
				}

				if (!this.info.email && this.hasActive.email) {

					this.$vux.toast.text('请输入您的邮箱')
					

					return;
				} else if (this.hasActive.email && this.info.email) {
					data.email = this.info.email;
				}

				if (!this.info.babyName && this.hasActive.childName) {

					this.$vux.toast.text('请输入宝贝姓名')
					return;
				} else if (this.hasActive.childName && this.info.babyName) {
					data.childName = this.info.babyName;
				}

				if (!this.info.babySex && this.hasActive.childSex) {

					this.$vux.toast.text('请输入宝贝性别')
					return;
				} else if (this.hasActive.childSex && this.info.babySex) {
					this.info.babySex == '男' ? data.childSex = 'male' : data.childSex = 'female';
				}

				if (!this.info.babyBirthday && this.hasActive.childBirthDay) {

					this.$vux.toast.text('请输入宝贝生日')
					return;
				} else if (this.hasActive.childBirthDay && this.info.babyBirthday) {
					data.childBirthDay = this.info.babyBirthday + " 00:00:00";
				}
				data.uuid = this.data.uuid;
				data.nick = this.data.nick;
				data.mixNick = this.data.mixNick;
				data.grade = this.data.grade;
				data.gradeRefreshTime = this.data.gradeRefreshTime;
				data.version = this.data.version;
				var params = data;
				var action = {
					successCallback: function(data) {
						this.isShow = true;
						this.successIsShow = true;
					}.bind(this),
					failCallback: function(data) {
						var self = this;

						this.$vux.toast.text(data.resultMessage)	
					}.bind(this)
				};
				restClient.post("dragon/collectionBuyerInfo/doTakeAward", {
					relationUuid: this.relationUuid
				}, params, action);

			},
			setToday: function() {
				var now = new Date();
				var cmonth = now.getMonth() + 1;
				var day = now.getDate();
				if (cmonth < 10) cmonth = '0' + cmonth;
				if (day < 10) day = '0' + day;
				return now.getFullYear() + '-' + cmonth + '-' + day;

			},
			//再次获取活动信息
			getActiveInfo: function() {
				var params = {
					relationUuid: this.relationUuid
				};
				var self = this;
				var action = {
					successCallback: function(data) {

					}.bind(this),
					failCallback: function(data) {
						alert(data.resultMessage);
					}
				};
				restClient.get("dragon/collectionBuyerInfo/check", params, action);
			}

		},
		mounted: function() {
			var self = this;
			// 获取活动信息
			this.getActiveDate = function() {
				var params = {
					// 参数是url里面带的
					relationType: this.relationType,
					relationUuid: this.relationUuid
				};
				var action = {
					successCallback: function(data) {
						this.activeData = data.data;
						this.point = this.activeData.collectionBuyerInfo.point / 100;
						this.shopId = this.activeData.collectionBuyerInfo.shopId;
						var self = this;
						var arr = this.activeData.collectionBuyerInfo.collectionInfo + "," + this.activeData.collectionBuyerInfo.extensionInfo;
						arr = arr.split(",");
						arr.forEach(function(value, index, arr) {
							self.hasActive[value] = value;
						});
						/*this.rule = this.activeData.collectionBuyerInfo.rule.replace(/\n/g, "<br>");*/
						self.actRuler.detail = this.activeData.collectionBuyerInfo.rule.split(/\n/);
					}.bind(this),
					failCallback: function(data) {
						this.$router.push('/activityMiss');
					}.bind(this)
				};
				var promise = restClient.get("common/activity", params, action);
				return promise;
			};
			// 初始获取数据
			this.getData = function() {
				restClient.get('dragon/buyer', null, function(data) {
					this.data = data.data;
					if (!this.data) return;
					this.info.name = this.data.name || '';
					this.info.sex = this.data.sex == 'male' ? '男' : '女';
					this.info.birthday = this.data.birthday ? this.data.birthday.split(' ')[0] : '';
					this.info.QQ = this.data.qq || '';
					this.info.micro = this.data.weChat || '';
					this.info.phone = this.data.mobile;
					this.info.email = this.data.email;
					this.info.name = this.data.name;
					this.info.babyName = this.data.childName;
					this.info.babySex = this.data.childSex == 'male' ? '男' : '女';
					this.info.babyBirthday = this.data.childBirthDay ? this.data.childBirthDay.split(' ')[0] : '';
				}.bind(this));
			};

			this.$nextTick(function init() {
				this.relationType = this.getUrlParam("relationType");
				this.relationUuid = this.getUrlParam("relationUuid");
				//this.$vux.loading.show('加载中');
				var self = this;
				getShop(self.query).then(function(shopDto) {
					self.shopDto = shopDto;
					console.log(shopDto)
					self.getActiveDate();
					self.getData();
				})


			});
		},
		components: {
			Group,
			PopupRadio,
			XInput,
			Datetime
		}
	}


</script>
