import request from '@/config/axios'

//  工艺评任务分配 VO
export interface FeasibilityTaskVO {
   id: string;
   projectCode:string
   partVersionId:string
   reviewedBy:string
   reviewer:string
   partNumber:string
   deadline:Date
   status: string
   taskMessageId:string
   creator:string
   createTime: Date
   updater:string
   updateTime: Date
   taskId:string
   partVersionIdArr:string[]
   taskIdArr:string[]
}

// PDM  工艺技术评估任务 API
export const FeasibilityTaskApi ={

  //获取项目详细信息
  getFeasibilityTask: async (id: number) => {
    return await request.get({ url: `/pdm/feasibility-task/getFeasibilityTask?id=` + id })
  },

  //获取当前零件目录列表
  getPartListByFeasibilityTaskId: async (params) => {
    return await request.get({ url: `/pdm/feasibility-task/getPartListByProjectCode`, params})
  },

  //添加指派任务
  addFeasibilityTask: async (data: FeasibilityTaskVO) => {
    return await request.post({ url: `/pdm/feasibility-task/add`, data })
  },
  //编辑指派任务
  updateFeasibilityTask: async (data: FeasibilityTaskVO) => {
    return await request.put({ url: `/pdm/feasibility-task/update`, data })
  },

  //获取当前零件目录列表
  getPartListByProjectCode: async (params) => {
    return await request.get({ url: `/pdm/feasibility-task-new/getPartListByProjectCode`, params})
  },

  //添加指派任务
  addFeasibilityTaskNew: async (data: FeasibilityTaskVO) => {
    return await request.post({ url: `/pdm/feasibility-task-new/add`, data })
  },
}

