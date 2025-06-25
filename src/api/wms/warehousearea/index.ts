import request from '@/config/axios'

// 库区 VO
export interface WarehouseAreaVO {
  id: string // ID
  warehouseId: string // 仓库id
  areaName: string // 库区名称
  areaCode: string // 库区编码
  areaProperty: number // 库区属性
  areaLength: number // 库区长
  areaWidth: number // 库区宽
  areaHeight: number // 库区高
  areaBearing: number // 库区承重
  areaChannels: number // 通道
  areaGroup: number // 组
  areaLayer: number // 层
  areaSite: number // 位
  areaType: number // 库区类型
}

// 库区 API
export const WarehouseAreaApi = {
  // 查询库区分页
  getWarehouseAreaPage: async (params: any) => {
    return await request.get({ url: `/wms/warehouse-area/page`, params })
  },
  // 查询库区分页
  getWarehouseAreaList: async () => {
    return await request.get({ url: `/wms/warehouse-area/list` })
  },

  // 查询库区详情
  getWarehouseArea: async (id: number) => {
    return await request.get({ url: `/wms/warehouse-area/get?id=` + id })
  },

  // 新增库区
  createWarehouseArea: async (data: WarehouseAreaVO) => {
    return await request.post({ url: `/wms/warehouse-area/create`, data })
  },

  // 修改库区
  updateWarehouseArea: async (data: WarehouseAreaVO) => {
    return await request.put({ url: `/wms/warehouse-area/update`, data })
  },

  // 删除库区
  deleteWarehouseArea: async (id: number) => {
    return await request.delete({ url: `/wms/warehouse-area/delete?id=` + id })
  },

  // 导出库区 Excel
  exportWarehouseArea: async (params) => {
    return await request.download({ url: `/wms/warehouse-area/export-excel`, params })
  },
}
