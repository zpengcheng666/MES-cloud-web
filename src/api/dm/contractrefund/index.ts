import request from '@/config/axios'

// 合同退款 VO
export interface ContractRefundVO {
  id: string // 主键
  shippingReturnId: string // 退货单
  contractId: string // 合同ID
  refundType: number // 退款方式现金、承兑、信用证、支付宝、二维码等
  refundTime: Date // 退款日期
  refundPrice: number // 退款金额
  refundStatus: number
  no: string
}

// 合同退款 API
export const ContractRefundApi = {
  // 查询合同退款分页
  getContractRefundPage: async (params: any) => {
    return await request.get({url: `/ppm/contract-refund/page`, params})
  },

  // 查询合同退款详情
  getContractRefund: async (id: number) => {
    return await request.get({url: `/ppm/contract-refund/get?id=` + id})
  },

  // 新增合同退款
  createContractRefund: async (data: ContractRefundVO) => {
    return await request.post({url: `/ppm/contract-refund/create`, data})
  },
  //新增合同退款并提交审核
  createContractRefundAndSubmit: async (data: ContractRefundVO) => {
    return await request.post({url: `/ppm/contract-refund/createAndSubmit`, data})
  },
  // 修改合同退款
  updateContractRefund: async (data: ContractRefundVO) => {
    return await request.put({url: `/ppm/contract-refund/update`, data})
  },

  // 修改合同退款并提交审核
  updateContractRefundAndSubmit: async (data: ContractRefundVO) => {
    return await request.put({url: `/ppm/contract-refund/updateAndSubmit`, data})
  },

// 提交审核
  submitContractRefund: async (id: string) => {
    return await request.put({url: `/ppm/contract-refund/submit?id=` + id})
  },

  // 付款确认
  handleConfirm: async (id: string) => {
    return await request.put({url: `/ppm/contract-refund/confirm?id=` + id})
  },
  // 删除合同退款
  deleteContractRefund: async (id: number) => {
    return await request.delete({url: `/ppm/contract-refund/delete?id=` + id})
  },

  // 导出合同退款 Excel
  exportContractRefund: async (params) => {
    return await request.download({url: `/ppm/contract-refund/export-excel`, params})
  },
}
