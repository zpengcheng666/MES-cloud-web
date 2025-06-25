import request from '@/config/axios'

// pms 立项表,项目立项相关 API
export const DeliveryApi = {
  // 获得销售发货单
  getShippingDetailByProjectId: async (projectIds) => {
    return await request.get({ url: `/pms/delivery/getShippingDetailByProjectId?projectIds=` + projectIds })
  },
  // 获得销售退货单
  getShippingReturnDetailByProjectId: async (projectId) => {
    return await request.get({ url: `/pms/delivery/getShippingReturnDetailByProjectId?projectId=` + projectId })
  },

  // 获得采购发货单
  getPurchaseConsignmentByProjectId: async (projectIds) => {
    return await request.get({ url: `/pms/delivery/getPurchaseConsignmentByProjectId?projectIds=` + projectIds })
  },

  // 获得采购退货单
  getConsignmentReturnByProjectId: async (projectId) => {
    return await request.get({ url: `/pms/delivery/getConsignmentReturnByProjectId?projectId=` + projectId })
  },

  // 获得销售发货数量(退货的也有),最新版
  getShippingOrderByProjectId: async (projectIds) => {
    return await request.get({ url: `/pms/delivery/getShippingOrderByProjectId?projectIds=` + projectIds })
  },

  // 获得发货详情(采购退货也能用)
  getShippingDetailByProjectOrderId: async (id) => {
    return await request.get({ url: `/ppm/shipping-detail/getShippingDetailByProjectOrderId?id=` + id })
  },
  // 获得采购详情(发货退货能用)
  getPurchaseDetailByProjectOrderId: async (id) => {
    return await request.get({ url: `/ppm/purchase-consignment-detail/getPurchaseDetailByProjectOrderId?id=` + id })
  },

  // 获得采购收货
  getPurchaseByProjectId: async (projectIds) => {
    return await request.get({ url: `/pms/delivery/getPurchaseByProjectId?projectIds=` + projectIds })
  },

  // 根据采购计划,获得收货详情
  getPurchaseDetailByPurchaseId: async (id) => {
    return await request.get({ url: `/ppm/purchase-consignment-detail/getPurchaseDetailByPurchaseId?id=` + id })
  },
  // 根据采购计划,获得收货退货详情
  getShippingDetailByPurchaseId: async (id) => {
    return await request.get({ url: `/ppm/shipping-detail/getShippingDetailByPurchaseId?id=` + id })
  },
}
