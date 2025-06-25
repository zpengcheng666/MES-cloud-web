/*
 * @Author: hyj
 * @Description: 装配任务大厅
 * @Date: 2024-07-01 14:58:56
 * @LastEditTime: 2024-07-01 15:22:18
 * @FilePath: /cimp-tms-web/src/api/paring/paringPlanHall/index.ts
 */
import request from '@/config/axios'

// 获取装配任务大厅的分页列表
export const getToolParingPlan = async (params: {paringDeadline: string}) => {
  return await request.get({ url: 'knifetool/toolParingPlan/page',params })
}

// 配刀计划 - 任务领取
export const handleReceiving = async (data: {id: string}) => {
  return await request.post({ url: 'knifetool/toolParingPlan/receiving',data })
}
