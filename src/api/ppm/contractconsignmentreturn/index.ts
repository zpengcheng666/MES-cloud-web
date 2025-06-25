import request from '@/config/axios'

// 外协退货 VO
export interface ContractConsignmentReturnVO {
  id: string // 主键
  name: string // 入库单名称
  no: string // 入库单
  contractId: string // 合同ID
  companyId: string // 公司ID
  projectId: string // 项目ID
  status: number // 审批状态
  processInstanceId: string // 工作流编号
  fileUrl: string // 附件地址
  returnStatus: number // 状态0已创建 1审批中 2 待签收 3待入库 4结束 8 审批失败 9作废
  consigner: string // 退货人
  consignerDate: Date // 退货日期
  consignedBy: string // 接收人
  consignedDate: Date // 收货日期
  consignedContact: string // 收货人联系方式
  returnType: number // 处理方式 1返修2换货3退货退款
  returnReason: string // 退换货原因
}

// 外协退货 API
export const ContractConsignmentReturnApi = {
  // 查询外协退货分页
  getContractConsignmentReturnPage: async (params: any) => {
    return await request.get({ url: `/ppm/contract-consignment-return/page`, params })
  },

  // 查询外协退货详情
  getContractConsignmentReturn: async (id: number) => {
    return await request.get({ url: `/ppm/contract-consignment-return/get?id=` + id })
  },

  // 新增外协退货
  createContractConsignmentReturn: async (data: ContractConsignmentReturnVO) => {
    return await request.post({ url: `/ppm/contract-consignment-return/create`, data })
  },
    // 新增外协退货
    createContractConsignmentReturnAndSubmit: async (data: ContractConsignmentReturnVO) => {
        return await request.post({ url: `/ppm/contract-consignment-return/createAndSubmit`, data })
    },
  // 修改外协退货
  updateContractConsignmentReturn: async (data: ContractConsignmentReturnVO) => {
    return await request.put({ url: `/ppm/contract-consignment-return/update`, data })
  },

    // 修改外协退货
    updateContractConsignmentReturnAndSubmit: async (data: ContractConsignmentReturnVO) => {
        return await request.put({ url: `/ppm/contract-consignment-return/updateAndSubmit`, data })
    },

  // 删除外协退货
  deleteContractConsignmentReturn: async (id: number) => {
    return await request.delete({ url: `/ppm/contract-consignment-return/delete?id=` + id })
  },
    //作废退货单
    cancelContractConsignmentReturn: async (id: number) => {
        return await request.put({url: `/ppm/contract-consignment-return/cancel?id=` + id})
    },
  // 导出外协退货 Excel
  exportContractConsignmentReturn: async (params) => {
    return await request.download({ url: `/ppm/contract-consignment-return/export-excel`, params })
  },



// 提交退货审核
    submitContractConsignmentReturn: async (id: string) => {
        return await request.put({url: `/ppm/contract-consignment-return/submit?id=` + id})
    },


// ==================== 子表（外协退货单详情） ====================

  // 获得外协退货单详情列表
  getContractConsignmentReturnDetailListByConsignmentReturnId: async (consignmentReturnId) => {
    return await request.get({ url: `/ppm/contract-consignment-return/contract-consignment-return-detail/list-by-consignment-return-id?consignmentReturnId=` + consignmentReturnId })
  },
}
