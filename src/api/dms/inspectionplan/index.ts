import request from '@/config/axios'

// 设备检查计划 VO
export interface InspectionPlanVO {
  id: string // id
  code: string // 计划编码
  tree: string // 所属计划关联树
  device: string // 设备
  enableStatus: number // 启用状态
  type: number // 检查类型
  startTime: Date // 开始时间
  cornExpression: string // cron表达式
  content: string // 检查内容
  remark: string // 说明
}

// 设备检查计划 API
export const InspectionPlanApi = {
  // 查询设备检查计划分页
  getInspectionPlanPage: async (params: any) => {
    return await request.get({ url: `/dms/inspection-plan/page`, params })
  },

  // 查询设备检查计划详情
  getInspectionPlan: async (id: number) => {
    return await request.get({ url: `/dms/inspection-plan/get?id=` + id })
  },

  // 新增设备检查计划
  createInspectionPlan: async (data: InspectionPlanVO) => {
    return await request.post({ url: `/dms/inspection-plan/create`, data })
  },

  // 修改设备检查计划
  updateInspectionPlan: async (data: InspectionPlanVO) => {
    return await request.put({ url: `/dms/inspection-plan/update`, data })
  },

  // 删除设备检查计划
  deleteInspectionPlan: async (id: number) => {
    return await request.delete({ url: `/dms/inspection-plan/delete?id=` + id })
  },

  // 导出设备检查计划 Excel
  exportInspectionPlan: async (params) => {
    return await request.download({ url: `/dms/inspection-plan/export-excel`, params })
  },

  // 查询设备检查计划详情
  hasInspectionPlanTree: async (id: number) => {
    return await request.get({ url: `/dms/inspection-plan/hasTree?id=` + id })
  },

  // 获得设备检查计划列表
  getInspectionPlanList: async () => {
    return await request.get({ url: `/dms/inspection-plan/getList` })
  },

  // 提醒设备检查计划
  reminderInspectionPlan: async (id) => {
    return await request.get({ url: `/dms/inspection-plan/reminder?id=` + id })
  }
}
