import {EChartsOption} from 'echarts'

const {t} = useI18n()
const colors = ['#5470C6', '#91CC75', '#EE6666'];
const itemColors = ['#5470C6', '#91CC75', '#EE6666', '#2B2B2B'];
const itemColors1 = ['#5470C6',  '#EE6666', ];
export const lineOptions: EChartsOption = {
    title: {
        text: t('analysis.monthlySales'),
        left: 'center'
    },
    xAxis: {
        data: [
            t('analysis.january'),
            t('analysis.february'),
            t('analysis.march'),
            t('analysis.april'),
            t('analysis.may'),
            t('analysis.june'),
            t('analysis.july'),
            t('analysis.august'),
            t('analysis.september'),
            t('analysis.october'),
            t('analysis.november'),
            t('analysis.december')
        ],
        boundaryGap: false,
        axisTick: {
            show: false
        }
    },
    grid: {
        left: 20,
        right: 20,
        bottom: 20,
        top: 80,
        containLabel: true
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        },
        padding: [5, 10]
    },
    yAxis: {
        axisTick: {
            show: false
        }
    },
    legend: {
        data: [t('analysis.estimate'), t('analysis.actual')],
        top: 50
    },
    series: [
        {
            name: t('analysis.estimate'),
            smooth: true,
            type: 'line',
            data: [100, 120, 161, 134, 105, 160, 165, 114, 163, 185, 118, 123],
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
        },
        {
            name: t('analysis.actual'),
            smooth: true,
            type: 'line',
            itemStyle: {},
            data: [120, 82, 91, 154, 162, 140, 145, 250, 134, 56, 99, 123],
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
        }
    ]
}

export const pieOptions: EChartsOption = {
    title: {
        text: t(''),
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: [
            t('气泡'),
            t('尺寸'),
            t('硬度'),
            t('包装'),
            t('光滑度')
        ]
    },
    series: [
        {
            name: t('缺陷统计'),
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
                {value: 335, name: t('气泡')},
                {value: 310, name: t('尺寸')},
                {value: 234, name: t('硬度')},
                {value: 135, name: t('包装')},
                {value: 1548, name: t('光滑度')}
            ]
        }
    ]
}

//报废率统计
export const polarOptions: EChartsOption = {
    color: itemColors,
    legend: {
        left: 'center',
        top: 'top',
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    series: [
        {
            name: '统计信息',
            type: 'pie',
            radius: [30, 90],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
                borderRadius: 7
            },
            data: [
                { value: 40, name: '返修率' },
                { value: 8, name: '报废率' },

            ]
        }
    ]

}

//工序统计
export const workerOptions: EChartsOption = {

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
  grid: {
    bottom: 20
  },
  legend: {
    data: ['检测数量', '比率', '不合格数量']
  },
  xAxis: {
    type: 'category',
    data: [],
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
      data: []
    },
    {
      name: '比率',
      type: 'line',
      yAxisIndex: 1,
      data: []
    },
    {
      name: '不合格数量',
      type: 'bar',
      yAxisIndex: 1,
      data: []
    }
  ]
}


//工人工时统计
export const workerHoursOptions: EChartsOption = {
    color:itemColors1,
    title: {
      text: '',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      bottom: 20
    },
    legend: {
      data: ['检测数量', '工时']
    },
    xAxis: {
      type: 'category',
      data: [],
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
            color: itemColors1[0]
          }
        },
        axisLabel: {
          formatter: '{value} '
        }
      },

      {
        type: 'value',
        name: '工时',
        position: 'right',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: itemColors1[1]
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
        yAxisIndex: 1,
        data: []
      },
      {
        name: '工时',
        type: 'line',
        yAxisIndex: 1,
        data: []
      }
    ]
}

