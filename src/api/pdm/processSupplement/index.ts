import request from '@/config/axios'

// CAPP 补加工工艺规程 VO
export interface ProcessSupplementVO {
  id: string
  projectCode: string
  partNumber: string
  processVersionId: string
  procedureId: string
  procedureNum: string
  procedureIdNext: string
  procedureNumNext: string
  processCodeSupplement: string
  description: string
  status: string
  processInstanceId: string
  approvalStatus: string
}

// CAPP 补加工工艺规程 API
export const ProcessSupplementApi ={
  //查询补加工工艺规程列表
  getProcessSupplementPage: async (params: PageParam) => {
    return await request.get({url: '/pdm/process-supplement/page',params})
  },
  //查询补加工工艺规程
  getProcessSupplement: async (id: number) => {
    return await request.get({url: '/pdm/process-supplement/get?id=' + id})
  },
  //新增补加工工艺规程
  createProcessSupplement: async (data: ProcessSupplementVO) => {
    return await request.post({url: '/pdm/process-supplement/create', data})
  },
  //修改补加工工艺规程
  updateProcessSupplement: async (data: ProcessSupplementVO) => {
    return await request.put({url: '/pdm/process-supplement/update', data})
  },
  //删除补加工工艺规程
  deleteProcessSupplement: async (id: number) => {
    return await request.delete({url: '/pdm/process-supplement/delete?id=' + id})
  },
  //获得补加工工艺规程结构树
  getProcessSupplementTreeList: async (params) => {
    return await request.get({ url: `/pdm/process-supplement/getProcessSupplementTreeList`, params })
  },
  //发起流程
  startProcessInstance: async (data) => {
    return await request.put({ url: `/pdm/process-supplement/startProcessInstance`, data })
  },
}
