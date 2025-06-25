import request from '@/config/axios'
import {params} from "postcss-html";

export interface BrakeSyncVO {
  id: string // 主键id
  automatic: number //自动同步(1.开启 2.关闭)
  cycle: string // 周期(分钟)
  sync: number //厂区同步方式(1.不互通 2.仅新厂同步旧厂 3.仅旧厂同步新厂 4.互通）
}

//同步配置 API
export const BrakeSyncApi = {

  getBrakeSync: async (id: string) =>{
    return await request.get({ url: '/es/brakeSync/get?id=' + id})
  },

  updateBrakeSync: async (data: BrakeSyncVO) =>{
    return await request.put({ url:'/es/brakeSync/update' , data})
  }

}
