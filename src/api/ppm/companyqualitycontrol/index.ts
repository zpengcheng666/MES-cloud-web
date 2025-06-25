import request from '@/config/axios'

// 企业质量控制信息 VO
export interface CompanyQualityControlVO {
  id: string // ID
  companyId: string // 企业编号
  companyName: string // 企业编号
  qmsc: number // 质量管理体系认证
  inspection: number // 是否专职检验
  nonconformingControl: number // 是否不合格品控制
  productionTraceability: number // 生产可追溯
  purchasingControl: number // 是否采购质量控制
  oqc: number // 出厂质量控制
  remark: string // 备注
  creationIp: string // 创建IP
  updatedIp: string // 更新ip
}

// 企业质量控制信息 API
export const CompanyQualityControlApi = {
  // 查询企业质量控制信息分页
  getCompanyQualityControlPage: async (params: any) => {
    return await request.get({ url: `/ppm/company-quality-control/page`, params })
  },

  // 查询企业质量控制信息详情
  getCompanyQualityControl: async (id: string) => {
    return await request.get({ url: `/ppm/company-quality-control/get?id=` + id })
  },

  // 新增企业质量控制信息
  createCompanyQualityControl: async (data: CompanyQualityControlVO) => {
    return await request.post({ url: `/ppm/company-quality-control/create`, data })
  },

  // 修改企业质量控制信息
  updateCompanyQualityControl: async (data: CompanyQualityControlVO) => {
    return await request.put({ url: `/ppm/company-quality-control/update`, data })
  },

  // 删除企业质量控制信息
  deleteCompanyQualityControl: async (id: number) => {
    return await request.delete({ url: `/ppm/company-quality-control/delete?id=` + id })
  },

  // 导出企业质量控制信息 Excel
  exportCompanyQualityControl: async (params) => {
    return await request.download({ url: `/ppm/company-quality-control/export-excel`, params })
  },

  // 获得合同订单列表
  getCompanyQualityControlByCompanyId: async (companyId) => {
    return await request.get({ url: `/ppm/company-quality-control/get-by-company-id?companyId=` + companyId })
  },
}
