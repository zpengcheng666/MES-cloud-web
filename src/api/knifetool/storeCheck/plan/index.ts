/*
 * @Author: hyj
 * @Description: 盘点计划
 * @Date: 2024-07-01 14:58:56
 * @LastEditTime: 2024-07-31 16:14:00
 * @FilePath: /cimp-tms-web/src/api/storeCheck/plan/index.ts
 */
import request from '@/config/axios'


export type planVO = {
  storeMenutreeId?: number
  latestCheckTime: string
  chargeUserName:string
  planFlag:string
  pageNo:number
  pageSize:number
}

// 获得盘点计划分页列表
export const getCheckPlan = async (params: planVO) => {
  return await request.get({ url: 'knifetool/checkPlan/page',params })
}

// 盘点计划添加或修改
export const createOrUpdateCheckPlan = async (data) => {
  return await request.post({ url: 'knifetool/checkPlan/addOrUpdate', data })
}

// 盘点计划 删除方案
export const deletePlan = async (params) => {
  return await request.delete({ url: 'knifetool/checkPlan/deletePlan', params })
}

// 盘点计划-获取仓库列表
export const getStoreMenuTreeName = async (params:{userId:number}) => {
  return await request.get({ url: 'knifetool/checkPlan/getStoreMenuTreeName',params })
}

