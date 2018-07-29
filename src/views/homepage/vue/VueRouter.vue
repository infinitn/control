<template>
  <div>
    vue-router
    test
    <mt-button type="primary">primary</mt-button>
    <div class="swipe-warpper">
      <mt-swipe :show-indicators="false">
        <mt-swipe-item>1</mt-swipe-item>
        <mt-swipe-item>2</mt-swipe-item>
        <mt-swipe-item>3</mt-swipe-item>
      </mt-swipe>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rangeValue: 20
    }
  }
}
</script>
<style lang="scss" scoped>
.swipe-warpper{
  width: 100px;
  height: 100px;
  background-color: red;
}
</style>
