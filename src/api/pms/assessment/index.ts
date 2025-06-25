import request from '@/config/axios'

// 项目评审 VO
export interface AssessmentVO {
  id: string // 评审id
  projectId: string // 项目id
  reasonType: number // 发起原因(新立项/修改)
  assessmentType: number // 类型(技术、采购、检验)
  assessmentStatus: number // 状态(未开启、评估中、评估结束)
  assessmentPerson: string // 评估人
  instruction: string // 评估说明
  conclusion: string // 结论
  startTime: Date // 开始时间
  endTime: Date // 结束时间
  prefinishTime: Date // 预计完成时间
  auditor: string // 审核人id
  auditDate: Date // 审核日期
  auditOpinion: string // 审核意见
  processInstanceId: string // 流程实例的编号
  status: number // 审批结果
  technologyAssessmentStatus: number // 技术评估状态
  capacityAssessmentStatus: number // 产能评估状态
  costAssessmentStatus: number // 成本评估状态
  strategyAssessmentStatus: number // 成本评估状态
}

// 项目评审 API
export const AssessmentApi = {
  // 查询项目评审分页
  getAssessmentPage: async (params: any) => {
    return await request.get({ url: `/pms/assessment/page`, params })
  },

  // 查询项目评审详情
  getAssessment: async (id: number) => {
    return await request.get({ url: `/pms/assessment/get?id=` + id })
  },

  // 新增项目评审
  createAssessment: async (data: AssessmentVO) => {
    return await request.post({ url: `/pms/assessment/create`, data })
  },

  // 修改项目评审
  updateAssessment: async (data: AssessmentVO) => {
    return await request.put({ url: `/pms/assessment/update`, data })
  },

  // 删除项目评审
  deleteAssessment: async (id: number) => {
    return await request.delete({ url: `/pms/assessment/delete?id=` + id })
  },

  // 导出项目评审 Excel
  exportAssessment: async (params) => {
    return await request.download({ url: `/pms/assessment/export-excel`, params })
  },
  getContractOrder: async (id: number) => {
    return await request.get({ url: `/pms/assessment/getContractOrder?id=` + id })
  },
  //获取技术评审相关数据
  getTechnologyAssessment: async (projectCode: string) => {
    return await request.get({ url: `/pms/assessment/getTechnologyAssessment?projectCode=` + projectCode })
  },

  // 新增技术评审相关数据
  createTechnologyAssessment: async (data) => {
    return await request.post({ url: `/pms/assessment/createTechnologyAssessment`, data })
  },

  // 获取评审相关设备
  getAssessmentDeviceListMap: async (assessmentId) => {
    return await request.get({ url: `/pms/assessment/assessment-device/list-by-assessment-id-map?assessmentId=`+assessmentId })
  },

  // 获取评审相关设备
  getOrderByAssessmentId: async (assessmentId) => {
    return await request.get({ url: `/pms/assessment/getOrderByAssessmentId?id=`+assessmentId })
  },

  // 更新评审相关审批人
  updateAuditor: async (data) => {
    return await request.post({ url: `/pms/assessment/updateAuditor`, data })
  },

// ==================== 子表（评审子表，评审补充） ====================

  // 获得评审子表，评审补充列表
  getAssessmentReplenishListByAssessmentId: async (assessmentId) => {
    return await request.get({ url: `/pms/assessment/assessment-replenish/list-by-assessment-id?assessmentId=` + assessmentId })
  },
}
