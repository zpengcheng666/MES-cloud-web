import request from '@/config/axios'

// 销售退货单详情 VO
export interface ConsignmentReturnDetailVO {
  id: string // ID
  consignmentReturnId: string // 退货单ID
  consignmentDetailId: string // 发货单详情ID
  orderId: string // 合同订单ID
  consignedAmount: number // 退货数量
  inboundAmount: number // 入库数量
  inboundBy: string // 入库人
  inboundTime: Date // 出库时间
  signedAmount: number // 确认数量
  signedBy: string // 确认人
  signedTime: Date // 确认日期
  materialStockId: string // 物料库存ID
  barCode: string // 物料条码
  batchNumber: string // 物料批次号
}

// 销售退货单详情 API
export const ConsignmentReturnDetailApi = {
  // 查询销售退货单详情分页
  getConsignmentReturnDetailPage: async (params: any) => {
    return await request.get({ url: `/ppm/consignment-return-detail/page`, params })
  },

  // 查询销售退货单详情详情
  getConsignmentReturnDetail: async (id: number) => {
    return await request.get({ url: `/ppm/consignment-return-detail/get?id=` + id })
  },

  // 新增销售退货单详情
  createConsignmentReturnDetail: async (data: ConsignmentReturnDetailVO) => {
    return await request.post({ url: `/ppm/consignment-return-detail/create`, data })
  },

  // 修改销售退货单详情
  updateConsignmentReturnDetail: async (data: ConsignmentReturnDetailVO) => {
    return await request.put({ url: `/ppm/consignment-return-detail/update`, data })
  },

  // 删除销售退货单详情
  deleteConsignmentReturnDetail: async (id: number) => {
    return await request.delete({ url: `/ppm/consignment-return-detail/delete?id=` + id })
  },

  // 导出销售退货单详情 Excel
  exportConsignmentReturnDetail: async (params) => {
    return await request.download({ url: `/ppm/consignment-return-detail/export-excel`, params })
  },
}