<template>
  <div class="page">
    <div class="tab-box">
      <div class="tab-item" v-for="(item, index) in tabs" :key="index" @click="handleTabClick(index)">
        <span :class="'tab-' + (index + 1)">{{item.name}}</span>
      </div>
      <div class="line" :style="line_style"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      preActive: 1,
      activeName: 1,
      tabs: [
        {name: '小龙虾1'},
        {name: '小龙虾2'},
        {name: '小龙虾3'},
        {name: '小龙虾4'},
        {name: '小龙虾5'}
      ],
      line_style: {width: '10px', height: '2px', left: '0'},
      left: '0',
      timer: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.line_style.width = (document.querySelector('.tab-' + this.activeName).offsetWidth / 2) + 'px';
    });
  },
  methods: {
    handleTabClick(index) {
      this.preActive = JSON.parse(JSON.stringify(this.activeName));
      this.activeName = index + 1;
      this.line_style.width = (document.querySelector('.tab-' + this.activeName).offsetWidth / 2) + 'px';
      let count = 0; // 移动的总长度
      for(let i = 0; i < index; i++) {
        count += (document.querySelector('.tab-' + (i + 1)).offsetWidth + 70);
      }
      window.clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.preActive > this.activeName) {
          this.left -= (index + 2);
          if (this.left <= count) {
            this.left = count;
            window.clearInterval(this.timer);
          }
        } else if (this.preActive < this.activeName) {
          this.left += (index + 2);
          if (this.left >= count) {
            this.left = count;
            window.clearInterval(this.timer);
          }
        }
        this.line_style.left = this.left + 'px';
      }, 0);
    }
  }
}
</script>
<style lang="scss" scoped>
.page{
  .tab-box{
    position: relative;
    display: flex;
    width: 1000px;
    height: 60px;
    background-color: #eee;
    .tab-item{
      margin-left: 70px;
      cursor: pointer;
      &:nth-child(1) {
        margin-left: 0;
      }
    }
    .line{
      position: absolute;
      bottom: 30px;
      background: linear-gradient(#f00, #ff0);
    }
  }
}
</style>
