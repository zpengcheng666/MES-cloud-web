import request from '@/config/axios'

// 生产订单详情 VO
export interface OrderDetailVO {
}

// 生产订单详情 API
export const OrderDetailApi = {
  // 查询生产订单详情分页
  getOrderDetailPage: async (params: any) => {
    return await request.get({ url: `/mcs/order-detail/page`, params })
  },

  getOrderDetailList: async (orderId: number) => {
    return await request.get({ url: `/mcs/batch-record/getOrderDetailList?orderId=` + orderId })
  },

  getScrapPartsList: async (orderId: number) => {
    return await request.get({ url: `/mcs/order-form/getScrapPartsListForNew?orderId=` + orderId })
  },

  saveNewBatchForScrap: async (data: any[]) => {
    return await request.post({ url: `/mcs/order-form/saveNewBatchForScrap`, data })
  },

  // 查询生产订单详情详情
  getOrderDetail: async (id: number) => {
    return await request.get({ url: `/mcs/order-detail/get?id=` + id })
  },

  // 新增生产订单详情
  createOrderDetail: async (data: OrderDetailVO) => {
    return await request.post({ url: `/mcs/order-detail/create`, data })
  },

  // 修改生产订单详情
  updateOrderDetail: async (data: OrderDetailVO) => {
    return await request.put({ url: `/mcs/order-detail/update`, data })
  },

  // 删除生产订单详情
  deleteOrderDetail: async (id: number) => {
    return await request.delete({ url: `/mcs/order-detail/delete?id=` + id })
  },

  // 导出生产订单详情 Excel
  exportOrderDetail: async (params) => {
    return await request.download({ url: `/mcs/order-detail/export-excel`, params })
  },
}
