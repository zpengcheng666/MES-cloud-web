import request from '@/config/axios'

// 抽样标准 VO
export interface SamplingStandardVO {
  id: string // 主键
  parentId: string // 父抽样标准ID
  name: string // 抽样标准名称
}

// 抽样标准 API
export const SamplingStandardApi = {

  // 查询抽样标准分类列表
  getSamplingStandardList: async (params) => {
    return await request.get({ url: `/qms/sampling-standard/list`, params })
  },

  // 查询抽样标准分页
  getSamplingStandardPage: async (params: any) => {
    return await request.get({ url: `/qms/sampling-standard/page`, params })
  },

  // 查询抽样标准详情
  getSamplingStandard: async (id: number) => {
    return await request.get({ url: `/qms/sampling-standard/get?id=` + id })
  },

  // 新增抽样标准
  createSamplingStandard: async (data: SamplingStandardVO) => {
    return await request.post({ url: `/qms/sampling-standard/create`, data })
  },

  // 修改抽样标准
  updateSamplingStandard: async (data: SamplingStandardVO) => {
    return await request.put({ url: `/qms/sampling-standard/update`, data })
  },

  // 删除抽样标准
  deleteSamplingStandard: async (id: number) => {
    return await request.delete({ url: `/qms/sampling-standard/delete?id=` + id })
  },

  // 导出抽样标准 Excel
  exportSamplingStandard: async (params) => {
    return await request.download({ url: `/qms/sampling-standard/export-excel`, params })
  },
}
