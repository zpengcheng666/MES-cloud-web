import request from '@/config/axios'

// 检验单 VO
export interface InspectionSheetGenerateTaskVO {
  id: string // 主键
  sheetName: string // 检验单名称
  sheetNo: string // 检验单号
  recordNumber: string // 来源单号
  status: number // 质检状态  0待派工1待检验2检验中3检验完成
  sourceType: number // 检验单来源  	1采购收货	2外协收获	3外协原材料退货	4委托加工收货	5销售退货	6生产
}

// 检验单 API
export const InspectionSheetGenerateTaskApi = {
  // 查询检验单分页
  getInspectionSheetGenerateTaskPage: async (params: any) => {
    return await request.get({ url: `/qms/inspection-sheet-generate-task/page`, params })
  },

  // 查询检验单详情
  getInspectionSheetGenerateTask: async (id: number) => {
    return await request.get({ url: `/qms/inspection-sheet-generate-task/get?id=` + id })
  },

  // 新增检验单
  createInspectionSheetGenerateTask: async (data: InspectionSheetGenerateTaskVO) => {
    return await request.post({ url: `/qms/inspection-sheet-generate-task/create`, data })
  },

  // 修改检验单
  updateInspectionSheetGenerateTask: async (data: InspectionSheetGenerateTaskVO) => {
    return await request.put({ url: `/qms/inspection-sheet-generate-task/update`, data })
  },

  // 删除检验单
  deleteInspectionSheetGenerateTask: async (id: number) => {
    return await request.delete({ url: `/qms/inspection-sheet-generate-task/delete?id=` + id })
  },

  // 导出检验单 Excel
  exportInspectionSheetGenerateTask: async (params) => {
    return await request.download({ url: `/qms/inspection-sheet-generate-task/export-excel`, params })
  },
}
