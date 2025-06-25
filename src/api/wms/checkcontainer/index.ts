import request from '@/config/axios'

// 库存盘点容器 VO
export interface CheckContainerVO {
  id: string // ID
  checkPlanId: string // 盘点计划id
  containerStockId: string // 容器库存id
  checkStatus: number // 盘点状态
}

// 库存盘点容器 API
export const CheckContainerApi = {
  // 查询库存盘点容器分页
  getCheckContainerPage: async (params: any) => {
    return await request.get({ url: `/wms/check-container/page`, params })
  },

  // 查询库存盘点容器详情
  getCheckContainer: async (id: number) => {
    return await request.get({ url: `/wms/check-container/get?id=` + id })
  },

  // 新增库存盘点容器
  createCheckContainer: async (data: CheckContainerVO) => {
    return await request.post({ url: `/wms/check-container/create`, data })
  },

  // 修改库存盘点容器
  updateCheckContainer: async (data: CheckContainerVO) => {
    return await request.put({ url: `/wms/check-container/update`, data })
  },

  // 删除库存盘点容器
  deleteCheckContainer: async (id: number) => {
    return await request.delete({ url: `/wms/check-container/delete?id=` + id })
  },

  // 导出库存盘点容器 Excel
  exportCheckContainer: async (params) => {
    return await request.download({ url: `/wms/check-container/export-excel`, params })
  },
}
