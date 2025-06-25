import request from '@/config/axios'

// 销售退货单 VO
export interface ShippingReturnVO {
  id: string // 主键
  shippingId: string // 发货单
  contractId: string // 合同ID
  consigner: string // 退货人
  consignerDate: Date // 退货日期
  consignedBy: string // 接收人
  consignedDate: Date // 收货日期
  consignedContact: string // 收货人联系方式
  returnType: number // 处理方式 1返修2换货3退货退款4仅退款
  returnReason: string // 退换货原因
  processInstanceId: string // 工作流编号
  status: number // 审批状态
  shippingStatus: number // 状态  0已创建 1审批中 2 待退货 3运输中 4结束 9取消
  fileUrl: string // 附件地址
  remark: string // 备注
}

// 销售退货单 API
export const ShippingReturnApi = {
  // 查询销售退货单分页
  getShippingReturnPage: async (params: any) => {
    return await request.get({url: `/ppm/shipping-return/page`, params})
  },

  // 查询销售退货单详情
  getShippingReturn: async (id: number) => {
    return await request.get({url: `/ppm/shipping-return/get?id=` + id})
  },

  // 新增销售退货单
  createShippingReturn: async (data: ShippingReturnVO) => {
    return await request.post({url: `/ppm/shipping-return/create`, data})
  },

  // 新增销售退货单并提交审核
  createShippingReturnAndAudit: async (data: ShippingReturnVO) => {
    return await request.post({url: `/ppm/shipping-return/createAndAudit`, data})
  },

  // 修改销售退货单
  updateShippingReturn: async (data: ShippingReturnVO) => {
    return await request.put({url: `/ppm/shipping-return/update`, data})
  },

  // 修改销售退货单并提交审核
  updateShippingReturnAndAudit: async (data: ShippingReturnVO) => {
    return await request.put({url: `/ppm/shipping-return/updateAndAudit`, data})
  },


// 提交退货审核
  submitShippingReturn: async (id: string) => {
    return await request.put({url: `/ppm/shipping-return/submit?id=` + id})
  },

  // 删除销售退货单
  deleteShippingReturn: async (id: number) => {
    return await request.delete({url: `/ppm/shipping-return/delete?id=` + id})
  },

    //作废退货单
    cancelShippingReturn: async (id: number) => {
        return await request.put({url: `/ppm/shipping-return/cancel?id=` + id})
    },


    // 导出销售退货单 Excel
  exportShippingReturn: async (params) => {
    return await request.download({url: `/ppm/shipping-return/export-excel`, params})
  },

  //获取合同下的退货单
  getShippingReturnByContract: async (contractId: string, contractRefundId: string) => {
    return await request.get({url: `/ppm/shipping-return/list-by-contract?contractId=` + contractId +'&contractRefundId='+contractRefundId})
  },

// ==================== 子表（销售退货单详情） ====================

  // 获得销售退货单详情列表
  getShippingReturnDetailListByShippingReturnId: async (shippingReturnId) => {
    return await request.get({url: `/ppm/shipping-return/shipping-return-detail/list-by-shipping-return-id?shippingReturnId=` + shippingReturnId})
  },
}
