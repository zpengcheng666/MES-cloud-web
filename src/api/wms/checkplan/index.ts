import request from '@/config/axios'

// 库存盘点计划 VO
export interface CheckPlanVO {
  id: string // ID
  checkAreaId: string // 盘点库区id
  checkName: string // 盘点名称
  materialConfigIds: string // 物料类型ids
  startTime: Date // 开始时间
  endTime: Date // 结束时间
  cutOffTime: Date // 截止时间
  checkUserId: string // 负责人
  checkStatus: number // 盘点状态
  checkLocked: boolean // 是否锁盘
}

// 库存盘点计划 API
export const CheckPlanApi = {
  // 查询库存盘点计划分页
  getCheckPlanPage: async (params: any) => {
    return await request.get({ url: `/wms/check-plan/page`, params })
  },

    // 查询库存盘点计划分页
    getCheckTaskPage: async (params: any) => {
      return await request.get({ url: `/wms/check-plan/taskPage`, params })
    },

  // 查询库存盘点计划详情
  getCheckPlan: async (id: number) => {
    return await request.get({ url: `/wms/check-plan/get?id=` + id })
  },

  // 新增库存盘点计划
  createCheckPlan: async (data: CheckPlanVO) => {
    return await request.post({ url: `/wms/check-plan/create`, data })
  },

  // 修改库存盘点计划
  updateCheckPlan: async (data: CheckPlanVO) => {
    return await request.put({ url: `/wms/check-plan/update`, data })
  },

  // 删除库存盘点计划
  deleteCheckPlan: async (id: number) => {
    return await request.delete({ url: `/wms/check-plan/delete?id=` + id })
  },

  // 导出库存盘点计划 Excel
  exportCheckPlan: async (params) => {
    return await request.download({ url: `/wms/check-plan/export-excel`, params })
  },
}
