/*
 * @Author: hyj
 * @Description: 对刀记录
 * @Date: 2024-07-01 14:58:56
 * @LastEditTime: 2024-07-23 15:41:34
 * @FilePath: /cimp-tms-web/src/api/paring/setting/index.ts
 */
import request from '@/config/axios'

export type ListVO = {
  paringId?: number
  groupCode: string
  rfid: string
  pageNo: number
  pageSize: number
}

export type UpdateVO = {
  // id?: number
  // paringId?: number
  // diameter: string
  // totalLength: string
  // rangle?: string
  // groupCode: string
  // rfid?: string
  // code: string
}

// 获取对刀分页数据列表
export const getToolSetting = async (data:ListVO) => {
  return await request.post({ url: 'knifetool/toolSetting/page',data })
}

// 提交及修改对刀
export const createToolSetting = async (data:UpdateVO) => {
  return await request.post({ url: 'knifetool/toolSetting/add',data })
}

// 配刀计划 - 删除(指定id)
export const deleteSetting = async (data:{id:number, paringId:number}) => {
  return await request.post({ url: 'knifetool/toolSetting/deleteSetting',data})
}

