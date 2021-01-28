<template>
  <div>
    开发指引
    <v-chart :options="options"/>
  </div>
</template>
<script>
export default {
  data () {
    return {
      options: {
        xAxis: {
          type: 'category',
          data: [1, '2', '3', '4', '5', '6']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [100, 500, 300, 400, 800, 10000],
          type: 'line'
        }]
      }
    }
  }
}
</script>
