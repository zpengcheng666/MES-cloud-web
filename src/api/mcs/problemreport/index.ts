import request from '@/config/axios'

// 问题上报 VO
export interface ProblemReportVO {
  id: string // id
  type: number // 问题类型
  reportId: string // 上报id
  status: string // 状态
  describe: string // 问题描述
}

// 问题上报 API
export const ProblemReportApi = {
  // 查询问题上报分页
  getProblemReportPage: async (params: any) => {
    return await request.get({ url: `/mcs/problem-report/page`, params })
  },

  // 查询问题上报详情
  getProblemReport: async (id: number) => {
    return await request.get({ url: `/mcs/problem-report/get?id=` + id })
  },

  // 新增问题上报
  createProblemReport: async (data: ProblemReportVO) => {
    return await request.post({ url: `/mcs/problem-report/create`, data })
  },

  // 修改问题上报
  updateProblemReport: async (data: ProblemReportVO) => {
    return await request.put({ url: `/mcs/problem-report/update`, data })
  },

  // 删除问题上报
  deleteProblemReport: async (id: number) => {
    return await request.delete({ url: `/mcs/problem-report/delete?id=` + id })
  },

  // 导出问题上报 Excel
  exportProblemReport: async (params) => {
    return await request.download({ url: `/mcs/problem-report/export-excel`, params })
  },

  // 列出问题上报列表
  getProblemReportList: async (stationId) => {
    if (stationId == undefined || stationId == null || stationId == '') {
      return await request.get({ url: `/mcs/problem-report/getList` })
    } else {
      return await request.get({ url: `/mcs/problem-report/getList?stationId=${stationId}` })
    }
  }
}
