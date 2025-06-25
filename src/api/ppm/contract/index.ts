import request from '@/config/axios'

// 购销合同 VO
export interface ContractVO {
  id: string // ID
  type: number // 类型(采购、销售)
  number: string // 合同编号
  name: string // 合同名称
  party: string // 合同方
  contact: string // 签约人
  signingDate: Date // 签约时间
  signingAddress: string // 签约地点
  department: string // 签约部门
  selfContact: string // 我方签约人
  vat: number // 是否增值税
  currency: number // 币种
  delivery: number // 交货方式
  contractStatus: number,
  status: number // 状态
  purchaser: string // 采购员
  remark: string // 备注
  partyName: string // 合同房
  contactName: string // 签约人
  selfContactName: string // 我方签约人
  departmentName: string
  processInstanceId: string
  processKey: string
  products: []
  paymentSchemes: []
}

// 购销合同 VO
export interface ContractStatusVO {
  id: string
  contractStatus: number
  type: string
}

// 购销合同 API
export const ContractApi = {
  // 查询购销合同分页
  getContractPage: async (params: any) => {
    return await request.get({ url: `/ppm/contract/page`, params })
  },

  // 查询购销合同详情
  getContract: async (id: number) => {
    return await request.get({ url: `/ppm/contract/get?id=` + id })
  },

  // 新增购销合同
  createContract: async (data: ContractVO) => {
    return await request.post({ url: `/ppm/contract/create`, data })
  },

  // 修改购销合同
  updateContract: async (data: ContractVO) => {
    return await request.put({ url: `/ppm/contract/update`, data })
  },

  // 删除购销合同
  deleteContract: async (id: string) => {
    return await request.delete({ url: `/ppm/contract/delete?id=` + id })
  },

  // 导出购销合同 Excel
  exportContract: async (params) => {
    return await request.download({ url: `/ppm/contract/export-excel`, params })
  },

  // 合同类型获得合同集合
  getContractListByType: async (type) => {
    return await request.get({ url: `/ppm/contract/list-by-type?type=` + type })
  },

  // 提交审核
  submitContract: async (id: string, processKey: string) => {
    return await request.put({
      url: `ppm/contract/submit`,
      params: {
        id,
        processKey
      }
    })
  },

  // 创建并审批合同
  createAndSubmitContract: async (data: ContractVO) => {
    return await request.post({ url: `/ppm/contract/createAndSubmit`, data })
  },


  // 修改合同状态
  updateContractStatus: async (data: ContractStatusVO) => {
    return await request.put({ url: `/ppm/contract/status`, data })
  },

  // 查询购销合同详情
  getContractById: async (id: string) => {
    return await request.get({ url: `/ppm/contract//get-contract-by-id?id=` + id })
  },

  // 合同编号查询合同
  getContractInfoById: async (id: string) => {
    return await request.get({ url: `/ppm/contract/get-contract-detail-info-by-id?id=` + id })
  },

  // ==================== 子表（合同订单） ====================

  // 获得合同订单列表
  getContractOrderListByContractId: async (contractId) => {
    return await request.get({ url: `/ppm/contract/contract-order/list-by-contract-id?contractId=` + contractId })
  },

  // 获得合同对应的项目订单详细
  getProjectOrderListByContractId: async (contractId) => {
      return await request.get({ url: `/ppm/contract/project-order/list-by-contract-id?contractId=` + contractId })
  },

    // 获得合同对应的项目订单详细
    getProjectOrderListInByContractId: async (contractId) => {
        return await request.get({ url: `/ppm/contract/project-order-in/list-by-contract-id?contractId=` + contractId })
    },
  // 获得合同订单列表
  getContractOrderListByRequirementDetailId: async (requirementDetailId) => {
    return await request.get({ url: `/ppm/contract/contract-order/list-by-requirement-detail-id?requirementDetailId=` + requirementDetailId })
  },
}

const ERP_PRICE_DIGIT = 2
export const erpPriceMultiply = (price: number, count: number) => {
  if (price == null || count == null) {
    return undefined
  }
  return parseFloat((price * count).toFixed(ERP_PRICE_DIGIT))
}
