import { EChartsOption } from 'echarts'

const { t } = useI18n()
const colors = ['#5470C6', '#91CC75', '#EE6666'];
const itemColors = ['#5470C6', '#91CC75', '#EE6666', '#2B2B2B'];
const itemColors1 = ['#5470C6',  '#EE6666', ];

export const companyOptions: EChartsOption = {

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
        bottom: 20
    },
    legend: {
        data: ['采购数量', '比率', '退货数量']
    },
    xAxis: {
        type: 'category',
        data: [
            t('气泡'),
            t('表面检测'),
            t('硬度检测'),
            t('外观检验'),
            t('A类表面'),
            t('B类表面'),
            t('C类表面')
        ],
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
                formatter: '{value} '
            }
        },

        {
            type: 'value',
            name: '比率',
            position: 'right',
            alignTicks: true,
            axisLine: {
                show: true,
                lineStyle: {
                    color: itemColors[1]
                }
            },
            axisLabel: {
                formatter: '{value}'
            }
        }
    ],
    series: [
        {
            name: '采购数量',
            type: 'bar',
            yAxisIndex: 0,
            data: [
                2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ]
        },
        {
            name: '比率',
            type: 'line',
            yAxisIndex: 1,
            data: [
                2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
        },
        {
            name: '退货数量',
            type: 'bar',
            yAxisIndex: 1,
            data: [
                2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
        }
    ]
}



export const consignmentQmsRateOptions: EChartsOption = {

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
        bottom: 20
    },
    legend: {
        data: ['检测数量', '比率', '不合格数量']
    },
    xAxis: {
        type: 'category',
        data: [
            t('气泡'),
            t('表面检测'),
            t('硬度检测'),
            t('外观检验'),
            t('A类表面'),
            t('B类表面'),
            t('C类表面')
        ],
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
                formatter: '{value} '
            }
        },

        {
            type: 'value',
            name: '比率',
            position: 'right',
            alignTicks: true,
            axisLine: {
                show: true,
                lineStyle: {
                    color: itemColors[1]
                }
            },
            axisLabel: {
                formatter: '{value}'
            }
        }
    ],
    series: [
        {
            name: '检测数量',
            type: 'bar',
            yAxisIndex: 0,
            data: [
                2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ]
        },
        {
            name: '比率',
            type: 'line',
            yAxisIndex: 1,
            data: [
                2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
        },
        {
            name: '不合格数量',
            type: 'bar',
            yAxisIndex: 1,
            data: [
                2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
        }
    ]


}

export const purchaseContractAnalysisOptions: EChartsOption = {

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
        bottom: 20
    },
    legend: {
        data: [ '金额']
    },
    xAxis: {
        type: 'category',
        data: [
            t('气泡'),
            t('表面检测'),
            t('硬度检测'),
            t('外观检验'),
            t('A类表面'),
            t('B类表面'),
            t('C类表面')
        ],
        axisTick: {
            alignWithLabel: true
        }
    },
    yAxis: [
        {
            type: 'value',
            name: '金额',
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
            name: '金额',
            type: 'line',
            yAxisIndex: 0,
            data: [
                2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
        },

    ]


}

export const shippingContractAnalysisOptions: EChartsOption = {

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
        bottom: 20
    },
    legend: {
        data: [ '金额']
    },
    xAxis: {
        type: 'category',
        data: [
            t('气泡'),
            t('表面检测'),
            t('硬度检测'),
            t('外观检验'),
            t('A类表面'),
            t('B类表面'),
            t('C类表面')
        ],
        axisTick: {
            alignWithLabel: true
        }
    },
    yAxis: [
        {
            type: 'value',
            name: '金额',
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
            name: '金额',
            type: 'line',
            yAxisIndex: 0,
            data: [
                2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
        },

    ]


}