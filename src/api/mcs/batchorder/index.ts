import request from '@/config/axios'

// 批次级订单 VO
export interface BatchOrderVO {
  orderNumber: string // 订单编号
  processingUnitId: string // 生产单元Id
  processingUnitName: string // 生产单元名称
  count: number // 数量
  qualityNumbers: string // 质量编号
  planStartTime: Date // 预计开始时间
  planEndTime: Date // 截止日期
  startTime: Date // 开始时间
  endTime: Date // 结束时间
  procesStatus: number // 结束时间
}

// 批次级订单 API
export const BatchOrderApi = {
  // 查询批次级订单分页
  getBatchOrderPage: async (orderId: String) => {
    return await request.get({ url: `/mcs/batch-order/listByOrderId?orderId=` + orderId })
  },

  getBatchOrder: async (id: String) => {
    return await request.get({ url: `/mcs/batch-order/get?id=` + id })
  },

  splitOrderCount: async (data) => {
    return await request.post({ url: `/mcs/batch-order/splitOrder`, data })
  },

  updateBatchOrder: async (data) => {
    return await request.put({ url: `/mcs/batch-order/update`, data })
  },

  batchSuspend: async (id) => {
    return await request.post({ url: `/mcs/batch-order/batchSuspend?id=` + id })
  },

  batchContinue: async (id) => {
    return await request.post({ url: `/mcs/batch-order/batchContinue?id=` + id })
  },

  batchIssuance: async (id) => {
    return await request.post({ url: `/mcs/batch-order/batchIssuance?batchId=` + id })
  },

  splitRevoke: async (id) => {
    return await request.post({ url: `/mcs/batch-order/splitRevoke?id=` + id })
  },

}
