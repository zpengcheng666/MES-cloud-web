import request from '@/config/axios'

// 购销合同发票 VO
export interface ContractInvoiceVO {
  id: string // 主键
  contractId: string // 合同ID
  businessType: number // 业务类型1采购 2销售
  type: number // 类型，普票、专票、收据等
  amount: number // 金额
  invoiceDate: Date // 开具时间
  invoiceNumber: string // 票据代码
  invoiceNumber2: string // 票据代码2
  fileUrl: string
  processInstanceId: string
  processKey: string
}

// 购销合同发票 API
export const ContractInvoiceApi = {
  // 查询购销合同发票分页
  getContractInvoicePage: async (params: any) => {
    return await request.get({ url: `/ppm/contract-invoice/page`, params })
  },

  // 查询购销合同发票详情
  getContractInvoice: async (id: number) => {
    return await request.get({ url: `/ppm/contract-invoice/get?id=` + id })
  },

  // 新增购销合同发票
  createContractInvoice: async (data: ContractInvoiceVO) => {
    return await request.post({ url: `/ppm/contract-invoice/create`, data })
  },

  // 修改购销合同发票
  updateContractInvoice: async (data: ContractInvoiceVO) => {
    return await request.put({ url: `/ppm/contract-invoice/update`, data })
  },

  // 删除购销合同发票
  deleteContractInvoice: async (id: number) => {
    return await request.delete({ url: `/ppm/contract-invoice/delete?id=` + id })
  },

  // 导出购销合同发票 Excel
  exportContractInvoice: async (params) => {
    return await request.download({ url: `/ppm/contract-invoice/export-excel`, params })
  },

  // 提交审核
  submitContractInvoice: async (id: string, processKey: string) => {
    return await request.put({
      url: `ppm/contract-invoice/submit`,
      params: {
        id,
        processKey
      }
    })
  },

  // 创建并审批合同
  createAndSubmitContractInvoice: async (data: ContractInvoiceVO) => {
    return await request.post({ url: `/ppm/contract-invoice/createAndSubmit`, data })
  },

// ==================== 子表（购销合同发票表详细） ====================

  // 获得购销合同发票表详细列表
  getContractInvoiceDetailListByInvoiceId: async (invoiceId) => {
    return await request.get({ url: `/ppm/contract-invoice/contract-invoice-detail/list-by-invoice-id?invoiceId=` + invoiceId })
  },
}
