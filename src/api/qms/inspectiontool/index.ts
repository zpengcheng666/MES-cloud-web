import request from '@/config/axios'

// 检测工具 VO
export interface InspectionToolVO {
  id: string // 主键
  name: string // 检测工具名称
}

// 检测工具 API
export const InspectionToolApi = {
  // 查询检测工具分页
  getInspectionToolPage: async (params: any) => {
    return await request.get({ url: `/qms/inspection-tool/page`, params })
  },

  // 查询检测工具详情
  getInspectionTool: async (id: number) => {
    return await request.get({ url: `/qms/inspection-tool/get?id=` + id })
  },

  // 新增检测工具
  createInspectionTool: async (data: InspectionToolVO) => {
    return await request.post({ url: `/qms/inspection-tool/create`, data })
  },

  // 修改检测工具
  updateInspectionTool: async (data: InspectionToolVO) => {
    return await request.put({ url: `/qms/inspection-tool/update`, data })
  },

  // 删除检测工具
  deleteInspectionTool: async (id: number) => {
    return await request.delete({ url: `/qms/inspection-tool/delete?id=` + id })
  },

  // 导出检测工具 Excel
  exportInspectionTool: async (params) => {
    return await request.download({ url: `/qms/inspection-tool/export-excel`, params })
  },


  // 查询检测工具分页
  getInspectionToolList: async (params: any) => {
    return await request.get({ url: `/qms/inspection-tool/list`})
  },
}
