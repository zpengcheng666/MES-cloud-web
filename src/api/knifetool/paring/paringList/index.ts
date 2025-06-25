/*
 * @Author: hyj
 * @Description: 装配记录
 * @Date: 2024-07-01 14:58:56
 * @LastEditTime: 2024-07-12 17:08:36
 * @FilePath: /cimp-tms-web/src/api/paring/paringList/index.ts
 */
import request from '@/config/axios'


// 获取配刀记录分页数据列表
export const getToolParing = async (params) => {
  return await request.get({ url: 'knifetool/toolParing/page',params })
}

// 提交动平衡数据
export const createToolBalance = async (data) => {
  return await request.post({ url: 'knifetool/toolBalance/add',data })
}

// 根据配刀记录id查询动平衡数据
export const getDynamicByParingId = async (params) => {
  return await request.get({ url: 'knifetool/toolBalance/getDynamicByParingId',params })
}

// 根据配刀记录id查询对刀数据
export const getSettingByParingId = async (params) => {
  return await request.get({ url: 'knifetool/toolSetting/getSettingByParingId',params })
}

// 根据配刀记录id查询配件列表
export const getPartsByParingId = async (params) => {
  return await request.get({ url: 'knifetool/toolParing/getPartsByParingId',params })
}


// 配刀解绑
export const unbindSubmit = async (data) => {
  return await request.post({ url: 'knifetool/toolParing/unbindSubmit',data })
}

// 工单解绑
export const unbindWorkSubmit = async (data) => {
  return await request.post({ url: 'knifetool/toolParing/unbindWorkSubmit',data })
}


