import request from '@/config/axios'

// 物料类型关联库区配置 VO
export interface MaterialConfigAreaVO {
  id: string // ID
  warehouseAreaId: string // 库区编码
  materialConfigId: string // 物料类型
}

// 物料类型关联库区配置 API
export const MaterialConfigAreaApi = {
  // 查询物料类型关联库区配置分页
  getMaterialConfigAreaPage: async (params: any) => {
    return await request.get({ url: `/wms/material-config-area/page`, params })
  },

  // 查询物料类型关联库区配置详情
  getMaterialConfigArea: async (id: number) => {
    return await request.get({ url: `/wms/material-config-area/get?id=` + id })
  },

  // 新增物料类型关联库区配置
  createMaterialConfigArea: async (data: MaterialConfigAreaVO) => {
    return await request.post({ url: `/wms/material-config-area/create`, data })
  },

  // 修改物料类型关联库区配置
  updateMaterialConfigArea: async (data: MaterialConfigAreaVO) => {
    return await request.put({ url: `/wms/material-config-area/update`, data })
  },

  // 删除物料类型关联库区配置
  deleteMaterialConfigArea: async (id: number) => {
    return await request.delete({ url: `/wms/material-config-area/delete?id=` + id })
  },

  // 导出物料类型关联库区配置 Excel
  exportMaterialConfigArea: async (params) => {
    return await request.download({ url: `/wms/material-config-area/export-excel`, params })
  },
}
