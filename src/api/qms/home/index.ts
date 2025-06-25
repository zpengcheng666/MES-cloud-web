import request from '@/config/axios'


// 首页 检验 API
export const InspectionHomeApi = {

  // 待生成
  getInspectionGenerateTaskList: async (params: any) => {
    return await request.get({ url: `/qms/inspection-sheet-generate-task/task/generate/page`, params })
  },

  // 待认领
  getInspectionClaimTaskList: async (params: any) => {
    return await request.get({ url: `/qms/inspection-sheet/task/claim/page`, params })
  },

  // 待检验
  getInspectionTaskList: async (params: any) => {
    return await request.get({ url: `/qms/inspection-sheet/task/inspection/page`, params })
  },

  // 不合格品录入
  getUnqualifiedTaskList: async (params: any) => {
    return await request.get({ url: `/qms/inspection-sheet/task/unqualified/page`, params })
  },

  // 待送检
  getToolVerificationTask: async (params: any) => {
    return await request.get({ url: `/qms/inspection-tool-verification-record/task/verification/page`, params })
  },
}
