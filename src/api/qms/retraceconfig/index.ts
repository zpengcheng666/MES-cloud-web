import request from '@/config/axios'

// 追溯字段配置 VO
export interface RetraceConfigVO {
  id: string // 主键
  name: string // 字段名称
  no: string // 字段属性
}

// 追溯字段配置 API
export const RetraceConfigApi = {
  // 查询追溯字段配置分页
  getRetraceConfigPage: async (params: any) => {
    return await request.get({ url: `/qms/retrace-config/page`, params })
  },

  // 查询追溯字段配置详情
  getRetraceConfig: async (id: number) => {
    return await request.get({ url: `/qms/retrace-config/get?id=` + id })
  },

  // 新增追溯字段配置
  createRetraceConfig: async (data: RetraceConfigVO) => {
    return await request.post({ url: `/qms/retrace-config/create`, data })
  },

  // 修改追溯字段配置
  updateRetraceConfig: async (data: RetraceConfigVO) => {
    return await request.put({ url: `/qms/retrace-config/update`, data })
  },

  // 删除追溯字段配置
  deleteRetraceConfig: async (id: number) => {
    return await request.delete({ url: `/qms/retrace-config/delete?id=` + id })
  },

  // 导出追溯字段配置 Excel
  exportRetraceConfig: async (params) => {
    return await request.download({ url: `/qms/retrace-config/export-excel`, params })
  },

  //获取配置表
  getRetraceConfigList: async (params: any) => {
    return await request.get({ url: `/qms/retrace-config/list`, params })
  },
}
