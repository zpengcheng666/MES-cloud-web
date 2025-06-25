import request from '@/config/axios'

// 销售订单入库 VO
export interface ShippingInstorageVO {
  id: string // 主键
  name: string // 入库单名称
  no: string // 入库单
  contractId: string // 合同ID
  companyId: string // 公司ID
  productId: string // 项目ID
  consigner: string // 发货人
  consignerDate: Date // 发货日期
  deliveryMethod: number // 承运方式
  deliveryBy: string // 承运人
  deliveryNumber: string // 承运单号
  deliveryContact: string // 承运人电话
  consignedBy: string // 收货人
  consignedDate: Date // 收货日期
  consignedContact: string // 收货人联系方式
  status: number // 审批状态
  processInstanceId: string // 工作流编号
  fileUrl: string // 附件地址
  shippingInstorageStatus: number // 状态  状态  0已创建 1审批中 2待发货 3运输中 4 待入库 5结束 6审批不通过 9已作废
}

// 销售订单入库 API
export const ShippingInstorageApi = {
  // 查询销售订单入库分页
  getShippingInstoragePage: async (params: any) => {
    return await request.get({ url: `/ppm/shipping-instorage/page`, params })
  },

  // 查询销售订单入库详情
  getShippingInstorage: async (id: number) => {
    return await request.get({ url: `/ppm/shipping-instorage/get?id=` + id })
  },

  // 新增销售订单入库
  createShippingInstorage: async (data: ShippingInstorageVO) => {
    return await request.post({ url: `/ppm/shipping-instorage/create`, data })
  },

  // 修改销售订单入库
  updateShippingInstorage: async (data: ShippingInstorageVO) => {
    return await request.put({ url: `/ppm/shipping-instorage/update`, data })
  },

    // 新增销售订单入库
    createShippingInstorageAndSubmit: async (data: ShippingInstorageVO) => {
        return await request.post({ url: `/ppm/shipping-instorage/createAndSubmit`, data })
    },

    // 修改销售订单入库
    updateShippingInstorageAndSubmit: async (data: ShippingInstorageVO) => {
        return await request.put({ url: `/ppm/shipping-instorage/updateAndSubmit`, data })
    },

  // 删除销售订单入库
  deleteShippingInstorage: async (id: number) => {
    return await request.delete({ url: `/ppm/shipping-instorage/delete?id=` + id })
  },

  // 导出销售订单入库 Excel
  exportShippingInstorage: async (params) => {
    return await request.download({ url: `/ppm/shipping-instorage/export-excel`, params })
  },

    //提交审核
    submitShippingInstorage:async (id: string)=>{
        return await request.put({ url: `/ppm/shipping-instorage/submit?id=` + id })
    },


    // 作废销售订单入库
    cancelShippingInstorage: async (id: string) => {
        return await request.put({ url: `/ppm/shipping-instorage/cancel?id=` + id })
    },

// ==================== 子表（销售订单入库明细） ====================

  // 获得销售订单入库明细列表
  getShippingInstorageDetailListByShippingStorageId: async (shippingStorageId) => {
    return await request.get({ url: `/ppm/shipping-instorage/shipping-instorage-detail/list-by-shipping-storage-id?shippingStorageId=` + shippingStorageId })
  },
}
