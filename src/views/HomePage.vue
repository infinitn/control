<template>
  <div>
    <nav-menu></nav-menu>
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

</style>
