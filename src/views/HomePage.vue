<template>
  <div class="body">
    <div class="nav">
      <nav-menu class="menu"></nav-menu>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import NavMenu from './homepage/NavMenu'
export default {
  components: {
    NavMenu
  },
  data () {
    return {
      
    }
  },
  methods: {
    
  },
  created () {
    
  }
}
</script>
<style lang="scss" scoped>
.body{
  padding-top: 65px;
}
.nav{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
