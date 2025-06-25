import request from '@/config/axios'

// 企业联系人 VO
export interface CompanyContactVO {
  id: string // ID
  companyId: string // 企业ID
  name: string // 姓名
  depart: string // 部门
  position: string // 职务
  status: number // 在职状态：0-在职、1-离职
  superior: string // 直属上级，子表ID
  header: number // 部门负责人
  sex: number // 性别
  phone: string // 电话
  email: string // 邮箱
  age: number // 年龄
  address: string // 地址
  remark: string // 备注
  creationIp: string // 创建IP
  updatedIp: string // 更新ip
}

// 企业联系人 API
export const CompanyContactApi = {
  // 查询企业联系人分页
  getCompanyContactPage: async (params: any) => {
    return await request.get({ url: `/ppm/company-contact/page`, params })
  },

  // 查询企业联系人详情
  getCompanyContact: async (id: string) => {
    return await request.get({ url: `/ppm/company-contact/get?id=` + id })
  },

  // 新增企业联系人
  createCompanyContact: async (data: CompanyContactVO) => {
    return await request.post({ url: `/ppm/company-contact/create`, data })
  },

  // 修改企业联系人
  updateCompanyContact: async (data: CompanyContactVO) => {
    return await request.put({ url: `/ppm/company-contact/update`, data })
  },

  // 删除企业联系人
  deleteCompanyContact: async (id: number) => {
    return await request.delete({ url: `/ppm/company-contact/delete?id=` + id })
  },

  // 导出企业联系人 Excel
  exportCompanyContact: async (params) => {
    return await request.download({ url: `/ppm/company-contact/export-excel`, params })
  },


  // 查询联系人集合
  getCompanyContactSimpleList: async (companyId: string) => {
    return await request.get({ url: `/ppm/company-contact/simple-list?companyId=` + companyId })
  },
}
