import request from '@/config/axios'

// 项目计划 VO
export interface PlanVO {
  id: string // 项目计划id
  projectOrderId: string // 项目订单编号(项目订单ID)
  projectId: string // 项目id
  projectCode: string // 项目编码
  remark: string // 备注
  materialNumber: string // 物料牌号	产品编号(产品ID(与工艺内产品版本ID对应))		这里写的是material。在产品里是partNumber，图号。在物料里是material。
  partNumber: string // 图号
  partName: string // 工件名称
  orderType: number // 订单类型(0为外部销售订单，1为内部自制订单)
  outSourceAmount: number // 外协数量(向外委派)，默认为0，项目评审时，产能评估填写，为0就是不用外协
  quantity: number // 数量
  processType: number // 带料加工(是/否)
  processCondition: string // 加工状态
  status: number // 审批结果
  processInstanceId: string // 流程实例的编号
  processScheme: string // 工艺方案(id)
  remindInfo: string // 提醒
  purchaseCompletionTime: Date // 采购完成时间
  processPreparationTime: Date // 工艺准备完成时间
  productionPreparationTime: Date // 生产准备完成时间
  warehousingTime: Date // 入库时间
  checkoutCompletionTime: Date // 完成检验时间
  planDeliveryTime: Date // 计划交付时间
}

// 项目计划 API
export const PlanApi = {
  // 查询项目计划分页
  getPlanPage: async (params: any) => {
    return await request.get({ url: `/pms/plan/page`, params })
  },

  // 查询项目计划详情
  getPlan: async (id: number) => {
    return await request.get({ url: `/pms/plan/get?id=` + id })
  },

  // 新增项目计划
  createPlan: async (data: PlanVO) => {
    return await request.post({ url: `/pms/plan/create`, data })
  },

  // 新增项目计划
  createPlanBpm: async (data: PlanVO) => {
    return await request.post({ url: `/pms/plan/createBpm`, data })
  },
  createPlanBpm2: async (data: PlanVO) => {
    return await request.post({ url: `/pms/plan/createBpm2`, data })
  },

  // 修改项目计划
  updatePlan: async (data: PlanVO) => {
    return await request.put({ url: `/pms/plan/update`, data })
  },

  // 删除项目计划
  deletePlan: async (id: number) => {
    return await request.delete({ url: `/pms/plan/delete?id=` + id })
  },

  // 导出项目计划 Excel
  exportPlan: async (params) => {
    return await request.download({ url: `/pms/plan/export-excel`, params })
  },
  //获取工艺方案列表
  getProjPartBomPlanList: async (params: any) => {
    return await request.get({ url: `/pms/plan/getProjPartBomPlanList`, params })
  },
  //通过项目id获取计划
  getProjPartBomPlanList: async (params: any) => {
    return await request.get({ url: `/pms/plan/getProjPartBomPlanList`, params })
  },

  //物料选取
  getPrepareMaterial: async (materialNumber) => {
    return await request.get({ url: `/pms/plan/getPrepareMaterial?materialNumber=` + materialNumber })
  },

  //物料选取
  selectProcessScheme: async (data) => {
    return await request.post({ url: `/pms/plan/selectProcessScheme` , data})
  },

  //物料选取
  batchSelect: async (data) => {
    return await request.post({ url: `/pms/plan/batchSelect`, data})
  },

  //批量采购下单(要拆分)
  batchPurchaseAndOrder: async (data) => {
    return await request.post({ url: `/pms/plan/batchPurchaseAndOrder`, data})
  },
  //批量采购
  batchPurchase: async (data) => {
    return await request.post({ url: `/pms/plan/batchPurchase`, data})
  },

  // 查询项目计划分页
  getPPOPage: async (params: any) => {
    return await request.get({ url: `/pms/plan/pagePPO`, params })
  },

  // 查询项目计划详情
  getPlanWith: async (params: any) => {
    return await request.get({ url: `/pms/plan/listWith`, params })
  },

  // 可选工艺展示
  showProcessScheme: async () => {
    return await request.get({ url: `/pms/plan/showProcessScheme`})
  },

// ==================== 子表（项目计划子表，产品计划完善） ====================

  // 获得项目计划子表，产品计划完善列表
  getPlanItemListByProjectPlanId: async (projectPlanId) => {
    return await request.get({ url: `/pms/plan/plan-item/list-by-project-plan-id?projectPlanId=` + projectPlanId })
  },
  createPlanItem : async (data) => {
    return await request.post({ url: `/pms/plan/plan-item/create-plan-item`, data })
  },
  //通过计划id创建订单
  createPlanItemByIds : async (ids) => {
    return await request.get({ url: `/pms/plan/plan-item/create-plan-item-byids?ids=` + ids })
  },
  //创建物料采购计划,毛坯的
  creatMaterialPurchsePlan : async (data) => {
    return await request.post({ url: `/pms/plan/plan-item/creatMaterialPurchsePlan`, data })
  },
  //创建物料采购计划,外协的
  creatStepOutsourcePurchsePlan : async (data) => {
    return await request.post({ url: `/pms/plan/plan-item/creatStepOutsourcePurchsePlan`, data })
  },
  //获取工序列表
  getProcedureListByProcessVersionId : async (processVersionId) => {
    return await request.get({ url: `/pms/plan/plan-item/getProcedureListByProcessVersionId?processVersionId=`+  processVersionId})
  },
  // 删除项目计划
  deletePlanItem: async (id: number) => {
    return await request.delete({ url: `/pms/plan/plan-item/delete-plan-item?id=` + id })
  },
}
