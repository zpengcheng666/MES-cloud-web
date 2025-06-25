import request from '@/config/axios'

// 不合格品登记 VO
export interface UnqualifiedRegistrationVO {
  id: string // 主键
  content: string // 缺陷描述
  defectiveCode: string // 缺陷代码
  quantity: number // 缺陷数量
  inspectionSheetSchemeId: string // 检验单方案任务ID
}

// 不合格品登记 API
export const UnqualifiedRegistrationApi = {
  // 查询不合格品登记分页
  getUnqualifiedRegistrationPage: async (params: any) => {
    return await request.get({ url: `/qms/unqualified-registration/page`, params })
  },

  // 查询不合格品登记详情
  getUnqualifiedRegistration: async (id: number) => {
    return await request.get({ url: `/qms/unqualified-registration/get?id=` + id })
  },

  // 新增不合格品登记
  createUnqualifiedRegistration: async (data: UnqualifiedRegistrationVO) => {
    return await request.post({ url: `/qms/unqualified-registration/create`, data })
  },

  // 修改不合格品登记
  updateUnqualifiedRegistration: async (data: UnqualifiedRegistrationVO) => {
    return await request.put({ url: `/qms/unqualified-registration/update`, data })
  },

  // 删除不合格品登记
  deleteUnqualifiedRegistration: async (id: number) => {
    return await request.delete({ url: `/qms/unqualified-registration/delete?id=` + id })
  },

  // 导出不合格品登记 Excel
  exportUnqualifiedRegistration: async (params) => {
    return await request.download({ url: `/qms/unqualified-registration/export-excel`, params })
  },

  getUnqualifiedRegistrationListBySheetSchemeId: async (id: string) => {
    return await request.get({ url: `/qms/unqualified-registration/list-by-sheet-scheme-id?id=` + id })
  },

  saveUnqualifiedRegistrationBatch: async (data: any) => {
    return await request.post({ url: `/qms/unqualified-registration/saveBatch`, data })
  },

  saveAndAuditUnqualifiedRegistrationBatch: async (data: any) => {
    return await request.post({ url: `/qms/unqualified-registration/saveAndAuditBatch`, data })
  },
}
