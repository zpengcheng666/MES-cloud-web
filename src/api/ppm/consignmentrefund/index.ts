import request from '@/config/axios'

// 采购退款单 VO
export interface ConsignmentRefundVO {
  id: string // 采购退款单主键
  no: string // 采购退款单号
  consignmentReturnId: string // 采购退货单
  contractId: string // 合同ID
  refundType: number // 退款方式现金、承兑、信用证、支付宝、二维码等
  refundTime: Date // 退款日期
  refundPrice: number // 退款金额
  status: number // 审批状态
  processInstanceId: string // 工作流编号
  refundStatus: number // 状态  0已创建 1审批中 2退款中 3结束 8审核失败 9作废
}

// 采购退款单 API
export const ConsignmentRefundApi = {
  // 查询采购退款单分页
  getConsignmentRefundPage: async (params: any) => {
    return await request.get({ url: `/ppm/consignment-refund/page`, params })
  },

  // 查询采购退款单详情
  getConsignmentRefund: async (id: number) => {
    return await request.get({ url: `/ppm/consignment-refund/get?id=` + id })
  },

  // 新增采购退款单
  createConsignmentRefund: async (data: ConsignmentRefundVO) => {
    return await request.post({ url: `/ppm/consignment-refund/create`, data })
  },

  // 新增采购退款单并提交审核
  createConsignmentRefundAndSubmit: async (data: ConsignmentRefundVO) => {
    return await request.post({ url: `/ppm/consignment-refund/createAndSubmit`, data })
  },

  // 修改采购退款单
  updateConsignmentRefund: async (data: ConsignmentRefundVO) => {
    return await request.put({ url: `/ppm/consignment-refund/update`, data })
  },

  // 修改采购退款单并提交审核
  updateConsignmentRefundAndSubmit: async (data: ConsignmentRefundVO) => {
    return await request.put({ url: `/ppm/consignment-refund/updateAndSubmit`, data })
  },

  // 退款完成确认
  handleConfirm: async (id: string) => {
    return await request.put({url: `/dm/consignment-refund/confirm?id=` + id})
  },

  // 提交审核
  submitContractRefund: async (id: string) => {
    return await request.put({url: `/ppm/consignment-refund/submit?id=` + id})
  },

  // 删除采购退款单
  deleteConsignmentRefund: async (id: number) => {
    return await request.delete({ url: `/ppm/consignment-refund/delete?id=` + id })
  },

  // 导出采购退款单 Excel
  exportConsignmentRefund: async (params) => {
    return await request.download({ url: `/ppm/consignment-refund/export-excel`, params })
  },
}
