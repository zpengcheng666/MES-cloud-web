import request from '@/config/axios'

// 采购收货 VO
export interface PurchaseConsignmentVO {
  consignmentName:string,
  id: string // ID
  contractId: string // 合同ID
  consignedBy: string // 收货人
  consignedDate: Date // 收货日期
  consignedContact: string // 收货人联系方式
  consigner: string // 发货人
  consignerContact: string // 发货人联系方式
  consignerDate: Date // 发货日期
  deliveryMethod: number // 承运方式
  deliveryNumber: string // 承运单号
  deliveryBy: string // 承运人
  deliveryContact: string // 承运人电话
  processInstanceId: string // 流程实例编号
  status: number // 审批结果
  consignmentNo: string
  consignmentStatus: number //状态  0已创建 1审批中 2待发货 3运输中 4 待入库 5结束 6审批不通过 7已作废
}

// 采购收货 API
export const PurchaseConsignmentApi = {
  // 查询采购收货分页
  getPurchaseConsignmentPage: async (params: any) => {
    return await request.get({ url: `/ppm/purchase-consignment/page`, params })
  },

  // 查询采购收货详情
  getPurchaseConsignment: async (id: number) => {
    return await request.get({ url: `/ppm/purchase-consignment/get?id=` + id })
  },

  // 新增采购收货
  createPurchaseConsignmentCreate: async (data: PurchaseConsignmentVO) => {
    return await request.post({ url: `/ppm/purchase-consignment/create`, data })
  },
  //新增采购收货并提交审批
  createPurchaseConsignmentCreateAndSubmit: async (data: PurchaseConsignmentVO) =>{
    return await request.post({url:'/ppm/purchase-consignment/createAndSubmit',data})
  },

  // 修改采购收货
  updatePurchaseConsignment: async (data: PurchaseConsignmentVO) => {
    return await request.put({ url: `/ppm/purchase-consignment/update`, data })
  },

  // 修改采购收货并提交审批
  updatePurchaseConsignmentAndSubmit: async (data: PurchaseConsignmentVO) => {
    return await request.put({ url: `/ppm/purchase-consignment/updateAndSubmit`, data })
  },


  // 删除采购收货
  deletePurchaseConsignment: async (id: number) => {
    return await request.delete({ url: `/ppm/purchase-consignment/delete?id=` + id })
  },

  // 作废销售发货
  cancelPurchaseConsignment: async (id: string) => {
    return await request.put({ url: `/ppm/purchase-consignment/cancel?id=` + id })
  },

  // 导出采购收货 Excel
  exportPurchaseConsignment: async (params) => {
    return await request.download({ url: `/ppm/purchase-consignment/export-excel`, params })
  },



  // 确认收货
  handleConfirm: async (id: string) => {
    return await request.put({url: `/ppm/purchase-consignment/confirm?id=` + id})
  },

  //提交审核
  submitPurchaseConsignment:async (id: string)=>{
    return await request.put({ url: `/ppm/purchase-consignment/submit?id=` + id })
  },

  // 获得合同订单列表
  getContractOrderListByContractId: async (contractId) => {
    return await request.get({ url: `/ppm/purchase-consignment/getOrder?id=` + contractId })
  },

  //获取合同下的发货单详情
  getConsignmentDetailByContractId: async (contractId) => {
    return await request.get({ url: `/ppm/purchase-consignment/getConsignmentDetail?id=` + contractId })
  },


    // 提交质检单
    updatePurchaseConsignmentForQms: async (data: PurchaseConsignmentVO) => {
        return await request.put({ url: `/ppm/purchase-consignment/updateForQms`, data })
    },


// ==================== 子表（收货明细） ====================

  // 获得收货明细列表
  getPurchaseConsignmentDetailListByConsignmentId: async (consignmentId) => {
    return await request.get({ url: `/ppm/purchase-consignment/purchase-consignment-detail/list-by-consignment-id?consignmentId=` + consignmentId })
  },
    getPurchaseConsignmentDetailListByProjectId: async (projectId,contractId,consignmentType) => {
        return await request.get({ url: `/ppm/purchase-consignment/purchase-consignment-detail/list-by-project-id?projectId=` + projectId+`&contractId=`+contractId +`&consignmentType=`+consignmentType })
    },


    getPurchaseConsignmentDetailListByConsignmentIdForQms: async (consignmentId) => {
        return await request.get({ url: `/ppm/purchase-consignment/purchase-consignment-detail/list-by-consignment-id-qms?consignmentId=` + consignmentId })
    },
}
