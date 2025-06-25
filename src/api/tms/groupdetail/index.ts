import request from '@/config/axios'

// 刀具组装 VO
export interface ToolGroupDetailVO {
  id: string // ID
  mainConfigId: string // 成品刀具类型id
  site: number // 刀位（非必填）
  accessoryConfigId: string // 装配刀具类型id
  count: number // 数量(仅限配件使用)
}

// 刀具组装 API
export const ToolGroupDetailApi = {
  // 查询刀具组装分页
  getToolGroupDetailPage: async (params: any) => {
    return await request.get({ url: `/tms/tool-group-detail/page`, params })
  },

  // 查询刀具组装详情
  getToolGroupDetail: async (id: number) => {
    return await request.get({ url: `/tms/tool-group-detail/get?id=` + id })
  },

  // 新增刀具组装
  createToolGroupDetail: async (data: ToolGroupDetailVO) => {
    return await request.post({ url: `/tms/tool-group-detail/create`, data })
  },

  // 修改刀具组装
  updateToolGroupDetail: async (data: ToolGroupDetailVO) => {
    return await request.put({ url: `/tms/tool-group-detail/update`, data })
  },

  // 删除刀具组装
  deleteToolGroupDetail: async (id: number) => {
    return await request.delete({ url: `/tms/tool-group-detail/delete?id=` + id })
  },

  // 导出刀具组装 Excel
  exportToolGroupDetail: async (params) => {
    return await request.download({ url: `/tms/tool-group-detail/export-excel`, params })
  },
}