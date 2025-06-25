import request from '@/config/axios'

//采集日志 VO
export interface OfflineErrorVO {
  id: string // 主键
}

// 采集日志 API
export const OfflineErrorApi = {

  //查询采集日志
  getOfflineErrorPage: async (params: any) =>{
    return await request.get({ url: '/dc/offline-error/page' , params})
  },

  //查询采集日志总条数
  queryOfflineErrorCount: async (params: any) =>{
    return await request.get({ url: '/dc/offline-error/count' , params})
  },

}
