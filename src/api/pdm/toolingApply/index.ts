import request from '@/config/axios'

//工装申请信息 VO
export interface ToolingApplyVO {
   id: string
   categoryId: number
   toolingCode: string
   toolingNumber: string
   toolingName: string
   toolingVersion: string
   applyName: string
   quantity: number
   toolingStyle: string
   processType: string
   applyReason: string
   requireTime: string
   equipmentName: string
   equipmentNumber: string
   technicalRequirement: string
   customizedIndex: string
   status: number
   processInstanceId: string
   approvalStatus: string
   applyId: string
   name: string
   parentId: string
}

// 产品分类信息 API
export const ToolingApplyApi = {
  // 查询工装申请信息列表
  getToolingApplyList: async (params: any) => {
    return await request.get({ url: `/pdm/tooling-apply/list`, params })
  },

  getToolingApplyPage: async (params: any) => {
    return await request.get({ url: `/pdm/tooling-apply/page`, params })
  },
  // 查询工装申请信息详情
  getToolingApply: async (id: number) => {
    return await request.get({ url: `/pdm/tooling-apply/get?id=` + id })
  },

  // 新增工装申请信息
  createToolingApply: async (data: ToolingApplyVO) => {
    return await request.post({ url: `/pdm/tooling-apply/create`, data })
  },

  // 修改工装申请信息
  updateToolingApply: async (data: ToolingApplyVO) => {
    return await request.put({ url: `/pdm/tooling-apply/update`, data })
  },

  // 删除工装申请信息
  deleteToolingApply: async (id: number) => {
    return await request.delete({ url: `/pdm/tooling-apply/delete?id=` + id })
  },

  //发起流程
  startApplyInstance: async (data) => {
    return await request.put({ url: `/pdm/tooling-apply/startApplyInstance`, data })
  },
}
