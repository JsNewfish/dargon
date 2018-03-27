<template>
  <div class="test">
    <div>
      123123 {{className}}
    </div>
    <div class="box flex-one">
      <span class="item"></span>
      <span class="item"></span>
     <span class="item"></span>
      <span class="item"></span>
      	
      
    </div>
  </div>
</template>
<script>
export default {
  name: 'test',
  data() {
    return {
      age: 123,
      className: 777
    }
  }
}

</script>
<style scoped>
.test {}

.flex-one {
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
}

.box {
  display: flex;

  margin: 16px;
  padding: 4px;

  background-color: #e7e7e7;
  width: 104px;
  height: 104px;
  object-fit: contain;

  box-shadow: inset 0 5px white,
  inset 0 -5px #bbb,
  inset 5px 0 #d7d7d7,
  inset -5px 0 #d7d7d7;

  border-radius: 10%;
}

.item {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin: 4px;

  background-color: #333;
  box-shadow: inset 0 3px #111, inset 0 -3px #555;
}

</style>
