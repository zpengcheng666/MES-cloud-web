import request from '@/config/axios'

// 质量管理资料库 VO
export interface ManagementDatabaseVO {
  id: string // id
  treeId: string // 所属质量管理关联ID
  type: number // 类型
  fileUrl: string // 附件
  remark: string // 备注
  status: number // 状态
  processInstanceId: string // 工作流编号
}

// 质量管理资料库 API
export const ManagementDatabaseApi = {
  // 查询质量管理资料库分页
  getManagementDatabasePage: async (params: any) => {
    return await request.get({ url: `/qms/management-database/page`, params })
  },

  // 查询质量管理资料库详情
  getManagementDatabase: async (id: number) => {
    return await request.get({ url: `/qms/management-database/get?id=` + id })
  },

  // 新增质量管理资料库
  createManagementDatabase: async (data: ManagementDatabaseVO) => {
    return await request.post({ url: `/qms/management-database/create`, data })
  },

  // 修改质量管理资料库
  updateManagementDatabase: async (data: ManagementDatabaseVO) => {
    return await request.put({ url: `/qms/management-database/update`, data })
  },

  // 删除质量管理资料库
  deleteManagementDatabase: async (id: number) => {
    return await request.delete({ url: `/qms/management-database/delete?id=` + id })
  },

  // 导出质量管理资料库 Excel
  exportManagementDatabase: async (params) => {
    return await request.download({ url: `/qms/management-database/export-excel`, params })
  },

  // 提交审核
  submitManagementDatabase: async (id: string, processKey: string) => {
    return await request.put({
      url: `qms/management-database/submit`,
      params: {
        id,
        processKey
      }
    })
  },
}
