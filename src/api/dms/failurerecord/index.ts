import request from '@/config/axios'

// 异常记录 VO
export interface FailureRecordVO {
  id: string // id
  model: string // 设备型号
  code: string // 设备编码
  description: string // 故障描述
  cause: string // 故障原因
  faultTime: Date // 故障时间
  maintenanceBy: string // 维修人员
  repairTime: Date // 修复时间
  remarks: string // 备注
}

// 异常记录 API
export const FailureRecordApi = {
  // 查询异常记录分页
  getFailureRecordPage: async (params: any) => {
    return await request.get({ url: `/dms/failure-record/page`, params })
  },

  // 查询异常记录详情
  getFailureRecord: async (id: number) => {
    return await request.get({ url: `/dms/failure-record/get?id=` + id })
  },

  // 新增异常记录
  createFailureRecord: async (data: FailureRecordVO) => {
    return await request.post({ url: `/dms/failure-record/create`, data })
  },

  // 修改异常记录
  updateFailureRecord: async (data: FailureRecordVO) => {
    return await request.put({ url: `/dms/failure-record/update`, data })
  },

  // 删除异常记录
  deleteFailureRecord: async (id: number) => {
    return await request.delete({ url: `/dms/failure-record/delete?id=` + id })
  },

  // 导出异常记录 Excel
  exportFailureRecord: async (params) => {
    return await request.download({ url: `/dms/failure-record/export-excel`, params })
  },

  // 获取异常记录列表
  getFailureRecordList: async (id) => {
    return await request.get({ url: `/dms/failure-record/getList?id=` + id })
  }
}
