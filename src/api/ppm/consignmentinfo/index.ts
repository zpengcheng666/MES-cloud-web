import request from '@/config/axios'

// 收货产品 VO
export interface ConsignmentInfoVO {
  id: string // ID
  consignmentId: string // 收货单ID
  contractId: string // 合同ID
  orderId: string // 合同订单ID
  materialId: string // 物料类型ID
  consignedAmount: number // 发货数量
  signedAmount: number // 签收数量
  signedBy: string // 签收人
  signedTime: Date // 签收日期
  projectId: string // 项目ID
  projectOrderId: string // 项目订单ID
  projectPlanId: string // 项目计划ID
  projectPlanItemId: string // 项目子计划ID
  consignmentStatus: number // 状态  状态  0已创建 1审批中 2待签收 3 入库中4待质检5质检中 6结束 7审批不通过 8已作废9待确认
  consignmentType: number // 收货单类型1采购收货2外协收获3外协原材料退货4委托加工收货5销售退货
}

// 收货产品 API
export const ConsignmentInfoApi = {
  // 查询收货产品分页
  getConsignmentInfoPage: async (params: any) => {
    return await request.get({ url: `/ppm/consignment-info/page`, params })
  },

    getConsignmentDetailPage: async (params: any) => {
        return await request.get({ url: `/ppm/consignment-info/detailPage`, params })
    },


  // 查询收货产品详情
  getConsignmentInfo: async (id: number) => {
    return await request.get({ url: `/ppm/consignment-info/get?id=` + id })
  },

  // 新增收货产品
  createConsignmentInfo: async (data: ConsignmentInfoVO) => {
    return await request.post({ url: `/ppm/consignment-info/create`, data })
  },

  // 修改收货产品
  updateConsignmentInfo: async (data: ConsignmentInfoVO) => {
    return await request.put({ url: `/ppm/consignment-info/update`, data })
  },


    signConsignmentInfo: async (data: ConsignmentInfoVO) => {
        return await request.put({ url: `/ppm/consignment-info/sign`, data })
    },

    signMaterial: async (data: ConsignmentInfoVO) => {
        return await request.put({ url: `/ppm/consignment-info/signMaterial`, data })
    },

  // 删除收货产品
  deleteConsignmentInfo: async (id: number) => {
    return await request.delete({ url: `/ppm/consignment-info/delete?id=` + id })
  },

  // 导出收货产品 Excel
  exportConsignmentInfo: async (params) => {
    return await request.download({ url: `/ppm/consignment-info/export-excel`, params })
  },
}
