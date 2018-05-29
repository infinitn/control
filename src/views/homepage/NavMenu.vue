<template>
  <div>
    <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
      <el-submenu v-for="(item,index) in list" :key="index" :index="item.index">
        <template slot="title">{{item.name}}</template>
        <el-menu-item v-for="(child,idx) in item.children" :key="idx" :index="child.path">
          {{child.name}}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeIndex: '1',
      list:[
        {
          name: '依赖管理',
          index: '1',
          children: [
            {
              name: 'scss',
              path: 'Scss'
            }
          ]
        },
        {
          name: 'Vue',
          index: '2',
          children: [
            {
              name: 'vue-vuex',
              path: 'VueVuex'
            },
            {
              name: 'vue-router',
              path: 'VueRouter'
            }
          ]
        }
      ]
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    }
  },
  created () {
    
  }
};
</script>
<style lang="scss" scoped>

</style>
