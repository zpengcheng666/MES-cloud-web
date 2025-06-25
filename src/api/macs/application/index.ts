import request from '@/config/axios'

// 通行申请 VO
export interface ApplicationVO {
  id: string // 主键id
  applicationNumber: string // 申请单号
  agent: string // 申请代理人
  organization: string // 公司/组织
  department: string // 部门
  reason: string // 申请原因/目的
  status: string // 申请状态
  createBy: string // 创建人
  updateBy: string // 更新人
  visitorRegions: [] // 访客
}

// 通行申请 API
export const ApplicationApi = {
  // 查询通行申请分页
  getAccessApplicationPage: async (params: any) => {
    return await request.get({ url: `/macs/access-application/page`, params })
  },

  // 查询通行申请详情
  getAccessApplication: async (id: number) => {
    return await request.get({ url: `/macs/access-application/get?id=` + id })
  },

  // 新增通行申请
  createAccessApplication: async (data: AccessApplicationVO) => {
    return await request.post({ url: `/macs/access-application/visitorApplication`, data })
  },

  // 修改通行申请
  updateAccessApplication: async (data: AccessApplicationVO) => {
    return await request.put({ url: `/macs/access-application/update`, data })
  },

  // 删除通行申请
  deleteAccessApplication: async (id: number) => {
    return await request.delete({ url: `/macs/access-application/delete?id=` + id })
  },

  // 导出通行申请 Excel
  exportAccessApplication: async (params) => {
    return await request.download({ url: `/macs/access-application/export-excel`, params })
  },

  getVisitorListByApplicationId: async (params) => {
    return await request.get({ url: `/macs/visitor/getPageByApplicationId`,params })
  },

  getRegionList: async (params) => {
    return await request.get({ url: `/macs/region/list`, params })
  },

  getVisitorList: async () => {
    return await request.get({ url: `/macs/visitor/list` })
  },
}
