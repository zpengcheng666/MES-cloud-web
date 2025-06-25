import request from '@/config/axios'

// 检测项目详情 VO
export interface InspectionSchemeItemDetailVO {
  id: string // 主键
  inspectionItemConfigId: string // 检测项配置表ID
  inspectionSchemeItemId: string // 检测方案项目ID
  referenceType: number // 判断方式  文本   是否  数字  条件判断
  number: number // 数字（技术要求）
  maxValue: number // 上限值
  minValue: number // 下限值
  content: string // 文本内容
  judgement: number // 判断
}

// 检测项目详情 API
export const InspectionSchemeItemDetailApi = {
  // 查询检测项目详情分页
  getInspectionSchemeItemDetailPage: async (params: any) => {
    return await request.get({ url: `/qms/inspection-scheme-item-detail/page`, params })
  },

  // 查询检测项目详情详情
  getInspectionSchemeItemDetail: async (id: number) => {
    return await request.get({ url: `/qms/inspection-scheme-item-detail/get?id=` + id })
  },

  // 新增检测项目详情
  createInspectionSchemeItemDetail: async (data: InspectionSchemeItemDetailVO) => {
    return await request.post({ url: `/qms/inspection-scheme-item-detail/create`, data })
  },

  // 修改检测项目详情
  updateInspectionSchemeItemDetail: async (data: InspectionSchemeItemDetailVO) => {
    return await request.put({ url: `/qms/inspection-scheme-item-detail/update`, data })
  },

  // 删除检测项目详情
  deleteInspectionSchemeItemDetail: async (id: number) => {
    return await request.delete({ url: `/qms/inspection-scheme-item-detail/delete?id=` + id })
  },

  // 导出检测项目详情 Excel
  exportInspectionSchemeItemDetail: async (params) => {
    return await request.download({ url: `/qms/inspection-scheme-item-detail/export-excel`, params })
  },
}