//批次统计
export const barOptions: EChartsOption = {

    color: colors,
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
        data: ['产量', '合格率']
    },
    xAxis: {
        type: 'category',
        data: [
            t('P0001'),
            t('P0002'),
            t('P0003'),
            t('P0005'),
            t('P0006'),
            t('P0007'),
            t('P0008')
        ],
        axisTick: {
            alignWithLabel: true
        }
    },
    yAxis: [
        {
            type: 'value',
            name: '产量',
            position: 'left',
            alignTicks: true,
            axisLine: {
                show: true,
                lineStyle: {
                    color: colors[0]
                }
            },
            axisLabel: {
                formatter: '{value} '
            }
        },
        {
            type: 'value',
            name: '合格率',
            position: 'right',
            alignTicks: true,
            axisLine: {
                show: true,
                lineStyle: {
                    color: colors[1]
                }
            },
            axisLabel: {
                formatter: '{value} %'
            }
        }
    ],
    series: [
        {
            name: '产量',
            type: 'bar',
            yAxisIndex: 0,
            data: [
                2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ]
        },
        {
            name: '合格率',
            type: 'line',
            yAxisIndex: 1,
            data: [
                2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
        }
    ]
}


//检测项分析
export const itemAnalysisOptions: EChartsOption = {

    color:itemColors1,
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
        data: ['不合格数量', '累计比率']
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
                    color: itemColors1[1]
                }
            },
            axisLabel: {
                formatter: '{value} '
            }
        },

        {
            type: 'value',
            name: '累计比率',
            position: 'right',
            alignTicks: true,
            axisLine: {
                show: true,
                lineStyle: {
                    color: itemColors1[0]
                }
            },
            axisLabel: {
                formatter: '{value}'
            }
        }
    ],
    series: [
        // {
        //     name: '检测数量',
        //     type: 'bar',
        //     yAxisIndex: 0,
        //     data: [
        //         2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
        //     ]
        // },
        {
            name: '累计比率',
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


//工序统计
export const processOptions: EChartsOption = {

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

export const radarOption: EChartsOption = {
    legend: {
        data: [t('workplace.personal'), t('workplace.team')]
    },
    radar: {
        // shape: 'circle',
        indicator: [
            {name: t('workplace.quote'), max: 65},
            {name: t('workplace.contribution'), max: 160},
            {name: t('workplace.hot'), max: 300},
            {name: t('workplace.yield'), max: 130},
            {name: t('workplace.follow'), max: 100}
        ]
    },
    series: [
        {
            name: `xxx${t('workplace.index')}`,
            type: 'radar',
            data: [
                {
                    value: [42, 30, 20, 35, 80],
                    name: t('workplace.personal')
                },
                {
                    value: [50, 140, 290, 100, 90],
                    name: t('workplace.team')
                }
            ]
        }
    ]
}


export const wordOptions = {
    series: [
        {
            type: 'wordCloud',
            gridSize: 2,
            sizeRange: [12, 50],
            rotationRange: [-90, 90],
            shape: 'pentagon',
            width: 600,
            height: 400,
            drawOutOfBound: true,
            textStyle: {
                color: function () {
                    return (
                        'rgb(' +
                        [
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160)
                        ].join(',') +
                        ')'
                    )
                }
            },
            emphasis: {
                textStyle: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            data: [
                {
                    name: 'Sam S Club',
                    value: 10000,
                    textStyle: {
                        color: 'black'
                    },
                    emphasis: {
                        textStyle: {
                            color: 'red'
                        }
                    }
                },
                {
                    name: 'Macys',
                    value: 6181
                },
                {
                    name: 'Amy Schumer',
                    value: 4386
                },
                {
                    name: 'Jurassic World',
                    value: 4055
                },
                {
                    name: 'Charter Communications',
                    value: 2467
                },
                {
                    name: 'Chick Fil A',
                    value: 2244
                },
                {
                    name: 'Planet Fitness',
                    value: 1898
                },
                {
                    name: 'Pitch Perfect',
                    value: 1484
                },
                {
                    name: 'Express',
                    value: 1112
                },
                {
                    name: 'Home',
                    value: 965
                },
                {
                    name: 'Johnny Depp',
                    value: 847
                },
                {
                    name: 'Lena Dunham',
                    value: 582
                },
                {
                    name: 'Lewis Hamilton',
                    value: 555
                },
                {
                    name: 'KXAN',
                    value: 550
                },
                {
                    name: 'Mary Ellen Mark',
                    value: 462
                },
                {
                    name: 'Farrah Abraham',
                    value: 366
                },
                {
                    name: 'Rita Ora',
                    value: 360
                },
                {
                    name: 'Serena Williams',
                    value: 282
                },
                {
                    name: 'NCAA baseball tournament',
                    value: 273
                },
                {
                    name: 'Point Break',
                    value: 265
                }
            ]
        }
    ]
}
