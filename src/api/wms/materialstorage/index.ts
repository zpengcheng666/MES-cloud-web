import request from '@/config/axios'

// 物料储位 VO
export interface MaterialStorageVO {
  id: string // ID
  storageCode: string // 储位编码
  materialStockId: string // 物料id
  valid: undefined, // 是否有效
}

// 物料储位 API
export const MaterialStorageApi = {
  // 查询物料储位分页
  getMaterialStoragePage: async (params: any) => {
    return await request.get({ url: `/wms/material-storage/page`, params })
  },
  getMaterialStorageList: async () => {
    return await request.get({ url: `/wms/material-storage/list` })
  },
  // 查询物料储位详情
  getMaterialStorage: async (id: number) => {
    return await request.get({ url: `/wms/material-storage/get?id=` + id })
  },

  // 新增物料储位
  createMaterialStorage: async (data: MaterialStorageVO) => {
    return await request.post({ url: `/wms/material-storage/create`, data })
  },

  // 修改物料储位
  updateMaterialStorage: async (data: MaterialStorageVO) => {
    return await request.put({ url: `/wms/material-storage/update`, data })
  },

  // 删除物料储位
  deleteMaterialStorage: async (id: number) => {
    return await request.delete({ url: `/wms/material-storage/delete?id=` + id })
  },

  // 导出物料储位 Excel
  exportMaterialStorage: async (params) => {
    return await request.download({ url: `/wms/material-storage/export-excel`, params })
  },
}
