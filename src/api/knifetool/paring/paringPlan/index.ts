/*
 * @Author: hyj
 * @Description: 装配任务
 * @Date: 2024-07-01 14:58:56
 * @LastEditTime: 2024-07-16 10:39:41
 * @FilePath: /cimp-tms-web/src/api/paring/paringPlan/index.ts
 */
import request from '@/config/axios'

export type ToolParingPlanT = {
  workOrderCode:string
  paringTaskState:string
  paringDeadline:string
  toolGroupCode:string
  paringTaskReceiver:string
  pageNo:number
  pageSize:number
}

// 获取配刀计划分页列表
export const getToolParingPlan = async (params:ToolParingPlanT) => {
  return await request.get({ url: 'knifetool/toolParingPlan/page',params })
}

// 配刀计划 - 添加
export const createToolParingPlan = async (data) => {
  return await request.post({ url: 'knifetool/toolParingPlan/add',data})
}

// 配刀计划 - 修改查询 -根据工单号查询配刀任务数据
export const getPlanListByWork = async (params:{ workOrderCode:string }) => {
  return await request.get({ url: 'knifetool/toolParingPlan/getPlanListByWork',params })
}

// 配刀计划 - 修改
export const updateToolParingPlan = async (data) => {
  return await request.put({ url: 'knifetool/toolParingPlan/edit',data})
}

// 配刀计划 - 删除(指定id)
export const deleteToolParingPlan = async (params) => {
  return await request.delete({ url: 'knifetool/toolParingPlan/delete',params})
}

// 配刀计划 - 删除(根据设备枚举id)
export const deleteParingPlanByEquId = async (params) => {
  return await request.delete({ url: 'knifetool/toolParingPlan/deleteParingPlanByEquId',params})
}

// 根据工单编码查询设备下面的配刀数量
export const getEquParingPlanByWorkNum = async (params:{ workOrderCode:string }) => {
  return await request.get({ url: 'knifetool/toolParingPlan/getEquParingPlanByWorkNum',params })
}

// 根据设备编码查询设备已经配了多少刀
export const getEquParingByEquCode = async (params:{ equipmentCode:string }) => {
  return await request.get({ url: 'knifetool/toolParingPlan/getEquParingByEquCode',params })
}

// 校验工单编号是否存在
export const checkWorkOrderCode = async (params) => {
  return await request.get({ url: '/knifetool/toolParingPlan/checkWorkOrderCode',params })
}

// 获取刀组分页列表数据
export const getToolGroup = async (params:{ groupCode:string, spec: string }) => {
  return await request.get({ url: 'knifetool/toolGroup/page',params })
}

