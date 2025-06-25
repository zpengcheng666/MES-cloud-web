import request from '@/config/axios'

// 单位 VO
export interface UnitVO {
  id: string // ID
  unit: string // 单位
}

// 单位 API
export const UnitApi = {
  // 查询单位分页
  getUnitPage: async (params: any) => {
    return await request.get({ url: `/wms/unit/page`, params })
  },

  // 查询单位列表
  getUnitList: async () => {
    return await request.get({ url: `/wms/unit/list` })
  },

  // 查询单位详情
  getUnit: async (id: number) => {
    return await request.get({ url: `/wms/unit/get?id=` + id })
  },

  // 新增单位
  createUnit: async (data: UnitVO) => {
    return await request.post({ url: `/wms/unit/create`, data })
  },

  // 修改单位
  updateUnit: async (data: UnitVO) => {
    return await request.put({ url: `/wms/unit/update`, data })
  },

  // 删除单位
  deleteUnit: async (id: number) => {
    return await request.delete({ url: `/wms/unit/delete?id=` + id })
  },

  // 导出单位 Excel
  exportUnit: async (params) => {
    return await request.download({ url: `/wms/unit/export-excel`, params })
  },
}
