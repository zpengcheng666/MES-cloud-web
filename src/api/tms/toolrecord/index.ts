import request from '@/config/axios'

// 刀具使用记录 VO
export interface ToolRecordVO {
  id: string // ID
  toolInfoId: string // 成品刀具id
  startTime: Date // 起始时间
  endTime: Date // 结束时间
  field: string // 表字段id（目标设备、目标位置、等）
  type: number // 类型（装配、测量、出库、配送、上机、使用、下机、回库、入库、拆卸）
}

// 刀具使用记录 API
export const ToolRecordApi = {
  // 查询刀具使用记录分页
  getToolRecordPage: async (params: any) => {
    return await request.get({ url: `/tms/tool-record/page`, params })
  },

  // 查询刀具使用记录详情
  getToolRecord: async (id: number) => {
    return await request.get({ url: `/tms/tool-record/get?id=` + id })
  },

  // 新增刀具使用记录
  createToolRecord: async (data: ToolRecordVO) => {
    return await request.post({ url: `/tms/tool-record/create`, data })
  },

  // 修改刀具使用记录
  updateToolRecord: async (data: ToolRecordVO) => {
    return await request.put({ url: `/tms/tool-record/update`, data })
  },

  // 删除刀具使用记录
  deleteToolRecord: async (id: number) => {
    return await request.delete({ url: `/tms/tool-record/delete?id=` + id })
  },

  // 导出刀具使用记录 Excel
  exportToolRecord: async (params) => {
    return await request.download({ url: `/tms/tool-record/export-excel`, params })
  },
}