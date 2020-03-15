<template>
  <div>
    Scss
    <div v-for="(item, index) in list" :key="index">
      {{item}}
    </div>
    <el-button @click="Click">点击</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: ['1','2','3']
    }
  },
  methods: {
    Click() {
      this.$router.push({name: 'Vuex', params: {a: false}, query: {b: true}});
    }
  }
}
</script>
