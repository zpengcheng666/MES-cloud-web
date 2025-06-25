import request from '@/config/axios'

// 抽样规则 VO
export interface SamplingRuleVO {
  id: string // 主键
  samplingStandardId: string // 抽样标准ID
  samplingNo: string // 样本数字码
  samplingNumber: number // 抽取数量
  upperLimit: number // 批量上限值
  lowerLimit: number // 批量下限值
  maxUnqualifiedQuantity: number // 最大不合格数
}

// 抽样规则 API
export const SamplingRuleApi = {
  // 查询抽样规则分页
  getSamplingRulePage: async (params: any) => {
    return await request.get({ url: `/qms/sampling-rule/page`, params })
  },

  // 查询抽样规则详情
  getSamplingRule: async (id: number) => {
    return await request.get({ url: `/qms/sampling-rule/get?id=` + id })
  },

  // 新增抽样规则
  createSamplingRule: async (data: SamplingRuleVO) => {
    return await request.post({ url: `/qms/sampling-rule/create`, data })
  },

  // 修改抽样规则
  updateSamplingRule: async (data: SamplingRuleVO) => {
    return await request.put({ url: `/qms/sampling-rule/update`, data })
  },

  // 删除抽样规则
  deleteSamplingRule: async (id: number) => {
    return await request.delete({ url: `/qms/sampling-rule/delete?id=` + id })
  },

  // 导出抽样规则 Excel
  exportSamplingRule: async (params) => {
    return await request.download({ url: `/qms/sampling-rule/export-excel`, params })
  },


  // 查询抽样规则详情
  getSamplingRuleInfo: async (samplingStandardId: number) => {
    return await request.get({ url: `/qms/sampling-rule/getInfo?samplingStandardId=` + samplingStandardId })
  },
}
