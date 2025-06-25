import request from '@/config/axios'
import { b } from 'vite/dist/node/types.d-jgA8ss1A'

// 刀组信息 VO
export interface ToolInfoVO {
  id: string // ID
  materialStockId: string // 物料id
  materialConfigId: string // 物料类型id（冗余）
  status: number // 状态(1，可用，2不可用)
  assembleTaskId: string // 刀具装配任务id
}

// 刀组信息 API
export const ToolInfoApi = {
  // 查询刀组信息分页
  getToolInfoPage: async (params: any) => {
    return await request.get({ url: `/tms/tool-info/page`, params })
  },

  // 查询刀组信息详情
  getToolInfo: async (id: number) => {
    return await request.get({ url: `/tms/tool-info/get?id=` + id })
  },

  // 新增刀组信息
  createToolInfo: async (data: ToolInfoVO) => {
    return await request.post({ url: `/tms/tool-info/create`, data })
  },

  // 修改刀组信息
  updateToolInfo: async (data: ToolInfoVO) => {
    return await request.put({ url: `/tms/tool-info/update`, data })
  },

  // 删除刀组信息
  deleteToolInfo: async (id: number) => {
    return await request.delete({ url: `/tms/tool-info/delete?id=` + id })
  },

  // 导出刀组信息 Excel
  exportToolInfo: async (params) => {
    return await request.download({ url: `/tms/tool-info/export-excel`, params })
  },

// ==================== 子表（刀具动平衡） ====================

  // 获得刀具动平衡分页
  getToolBalancePage: async (params) => {
    return await request.get({ url: `/tms/tool-info/tool-balance/page`, params })
  },
  // 新增刀具动平衡
  createToolBalance: async (data) => {
    return await request.post({ url: `/tms/tool-info/tool-balance/create`, data })
  },

  // 修改刀具动平衡
  updateToolBalance: async (data) => {
    return await request.put({ url: `/tms/tool-info/tool-balance/update`, data })
  },

  // 删除刀具动平衡
  deleteToolBalance: async (id: number) => {
    return await request.delete({ url: `/tms/tool-info/tool-balance/delete?id=` + id })
  },

  // 获得刀具动平衡
  getToolBalance: async (id: number) => {
    return await request.get({ url: `/tms/tool-info/tool-balance/get?id=` + id })
  },

// ==================== 子表（对刀数据） ====================

  // 获得对刀数据分页
  getToolBasePage: async (params) => {
    return await request.get({ url: `/tms/tool-info/tool-base/page`, params })
  },
  // 新增对刀数据
  createToolBase: async (data) => {
    return await request.post({ url: `/tms/tool-info/tool-base/create`, data })
  },

  // 修改对刀数据
  updateToolBase: async (data) => {
    return await request.put({ url: `/tms/tool-info/tool-base/update`, data })
  },

  // 删除对刀数据
  deleteToolBase: async (id: number) => {
    return await request.delete({ url: `/tms/tool-info/tool-base/delete?id=` + id })
  },

  // 获得对刀数据
  getToolBase: async (id: number) => {
    return await request.get({ url: `/tms/tool-info/tool-base/get?id=` + id })
  },

// ==================== 子表（刀具装配记录） ====================

  // 获得刀具装配记录分页
  getAssembleRecordPage: async (params) => {
    return await request.get({ url: `/tms/tool-info/assemble-record/page`, params })
  },
  // 新增刀具装配记录
  createAssembleRecord: async (data) => {
    return await request.post({ url: `/tms/tool-info/assemble-record/create`, data })
  },
    // 新增刀具装配记录
    saveAssembleRecord: async (data) => {
        return await request.post({ url: `/tms/tool-info/assemble-record/saveAssembleRecord`, data })
    },

  // 修改刀具装配记录
  updateAssembleRecord: async (data) => {
    return await request.put({ url: `/tms/tool-info/assemble-record/update`, data })
  },

  // 删除刀具装配记录
  deleteAssembleRecord: async (id: number) => {
    return await request.delete({ url: `/tms/tool-info/assemble-record/delete?id=` + id })
  },

  // 获得刀具装配记录
  getAssembleRecord: async (id: number) => {
    return await request.get({ url: `/tms/tool-info/assemble-record/get?id=` + id })
  },

  // 获得当前已装刀具装配记录
  getCurrentAssembleRecord: async (id: number) => {
    return await request.get({ url: `/tms/tool-info/assemble-record/getCurrentAssembleRecord?id=` + id })
  },

  // 刀具分解
  toolDisassembly: async (saveData: any,toolInfoId:string) => {
    const data = {
        removeList: saveData,
        id:toolInfoId
    }
    return await request.post({ url: `/tms/tool-info/assemble-record/tool-disassembly`, data })
  },
}
