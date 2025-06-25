import request from '@/config/axios'

// 物料收货 VO
export interface TakeDeliveryVO {
  id: string // ID
  orderNumber: string // 到货单号
  materialTypeId: string // 物料类型id
  tdQuantity: number // 收货数量
  locationId: string // 绑定库位
  storageId: string // 绑定储位
  materialId: string // 绑定物料
}

// 物料收货 API
export const TakeDeliveryApi = {
  // 查询物料收货分页
  getTakeDeliveryPage: async (params: any) => {
    return await request.get({ url: `/wms/take-delivery/page`, params })
  },

  // 查询物料收货详情
  getTakeDelivery: async (id: number) => {
    return await request.get({ url: `/wms/take-delivery/get?id=` + id })
  },

  // 新增物料收货
  createTakeDelivery: async (data: TakeDeliveryVO) => {
    return await request.post({ url: `/wms/take-delivery/create`, data })
  },

  // 修改物料收货
  updateTakeDelivery: async (data: TakeDeliveryVO) => {
    return await request.put({ url: `/wms/take-delivery/update`, data })
  },

  // 删除物料收货
  deleteTakeDelivery: async (id: number) => {
    return await request.delete({ url: `/wms/take-delivery/delete?id=` + id })
  },

  // 导出物料收货 Excel
  exportTakeDelivery: async (params) => {
    return await request.download({ url: `/wms/take-delivery/export-excel`, params })
  },
}