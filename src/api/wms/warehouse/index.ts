import request from '@/config/axios'

// 仓库表 VO
export interface WarehouseVO {
  id: string // ID
  warehouseName: string // 仓库名称
  warehouseCode: string // 仓库编码
  warehouseAddress: string // 仓库地址
  warehouseCapacity: string // 仓库容量
  warehouseNature: number // 仓库性质
  warehouseType: number // 仓库类型
  warehouseState: number // 仓库状态
  userId: string // 仓库主管
}

// 仓库表 API
export const WarehouseApi = {
  // 查询仓库表分页
  getWarehousePage: async (params: any) => {
    return await request.get({ url: `/wms/warehouse/page`, params })
  },
  // 查询仓库表列表
  getWarehouseList: async () => {
    return await request.get({ url: `/wms/warehouse/list` })
  },

  // 查询仓库表详情
  getWarehouse: async (id: number) => {
    return await request.get({ url: `/wms/warehouse/get?id=` + id })
  },

  // 新增仓库表
  createWarehouse: async (data: WarehouseVO) => {
    return await request.post({ url: `/wms/warehouse/create`, data })
  },

  // 修改仓库表
  updateWarehouse: async (data: WarehouseVO) => {
    return await request.put({ url: `/wms/warehouse/update`, data })
  },

  // 删除仓库表
  deleteWarehouse: async (id: number) => {
    return await request.delete({ url: `/wms/warehouse/delete?id=` + id })
  },

  // 导出仓库表 Excel
  exportWarehouse: async (params) => {
    return await request.download({ url: `/wms/warehouse/export-excel`, params })
  },
}
