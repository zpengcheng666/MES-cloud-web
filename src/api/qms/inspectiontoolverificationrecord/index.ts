import request from '@/config/axios'

// 检验工具校准记录 VO
export interface InspectionToolVerificationRecordVO {
  id: string // 主键
  stockId: string // 库存主键
  toolId: string // 工具主键
  verificationDateBegin: Date // 送检时间
  verificationDateEnd: Date // 完成时间
  status: number // 状态
}

// 检验工具校准记录 API
export const InspectionToolVerificationRecordApi = {
  // 查询检验工具校准记录分页
  getInspectionToolVerificationRecordPage: async (params: any) => {
    return await request.get({ url: `/qms/inspection-tool-verification-record/page`, params })
  },

  // 查询检验工具校准记录详情
  getInspectionToolVerificationRecord: async (id: number) => {
    return await request.get({ url: `/qms/inspection-tool-verification-record/get?id=` + id })
  },

  // 新增检验工具校准记录
  createInspectionToolVerificationRecord: async (data: InspectionToolVerificationRecordVO) => {
    return await request.post({ url: `/qms/inspection-tool-verification-record/create`, data })
  },

  // 修改检验工具校准记录
  updateInspectionToolVerificationRecord: async (data: InspectionToolVerificationRecordVO) => {
    return await request.put({ url: `/qms/inspection-tool-verification-record/update`, data })
  },

  // 删除检验工具校准记录
  deleteInspectionToolVerificationRecord: async (id: number) => {
    return await request.delete({ url: `/qms/inspection-tool-verification-record/delete?id=` + id })
  },

  // 导出检验工具校准记录 Excel
  exportInspectionToolVerificationRecord: async (params) => {
    return await request.download({ url: `/qms/inspection-tool-verification-record/export-excel`, params })
  },
}
