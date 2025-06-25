import request from '@/config/axios'

// 采购申请主 VO
export interface PurchaseRequirementVO {
  id: string // 主键
  type: number // 采购类型
  applicant: string // 申请人
  applicationDepartment: string // 申请部门
  applicationDate: Date // 申请日期
  applicationReason: string // 申请理由
  creationIp: string // 创建IP
  updatedIp: string // 更新ip
  processInstanceId: string
}

// 采购申请主 API
export const PurchaseRequirementApi = {
  // 查询采购申请主分页
  getPurchaseRequirementPage: async (params: any) => {
    return await request.get({ url: `/ppm/purchase-requirement/page`, params })
  },
    getPurchaseRequirementDetailPage: async (params: any) => {
        return await request.get({ url: `/ppm/purchase-requirement/detailPage`, params })
    },
  // 查询采购申请主详情
  getPurchaseRequirement: async (id: number) => {
    return await request.get({ url: `/ppm/purchase-requirement/get?id=` + id })
  },

  // 新增采购申请主
  createPurchaseRequirement: async (data: PurchaseRequirementVO) => {
    return await request.post({ url: `/ppm/purchase-requirement/create`, data })
  },

  // 修改采购申请主
  updatePurchaseRequirement: async (data: PurchaseRequirementVO) => {
    return await request.put({ url: `/ppm/purchase-requirement/update`, data })
  },

  // 删除采购申请主
  deletePurchaseRequirement: async (id: number) => {
    return await request.delete({ url: `/ppm/purchase-requirement/delete?id=` + id })
  },

  // 导出采购申请主 Excel
  exportPurchaseRequirement: async (params) => {
    return await request.download({ url: `/ppm/purchase-requirement/export-excel`, params })
  },

  getPurchaseRequirementDetailByRequirementId: async (params: any) => {
    return await request.get({ url: `/ppm/purchase-requirement/purchase-requirement-detail/list-by-requirementId`, params })
  },

  // 提交审核
  submitRequirement: async (id: string) => {
    return await request.put({
      url: `ppm/purchase-requirement/submit`,
      params: {
        id
      }
    })
  },

  // 创建并审批合同
  createAndSubmitPurchaseRequirement: async (data: PurchaseRequirementVO) => {
    return await request.post({ url: `/ppm/purchase-requirement/createAndSubmit`, data })
  },
}
