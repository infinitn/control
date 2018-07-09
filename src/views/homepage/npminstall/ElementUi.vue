<template>
  <div class="element-ui-box">
    <div v-for="cur in 100" :key="cur">
      我是文字{{cur}}
    </div>
    <div class="btns">
      <el-button>我是按钮</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      
    }
  },
  methods: {

  },
  created () {
    
  }
};
</script>
<style lang="scss" scoped>
.element-ui-box{
  padding-bottom: 80px;
  width: 100%;
  .btns{
    text-align: center;
    position: fixed;
    bottom: 0;
    background-color: #ccc;
    height: 60px;
    line-height: 60px;
    width: 100%;
  }
}
</style>

