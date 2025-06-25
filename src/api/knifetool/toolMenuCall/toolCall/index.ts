/*
 * @Author: hyj
 * @Description: 报废管理
 * @Date: 2024-07-01 14:58:56
 * @LastEditTime: 2024-07-24 15:39:19
 * @FilePath: /cimp-tms-web/src/api/toolMenuCall/toolCall/index.ts
 */
import request from '@/config/axios'

// 获取紧急呼叫任务分页列表
export const getToolUrgentAssignmentList = async (params) => {
  return await request.get({ url: 'knifetool/toolUrgentAssignment/listPage',params })
}


// 紧急配刀任务添加
export const createToolUrgentAssignment = async (data) => {
  return await request.post({ url: 'knifetool/toolUrgentAssignment/add',data })
}

// 紧急配刀任务修改
export const updateToolUrgentAssignment = async (data) => {
  return await request.post({ url: 'knifetool/toolUrgentAssignment/update',data })
}

// 紧急配刀任务详情
export const getDetailByParam = async (params) => {
  return await request.get({ url: 'knifetool/toolUrgentAssignment/detail',params })
}

// 紧急配刀任务修改审核状态
export const updateApproveState = async (data) => {
  return await request.post({ url: 'knifetool/toolUrgentAssignment/updateApproveState',data })
}

// 获取发起配送列表数据
export const getDeliverylist = async (params) => {
  return await request.get({ url: 'knifetool/delivery/listPage',params })
}

// 发起配送呼叫刀具
export const callToolDelivery = async (data) => {
  return await request.post({ url: 'knifetool/delivery/callTool',data })
}

// 发送紧急呼叫刀具
export const urgentCallTool = async (data) => {
  return await request.post({ url: 'knifetool/delivery/urgentCallTool',data })
}


// 获取配送单查询列表数据
export const getDeliveryTasklist = async (params) => {
  return await request.get({ url: 'knifetool/deliveryTask/listPage',params })
}


// 刀具配送任务修改配送状态
export const updateDeliveryState = async (data) => {
  return await request.post({ url: 'knifetool/deliveryTask/updateDeliveryState',data })
}

// 获取所有刀组编码列表
export const getGroupCodeData = async () => {
  return await request.get({ url: '/knifetool/toolGroup/getGroupCodeData' })
}

// 根据刀组编码查询刀组信息
export const getGroupByCode = async (params) => {
  return await request.get({ url: 'knifetool/toolGroup/getGroupByCode',params })
}
