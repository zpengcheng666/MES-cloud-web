import request from '@/config/axios'

//采集日志 VO
export interface OfflineCollectVO {
  id: string // 主键
}

// 采集日志 API
export const OfflineCollectApi = {

  //查询采集日志
  getOfflineCollectPage: async (params: any) =>{
    return await request.get({ url: '/dc/offline-collect/page' , params})
  },

  //查询采集日志总条数
  queryOfflineCollectCount: async (params: any) =>{
    return await request.get({ url: '/dc/offline-collect/count' , params})
  },

  //查询在线异常日志
  queryOlineStatusDetailPage: async (params: any) =>{
    return await request.get({ url: '/dc/offline-collect/queryOlineStatusDetailPage' , params})
  },

  //查询在线异常日志
  queryOlineStatusDetailCount: async (params: any) =>{
    return await request.get({ url: '/dc/offline-collect/queryOlineStatusDetailCount' , params})
  },

  //查询在线异常日志
  queryNormStatusDetailPage: async (params: any) =>{
    return await request.get({ url: '/dc/offline-collect/queryNormStatusDetailPage' , params})
  },

  //查询在线异常日志
  queryNormStatusDetailCount: async (params: any) =>{
    return await request.get({ url: '/dc/offline-collect/queryNormStatusDetailCount' , params})
  },

}
