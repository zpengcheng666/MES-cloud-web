import request from '@/config/axios'

// 入库详情 VO
export interface InWarehouseDetailVO {
  id: string // ID
  orderNumber: string // 入库单号 默认为来源单号；自建单则自动生成
  inType: number // 入库类型（采购入库、外协入库、生产入库、退料入库、检验入库、其他入库）
  startWarehouseId: string // 入库仓库ID
  targetWarehouseId: string // 入库仓库ID
  inState: number // 入库状态（待质检、待入库、待上架、已完成、已关闭）
  batchNumber: string // 物料批次号(冗余方便查询)
  materialConfigId: string // 物料类型id(冗余方便查询)
  materialId: string // 物料id
  quantity: number // 数量
}

// 入库详情 API
export const InWarehouseDetailApi = {
  // 查询入库详情分页
  getInWarehouseDetailPage: async (params: any) => {
    return await request.get({ url: `/wms/in-warehouse-detail/page`, params })
  },

  // 查询入库详情详情
  getInWarehouseDetail: async (id: number) => {
    return await request.get({ url: `/wms/in-warehouse-detail/get?id=` + id })
  },

  // 新增入库详情
  createInWarehouseDetail: async (data: InWarehouseDetailVO) => {
    return await request.post({ url: `/wms/in-warehouse-detail/create`, data })
  },

  // 修改入库详情
  updateInWarehouseDetail: async (data: InWarehouseDetailVO) => {
    return await request.put({ url: `/wms/in-warehouse-detail/update`, data })
  },

  // 删除入库详情
  deleteInWarehouseDetail: async (id: number) => {
    return await request.delete({ url: `/wms/in-warehouse-detail/delete?id=` + id })
  },

  // 导出入库详情 Excel
  exportInWarehouseDetail: async (params) => {
    return await request.download({ url: `/wms/in-warehouse-detail/export-excel`, params })
  },
  
  // 呼叫AGV
  callTray: async (data: any) => {
    return await request.post({ url: `/wms/in-warehouse-detail/call-tray`, data })
  },
  // 入库
  inWarehouseAction: async (locationId: string, warehouseId: string) => {
    return await request.post({ url: `/wms/in-warehouse-detail/in-warehouse-action?locationId=`+ locationId + `&warehouseId=`+ warehouseId })
  },
}
