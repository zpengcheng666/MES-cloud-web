import request from '@/config/axios'
import {params} from "postcss-html";

// 生产订单 VO
export interface OrderFormVO {
  projectNumber: string // 项目编号
  orderNumber: string // 订单编号
  productNumber: string // 产品名称
  orderType: number // 订单类型
  priority: number // 优先级
  count: number // 数量
  receptionTime: Date // 接收时间
  deliveryTime: Date // 交付时间
  responsiblePerson: string // 负责人
}

// 生产订单 API
export const OrderFormApi = {
  // 查询生产订单分页
  getOrderFormPage: async (params: any) => {
    return await request.get({ url: `/mcs/order-form/page`, params })
  },

  getListByProjectPlanId: async (params: any) => {
    return await request.get({ url: `/mcs/order-form/getListByProjectPlanId`, params })
  },

  getListByIds: async (params: any) => {
    return await request.get({ url: `/mcs/order-form/listByIds`, params })
  },

  getDeviceByOrderId: async (params: any) => {
    return await request.get({ url: `/mcs/batch-record/getDeviceByOrderId`, params })
  },

  // 查询生产订单详情
  getOrderForm: async (id: number) => {
    return await request.get({ url: `/mcs/order-form/get?id=` + id })
  },

  // 新增生产订单
  createOrderForm: async (data: OrderFormVO) => {
    return await request.post({ url: `/mcs/order-form/create`, data })
  },

  // 修改生产订单
  updateOrderForm: async (data: OrderFormVO) => {
    return await request.put({ url: `/mcs/order-form/update`, data })
  },

  // 删除生产订单
  deleteOrderForm: async (id: number) => {
    return await request.delete({ url: `/mcs/order-form/delete?id=` + id })
  },

  // 订单提交
  orderSubmit: async (id: number) => {
    return await request.post({ url: `/mcs/order-form/orderSubmit?id=` + id })
  },

  orderIssued: async (id: number) => {
    return await request.post({ url: `/mcs/order-form/orderIssued?id=` + id })
  },

  // 导出生产订单 Excel
  exportOrderForm: async (params) => {
    return await request.download({ url: `/mcs/order-form/export-excel`, params })
  },

  // 查询临时项目列表
  getProjectList: async () => {
    return await request.get({ url: '/pms/approval/all' })
  },

  //获取当前零件目录列表
  getPartListByProcessPlanDetailId: async (projectId:string) => {
    return await request.get({ url: `/pms/order/getOrderByProjectId?projectId=`+projectId})
  },

  getProcessPlanDetail: async (params: any) => {
    return await request.get({ url: `/pdm/process-plan-detail/getProjPartBomTreeList`, params})
  },

  generateDemandByOrderIds: async (data: any) => {
    return await request.post({ url: `/mcs/order-form/generateDemandByOrderIds`, data })
  },

  getProcessByOrderId: async (id: any) => {
    return await request.get({ url: `/mcs/order-form/getProcessByOrderId?id=` + id})
  },

  getLedgersByOrderAndProcess: async (params: any) => {
    return await request.get({ url: `/mcs/order-form/getLedgersByOrderAndProcess`, params})
  },

  getResourceDemandByOrderId: async (params: any) => {
    return await request.get({ url: `/mcs/order-form/getResourceDemandByOrderId`, params})
  },
}
