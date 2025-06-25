import request from '@/config/axios'

// 检验单生成任务明细 VO
export interface InspectionSheetGenerateTaskDetailVO {
  id: string // 主键
  taskId: string // 检验单任务ID
  materialId: string // 物料ID
  materialConfigId: string // 物料类型ID
  barCode: string // 物料条码
  batchNumber: string // 物料批次号
  status: number // 状态 0 未生成 1 已生成
}

// 检验单生成任务明细 API
export const InspectionSheetGenerateTaskDetailApi = {
  // 查询检验单生成任务明细分页
  getInspectionSheetGenerateTaskDetailPage: async (params: any) => {
    return await request.get({ url: `/qms/inspection-sheet-generate-task-detail/page`, params })
  },

  // 查询检验单生成任务明细详情
  getInspectionSheetGenerateTaskDetail: async (id: number) => {
    return await request.get({ url: `/qms/inspection-sheet-generate-task-detail/get?id=` + id })
  },

  // 新增检验单生成任务明细
  createInspectionSheetGenerateTaskDetail: async (data: InspectionSheetGenerateTaskDetailVO) => {
    return await request.post({ url: `/qms/inspection-sheet-generate-task-detail/create`, data })
  },

  // 修改检验单生成任务明细
  updateInspectionSheetGenerateTaskDetail: async (data: InspectionSheetGenerateTaskDetailVO) => {
    return await request.put({ url: `/qms/inspection-sheet-generate-task-detail/update`, data })
  },

  // 删除检验单生成任务明细
  deleteInspectionSheetGenerateTaskDetail: async (id: number) => {
    return await request.delete({ url: `/qms/inspection-sheet-generate-task-detail/delete?id=` + id })
  },

  // 导出检验单生成任务明细 Excel
  exportInspectionSheetGenerateTaskDetail: async (params) => {
    return await request.download({ url: `/qms/inspection-sheet-generate-task-detail/export-excel`, params })
  },
}
