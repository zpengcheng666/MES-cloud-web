import request from '@/config/axios'

// OA 采购申请 VO
export interface OaPurchaseVO {
  id: number // 请假表单主键
  dept: string // 申请人部门
  applicant: string // 申请人
  purchaseAgent: string // 采购人
  supplier: string //供应商
  supplyCode: string,
  contact: string,
  tel: string,
  // status: number // 审批结果
  // processInstanceId: string // 流程实例的编号
}

// OA 采购申请 type
export type PurchaseVO = {
  id: number // 请假表单主键
  dept: string // 申请人部门
  applicant: string // 申请人
  purchaseAgent: string // 采购人
  supplier: string //供应商
  supplyCode: string,
  contact: string,
  tel: string,
}

// OA 采购申请 API
export const OaPurchaseApi = {
  // 查询OA 采购申请分页
  getOaPurchasePage: async (params: any) => {
    return await request.get({ url: `/bpm/oa-purchase/page`, params })
  },

  // 查询OA 采购申请详情
  getOaPurchase: async (id: number) => {
    return await request.get({ url: `/bpm/oa-purchase/get?id=` + id })
  },

  // 新增OA 采购申请
  createOaPurchase: async (data: OaPurchaseVO) => {
    return await request.post({ url: `/bpm/oa-purchase/create`, data })
  },

  // 修改OA 采购申请
  updateOaPurchase: async (data: OaPurchaseVO) => {
    return await request.put({ url: `/bpm/oa-purchase/update`, data })
  },

  // 删除OA 采购申请
  deleteOaPurchase: async (id: number) => {
    return await request.delete({ url: `/bpm/oa-purchase/delete?id=` + id })
  },

  // 导出OA 采购申请 Excel
  exportOaPurchase: async (params) => {
    return await request.download({ url: `/bpm/oa-purchase/export-excel`, params })
  },

// ==================== 子表（OA 采购申请） ====================

  // 获得OA 采购申请列表
  getOaPurchaseListListByPurchaseId: async (purchaseId) => {
    return await request.get({ url: `/bpm/oa-purchase/oa-purchase-list/list-by-purchase-id?purchaseId=` + purchaseId })
  }
}
