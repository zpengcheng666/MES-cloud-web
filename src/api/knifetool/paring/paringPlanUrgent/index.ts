/*
 * @Author: hyj
 * @Description: 紧急任务审批
 * @Date: 2024-07-01 14:58:56
 * @LastEditTime: 2024-07-18 15:13:30
 * @FilePath: /cimp-tms-web/src/api/paring/paringPlanUrgent/index.ts
 */
import request from '@/config/axios'


// 获取紧急呼叫任务分页列表
export const getToolUrgentAssignmentList = async (params) => {
  return await request.get({ url: 'knifetool/toolUrgentAssignment/listPage', params })
}

// 紧急配刀任务添加
export const createToolUrgentAssignment = async (data) => {
  return await request.post({ url: 'knifetool/toolUrgentAssignment/add', data })
}

// 紧急配刀任务添加
export const updateToolUrgentAssignment = async (data) => {
  return await request.post({ url: 'knifetool/toolUrgentAssignment/update', data })
}

// 紧急配刀任务详情
export const getToolUrgentAssignment = async (params: {id:string}) => {
  return await request.get({ url: 'knifetool/toolUrgentAssignment/detail', params })
}

// 紧急配刀任务修改审核状态
export const updateApproveState = async (data) => {
  return await request.post({ url: 'knifetool/toolUrgentAssignment/updateApproveState', data })
}
