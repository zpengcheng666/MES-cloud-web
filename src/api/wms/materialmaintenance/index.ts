import request from '@/config/axios'

// 物料维护记录 VO
export interface MaterialMaintenanceVO {
  id: string // ID
  materialStockId: string // 物料库存id
  description: string // 描述
  quantity: number // 数量
  type: number // 维护类型(1报废，2装配，3加工)
}

// 物料维护记录 API
export const MaterialMaintenanceApi = {
  // 查询物料维护记录分页
  getMaterialMaintenancePage: async (params: any) => {
    return await request.get({ url: `/wms/material-maintenance/page`, params })
  },

  // 查询物料维护记录详情
  getMaterialMaintenance: async (id: number) => {
    return await request.get({ url: `/wms/material-maintenance/get?id=` + id })
  },

  // 新增物料维护记录
  createMaterialMaintenance: async (data: MaterialMaintenanceVO) => {
    return await request.post({ url: `/wms/material-maintenance/create`, data })
  },

  // 修改物料维护记录
  updateMaterialMaintenance: async (data: MaterialMaintenanceVO) => {
    return await request.put({ url: `/wms/material-maintenance/update`, data })
  },

  // 删除物料维护记录
  deleteMaterialMaintenance: async (id: number) => {
    return await request.delete({ url: `/wms/material-maintenance/delete?id=` + id })
  },

  // 导出物料维护记录 Excel
  exportMaterialMaintenance: async (params) => {
    return await request.download({ url: `/wms/material-maintenance/export-excel`, params })
  },
}