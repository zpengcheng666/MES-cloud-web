import request from '@/config/axios'

// 设备维修申请 VO
export interface MaintainApplicationVO {
  id: string // id
  model: string // 设备型号
  code: string // 设备编码
  name: string // 设备名称
  important: boolean // 关键设备
  processingUnitNumber: string // 生产单元编号
  type: number // 维修类型
  describe: string // 故障信息描述
  duration: number // 期望修复时间
  status: number // 申请状态
  applicant: string // 申请人
  applicationTime: Date // 申请时间
}

// 设备维修申请 API
export const MaintainApplicationApi = {
  // 查询设备维修申请分页
  getMaintainApplicationPage: async (params: any) => {
    return await request.get({ url: `/dms/maintain-application/page`, params })
  },

  // 查询设备维修申请详情
  getMaintainApplication: async (id: number) => {
    return await request.get({ url: `/dms/maintain-application/get?id=` + id })
  },

  // 新增设备维修申请
  createMaintainApplication: async (data: MaintainApplicationVO) => {
    return await request.post({ url: `/dms/maintain-application/create`, data })
  },

  // 修改设备维修申请
  updateMaintainApplication: async (data: MaintainApplicationVO) => {
    return await request.put({ url: `/dms/maintain-application/update`, data })
  },

  // 删除设备维修申请
  deleteMaintainApplication: async (id: number) => {
    return await request.delete({ url: `/dms/maintain-application/delete?id=` + id })
  },

  // 导出设备维修申请 Excel
  exportMaintainApplication: async (params) => {
    return await request.download({ url: `/dms/maintain-application/export-excel`, params })
  },
}