import request from '@/config/axios'

// 合同付款 VO
export interface ContractPaymentVO {
  id: string // 主键
  contractId: string // 合同ID
  schemeId: string // 付款计划ID
  payDate: Date // 实际付款日期
  amount: number // 实际付款金额
  method: number // 实际付款方式
  evidence: string // 付款凭证
  remark: string // 备注
  processInstanceId: string
  processKey: string
  paymentDetails: []
  // paymentSchemes: []
}
// 购销合同 VO
export interface ContractStatusVO {
  id: string
  contractStatus: number
  type: string
}

// 合同付款 API
export const ContractPaymentApi = {
  // 查询合同付款分页
  getContractPaymentPage: async (params: any) => {
    return await request.get({ url: `/ppm/contract-payment/page`, params })
  },

  // 查询合同付款详情
  getContractPayment: async (id: string) => {
    return await request.get({ url: `/ppm/contract-payment/get?id=` + id })
  },


  // 新增合同付款
  createContractPayment: async (data: ContractPaymentVO) => {
    return await request.post({ url: `/ppm/contract-payment/create`, data })
  },

  // 修改合同付款
  updateContractPayment: async (data: ContractPaymentVO) => {
    return await request.put({ url: `/ppm/contract-payment/update`, data })
  },

  // 删除合同付款
  deleteContractPayment: async (id: number) => {
    return await request.delete({ url: `/ppm/contract-payment/delete?id=` + id })
  },

  // 导出合同付款 Excel
  exportContractPayment: async (params) => {
    return await request.download({ url: `/ppm/contract-payment/export-excel`, params })
  },

  // 获得合同付款计划列表
  getContractPaymentSchemeListByContractId: async (params: any) => {
    return await request.get({ url: `/ppm/contract-payment/list-by-contract-id`, params })
  },

  // 提交审核
  submitContractPayment: async (id: string, processKey: string) => {
    return await request.put({
      url: `ppm/contract-payment/submit`,
      params: {
        id,
        processKey
      }
    })
  },

  // 创建并审批合同
  createAndSubmitContractPayment: async (data: ContractPaymentVO) => {
    return await request.post({ url: `/ppm/contract-payment/createAndSubmit`, data })
  },

  // 修改合同状态
  updateContractPaymentStatus: async (data: ContractStatusVO) => {
    return await request.put({ url: `/ppm/contract-payment/status`, data })
  },

  // 获得合同付款计划列表
  getPaymentList4InvoiceByContractId: async (params: any) => {
    return await request.get({ url: `/ppm/contract-payment/list-invoice-by-payment-id`, params })
  },

  // ==================== 子表（合同付款详细） ====================
  // 获得合同付款详细列表
  getContractPaymentDetailListByPaymentId: async (paymentId) => {
    return await request.get({ url: `/ppm/contract-payment/contract-payment-detail/list-by-payment-id?paymentId=` + paymentId })
  },

}
