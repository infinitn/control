<template>
  <div class="body-menu">
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      @select="handleSelect"
      menu-trigger="click"
      unique-opened
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      >
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
      activeIndex: 'ELementUi',
      list:[
        {
          name: '依赖管理',
          index: 'NpmInstall',
          children: [
            {
              name: 'element-ui',
              path: 'ELementUi'
            },
            {
              name: 'scss',
              path: 'Scss'
            }
          ]
        },
        {
          name: 'Vue',
          index: 'Vue',
          children: [
            {
              name: 'vuex',
              path: 'Vuex'
            },
            {
              name: 'vue-router',
              path: 'VueRouter'
            }
          ]
        },

        {
          name: '开发文档',
          index: 'Document',
          children: [
            {
              name: '开发指引',
              path: 'DevelopGuidance'
            },
            {
              name: '开发规范',
              path: 'DevelopStandard'
            }
          ]
        },
        {
          name: '插件',
          index: 'Plugins',
          children: [
            {
              name: 'mp3录音',
              path: 'Mp3Recording'
            }
          ]

        }
      ]
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push({name: key})
    }
  },
  created () {

  }
};
</script>
<style lang="scss" scoped>

</style>
