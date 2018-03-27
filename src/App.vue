<template>
  <div id="app">
    <transition name="page-fade">
    	<router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style lang="scss">

@import "./styles/main.scss";

</style>
