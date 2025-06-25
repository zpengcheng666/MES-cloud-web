import request from '@/config/axios'

// pms 立项表,项目立项相关 API
export const ExcuteApi = {
  // 获得所属产品或物料
  getMaterialList: async (projectId) => {
    return await request.get({ url: `/pms/excute/getMaterialList?projectId=` + projectId })
  },
  getMaterialListByProjectIds: async (projectIds) => {
  return await request.get({ url: `/pms/excute/getMaterialListByProjectIds?projectIds=` + projectIds })
},
  // 获得所属产品或物料
  getPurchaseProgress: async (projectIds) => {
    return await request.get({ url: `/pms/excute/getPurchaseProgress?projectIds=` + projectIds })
  },
  //获得生产进度
  getProductProgress:async(projectCodes)=>{
    return await request.get({ url: `/pms/excute/getProductProgress?projectCodes=` + projectCodes })
  }

}
