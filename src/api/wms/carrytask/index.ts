import request from '@/config/axios'

// 搬运任务 VO
export interface CarryTaskVO {
  id: string // ID
  taskCode: string // 任务编码
  taskStatus: number // 任务状态(未开始、进行中、已完成、已取消)
  taskType: number // 任务类型(入库搬运、出库搬运、库存移交、呼叫托盘)
  taskContent: string // 任务内容
  taskDescription: string // 任务描述
  agvId: string // AGV ID
  orderIds: string // 库存单集合
}

// 搬运任务 API
export const CarryTaskApi = {
  // 查询搬运任务分页
  getCarryTaskPage: async (params: any) => {
    return await request.get({ url: `/wms/carry-task/page`, params })
  },

  // 查询搬运任务详情
  getCarryTask: async (id: number) => {
    return await request.get({ url: `/wms/carry-task/get?id=` + id })
  },

  // 新增搬运任务
  createCarryTask: async (data: CarryTaskVO) => {
    return await request.post({ url: `/wms/carry-task/create`, data })
  },

  // 修改搬运任务
  updateCarryTask: async (data: CarryTaskVO) => {
    return await request.put({ url: `/wms/carry-task/update`, data })
  },

  // 删除搬运任务
  deleteCarryTask: async (id: number) => {
    return await request.delete({ url: `/wms/carry-task/delete?id=` + id })
  },

  // 导出搬运任务 Excel
  exportCarryTask: async (params) => {
    return await request.download({ url: `/wms/carry-task/export-excel`, params })
  },

// ==================== 子表（搬运任务子表） ====================

  // 获得搬运任务子表列表
  getCarrySubTaskListByParentId: async (parentId) => {
    return await request.get({ url: `/wms/carry-task/carry-sub-task/list-by-parent-id?parentId=` + parentId })
  },

  dispatchCarryTask: async (id: number) => {
    return await request.post({ url: `/wms/carry-task/dispatch-carry-task?carryTaskId=` + id })
  },

  endCarryTask: async (id: number) => {
    return await request.post({ url: `/wms/carry-task/end-carry-task?carrySubTaskId=` + id })
  },

}
