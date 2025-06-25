/*
 * @Author: hyj
 * @Description: 装配库存
 * @Date: 2024-07-01 14:58:56
 * @LastEditTime: 2024-07-10 17:12:33
 * @FilePath: /cimp-tms-web/src/api/paring/paringRepertory/index.ts
 */
import request from '@/config/axios'

export type listVO = {
   groupCode: string
    hiltCode: string
    hiltSpec: string
    pageNo: number
    pageSize: number
}

// 获取配刀计划分页列表
export const getRepertoryPage = async (data:listVO) => {
  return await request.post({ url: 'knifetool/toolParing/repertoryPage',data })
}

export const getToolParing = async (params) => {
  return await request.get({ url: 'knifetool/toolParing/page',params })
}


