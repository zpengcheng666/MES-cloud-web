import request from '@/config/axios'

// 任务分配 VO
export interface ProcessDetailTaskVO {
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
}
export const ProcessDetailTaskApi = {
  //获取当前项目零件目录树表结构
  getProjPartBomTreeList: async (params) => {
    return await request.get({ url: `/pdm/process-detail-task/getProjPartBomTreeList`, params })
  },

  // 获取当前零件目录列表
  getPartListByProcessTaskId: async (params) => {
    return await request.get({ url: `/pdm/process-detail-task/getPartListByProjectCode`, params})
  },

  //指派工艺任务
  assignProcessTask: async (data: ProcessDetailTaskVO) => {
    return await request.post({ url: `/pdm/process-detail-task/assign`, data })
  },

  //编辑工艺任务
  updateProcessTask: async (data: ProcessDetailTaskVO) => {
    return await request.put({ url: `/pdm/process-detail-task/update`, data })
  },
  //获取项目详细信息
  getProcessDetailTask: async (id: number) => {
    return await request.get({ url: `/pdm/process-detail-task/getProcessDetailTask?id=` + id })
  },
}
