/*
 * @Author: hyj
 * @Description: 安全库存
 * @Date: 2024-06-11 16:23:29
 * @LastEditTime: 2024-06-20 15:11:57
 * @FilePath: /cimp-tms-web/src/api/store/storeSafety/index.ts
 */
import request from '@/config/axios'

export interface batchMesState {
  id?: number
  toolInformationId?: number
  code: string
  name: string
  spec: string
  toolCategoryValue: string
  upLimit?: number
  downLimit?: number
}

// 查询安全库存
export const getStoreSafety =  async (params:any) => {
  return await request.get({ url: 'knifetool/storeSafety/page',params })
}

// 添加/修改安全库存
export const createStoreSafety = async (data: batchMesState) => {
  return await request.post({ url: `knifetool/storeSafety/add`, data })
}

// 查询详情
export const getStoreSafetyDetail = async (params: any) => {
  return await request.get({ url: `knifetool/storeSafety/detail`, params })
}




