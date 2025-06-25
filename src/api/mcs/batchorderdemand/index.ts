import request from '@/config/axios'

// 批次订单需求 VO
export interface BatchOrderDemandVO {
  orderNumber: string // 订单编号
  batchCode: string // 批次订单编码
  resourceType: number // 资源类型
  resourceCode: string // 资源编码
  total: number // 需求数量
  minimum: number // 最小需求数量
  status: number // 齐备情况
  confirmedBy: string // 确认人
  confirmedTime: Date // 确认时间
  processingUnitId: undefined, // 生产单元
  deviceId: undefined, // 设备
}

// 批次订单需求 API
export const BatchOrderDemandApi = {
  // 查询订单需求分页
  getBatchOrderDemandPage: async (params: any) => {
    return await request.get({ url: `/mcs/batch-order-demand/page`, params })
  },
  // 查询批次订单需求分页
  getBatchOrderDemandRecordPage: async (params: any) => {
    return await request.get({ url: `/mcs/batch-demand-record/page`, params })
  },

  // 查询批次订单需求详情
  getBatchOrderDemand: async (id: number) => {
    return await request.get({ url: `/mcs/batch-order-demand/get?id=` + id })
  },

  getListByOrderId: async (params) => {
    return await request.get({ url: `/mcs/batch-order-demand/getListByOrderId`, params })
  },

  // 新增批次订单需求
  createBatchOrderDemand: async (data: BatchOrderDemandVO) => {
    return await request.post({ url: `/mcs/batch-order-demand/create`, data })
  },

  //新增附加订单需求
  createBatchOrderExtraDemand: async (data: BatchOrderDemandVO) => {
    return await request.post({ url: `/mcs/batch-order-demand/createExtraDemand`, data })
  },

  // 修改批次订单需求
  updateBatchOrderDemand: async (data: BatchOrderDemandVO) => {
    return await request.put({ url: `/mcs/batch-order-demand/update`, data })
  },
  updateBatchOrderComplete: async (data: BatchOrderDemandVO) => {
    return await request.put({ url: `/mcs/batch-order-demand/completeConfirmation`, data })
  },

  // 删除批次订单需求
  deleteBatchOrderDemand: async (id: number) => {
    return await request.delete({ url: `/mcs/batch-order-demand/delete?id=` + id })
  },

  demandRecordRevoke: async (id: string) => {
    return await request.post({ url: `/mcs/batch-demand-record/demandRecordRevoke?id=` + id })
  },

  // 导出批次订单需求 Excel
  exportBatchOrderDemand: async (params) => {
    return await request.download({ url: `/mcs/batch-order-demand/export-excel`, params })
  },

  getOrderList: async (params?: any) => {
    return await request.get({ url: `/mcs/order-form/list1`, params})
  },

  getBatchList: async (params?: any) => {
    return await request.get({ url: `/mcs/batch-order/list`, params})
  },

  getBatchRecordList: async (params?: any) => {
    return await request.get({ url: `/mcs/batch-record/list`, params})
  },

  getUnitList: async (params?: any) => {
    return await request.get({ url: `/mcs/batch-order-demand/getUnitList`, params })
  },

  getMaterialsByConfigIds: async (id: string) => {
    return await request.get({ url: `/mcs/batch-order-demand/getMaterialsByConfigIds?materialConfigId=` + id })
  },

  getToolMaterialsByConfigIds: async (params) => {
    return await request.get({ url: `/mcs/batch-order-demand/getToolMaterialsByConfigIds`, params })
  },
  getCuttingMaterialsByConfigIds: async (params) => {
    return await request.get({ url: `/mcs/batch-order-demand/getCuttingMaterialsByConfigIds`, params })
  },

  getMaterialsByConfigIds1: async (id: string) => {
    return await request.get({ url: `/mcs/batch-order-demand/getMaterialsByConfigIds1?materialConfigId=` + id })
  },

  getSelectedMaterialIdByDemandId: async (id: string) => {
    return await request.get({ url: `/mcs/batch-demand-record/getSelectedMaterialIdByDemandId?demandId=` + id })
  },

  resourceSortingSave: async (data: any) => {
    return await request.post({ url: `/mcs/batch-order-demand/resourceSortingSave`, data })
  },

  demandCompleteConfirm: async (id: string) => {
    return await request.post({ url: `/mcs/batch-order-demand/completeConfirmation?id=` + id })
  },

  listByDemandId: async  (id: number) => {
    return await request.get({ url: `/mcs/batch-demand-record/listByDemandId?demandId=` + id })
  },
}
