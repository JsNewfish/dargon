<template>
  <div class="activityMiss">
    <div class="kby text-center">
      <img src="../assets/images/activity/kby-bg.png" alt=""/>
    </div>
    <div class="notice text-center">
      <p>
        抱歉，亲~
      </p>
      <p>
        您访问的活动不存在或已结束
      </p>
    </div>
    <div class="btn">
      <button class="btn-shop">进店逛逛</button>
      <button class="btn-act">去活动中心</button>
    </div>
  </div>
</template>


<script >

  export default{
    name:'home',
    data () {
      return {
        shopName: '秀奴曼旗舰店'
      }
    },
    method: {

    }
  }
</script>
