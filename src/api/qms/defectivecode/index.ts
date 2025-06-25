import request from '@/config/axios'

// 缺陷代码 VO
export interface DefectiveCodeVO {
  id: string // 主键
  name: string // 缺陷代码名称
  code: string // 缺陷代码
}

// 缺陷代码 API
export const DefectiveCodeApi = {
  // 查询缺陷代码分页
  getDefectiveCodePage: async (params: any) => {
    return await request.get({ url: `/qms/defective-code/page`, params })
  },

  // 查询缺陷代码详情
  getDefectiveCode: async (id: number) => {
    return await request.get({ url: `/qms/defective-code/get?id=` + id })
  },

  // 新增缺陷代码
  createDefectiveCode: async (data: DefectiveCodeVO) => {
    return await request.post({ url: `/qms/defective-code/create`, data })
  },

  // 修改缺陷代码
  updateDefectiveCode: async (data: DefectiveCodeVO) => {
    return await request.put({ url: `/qms/defective-code/update`, data })
  },

  // 删除缺陷代码
  deleteDefectiveCode: async (id: number) => {
    return await request.delete({ url: `/qms/defective-code/delete?id=` + id })
  },

  // 导出缺陷代码 Excel
  exportDefectiveCode: async (params) => {
    return await request.download({ url: `/qms/defective-code/export-excel`, params })
  },

  // 查询缺陷代码集合
  getDefectiveCodeList: async () => {
    return await request.get({ url: `/qms/defective-code/list` })
  },
}
