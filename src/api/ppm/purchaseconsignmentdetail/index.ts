import request from '@/config/axios'

// 收货明细 VO
export interface PurchaseConsignmentDetailVO {
  id: string // ID
  consignmentId: string // 收货单ID
  orderId: string // 合同订单ID
  consignedAmount: number // 发货数量
  signedAmount: number // 签收数量
  signedBy: string // 签收人
  signedTime: Date // 签收日期
}

// 收货明细 API
export const PurchaseConsignmentDetailApi = {
  // 查询收货明细分页
  getPurchaseConsignmentDetailPage: async (params: any) => {
    return await request.get({ url: `/ppm/purchase-consignment-detail/page`, params })
  },

  // 查询收货明细详情
  getPurchaseConsignmentDetail: async (id: number) => {
    return await request.get({ url: `/ppm/purchase-consignment-detail/get?id=` + id })
  },

  // 新增收货明细
  createPurchaseConsignmentDetail: async (data: PurchaseConsignmentDetailVO) => {
    return await request.post({ url: `/ppm/purchase-consignment-detail/create`, data })
  },

  // 修改收货明细
  updatePurchaseConsignmentDetail: async (data: PurchaseConsignmentDetailVO) => {
    return await request.put({ url: `/ppm/purchase-consignment-detail/update`, data })
  },

  // 删除收货明细
  deletePurchaseConsignmentDetail: async (id: number) => {
    return await request.delete({ url: `/ppm/purchase-consignment-detail/delete?id=` + id })
  },

  // 导出收货明细 Excel
  exportPurchaseConsignmentDetail: async (params) => {
    return await request.download({ url: `/ppm/purchase-consignment-detail/export-excel`, params })
  },
}
