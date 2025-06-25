import request from '@/config/axios'

// 采集属性 VO
export interface CollectAttributesVO {
  id: string // 采集属性主键
  collectAttributesName: string // 采集属性名称
  collectAttributesText: string // 采集属性详情
  collectAttributesValue: string // 采集属性值
}

// 采集属性 API
export const CollectAttributesApi = {

  // 查询全部采集属性
  getCollectAttributesList: async () => {
    return await request.get({ url: `/dc/collect-attributes/getList` })
  },

  // 查询采集属性分页
  getCollectAttributesPage: async (params: any) => {
    return await request.get({ url: `/dc/collect-attributes/page`, params })
  },

  // 查询采集属性详情
  getCollectAttributes: async (id: number) => {
    return await request.get({ url: `/dc/collect-attributes/get?id=` + id })
  },

  // 新增采集属性
  createCollectAttributes: async (data: CollectAttributesVO) => {
    return await request.post({ url: `/dc/collect-attributes/create`, data })
  },

  // 修改采集属性
  updateCollectAttributes: async (data: CollectAttributesVO) => {
    return await request.put({ url: `/dc/collect-attributes/update`, data })
  },

  // 删除采集属性
  deleteCollectAttributes: async (id: number) => {
    return await request.delete({ url: `/dc/collect-attributes/delete?id=` + id })
  },

  // 导出采集属性 Excel
  exportCollectAttributes: async (params) => {
    return await request.download({ url: `/dc/collect-attributes/export-excel`, params })
  },
}
