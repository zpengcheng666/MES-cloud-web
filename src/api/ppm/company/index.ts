import request from '@/config/axios'

// 供应商信息 VO
export interface CompanyVO {
  id: string // ID
  name: string // 名称
  usci: string // 统一社会信用代码
  organizationCode: string // 组织结构代码
  status: number // 状态
  type: number // 类型
  industryClassification: number // 行业分类，参见国民经济行业分类
  formed: Date // 成立时间
  registrationFund: number // 注册资金
  taxpayer: number // 纳税人资质
  area: string // 区域
  registrationAddress: string // 注册地址
  firmSize: number // 企业规模，几个区间
  telephone: string // 电话
  email: string // 邮箱
  website: string // 公司官网
  introduction: string // 简介
  supplyType: string // 供求类型
  processInstanceId: string
  processKey: string
}

// 供应商信息 API
export const CompanyApi = {
  // 查询供应商信息分页
  getCompanyPage: async (params: any) => {
    return await request.get({ url: `/ppm/company/page`, params })
  },

  // 查询供应商信息详情
  getCompany: async (id: string) => {
    return await request.get({ url: `/ppm/company/get?id=` + id })
  },

  // 新增供应商信息
  createCompany: async (data: CompanyVO) => {
    return await request.post({ url: `/ppm/company/create`, data })
  },

  // 修改供应商信息
  updateCompany: async (data: CompanyVO) => {
    return await request.put({ url: `/ppm/company/update`, data })
  },
    // 修改供应商信息
    updateAndSubmit: async (data: CompanyVO) => {
        return await request.put({ url: `/ppm/company/updateAndSubmit`, data })
    },

  // 删除供应商信息
  deleteCompany: async (ids: string[]) => {
    return await request.delete({
      url: `/ppm/company/delete`,
      params: {
        ids: ids.join(',')
      }
    })
  },

  // 导出供应商信息 Excel
  exportCompany: async (params) => {
    return await request.download({ url: `/ppm/company/export-excel`, params })
  },

  // 获得地区树
  getAreaTree : async () => {
    return await request.get({ url: '/system/area/tree' })
  },

  // 查询供应商集合
  getCompanySimpleList: async () => {
    return await request.get({ url: `/ppm/company/simple-list` })
  },

  // 供应商类型获得供应商集合
  getCompanyListByType: async (type) => {
    return await request.get({ url: `/ppm/company/list-by-type?type=` + type })
  },

  // 提交审核
  submitCompany: async (id: string, processKey: string) => {
    return await request.put({
      url: `ppm/company/submit`,
      params: {
        id,
        processKey
      }
    })
  },

  // 创建并审批
  createAndSubmitCompany: async (data: CompanyVO) => {
    return await request.post({ url: `/ppm/company/createAndSubmit`, data })
  },

  /**
   * 外协供应商
   * @param id
   */

  // 查询供应商信息详情
  getCompanyCoord: async (id: string) => {
    return await request.get({ url: `/ppm/company/coord/get?id=` + id })
  },

  // 新增供应商信息
  createCompanyCoord: async (data: CompanyVO) => {
    return await request.post({ url: `/ppm/company/coord/create`, data })
  },

  // 修改供应商信息
  updateCompanyCoord: async (data: CompanyVO) => {
    return await request.put({ url: `/ppm/company/coord/update`, data })
  },

  // 删除供应商信息
  deleteCompanyCoord: async (ids: string[]) => {
    return await request.delete({
      url: `/ppm/company/coord/delete`,
      params: {
        ids: ids.join(',')
      }
    })
  },
}
