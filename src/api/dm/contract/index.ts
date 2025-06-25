import request from '@/config/axios'

// 购销合同 VO
export interface DMContractVO {
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
export const DMContractApi = {


  // 合同编号查询合同
    getContractInfoById: async (id: string) => {
    return await request.get({ url: `/ppm/dmcontract/get-contract-detail-info-by-id?id=`+ id })
  },
    //获取项目集合
    getProductOrderList: async (type: string,id:stirng) => {
        return await request.get({ url: `/ppm/dmcontract/getProductOrderList?type=`+type+'&projectId='+id})
    },
    //获取项目合同
    getContractInfoByProjectId: async (id: string) => {
        return await request.get({ url: `/ppm/dmcontract/getContractInfoByProjectId?id=`+ id })
    },
    //获取项目产品
    getProjectOrderByProjectId: async (id: string) => {
        return await request.get({ url: `/ppm/dmcontract/getProjectOrderByProjectId?id=`+ id })
    },
    //获取物料
    getMaterialStockByProjectId: async (id: string) => {
        return await request.get({ url: `/ppm/dmcontract/getMaterialStockByProjectId?id=`+ id })
    },
    getContractOrderListByContractId: async (id: string) => {
        return await request.get({ url: `/ppm/dmcontract/get-contract-detail-info-by-id?id=`+ id })
    },

    getProductList: async (params: any) => {
        return await request.get({ url: `/ppm/dmcontract/getProductList`, params})
    },
}

const ERP_PRICE_DIGIT = 2
export const erpPriceMultiply = (price: number, count: number) => {
  if (price == null || count == null) {
    return undefined
  }
  return parseFloat((price * count).toFixed(ERP_PRICE_DIGIT))
}
