import request from '@/config/axios'

// 检验方案检测项目详情 VO
export interface InspectionSchemeItemVO {
  id: string // 主键
  inspectionSchemeId: string // 方案ID
  inspectionItemId: string // 检测项目ID
  number: number // 检测顺序
}

// 检验方案检测项目详情 API
export const InspectionSchemeItemApi = {
  // 查询检验方案检测项目详情分页
  getInspectionSchemeItemPage: async (params: any) => {
    return await request.get({ url: `/qms/inspection-scheme-item/page`, params })
  },

  // 查询检验方案检测项目详情详情
  getInspectionSchemeItem: async (id: number) => {
    return await request.get({ url: `/qms/inspection-scheme-item/get?id=` + id })
  },

  // 新增检验方案检测项目详情
  createInspectionSchemeItem: async (data: InspectionSchemeItemVO) => {
    return await request.post({ url: `/qms/inspection-scheme-item/create`, data })
  },

  // 修改检验方案检测项目详情
  updateInspectionSchemeItem: async (data: InspectionSchemeItemVO) => {
    return await request.put({ url: `/qms/inspection-scheme-item/update`, data })
  },


  // 新增检验方案检测项目详情
  createInspectionSchemeItemWithDetail: async (data: InspectionSchemeItemVO) => {
    return await request.post({ url: `/qms/inspection-scheme-item/create-with-detail`, data })
  },

  // 修改检验方案检测项目详情
  updateInspectionSchemeItemWithDetail: async (data: InspectionSchemeItemVO) => {
    return await request.put({ url: `/qms/inspection-scheme-item/update-with-detail`, data })
  },
  // 删除检验方案检测项目详情
  deleteInspectionSchemeItem: async (id: number) => {
    return await request.delete({ url: `/qms/inspection-scheme-item/delete?id=` + id })
  },

  // 导出检验方案检测项目详情 Excel
  exportInspectionSchemeItem: async (params) => {
    return await request.download({ url: `/qms/inspection-scheme-item/export-excel`, params })
  },


  // ==================== 子表（检测项目详情） ====================

  // 获得检测项目详情列表
  getInspectionSchemeItemDetailListByInspectionSchemeItemId: async (inspectionSchemeItemId) => {
    return await request.get({ url: `/qms/inspection-scheme-item/inspection-scheme-item-detail/list-by-inspection-scheme-item-id?inspectionSchemeItemId=` + inspectionSchemeItemId })
  },


  // 获得检测项目详情列表
  getInspectionSchemeItemDetailListByInspectionSchemeId: async (inspectionSchemeId) => {
    return await request.get({ url: `/qms/inspection-scheme-item/inspection-scheme-item-detail/list-by-inspection-scheme-id?inspectionSchemeId=` + inspectionSchemeId })
  },
}
