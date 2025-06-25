import request from '@/config/axios'

// 项目订单 VO
export interface OrderVO {
  id: string // 订单id
  projectId: string // 项目编号
  contractId: string // 合同id
  // orderId: string // 销售订单编号
  // orderCode: string // 订单编码(用于指挥生产的订单编码)
}

// 项目订单 API
export const OrderApi = {
  // 查询项目订单分页
  getOrderPage: async (params: any) => {
    return await request.get({ url: `/pms/order/page`, params })
  },

  // 查询项目订单详情
  getOrder: async (id: number) => {
    return await request.get({ url: `/pms/order/get?id=` + id })
  },
  // 查询项目订单详情
  getOrderById: async (id) => {
    return await request.get({ url: `/pms/order/getById?id=` + id })
  },

  // 新增项目订单
  createOrder: async (data: OrderVO) => {
    return await request.post({ url: `/pms/order/create`, data })
  },

  // 修改项目订单
  updateOrder: async (data: OrderVO) => {
    return await request.put({ url: `/pms/order/update`, data })
  },

  // 修改项目订单,仅针对物料牌号
  updateOutOrder: async (data: OrderVO) => {
    return await request.put({ url: `/pms/order/updateOutOrder`, data })
  },

  // 删除项目订单
  deleteOrder: async (id: number) => {
    return await request.delete({ url: `/pms/order/delete?id=` + id })
  },

  // 导出项目订单 Excel
  exportOrder: async (params) => {
    return await request.download({ url: `/pms/order/export-excel`, params })
  },

  // 查询所有项目
  getAll: async (id: number) => {
    return await request.get({ url: `/pms/order/all` })
  },
  // 查询项目订单详情
  getMaterialByTypeCode: async (typeCode) => {
    return await request.get({ url: `/pms/order/listMaterialByTypeCode?typeCode=`+ typeCode })
  },
  // 查询项目订单详情
  getOrderByProjectId: async (projectId) => {
    return await request.get({ url: `/pms/order/getOrderByProjectId?projectId=` + projectId })
  },

// ==================== 子表（项目订单表子） ====================

  // 获得项目订单表子分页
  getOrderListPage: async (params) => {
    return await request.get({ url: `/pms/order/order-list/page`, params })
  },
  // 新增项目订单表子
  createOrderList: async (data) => {
    return await request.post({ url: `/pms/order/order-list/create`, data })
  },

  // 修改项目订单表子
  updateOrderList: async (data) => {
    return await request.put({ url: `/pms/order/order-list/update`, data })
  },

  // 删除项目订单表子
  deleteOrderList: async (id: number) => {
    return await request.delete({ url: `/pms/order/order-list/delete?id=` + id })
  },

  // 获得项目订单表子
  getOrderList: async (id: number) => {
    return await request.get({ url: `/pms/order/order-list/get?id=` + id })
  },

  // 获得项目订单表子列表
  getOrderListByProjectOrderId: async (projectOrderId) => {
    return await request.get({ url: `/pms/order/order-list/list-by-project-order-id?projectOrderId=` + projectOrderId })
  },

  //根据项目状态查询项目
  unbind:async (id)=> {
    return await request.post({url: `/pms/order/unbind?id=` + id})
  },
}
