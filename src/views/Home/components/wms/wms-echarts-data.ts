import { EChartsOption } from 'echarts'

const { t } = useI18n()
const colors = ['#5470C6', '#91CC75', '#EE6666'];
const itemColors = ['#5470C6', '#91CC75', '#EE6666', '#2B2B2B'];
const itemColors1 = ['#5470C6',  '#EE6666', ];

export const warehouseOccupancyRateOptions: EChartsOption = {

    color: itemColors,
    title: {
        text: '',
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    // toolbox: {
    //   feature: {
    //     dataView: { show: true, readOnly: false },
    //     restore: { show: true },
    //     saveAsImage: { show: true }
    //   }
    // },
    grid: {
        bottom: "20%",
    },

    legend: {
        data: ['仓库占用率', '物料占用率']
    },
    xAxis: {
        type: 'category',
        data: [
            t('A'),
            t('B'),
            t('C'),
            t('D'),
            t('E'),
        ],
        axisLabel: {
            interval: 0,
            rotate: 20,
            formatter: function (value) {
                if (value.length > 5) {
                  const str = `${value.slice(0, 5)}`
                  return str + '...';
                } 
                return value;
            },
        },
        axisTick: {
            alignWithLabel: true
        }
    },
    yAxis: [
        {
            type: 'value',
            name: '百分比',
            position: 'left',
            alignTicks: true,
            axisLine: {
                show: true,
                lineStyle: {
                    color: itemColors[0]
                }
            },
            axisLabel: {
                formatter: '{value} %'
            }
        }

    ],
    series: [
        {
            name: '仓库占用率',
            type: 'bar',
            yAxisIndex: 0,
            data: [
                2.0, 4.9, 7.0, 23.2, 25.6
            ]
        },
        {
            name: '物料占用率',
            type: 'bar',
            yAxisIndex: 0,
            data: [
                2.6, 5.9, 9.0, 26.4, 28.7
            ]
        }
    ]
}

// 仓库总出入库统计
export const totalWarehouseOptions: EChartsOption = {

    color: itemColors,
    title: {
        text: '',
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    // toolbox: {
    //   feature: {
    //     dataView: { show: true, readOnly: false },
    //     restore: { show: true },
    //     saveAsImage: { show: true }
    //   }
    // },
    grid: {
        bottom: "12%",
    },

    legend: {
        data: ['入库数量', '出库数量','库存数量']
    },
    xAxis: {
        type: 'category',
        data: [
            t('A'),
            t('B'),
            t('C'),
            t('D'),
            t('E'),
        ],
        axisLabel: {
            interval: 0,
            rotate: 20,
            formatter: function (value) {
                if (value.length > 5) {
                  const str = `${value.slice(0, 5)}`
                  return str + '...';
                } 
                return value;
            },
        },
        axisTick: {
            alignWithLabel: true
        }
    },
    yAxis: [
        {
            type: 'value',
            name: '数量',
            position: 'left',
            alignTicks: true,
            axisLine: {
                show: true,
                lineStyle: {
                    color: itemColors[0]
                }
            },
            axisLabel: {
                formatter: '{value}'
            }
        }

    ],
    series: [
        {
            name: '入库数量',
            type: 'bar',
            yAxisIndex: 0,
            data: [
                2.0, 4.9, 7.0, 23.2, 25.6
            ]
        },
        {
            name: '出库数量',
            type: 'bar',
            yAxisIndex: 0,
            data: [
                2.6, 5.9, 9.0, 26.4, 28.7
            ]
        },
        {
            name: '库存数量',
            type: 'bar',
            yAxisIndex: 0,
            data: [
                2.6, 5.9, 9.0, 26.4, 28.7
            ]
        }
    ]
}