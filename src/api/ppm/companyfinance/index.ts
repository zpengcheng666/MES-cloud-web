import request from '@/config/axios'

// 企业税务信息 VO
export interface CompanyFinanceVO {
  id: string // ID
  companyId: string // 公司ID
  type: number // 类型
  accountNumber: string // 账号
  bank: string // 银行
  address: string // 地址
  telephone: string // 电话
  bankAddress: string // 联行号
  creationIp: string // 创建IP
  updatedIp: string // 更新ip
}

// 企业税务信息 API
export const CompanyFinanceApi = {
  // 查询企业税务信息分页
  getCompanyFinancePage: async (params: any) => {
    return await request.get({ url: `/ppm/company-finance/page`, params })
  },

  // 查询企业税务信息详情
  getCompanyFinance: async (id: string) => {
    return await request.get({ url: `/ppm/company-finance/get?id=` + id })
  },

  // 新增企业税务信息
  createCompanyFinance: async (data: CompanyFinanceVO) => {
    return await request.post({ url: `/ppm/company-finance/create`, data })
  },

  // 修改企业税务信息
  updateCompanyFinance: async (data: CompanyFinanceVO) => {
    return await request.put({ url: `/ppm/company-finance/update`, data })
  },

  // 删除企业税务信息
  deleteCompanyFinance: async (id: number) => {
    return await request.delete({ url: `/ppm/company-finance/delete?id=` + id })
  },

  // 导出企业税务信息 Excel
  exportCompanyFinance: async (params) => {
    return await request.download({ url: `/ppm/company-finance/export-excel`, params })
  },

  // 查询企业税务信息分页
  getCompanyFinanceByCompanyId: async (id: string) => {
    return await request.get({ url: `/ppm/company-finance/get-by-company-id?companyId=` + id })
  },
}
