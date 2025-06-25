import request from '@/config/axios'

// 库位 VO
export interface WarehouseLocationVO {
  id: string // ID
  locationCode: string // 库位编码
  defaultWarehouseId: string // 库区id
  locked: undefined, // 是否锁定
  valid: undefined, // 是否有效
}

// 库位 API
export const WarehouseLocationApi = {
  // 查询库位分页
  getWarehouseLocationPage: async (params: any) => {
    return await request.get({ url: `/wms/warehouse-location/page`, params })
  },

  getWarehouseLocationList: async () => {
    return await request.get({ url: `/wms/warehouse-location/list` })
  },

  // 查询库位详情
  getWarehouseLocation: async (id: number) => {
    return await request.get({ url: `/wms/warehouse-location/get?id=` + id })
  },

  // 新增库位
  createWarehouseLocation: async (data: WarehouseLocationVO) => {
    return await request.post({ url: `/wms/warehouse-location/create`, data })
  },

  // 修改库位
  updateWarehouseLocation: async (data: WarehouseLocationVO) => {
    return await request.put({ url: `/wms/warehouse-location/update`, data })
  },

  // 删除库位
  deleteWarehouseLocation: async (id: number) => {
    return await request.delete({ url: `/wms/warehouse-location/delete?id=` + id })
  },

  // 导出库位 Excel
  exportWarehouseLocation: async (params) => {
    return await request.download({ url: `/wms/warehouse-location/export-excel`, params })
  },

  // 查询库位详情
  getWarehouseLocationDetail: async (id: string) => {
    return await request.get({ url: `/wms/warehouse-location/getWarehouseLocationDetail?locationId=` + id })
  },

  // 通过仓库id获得库位
  getLocationListByWarehouseId: async (warehouseId: number) => {
    return await request.get({
      url: `/wms/warehouse-location/getLocationListByWarehouseId?warehouseId=` + warehouseId
    })
  }
}
