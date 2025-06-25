<template>
  <div id="deviceLoadView" style="text-align: center">暂无排产记录</div>
</template>

<script lang="ts" setup>
import { onMounted, inject, watch } from 'vue'
import * as echarts from 'echarts/core';
import {TooltipComponent, GridComponent, LegendComponent} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import {BatchOrderApsResultApi} from "@/api/mcs/batchorderapsresult";

echarts.use([TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer]);

const sharedInfo = inject("sharedInfo");
const myChart = ref();
const option: any = {
  tooltip: {
    trigger: 'item',
    axisPointer: {
      type: 'shadow'
    },
    formatter: (params) => {
      let msg = '<div style="text-align: left">订单: ' + params.data.orderNumber + '<br/>' +
        '图号: ' + params.data.partNumber + '<br/>' +
        '零件: ' + params.data.partIndex + '<br/>' +
        '工序: ' + params.data.processNumber + '<br/>' +
        '工步: ' + params.data.stepNumber + '<br/>' +
        '开始: ' + params.data.startTime + '<br/>' +
        '结束: ' + params.data.endTime +
        '</div>';
      //非字符串不显示
      return params.data.show ? msg : null;
    }
  },
  grid: {
    left: '1%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value'
  },
  yAxis: {
    type: 'category',
  },
};

const hideStyle = {
  borderColor: 'transparent',
  // color: 'transparent'
}
const showStyle = {
  barBorderRadius: 8,
  barBorderColor: '#999999',
  barBorderWidth:1,
  // color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{offset: 0, color: '#06B5D7'}, {offset: 0.5, color: '#44C0C1'}, {offset: 1, color: '#71C8B1'}])
}

const selectPartId = ref('1861580744329138177');

watch(() => sharedInfo.apsId, (value) => {
  if (value) {
    if (!myChart.value) {
      setTimeout(chartMain);
    } else {
      chartLoad();
    }
  }},
  {immediate: false}
)

const chartMain = async (times) => {
  const chartDom:HTMLElement | null = document.getElementById('deviceLoadView');
  if (chartDom == null) {
    //重新获取dom元素100次,间隔0.1s
    if (times == null) times = 100;
    if (times == 0) {window.alert('设备负载图加载失败');return;}
    setTimeout(() => chartMain(times-1), 100); return;
  }
  await setViewHeight(chartDom);
  myChart.value = echarts.init(chartDom);
  await chartLoad();
}

const setViewHeight = async (chartDom: HTMLElement) => {
  option.yAxis.data = await BatchOrderApsResultApi.getLedgerNameListByApsId({id: sharedInfo.apsId});
  chartDom.style.height = option.yAxis.data.length * 145 + 60 + 'px'
}

const chartLoad = async () => {
  const resultMap = await BatchOrderApsResultApi.getLedgerLoadByApsId({id: sharedInfo.apsId});
  const deviceLoadDataList = resultMap.data;
  const series = []
    for (let dataList of deviceLoadDataList) {
    const item = {
      label: {
        show: true,
        formatter: (params) => {
          if (params.data.show) {
            return params.data.orderNumber + '\n' +
              params.data.partIndex + '-' +
              params.data.processNumber + '-' +
              params.data.stepNumber;
          } else {
            return '';
          }
        }
      },
      itemStyle: {
        color: (params: any) => {
          if (params.data.show) {
            return params.data.orderFormId == selectPartId.value? 'rgb(250, 200, 88)' : 'rgb(140, 200, 255)'
          } else {
            return 'transparent'
          }
        }
      },
      type: 'bar',
      stack: 'total',
      data: []
    }
    for (let data of dataList) {
      if (data.show) {
        data.itemStyle = showStyle;
      } else {
        data.itemStyle = hideStyle;
      }
      item.data.push(data);
    }
    series.push(item)
  }
  option.series = series;
  option && myChart.value.setOption(option);
}

onMounted(() => {
  //todo 测试
  sharedInfo.apsId = "1865199311316058114"
  if (sharedInfo.apsId) {
    //等待dom加载完成
    setTimeout(chartMain);
  }
})
</script>

<style scoped>

</style>
