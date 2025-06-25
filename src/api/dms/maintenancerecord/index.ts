import request from '@/config/axios'

// 设备保养维护记录 VO
export interface MaintenanceRecordVO {
  id: string // id
  code: string // 计划编码
  device: string // 设备编码
  criticalDevice: number // 是否为关键设备
  type: number // 保养类型
  status: number // 完成状态
  remarks: string // 备注
  content: string // 保养内容
  maintenanceBy: string // 保养人
  startTime: Date // 开始维护时间
  endTime: Date // 结束维护时间
}

// 设备保养维护记录 API
export const MaintenanceRecordApi = {
  // 查询设备保养维护记录分页
  getMaintenanceRecordPage: async (params: any) => {
    return await request.get({ url: `/dms/maintenance-record/page`, params })
  },

  // 查询设备保养维护记录详情
  getMaintenanceRecord: async (id: number) => {
    return await request.get({ url: `/dms/maintenance-record/get?id=` + id })
  },

  // 新增设备保养维护记录
  createMaintenanceRecord: async (data: MaintenanceRecordVO) => {
    return await request.post({ url: `/dms/maintenance-record/create`, data })
  },

  // 修改设备保养维护记录
  updateMaintenanceRecord: async (data: MaintenanceRecordVO) => {
    return await request.put({ url: `/dms/maintenance-record/update`, data })
  },

  // 删除设备保养维护记录
  deleteMaintenanceRecord: async (id: number) => {
    return await request.delete({ url: `/dms/maintenance-record/delete?id=` + id })
  },

  // 导出设备保养维护记录 Excel
  exportMaintenanceRecord: async (params) => {
    return await request.download({ url: `/dms/maintenance-record/export-excel`, params })
  },

  //填写保养维护记录
  addMaintenanceRecord: async (data: any) => {
    return await request.post({ url: `/dms/maintenance-record/add`, data })
  },

  /*****************************************************************************************************/
  /********                                  使用备件                                          **********/
  /*****************************************************************************************************/

  //根据保养维护记录获得使用备件
  getSparePartByRecordId: async (recordId: number) => {
    return await request.get({
      url: `/dms/maintenance-record/SparePart/getByRecordId?recordId=` + recordId
    })
  },

  //根据备件获得使用记录
  getSparePartByPartId: async (partId: number) => {
    return await request.get({
      url: `/dms/maintenance-record/SparePart/getByPartId?partId=` + partId
    })
  }
}
