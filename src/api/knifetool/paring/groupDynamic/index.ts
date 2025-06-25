/*
 * @Author: hyj
 * @Description: 组合动平衡
 * @Date: 2024-07-01 14:58:56
 * @LastEditTime: 2024-07-11 16:01:20
 * @FilePath: /cimp-tms-web/src/api/paring/groupDynamic/index.ts
 */
import request from '@/config/axios'

export type ListVO = {
  groupCode: string
  rfid: string
  pageNo: number
  pageSize: number
}

export type UpdateVO = {
  id?: number
  groupCode: string  
  code: string
  paringId?: number
  balancingQuality?: number
  serviceSpeed?: number
  weight?: number
  staticUnbalance?: number
  rpm?: number
  balancingQualityReality?: number
  maxSpeed?: number
  gmmResult?: number
}

// 获取动平衡分页数据列表
export const getToolBalance = async (params:ListVO) => {
  return await request.get({ url: 'knifetool/toolBalance/page',params })
}

// 提交动平衡数据
export const createToolBalance = async (data:UpdateVO) => {
  return await request.post({ url: 'knifetool/toolBalance/add',data })
}

// 根据id删除动平衡数据
export const deleteDelDynamic = async (data) => {
  return await request.post({ url: 'knifetool/toolBalance/delDynamic',data})
}

