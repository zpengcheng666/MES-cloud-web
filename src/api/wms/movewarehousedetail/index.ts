import request from '@/config/axios'

// 库存移动详情 VO
export interface MoveWarehouseDetailVO {
  id: string // ID
  orderNumber: string // 移库单号
  moveType: number // 移库类型（生产移库，检验移库，调拨移库）
  moveState: number // 移库状态（待移交、待送达、待签收、已完成、已关闭）
  startWarehouseId: string // 起始仓库id
  targetWarehouseId: string // 目标仓库id
  batchNumber: string // 物料批次号(冗余方便查询)
  materialConfigId: string // 物料类型id(冗余方便查询)
  materialStockId: string // 物料库存id
  quantity: number // 数量
}

// 库存移动详情 API
export const MoveWarehouseDetailApi = {
  // 查询库存移动详情分页
  getMoveWarehouseDetailPage: async (params: any) => {
    return await request.get({ url: `/wms/move-warehouse-detail/page`, params })
  },

  // 查询库存移动详情详情
  getMoveWarehouseDetail: async (id: number) => {
    return await request.get({ url: `/wms/move-warehouse-detail/get?id=` + id })
  },

  // 新增库存移动详情
  createMoveWarehouseDetail: async (data: MoveWarehouseDetailVO) => {
    return await request.post({ url: `/wms/move-warehouse-detail/create`, data })
  },

  // 修改库存移动详情
  updateMoveWarehouseDetail: async (data: MoveWarehouseDetailVO) => {
    return await request.put({ url: `/wms/move-warehouse-detail/update`, data })
  },

  // 删除库存移动详情
  deleteMoveWarehouseDetail: async (id: number) => {
    return await request.delete({ url: `/wms/move-warehouse-detail/delete?id=` + id })
  },

  // 导出库存移动详情 Excel
  exportMoveWarehouseDetail: async (params) => {
    return await request.download({ url: `/wms/move-warehouse-detail/export-excel`, params })
  },

  // 移库
  moveWarehouseAction: async (locationId: string, warehouseId: string) => {
    return await request.post({ url: `/wms/move-warehouse-detail/move-warehouse-action?locationId=`+ locationId + `&warehouseId=`+ warehouseId })
  },
}
