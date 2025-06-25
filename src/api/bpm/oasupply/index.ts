import request from '@/config/axios'

// OA 物品领用 VO
export interface OaSupplyVO {
  id: number // 请假表单主键
  dept: string // 申请人部门
  applicant: string // 申请人
  leader: string // 申请部门领导
  warehouseman: string // 仓库管理员
  reason: string // 申请原因
  // status: number // 审批结果
  // processInstanceId: string // 流程实例的编号
}
// OA 物品领用 VO
export type SupplyType = {
  id: number // 请假表单主键
  dept: string // 申请人部门
  applicant: string // 申请人
  leader: string // 申请部门领导
  warehouseman: string // 仓库管理员
  reason: string // 申请原因
}

// OA 物品领用 API
export const OaSupplyApi = {
  // 查询OA 物品领用分页
  getOaSupplyPage: async (params: any) => {
    return await request.get({ url: `/bpm/oa-supply/page`, params })
  },

  // 查询OA 物品领用详情
  getOaSupply: async (id: number) => {
    return await request.get({ url: `/bpm/oa-supply/get?id=` + id })
  },

  // 新增OA 物品领用
  createOaSupply: async (data: OaSupplyVO) => {
    return await request.post({ url: `/bpm/oa-supply/create`, data })
  },

  // 修改OA 物品领用
  updateOaSupply: async (data: OaSupplyVO) => {
    return await request.put({ url: `/bpm/oa-supply/update`, data })
  },

  // 删除OA 物品领用
  deleteOaSupply: async (id: number) => {
    return await request.delete({ url: `/bpm/oa-supply/delete?id=` + id })
  },

  // 导出OA 物品领用 Excel
  exportOaSupply: async (params) => {
    return await request.download({ url: `/bpm/oa-supply/export-excel`, params })
  },

// ==================== 子表（OA 物品领用表-物品清单） ====================

  // 获得OA 物品领用表-物品清单列表
  getOaSupplyListListBySupplyId: async (supplyId) => {
    return await request.get({ url: `/bpm/oa-supply/oa-supply-list/list-by-supply-id?supplyId=` + supplyId })
  }
}
