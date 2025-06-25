import request from '@/config/axios'

// 刀具托盘 VO
export interface ToolTrayVO {
  id: number // 自增主键
  trayNumber: string // 托盘类型编码
  trayLocation: number // 托盘库内位置
  trayTypeId: number // 托盘类型ID
  trayStatus: number // 托盘状态 1：可用  0：不可用
  createId: number // 创建人ID
  updateId: number // 修改人ID
}

// 刀具托盘 API
// 查询刀具托盘分页
export const getToolTrayPage = async (params: any) => {
  return await request.get({ url: `/knifetool/toolTray/page`, params })
}

// 查询刀具托盘详情
export const getToolTray = async (id: number) => {
  return await request.get({ url: `/knifetool/toolTray/get?id=` + id })
}

// 新增刀具托盘
export const createToolTray = async (data: ToolTrayVO) => {
  return await request.post({ url: `/knifetool/toolTray/create`, data })
}

// 修改刀具托盘
export const updateToolTray = async (data: ToolTrayVO) => {
  return await request.put({ url: `/knifetool/toolTray/update`, data })
}

// 修改刀具托盘状态
export const updateToolTrayState = async (id: number, trayStatus: number) => {
  const data = {
    id,
    trayStatus
  }
  return await request.put({ url: `/knifetool/toolTray/update-state`, data })
}

// 删除刀具托盘
export const deleteToolTray = async (id: number) => {
  return await request.delete({ url: `/knifetool/toolTray/delete?id=` + id })
}

// 导出刀具托盘 Excel
export const exportToolTray = async (params) => {
  return await request.download({ url: `/knifetool/toolTray/export-excel`, params })
}