import request from '@/config/axios'

// 刀具适配 VO
export interface FitConfigVO {
  id: string // ID
  toolConfigId: string // 刀具类型id
  materialConfigId: string // 物料类型id
  materialConfigId2: string // 物料类型id
}

// 刀具适配 API
export const FitConfigApi = {
  // 查询刀具适配分页
  getFitConfigPage: async (params: any) => {
    return await request.get({ url: `/tms/fit-config/page`, params })
  },

  // 查询刀具适配详情
  getFitConfig: async (id: number) => {
    return await request.get({ url: `/tms/fit-config/get?id=` + id })
  },

  // 新增刀具适配
  createFitConfig: async (data: FitConfigVO) => {
    return await request.post({ url: `/tms/fit-config/create`, data })
  },

  // 修改刀具适配
  updateFitConfig: async (data: FitConfigVO) => {
    return await request.put({ url: `/tms/fit-config/update`, data })
  },

  // 删除刀具适配
  deleteFitConfig: async (id: number) => {
    return await request.delete({ url: `/tms/fit-config/delete?id=` + id })
  },

  // 导出刀具适配 Excel
  exportFitConfig: async (params) => {
    return await request.download({ url: `/tms/fit-config/export-excel`, params })
  },

  // 查询刀具适配详情
  getTemplateFitConfigList: async (params: any) => {
    return await request.get({ url: `/tms/fit-config/getTemplateFitConfigList`, params })
  },

}
