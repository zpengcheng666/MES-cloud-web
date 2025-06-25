import request from '@/config/axios'

// 设备检查记录 VO
export interface InspectionRecordVO {
  id: string // id
  code: string // 计划编码
  device: string // 设备
  type: number // 检查类型
  remark: string // 备注
  content: string // 检查内容
  createBy: string // 检查人
  startTime: Date // 开始时间
  endTime: Date // 结束时间
}

// 设备检查记录 API
export const InspectionRecordApi = {
  // 查询设备检查记录分页
  getInspectionRecordPage: async (params: any) => {
    return await request.get({ url: `/dms/inspection-record/page`, params })
  },

  // 查询设备检查记录详情
  getInspectionRecord: async (id: number) => {
    return await request.get({ url: `/dms/inspection-record/get?id=` + id })
  },

  // 新增设备检查记录
  createInspectionRecord: async (data: InspectionRecordVO) => {
    return await request.post({ url: `/dms/inspection-record/create`, data })
  },

  // 修改设备检查记录
  updateInspectionRecord: async (data: InspectionRecordVO) => {
    return await request.put({ url: `/dms/inspection-record/update`, data })
  },

  // 删除设备检查记录
  deleteInspectionRecord: async (id: number) => {
    return await request.delete({ url: `/dms/inspection-record/delete?id=` + id })
  },

  // 导出设备检查记录 Excel
  exportInspectionRecord: async (params) => {
    return await request.download({ url: `/dms/inspection-record/export-excel`, params })
  },

  // 添加设备检查记录
  addInspectionRecord: async (data: any) => {
    return await request.post({ url: `/dms/inspection-record/add`, data })
  }
}
