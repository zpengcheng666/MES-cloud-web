import request from '@/config/axios'

// 销售发货 VO
export interface ShippingVO {
  id: string // 主键
  contractId: string // 合同ID
  consigner: string // 发货人
  fileUrl: string,
  consignerDate: Date // 发货日期
  deliveryMethod: number // 承运方式
  deliveryBy: string // 承运人
  deliveryNumber: string // 承运单号
  deliveryContact: string // 承运人电话
  consignedBy: string // 收货人
  consignedDate: Date // 收货日期
  consignedContact: string // 收货人联系方式
  processInstanceId:string
  status:number
  shippingNo:string  //发货单号
  shippingName:string  //发货单名称
  shippingStatus: number // 状态  0已创建 1审批中 2 待出库 3待发货4运输中 5结束 9取消
}

// 销售发货 API
export const ShippingApi = {
  // 查询销售发货分页
  getShippingPage: async (params: any) => {
    return await request.get({ url: `/ppm/shipping/page`, params })
  },

  // 查询销售发货详情
  getShipping: async (id: number) => {
    return await request.get({ url: `/ppm/shipping/get?id=` + id })
  },

  // 新增销售发货
  createShipping: async (data: ShippingVO) => {
    return await request.post({ url: `/ppm/shipping/create`, data })
  },

  // 修改销售发货
  updateShipping: async (data: ShippingVO) => {
    return await request.put({ url: `/ppm/shipping/update`, data })
  },
    //出库
    outBoundShipping: async (data: ShippingVO) => {
        return await request.put({ url: `/ppm/shipping/outBound`, data })
    },


  // 新增销售发货并提交审批
  createShippingAndSubmit: async (data: ShippingVO) => {
    return await request.post({ url: `/ppm/shipping/createAndSubmit`, data })
  },

  // 修改销售发货并提交审批
  updateShippingAndSubmit: async (data: ShippingVO) => {
    return await request.put({ url: `/ppm/shipping/updateAndSubmit`, data })
  },


  // 删除销售发货
  deleteShipping: async (id: number) => {
    return await request.delete({ url: `/ppm/shipping/delete?id=` + id })
  },


  // 作废销售发货
  cancelShipping: async (id: string) => {
    return await request.put({ url: `/ppm/shipping/cancel?id=` + id })
  },
    //出库扫码确认
  confirmShipping: async (id: string) => {
      return await request.put({ url: `/ppm/shipping/confirmShipping?id=` + id })
  },

  // 导出销售发货 Excel
  exportShipping: async (params) => {
    return await request.download({ url: `/ppm/shipping/export-excel`, params })
  },

// 提交审核
  submitShipping: async (id: string) => {
  return await request.put({ url: `/ppm/shipping/submit?id=` + id })
},

  // 收货确认
  handleConfirm: async (id: string) => {
    return await request.put({url: `/ppm/shipping/confirm?id=` + id})
  },

  // 获得合同订单列表
  getContractOrderListByContractId: async (contractId) => {
    return await request.get({ url: `/ppm/shipping/getOrder?id=` + contractId })
  },

  //获取合同下的发货单详情
  getShippingDetailByContractId: async (contractId) => {
    return await request.get({ url: `/ppm/shipping/getShippingDetail?id=` + contractId })
  },

  //获取发货单集合
  getShippingList: async (status: string) => {
    return await request.get({ url: `/ppm/shipping/list?status=`+status })
  },
// ==================== 子表（销售发货明细） ====================

  // 获得销售发货明细列表
  getShippingDetailListByShippingId: async (shippingId) => {
    return await request.get({ url: `/ppm/shipping/shipping-detail/list-by-shipping-id?shippingId=` + shippingId })
  },
  //根据项目获取发货单详细
    getShippingDetailByProject: async (projectId,contractId,shippingType) => {
        return await request.get({ url: `/ppm/shipping/getShippingDetailByProject?projectId=` + projectId+`&contractId=`+contractId+`&shippingType=`+shippingType })
    },
}
