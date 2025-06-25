import request from '@/config/axios'

export interface processTaskStatisticsVO{
  id: number
  reviewedBy: string
  reviewer: string
  updateTime: string // 更新时间
  one: string
  two: string
  three: string
  five: string
}

export const ProcessTaskStatisticsApi = {

  //查询工艺任务统计分页列表
  getProcessTaskStatistics: async (params) => {
    return await request.get({url: '/pdm/process-plan-new/list',params})
  },
}
