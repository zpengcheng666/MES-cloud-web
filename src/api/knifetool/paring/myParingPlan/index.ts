/*
 * @Author: hyj
 * @Description: 我的装配任务
 * @Date: 2024-07-01 14:58:56
 * @LastEditTime: 2024-08-16 10:12:12
 * @FilePath: /cimp-tms-web/src/api/paring/myParingPlan/index.ts
 */
import request from '@/config/axios'

// 获取配刀计划分页列表
export const getToolParingPlan = async (params) => {
  return await request.get({ url: 'knifetool/toolParingPlan/page',params })
}

// 清除已出入库记录
export const deleteWrongRecord = async (params) => {
  return await request.post({ url: 'knifetool/storeMaterielFrock/deleteWrongRecord',params })
}

// 配刀页面中查询刀组数据
export const getGroupByCode = async (params) => {
  return await request.get({ url: 'knifetool/toolGroup/getGroupByCode',params })
}

// 根据刀盒码获取刀具信息
export const getToolDetail = async (params) => {
  return await request.get({ url: 'knifetool/toolParing/getToolDetail',params })
}

// 根据刀盒码获取刀具信息
export const getToolInformation = async (params) => {
    return await request.get({ url: 'knifetool/toolParing/getToolInformation',params })
}
// 提交配刀
export const createToolParing = async (data) => {
  return await request.post({ url: 'knifetool/toolParing/toolParingAdd',data })
}

// 根据刀盒码获取刀具信息
export const getParingAccomplishByPlanId = async (params) => {
  return await request.get({ url: 'knifetool/toolParing/getParingAccomplishByPlanId',params })
}

// 查询对刀数据
export const getSettingByParingId = async (params) => {
  return await request.get({ url: 'knifetool/toolSetting/getSettingByParingId',params })
}

// 提交及修改对刀
export const createToolSetting = async (data) => {
  return await request.post({ url: 'knifetool/toolSetting/add',data })
}

// 根据配刀记录id查询动平衡数据
export const getDynamicByParingId = async (params) => {
  return await request.get({ url: 'knifetool/toolBalance/getDynamicByParingId',params })
}
// 提交动平衡数据
export const createToolBalance = async (data) => {
  return await request.post({ url: 'knifetool/toolBalance/add',data })
}

// 提交动平衡数据
export const uploadUrl = async (data) => {
  return await request.post({ url: 'infra/file/upload',data })
}

// 托盘码与刀具分类对应校验
export const validateTrayCodeAndToolCode = async (params) => {
  return await request.get({ url: 'knifetool/toolParing/validateTrayCodeAndToolCode',params })
}

