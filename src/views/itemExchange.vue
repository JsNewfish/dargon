<template>
  <div class="page-itemExchange">
    <div class="deliveryInfo">
      <form action="">
        <ul>
          <li class="consignee">
            <label>
              <span>收货人</span>
              <input name="consignee" type="text" v-model="receiverName"/>
            </label>
          </li>
          <li class="tel">
            <label>
              <span>联系电话</span>
              <input name="tel" type="number" v-model="receiverMobile"/>
            </label>
          </li>
          <li class="address-control">
              <x-address  :title="addressTitle" v-model="addressDto" :list="addressData"  placeholder="请选择"></x-address>
          </li>
           <li class="address">
            <textarea name="address" placeholder="详细地址" v-model="address"></textarea>
          </li>
        </ul>
        <button  v-on:click.stop.prevent="confirm.show=true">
          确认兑换
        </button>
      </form>
    </div>
    <confirm v-model="confirm.show" class="dg-confirm"
      @on-confirm="redeem">
      <p style="text-align:center;">确定要用{{query.point|centToDollar}}{{"积分"|unitFormat}}兑换该商品吗？ </p>
    </confirm>
    <confirm v-model="confirmSuccess.show" class="dg-confirm confirm-success"  @on-confirm="onConfirm">
      <p style="text-align:center;">恭喜您，兑换成功！<br>近期请注意查收货哦 </p>
    </confirm>
  </div>
</template>
<script >
   import {
     XAddress,
     ChinaAddressV2Data,
     Value2nameFilter,
     Group,
     Confirm
   } from 'vux';
   import rest from '../scripts/restClient';
   import {
    getShop,
    getShopDto
  } from '../scripts/global';


   export default {
     name: 'itemExchange',
     data() {
       return {
         shopDto: getShopDto(),
         query: this.$route.query,
         addressTitle: '所在地区',
         receiverName: "",
         receiverMobile: "",
         addressData: ChinaAddressV2Data,
         addressDto: [],
         address: "",
         confirm:{show:false},
         confirmSuccess:{show:false}
       }
     },
     methods: {
       redeem() {
         var self = this,
           addressData = Value2nameFilter(this.addressDto, this.addressData).split(" "),
           postData = {
             receiverName: this.receiverName,
             receiverMobile: this.receiverMobile,
             province: addressData[0],
             city: addressData[1],
             district: addressData[2],
             address: this.address,
             pointRewardUuid: this.query.relationUuid,
           };
         if (this.doValidate(postData)) {
           rest.post("dragon/pointReward/redeem", null, postData, function(data) {
            self.confirmSuccess.show=true;
           });
         }
       },
       doValidate(data){
          var toast=this.$vux.toast;
          if(!data.receiverName){
            toast.show({
              text:"收货人不能为空！",
              type:"warn"
            })
            return false;
          }else if(!data.receiverMobile){
            toast.show({
              text:"联系电话不能为空！",
              type:"warn"
            })
            return false;
          }else if(!data.province){
             toast.show({
              text:"所在地区不能为空",
              type:"warn"
             })
            return false;
          }else if(!data.address){
            toast.show({
              text:"详细地址不能为空",
              type:"warn"
            });
            return false;
          }
          return true;
       },
       onConfirm(){
         location.href=this.shopDto.mallUrl;
       }
     },
     components: {
       XAddress,
       ChinaAddressV2Data,
       Group,
       Confirm
     },
     mounted(){
        var self=this;
        getShop().then(function(shopDto){
          self.shopDto = shopDto;
        });

        rest.get("dragon/buyer",null,function(data){
            console.log(data.data)
            var buyer=data.data;
            self.receiverName=buyer.name;
            self.receiverMobile=buyer.mobile;
            self.address=buyer.address;
            self.addressDto=[buyer.province,buyer.city,buyer.district];  
        });
     }
   }
</script>
