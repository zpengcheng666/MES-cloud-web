import request from '@/config/axios'

// 合同付款计划 VO
export interface ContractPaymentSchemeVO {
  id: string // 主键
  contractId: string // 合同ID
  paymentControl: number // 付款控制，货到付款、预付、货到票据支付、货到分期、货到延期等
  payDate: Date // 付款日期
  ratio: number // 比例
  amount: number // 金额，与比例联动
  method: number // 付款方式，银行汇款、银行本票、商业汇票、现金、托收承付等
  remark: string // 备注
  payAmount:number // 已支付金额
}

// 合同付款计划 API
export const ContractPaymentSchemeApi = {
  // 查询合同付款计划分页
  getContractPaymentSchemePage: async (params: any) => {
    return await request.get({ url: `/ppm/contract-payment-scheme/page`, params })
  },

  // 查询合同付款计划详情
  getContractPaymentScheme: async (id: number) => {
    return await request.get({ url: `/ppm/contract-payment-scheme/get?id=` + id })
  },

  // 新增合同付款计划
  createContractPaymentScheme: async (data: ContractPaymentSchemeVO) => {
    return await request.post({ url: `/ppm/contract-payment-scheme/create`, data })
  },

  // 修改合同付款计划
  updateContractPaymentScheme: async (data: ContractPaymentSchemeVO) => {
    return await request.put({ url: `/ppm/contract-payment-scheme/update`, data })
  },

  // 删除合同付款计划
  deleteContractPaymentScheme: async (id: number) => {
    return await request.delete({ url: `/ppm/contract-payment-scheme/delete?id=` + id })
  },

  // 导出合同付款计划 Excel
  exportContractPaymentScheme: async (params) => {
    return await request.download({ url: `/ppm/contract-payment-scheme/export-excel`, params })
  },

}
