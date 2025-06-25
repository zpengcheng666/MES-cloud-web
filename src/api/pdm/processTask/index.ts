import request from '@/config/axios'
import {FeasibilityTaskVO} from "@/api/pdm/feasibilityTask";

//  工艺任务分配 VO
export interface ProcessTaskVO {
   id: string;
   projectCode:string
   partVersionId:string
   reviewedBy:string
   reviewer:string
   partNumber:string
   deadline:Date
   status: string
   processVersionId:string
   processInstanceId:string
   approvalStatus:string
   creator:string
   createTime: Date
   updater:string
   updateTime: Date
   taskId:string
   processCondition:string
   partVersionIdArr:string[]
   taskIdArr: string[]
   processPreparationTime:Date
}

// PDM  工艺技术评估任务 API
export const ProcessTaskApi ={

  //获取项目详细信息
  getProcessTask: async (id: number) => {
    return await request.get({ url: `/pdm/process-task/getProcessTask?id=` + id })
  },

  //获取当前零件目录列表
  getPartListByProcessTaskId: async (params) => {
    return await request.get({ url: `/pdm/process-task/getPartListByProjectCode`, params})
  },

  //添加工艺任务
  addProcessTask: async (data: ProcessTaskVO) => {
    return await request.post({ url: `/pdm/process-task/add`, data })
  },
  //编辑工艺任务
  updateProcessTask: async (data: ProcessTaskVO) => {
    return await request.put({ url: `/pdm/process-task/update`, data })
  },
  //获取当前零件目录列表
  getPartListByProjectCode: async (params) => {
    return await request.get({ url: `/pdm/process-task-new/getPartListByProjectCode`, params})
  },

  //添加指派任务
  addProcessTaskNew: async (data: ProcessTaskVO) => {
    return await request.post({ url: `/pdm/process-task-new/addNewProcessTask`, data })
  },
}

