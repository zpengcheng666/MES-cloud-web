import request from '@/config/axios'

// 刀具装配任务 VO
export interface AssembleTaskVO {
  id: string // ID
  orderNumber: string // 工单号
  needCount: number // 需求数量
  targetLocation: string // 目标位置
  distributionDeadline: Date // 配送截止时间
  materialConfigId: string // 物料类型id
  minimumTime: number // 最短加工时长
  status: number // 状态（启用、作废）
}

// 刀具装配任务 API
export const AssembleTaskApi = {
  // 查询刀具装配任务分页
  getAssembleTaskPage: async (params: any) => {
    return await request.get({ url: `/tms/assemble-task/page`, params })
  },

  // 查询刀具装配任务详情
  getAssembleTask: async (id: number) => {
    return await request.get({ url: `/tms/assemble-task/get?id=` + id })
  },

  // 查询刀具装配任务详情
  getAssembleTaskByOrderNumber: async (orderNumbers: Array<string>) => {
    return await request.get({ url: `/tms/assemble-task/getListByOrderNumbers?orderNumbers=` + orderNumbers })
  },

  // 新增刀具装配任务
  createAssembleTask: async (data: AssembleTaskVO) => {
    return await request.post({ url: `/tms/assemble-task/create`, data })
  },

  // 修改刀具装配任务
  updateAssembleTask: async (data: AssembleTaskVO) => {
    return await request.put({ url: `/tms/assemble-task/update`, data })
  },

  // 删除刀具装配任务
  deleteAssembleTask: async (id: number) => {
    return await request.delete({ url: `/tms/assemble-task/delete?id=` + id })
  },

  // 导出刀具装配任务 Excel
  exportAssembleTask: async (params) => {
    return await request.download({ url: `/tms/assemble-task/export-excel`, params })
  },

// ==================== 子表（刀具装配记录） ====================

  // 获得刀具装配记录列表
  getAssembleRecordPage: async (params: any) => {
    return await request.get({ url: `/tms/assemble-task/assemble-record/page`, params })
  },

  // 获得刀具装配记录列表
  getAssembleRecordListByAssembleTaskId: async (assembleTaskId) => {
    return await request.get({ url: `/tms/assemble-task/assemble-record/list-by-assemble-task-id?assembleTaskId=` + assembleTaskId })
  },

  //====================刀具需求表================================
  // 查询刀具装配任务分页
  getToolNeedTaskPage: async (params: any) => {
    return await request.get({ url: `/mcs/batch-order-demand/getCuttingToolDemandPage`, params })
  },
  //====================刀具需求表================================
  // 查询刀具装配任务分页
  updateCuttingToolDemand: async (data: any) => {
    return await request.post({ url: `/mcs/batch-order-demand/updateCuttingToolDemand`, data })
  },
}
