import request from '@/config/axios'

// 出库详情 VO
export interface OutWarehouseDetailVO {
  id: string // ID
  orderNumber: string // 出库单号
  outType: number // 出库类型（销售出库、外协出库、生产出库、检验出库、报损出库、采购退货出库、调拨出库、其他出库）
  outState: number // 出库状态（待出库、待送达、待签收、已完成、已关闭）
  warehouseId: string // 出库仓库id
  batchNumber: string // 物料批次号(冗余方便查询)
  materialConfigId: string // 物料类型id(冗余方便查询)
  materialStockId: string // 物料库存id
  quantity: number // 数量
}

// 出库详情 API
export const OutWarehouseDetailApi = {
  // 查询出库详情分页
  getOutWarehouseDetailPage: async (params: any) => {
    return await request.get({ url: `/wms/out-warehouse-detail/page`, params })
  },

  // 查询出库详情详情
  getOutWarehouseDetail: async (id: number) => {
    return await request.get({ url: `/wms/out-warehouse-detail/get?id=` + id })
  },

  // 查询出库详情详情
  getOutWarehouseDetailList: async () => {
    return await request.get({ url: `/wms/out-warehouse-detail/list`})
  },

  // 查询出库详情列表 根据出库单号 分组   注：此方法 仅返回 orderNumber 用于下拉展示使用
  getOutWarehouseDetailGroupByOrderNumberList: async () => {
    return await request.get({ url: `/wms/out-warehouse-detail/groupByOrderNumberList` })
  },
  
  // 查询出库详情列表 根据出库单号
  getOutWarehouseDetailListByOrderNumber: async (orderNumber: string) => {
    return await request.get({ url: `/wms/out-warehouse-detail/listByOrderNumber?orderNumber=` + orderNumber })
  },
  

  // 新增出库详情
  createOutWarehouseDetail: async (data: OutWarehouseDetailVO) => {
    return await request.post({ url: `/wms/out-warehouse-detail/create`, data })
  },

  // 修改出库详情
  updateOutWarehouseDetail: async (data: OutWarehouseDetailVO) => {
    return await request.put({ url: `/wms/out-warehouse-detail/update`, data })
  },

  // 删除出库详情
  deleteOutWarehouseDetail: async (id: number) => {
    return await request.delete({ url: `/wms/out-warehouse-detail/delete?id=` + id })
  },

  // 导出出库详情 Excel
  exportOutWarehouseDetail: async (params) => {
    return await request.download({ url: `/wms/out-warehouse-detail/export-excel`, params })
  },

  // 呼叫物料
  callMaterial: async (data: any) => {
    return await request.post({ url: `/wms/out-warehouse-detail/call-material`, data })
  },

  // 签收物料
  SignForMaterial: async (data: any) => {
    return await request.post({ url: `/wms/out-warehouse-detail/sign-for-material`, data })
  },

  // 刀具配送
  distributionTool: async (locationCode: string) => {
    const params = {
      locationCode: locationCode
    }
    return await request.get({ url: `/wms/out-warehouse-detail/tool-distribution`, params})
  },
  //获取刀具配送路径
  getDistributionPath: async (locationCode: string) => {
    const params = {
      locationCode: locationCode
    }
    return await request.get({ url: `/wms/out-warehouse-detail/tool-distribution-path`, params})
  },

}


