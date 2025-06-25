import request from '@/config/axios'

//采集日志 VO
export interface OfflineAlarmVO {
  id: string // 主键
}

// 采集日志 API
export const OfflineAlarmApi = {

  //查询在线异常日志
  queryOlineStatusDetailPage: async (params: any) =>{
    return await request.get({ url: '/dc/offline-alarm/OlinePage' , params})
  },

  //查询在线异常日志总数
  queryOlineStatusDetailCount: async (params: any) =>{
    return await request.get({ url: '/dc/offline-alarm/OlineCount' , params})
  },

  //查询在线异常日志
  queryNormStatusDetailCount: async (params: any) =>{
    return await request.get({ url: '/dc/offline-alarm/NormCount' , params})
  },

  //查询在线异常日志总数
  queryNormStatusDetailPage: async (params: any) =>{
    return await request.get({ url: '/dc/offline-alarm/NormPage' , params})
  },

}

