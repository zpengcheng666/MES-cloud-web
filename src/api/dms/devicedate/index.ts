import request from '@/config/axios'

// 设备数据 VO
export interface DeviceDateVO {
  id: string // id
  status: number // 状态
}

export const DeviceDateApi = {

  //查询设备数据
  getDeviceDatePage: async (params: any) =>{
    return await request.get({ url: '/dms/device-date/page' , params})
  },


}
