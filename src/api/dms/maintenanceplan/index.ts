import request from '@/config/axios'

// 设备保养维护计划 VO
export interface MaintenancePlanVO {
  id: string // id
  model: string // 设备型号
  code: string // 设备编码
  processingUnitNumber: string // 生产单元编号
  type: number // 维护类型
  startTime: Date // 开始时间
  cornExpression: string // cron表达式
  content: string // 维护内容
  remark: string // 说明
  lastStatus: number // 上一次完成状态
  superintendent: string // 负责人
}

// 设备保养维护计划 API
export const MaintenancePlanApi = {
  // 查询设备保养维护计划分页
  getMaintenancePlanPage: async (params: any) => {
    return await request.get({ url: `/dms/maintenance-plan/page`, params })
  },

  // 查询设备保养维护计划详情
  getMaintenancePlan: async (id: number) => {
    return await request.get({ url: `/dms/maintenance-plan/get?id=` + id })
  },

  // 新增设备保养维护计划
  createMaintenancePlan: async (data: MaintenancePlanVO) => {
    return await request.post({ url: `/dms/maintenance-plan/create`, data })
  },

  // 修改设备保养维护计划
  updateMaintenancePlan: async (data: MaintenancePlanVO) => {
    return await request.put({ url: `/dms/maintenance-plan/update`, data })
  },

  // 删除设备保养维护计划
  deleteMaintenancePlan: async (id: number) => {
    return await request.delete({ url: `/dms/maintenance-plan/delete?id=` + id })
  },

  // 导出设备保养维护计划 Excel
  exportMaintenancePlan: async (params) => {
    return await request.download({ url: `/dms/maintenance-plan/export-excel`, params })
  },

  // 查询是否存在关联树的计划
  getMaintenancePlanTree: async (id: number) => {
    return await request.get({ url: `/dms/maintenance-plan/getTree?id=` + id })
  },

  // 获得保养维护计划列表
  getMaintenancePlanList: async () => {
    return await request.get({ url: `/dms/maintenance-plan/getList` })
  },

  // 执行设备保养维护计划
  remindMaintenancePlan: async (id: string) => {
    return await request.post({ url: `/dms/maintenance-plan/remind`, data: { id } })
  }
}
