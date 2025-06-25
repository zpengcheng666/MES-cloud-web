import request from '@/config/axios'

// pms 立项表,项目立项相关 VO
export interface ApprovalVO {
  id: string // 立项id
  projectCode: string // 项目编码
  projectName: string // 项目名称
  projectType: number // 自研/销售 (父部门id)
  projectContract: string // 项目合同，如销售项目则可以填写销售合同
  budget: number // 项目预算(万元)
  projectClient: string // 客户(企业ID)
  description: string // 项目简述
  prestartTime: Date // 预计开始时间
  preendTime: Date // 预计结束时间
  responsiblePerson: number // 负责人(人员ID)
  projectManager: number // 项目经理(ID)
  needsAssessment: number // 是否需要评估
  strategy: number // 战略评估
  technology: number // 技术评估
  capacity: number // 产能评估
  cost: number // 成本评估
  technicalMaterials: string // 项目技术材料
  contactId: number // 客户联系人(id)
  order:object
}

// pms 立项表,项目立项相关 API
export const ApprovalApi = {
  // 查询pms 立项表,项目立项相关分页
  getApprovalPage: async (params: any) => {
    return await request.get({ url: `/pms/approval/page`, params })
  },

  // 查询pms 立项表,项目立项相关详情
  getApproval: async (id: number) => {
    return await request.get({ url: `/pms/approval/get?id=` + id })
  },

  //查询全部项目,多用于下拉
  getApprovalAll:async ()=> {
    return await request.get({url: `/pms/approval/all`})
  },

  //查询全部合同,多用于下拉
  getContractListAll:async ()=> {
    return await request.get({url: `/pms/approval/getContractListAll`})
  },

  // 新增pms 立项表,项目立项相关
  createApproval: async (data: ApprovalVO) => {
    return await request.post({ url: `/pms/approval/create`, data })
  },
  // 新增pms 立项表,项目立项相关
  createApprovalWithOrder: async (data: ApprovalVO) => {
    return await request.post({ url: `/pms/approval/createWithOrder`, data })
  },
  // 立项审批
  createApprovalBpm: async (data: ApprovalVO) => {
    return await request.post({ url: `/pms/approval/createBpm`, data })
  },
  // 立项审批
  createApprovalBpm2: async (data: ApprovalVO) => {
    return await request.post({ url: `/pms/approval/createBpm2`, data })
  },

  // 修改pms 立项表,项目立项相关
  updateApproval: async (data: ApprovalVO) => {
    return await request.put({ url: `/pms/approval/update`, data })
  },

  // 项目结算,项目状态改为已结束
  projectClose: async (data: ApprovalVO) => {
    return await request.put({ url: `/pms/approval/projectClose`, data })
  },

  // 删除pms 立项表,项目立项相关
  deleteApproval: async (id: number) => {
    return await request.delete({ url: `/pms/approval/delete?id=` + id })
  },

  // 导出pms 立项表,项目立项相关 Excel
  exportApproval: async (params) => {
    return await request.download({ url: `/pms/approval/export-excel`, params })
  },

  //根据项目编码查询项目
  getByProjectCode:async (code)=> {
  return await request.get({url: `/pms/approval/getByProjectCode?code=` + code})
},

  //根据审批状态查询项目
  getByStatusList:async (statusList)=> {
    return await request.get({url: `/pms/approval/getByStatus?status=` + statusList})
  },
  //根据项目状态查询项目
  getByProjectStatusList:async (statusList)=> {
    return await request.get({url: `/pms/approval/getByProjectStatus?status=` + statusList})
  },

  //查询项目采购明细
  getPurchaseDetail:async (id)=> {
    return await request.get({url: `/pms/approval/getPurchaseDetail?id=` + id})
  },

  //查询项目采购明细
  projectProgress:async ()=> {
    return await request.get({url: `/pms/approval/projectProgress`})
  },

  // ==================== 子表（项目评审） ====================

  // 获得项目评审列表
  getAssessmentListByProjectId: async (projectId) => {
    return await request.get({ url: `/pms/approval/assessment/list-by-project-id?projectId=` + projectId })
  },

  // ==================== 子表（项目订单） ====================

  // 获得项目订单列表
  getOrderListByProjectId: async (projectId) => {
    return await request.get({ url: `/pms/approval/order/list-by-project-id?projectId=` + projectId })
  },
  //查询项目采购明细
  orderProgress:async ()=> {
    return await request.get({url: `/pms/approval/orderProgress`})
  },
}
