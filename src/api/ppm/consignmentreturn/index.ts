import request from '@/config/axios'

// 采购退货单 VO
export interface ConsignmentReturnVO {
  id: string // 主键
  consignmentDetailId: string
  consignmentReturnNo: string // 退货单编号
  consignmentReturnName: string // 退货单名称
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
  consignmentStatus: number // 状态  0已创建 1审批中 2待出库 3待确认 4 运输中 5结束 6审批不通过 7已作废
  fileUrl: string // 附件地址
  remark: string // 备注
  consignmentNo: string
}

// 采购退货单 API
export const ConsignmentReturnApi = {
  // 查询采购退货单分页
  getConsignmentReturnPage: async (params: any) => {
    return await request.get({ url: `/ppm/consignment-return/page`, params })
  },

  // 查询采购退货单详情
  getConsignmentReturn: async (id: number) => {
    return await request.get({ url: `/ppm/consignment-return/get?id=` + id })
  },

  // 作废采购退货
  cancelConsignmentReturn: async (id: string) => {
    return await request.put({ url: `/ppm/consignment-return/cancel?id=` + id })
  },

  // 新增采购退货单
  createConsignmentReturn: async (data: ConsignmentReturnVO) => {
    return await request.post({ url: `/ppm/consignment-return/create`, data })
  },

  // 新增采购退货单并提交审核
  createConsignmentReturnAndAudit: async (data: ConsignmentReturnVO) => {
    return await request.post({ url: `/ppm/consignment-return/createAndAudit`, data })
  },

  // 修改采购退货单
  updateConsignmentReturn: async (data: ConsignmentReturnVO) => {
    return await request.put({ url: `/ppm/consignment-return/update`, data })
  },

  // 修改采购退货单并提交审核
  updateConsignmentReturnAndAudit: async (data: ConsignmentReturnVO) => {
    return await request.put({ url: `/ppm/consignment-return/updateAndAudit`, data })
  },

  // 删除采购退货单
  deleteConsignmentReturn: async (id: number) => {
    return await request.delete({ url: `/ppm/consignment-return/delete?id=` + id })
  },

  // 导出采购退货单 Excel
  exportConsignmentReturn: async (params) => {
    return await request.download({ url: `/ppm/consignment-return/export-excel`, params })
  },

  //提交审核
  submitConsignmentReturn:async (id: string)=>{
    return await request.put({ url: `/ppm/consignment-return/submit?id=` + id })
  },

  //获取合同下的退货单
  getConsignmentReturnByContract: async(contractId) =>{
    return await request.get({url: `/ppm/consignment-return/list-by-contract?contractId=` + contractId})
  },
    getPurchaseByContract: async(contractId) =>{
        return await request.get({url: `/ppm/consignment-return/purchases-by-contract?contractId=` + contractId})
    },


  // ========================= 子表（采购退货单详情） ============================
  //获取采购退货单详情列表
  getConsignmentReturnDetailListByConsignmentReturnId: async (consignmentReturnId) => {
    return await request.get({ url: `/ppm/consignment-return/consignment-return-detail/list-by-consignment-return-id?consignmentReturnId=` + consignmentReturnId })
  },

}
