import request from '@/config/axios'

// 刀具托盘类型 VO
export interface ToolTrayTypeVO {
  id: number // 自增主键
  trayTypeName: string // 托盘类型名称
  trayTypeNumber: string // 托盘类型编码
  trayTypeCount: number // 托盘类型数量
  material: string // 材料
  commonUse: string // 通用性
  weight: number // 重量
  createId: number // 创建人ID
  updateId: number // 修改人ID
}

// 刀具托盘类型 API
// 查询刀具托盘类型分页
export const getToolTrayTypePage = async (params: any) => {
  return await request.get({ url: `/knifetool/toolTrayType/page`, params })
}

// 查询所有刀具托盘类型
export const getToolTrayTypeList = async () => {
  return await request.get({ url: `/knifetool/toolTrayType/list` })
}

// 查询刀具托盘类型详情
export const getToolTrayType = async (id: number) => {
  return await request.get({ url: `/knifetool/toolTrayType/get?id=` + id })
}

// 新增刀具托盘类型
export const createToolTrayType = async (data: ToolTrayTypeVO) => {
  return await request.post({ url: `/knifetool/toolTrayType/create`, data })
}

// 修改刀具托盘类型
export const updateToolTrayType = async (data: ToolTrayTypeVO) => {
  return await request.put({ url: `/knifetool/toolTrayType/update`, data })
}

// 删除刀具托盘类型
export const deleteToolTrayType = async (id: number) => {
  return await request.delete({ url: `/knifetool/toolTrayType/delete?id=` + id })
}

// 导出刀具托盘类型 Excel
export const exportToolTrayType = async (params) => {
  return await request.download({ url: `/knifetool/toolTrayType/export-excel`, params })
}