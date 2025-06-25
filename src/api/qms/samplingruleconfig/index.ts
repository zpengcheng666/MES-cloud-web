import request from '@/config/axios'

// 抽样规则（检验抽样方案） VO
export interface SamplingRuleConfigVO {
  id: string // 主键
  sampleSizeCode: string // 样本量字码
  sampleSize: number // 抽取样本数量
  samplingRuleType: boolean // 类型  1正常检查2加严检查3放宽检查
  acceptanceQualityImit: number // 接收质量限（AQL）
  acceptNum: number // 接收数（Ac）
  rejectionNum: number // 拒收数（Re）
}

// 抽样规则（检验抽样方案） API
export const SamplingRuleConfigApi = {
  // 查询抽样规则（检验抽样方案）分页
  getSamplingRuleConfigPage: async (params: any) => {
    return await request.get({ url: `/qms/sampling-rule-config/page`, params })
  },

  // 查询抽样规则（检验抽样方案）详情
  getSamplingRuleConfig: async (id: number) => {
    return await request.get({ url: `/qms/sampling-rule-config/get?id=` + id })
  },

  // 新增抽样规则（检验抽样方案）
  createSamplingRuleConfig: async (data: SamplingRuleConfigVO) => {
    return await request.post({ url: `/qms/sampling-rule-config/create`, data })
  },

  // 修改抽样规则（检验抽样方案）
  updateSamplingRuleConfig: async (data: SamplingRuleConfigVO) => {
    return await request.put({ url: `/qms/sampling-rule-config/update`, data })
  },

  // 删除抽样规则（检验抽样方案）
  deleteSamplingRuleConfig: async (id: number) => {
    return await request.delete({ url: `/qms/sampling-rule-config/delete?id=` + id })
  },

  // 导出抽样规则（检验抽样方案） Excel
  exportSamplingRuleConfig: async (params) => {
    return await request.download({ url: `/qms/sampling-rule-config/export-excel`, params })
  },

  // 查询抽样规则（检验抽样方案）详情
  getSamplingRuleConfigInfo: async (samplingStandardId: number) => {
    return await request.get({ url: `/qms/sampling-rule-config/getInfo?samplingStandardId=` + samplingStandardId })
  },

}
