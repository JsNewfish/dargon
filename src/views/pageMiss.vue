<template>
  <div class="activityMiss">
    <div class="kby text-center">
      <img src="../assets/images/activity/kby-bg.png" alt=""/>
    </div>
    <div class="notice text-center">
      <p style="font-size: 2em;color: pink">
        {{query.type}}
      </p>
      <p>
        抱歉，亲~
      </p>
      <p>
        您访问的活动不存在或已结束
      </p>
    </div>
  </div>
</template>


<script >

  export default{
    name:'home',
    data () {
      return {
        shopName: '秀奴曼旗舰店',
        query: this.$route.query
      }
    },
    method: {

    }
  }
</script>
