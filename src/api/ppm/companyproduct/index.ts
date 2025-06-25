import request from '@/config/axios'

// 企业产品表，用于销售和采购 VO
export interface CompanyProductVO {
  id: string // 编码
  companyId: string // 企业ID
  initPrice: number // 初始单价
  initTax: undefined // 初始单价
  leadTime: number // 供货周期
  qualityCheck: undefined
  materialNumber: undefined,
  materialCode: undefined,
  materialName: undefined,
  materialProperty: undefined,
  materialType: undefined,
  materialSpecification: undefined,
  materialBrand: undefined,
  materialUnit: undefined,
}

// 企业产品表，用于销售和采购 API
export const CompanyProductApi = {
  // 查询企业产品表，用于销售和采购分页
  getCompanyProductPage: async (params: any) => {
    return await request.get({ url: `/ppm/company-product/page`, params })
  },

  // 查询企业产品表，用于销售和采购详情
  getCompanyProduct: async (id: string) => {
    return await request.get({ url: `/ppm/company-product/get?id=` + id })
  },

  // 新增企业产品表，用于销售和采购
  createCompanyProduct: async (data: CompanyProductVO) => {
    return await request.post({ url: `/ppm/company-product/create`, data })
  },

  // 修改企业产品表，用于销售和采购
  updateCompanyProduct: async (data: CompanyProductVO) => {
    return await request.put({ url: `/ppm/company-product/update`, data })
  },

  // 删除企业产品表，用于销售和采购
  deleteCompanyProduct: async (id: number) => {
    return await request.delete({ url: `/ppm/company-product/delete?id=` + id })
  },

  // 导出企业产品表，用于销售和采购 Excel
  exportCompanyProduct: async (params) => {
    return await request.download({ url: `/ppm/company-product/export-excel`, params })
  },

  // 查询物料集合
  getMaterialList: async () => {
    return await request.get({ url: `/ppm/material/list` })
  },

  // 查询联系人集合
  getProductSimpleList: async (companyId: string) => {
    return await request.get({ url: `/ppm/company-product/simple-list?companyId=` + companyId })
  },
}
