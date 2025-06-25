import request from '@/config/axios'

// 销售订单入库退货 VO
export interface ShippingInstorageReturnVO {
  id: string // 主键
  name: string // 入库单名称
  no: string // 入库单
  contractId: string // 合同ID
  companyId: string // 公司ID
  projectId: string // 项目ID
  status: number // 审批状态
  processInstanceId: string // 工作流编号
  fileUrl: string // 附件地址
  shippingInstorageReturnStatus: number // 状态  0已创建 1审批中 2 待出库 3出库中4发货确认5结束 9取消 8审批失败
  consigner: string // 退货人
  consignerDate: Date // 退货日期
  consignedBy: string // 接收人
  consignedDate: Date // 收货日期
  consignedContact: string // 收货人联系方式
  returnType: number // 处理方式 1返修2换货3退货退款4仅退款
  returnReason: string // 退换货原因
}

// 销售订单入库退货 API
export const ShippingInstorageReturnApi = {
  // 查询销售订单入库退货分页
  getShippingInstorageReturnPage: async (params: any) => {
    return await request.get({ url: `/ppm/shipping-instorage-return/page`, params })
  },

  // 查询销售订单入库退货详情
  getShippingInstorageReturn: async (id: number) => {
    return await request.get({ url: `/ppm/shipping-instorage-return/get?id=` + id })
  },

  // 新增销售订单入库退货
  createShippingInstorageReturn: async (data: ShippingInstorageReturnVO) => {
    return await request.post({ url: `/ppm/shipping-instorage-return/create`, data })
  },

  // 修改销售订单入库退货
  updateShippingInstorageReturn: async (data: ShippingInstorageReturnVO) => {
    return await request.put({ url: `/ppm/shipping-instorage-return/update`, data })
  },

    // 新增销售订单入库退货
    createShippingInstorageReturnAndSubmit: async (data: ShippingInstorageReturnVO) => {
        return await request.post({ url: `/ppm/shipping-instorage-return/createAndSubmit`, data })
    },

    // 修改销售订单入库退货
    updateShippingInstorageReturnAndSubmit: async (data: ShippingInstorageReturnVO) => {
        return await request.put({ url: `/ppm/shipping-instorage-return/updateAndSubmit`, data })
    },

  // 删除销售订单入库退货
  deleteShippingInstorageReturn: async (id: number) => {
    return await request.delete({ url: `/ppm/shipping-instorage-return/delete?id=` + id })
  },

  // 导出销售订单入库退货 Excel
  exportShippingInstorageReturn: async (params) => {
    return await request.download({ url: `/ppm/shipping-instorage-return/export-excel`, params })
  },

    //出库扫码确认
    confirmShipping: async (id: string) => {
        return await request.put({ url: `/ppm/shipping-instorage-return/confirmShipping?id=` + id })
    },


// 提交审核
    submitShipping: async (id: string) => {
        return await request.put({ url: `/ppm/shipping-instorage-return/submit?id=` + id })
    },

    // 作废销售发货
    cancelShipping: async (id: string) => {
        return await request.put({ url: `/ppm/shipping-instorage-return/cancel?id=` + id })
    },
// ==================== 子表（销售订单退货明细） ====================

  // 获得销售订单退货明细列表
  getShippingInstorageReturnDetailListByShippingStorageReturnId: async (shippingStorageReturnId) => {
    return await request.get({ url: `/ppm/shipping-instorage-return/shipping-instorage-return-detail/list-by-shipping-storage-return-id?shippingStorageReturnId=` + shippingStorageReturnId })
  },
}
