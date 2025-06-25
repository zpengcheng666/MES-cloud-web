import request from '@/config/axios'

// 刀具组装 VO
export interface GroupVO {
  id: string // ID
  mainConfigId: string // 成品刀具类型id

}

// 刀具组装 API
export const GroupApi = {
  // 查询刀具组装分页
  getGroupPage: async (params: any) => {
    return await request.get({ url: `/tms/tool-group/page`, params })
  },

  // 查询刀具组装详情
  getGroup: async (id: string) => {
    return await request.get({ url: `/tms/tool-group/get?id=` + id })
  },

  // 新增刀具组装
  createGroup: async (data: GroupVO) => {
    return await request.post({ url: `/tms/tool-group/create`, data })
  },

  // 修改刀具组装
  updateGroup: async (data: GroupVO) => {
    return await request.put({ url: `/tms/tool-group/update`, data })
  },

  // 删除刀具组装
  deleteGroup: async (id: string) => {
    return await request.delete({ url: `/tms/tool-group/delete?id=` + id })
  },

  // 导出刀具组装 Excel
  exportGroup: async (params) => {
    return await request.download({ url: `/tms/tool-group/export-excel`, params })
  },

  // 查询刀具组装
  getGroupList: async (params) => {
    return await request.get({ url: `/tms/tool-group/detail/list`, params })
  },

  getToolGroupDetailPage: async (params) => {
    return await request.get({ url: `/tms/tool-group/detail/page`, params })
  },

  // 查询刀具组装详情
  getGroupByMainConfigId: async (id: string) => {
    return await request.get({ url: `/tms/tool-group/getGroupByMainConfigId?id=` + id })
  },
}
