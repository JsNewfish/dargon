<template>
  <div class="deliveryRecord">
    <div class="notice">
      <p v-if="entity.isSend=='1'">您好，您兑换的{{entity.pointRewardName}}暂时未发货，会尽快为您发货，请耐心等待哦</p>
      <p v-if="entity.isSend=='2'">您好，您兑换的{{entity.pointRewardName}}已经发货，近期请注意查收货物哦~</p>
    </div>
    <div class="detail">
      <div class="status">
        <div class="stick pull-left"></div>
        <span>状态</span>
        <p v-if="entity.isSend=='1'">待发货</p>
        <p v-if="entity.isSend=='2'">已发货</p>
      </div>
      <div class="deliveryInfo" v-if="entity.isSend=='2'">
        <div class="stick pull-left"></div>
        <span>收货信息</span>
        <ul>
          <li class="clearfix" >
            <span class="left pull-left">
              收货人：
            </span>
            <span class="right pull-left">
              {{entity.receiverName}}
            </span>
          </li>
          <li class="clearfix" >
            <span class="left pull-left">
              联系电话：
            </span>
            <span class="right pull-left">
              {{entity.receiverMobile}}
            </span>
          </li>
          <li class="clearfix" >
            <span class="left pull-left">
              收货地址：
            </span>
            <span class="right pull-left">
              {{entity.shoppingAddressId}}
            </span>
          </li>
          <li class="clearfix" >
            <span class="left pull-left">
              快递公司：
            </span>
            <span class="right pull-left">
              {{entity.expressName}}
            </span>
          </li>
          <li class="clearfix" >
            <span class="left pull-left">
              运单号：
            </span>
            <span class="right pull-left">
              {{entity.expressNo}}
            </span>
          </li>
          <li class="clearfix" >
            <span class="left pull-left">
              商家备注：
            </span>
            <span class="right pull-left">
              {{entity.remark}}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script >
  import rest from '../scripts/restClient';

  export default {
    name: 'deliveryRecord',
    data() {
      return {
        entity: {}
      }
    },
    methods: {
      init() {
        var self=this;
        rest.get("dragon/pointRewardOrder", {
          id: this.$route.query.id
        }, function(data) {
           self.entity=data.data;
        })
      }
    },
    created() {
      this.init();
    }
  }
</script>
