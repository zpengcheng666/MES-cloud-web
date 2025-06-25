import request from '@/config/axios'

// 外协发货 VO
export interface ContractConsignmentVO {
  id: string // 主键
  consignmentNo: string // 发货单编号
  consignmentName: string // 发货单名称
  contractId: string // 合同ID
  companyId: string // 公司ID
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
  consignmentStatus: number // 状态  0已创建 1审批中 2 待出库 3出库中4待发货5结束 9取消
}

// 外协发货 API
export const ContractConsignmentApi = {
  // 查询外协发货分页
  getContractConsignmentPage: async (params: any) => {
    return await request.get({ url: `/ppm/contract-consignment/page`, params })
  },

  // 查询外协发货详情
  getContractConsignment: async (id: number) => {
    return await request.get({ url: `/ppm/contract-consignment/get?id=` + id })
  },

  // 新增外协发货
  createContractConsignment: async (data: ContractConsignmentVO) => {
    return await request.post({ url: `/ppm/contract-consignment/create`, data })
  },

  // 修改外协发货
  updateContractConsignment: async (data: ContractConsignmentVO) => {
    return await request.put({ url: `/ppm/contract-consignment/update`, data })
  },

    // 新增外协发货
    createContractConsignmentAndSubmit: async (data: ContractConsignmentVO) => {
        return await request.post({ url: `/ppm/contract-consignment/createAndSubmit`, data })
    },

    // 修改外协发货
    updateContractConsignmentAndSubmit: async (data: ContractConsignmentVO) => {
        return await request.put({ url: `/ppm/contract-consignment/updateAndSubmit`, data })
    },

  // 删除外协发货
  deleteContractConsignment: async (id: number) => {
    return await request.delete({ url: `/ppm/contract-consignment/delete?id=` + id })
  },
  //提交审核
    submitContractConsignment: async (id: number) => {
        return await request.put({ url: `/ppm/contract-consignment/submit?id=` + id })
    },
  // 导出外协发货 Excel
  exportContractConsignment: async (params) => {
    return await request.download({ url: `/ppm/contract-consignment/export-excel`, params })
  },

    //出库扫码确认
    confirmShipping: async (id: string) => {
        return await request.put({ url: `/ppm/contract-consignment/confirmShipping?id=` + id })
    },


// ==================== 子表（外协发货单详情） ====================

  // 获得外协发货单详情列表
  getContractConsignmentDetailListByConsignmentId: async (consignmentId) => {
    return await request.get({ url: `/ppm/contract-consignment/contract-consignment-detail/list-by-consignment-id?consignmentId=` + consignmentId })
  },
}
