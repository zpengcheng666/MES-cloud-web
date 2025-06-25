import request from '@/config/axios'

// 班次类型 VO
export interface ShiftTypeVO {
  id: string // id
  name: string // 班次名称
}

// 班次类型 API
export const ShiftTypeApi = {
  // 查询班次类型分页
  getShiftTypePage: async (params: any) => {
    return await request.get({ url: `/dms/shift-type/page`, params })
  },

  // 查询班次类型详情
  getShiftType: async (id: number) => {
    return await request.get({ url: `/dms/shift-type/get?id=` + id })
  },

  // 新增班次类型
  createShiftType: async (data: ShiftTypeVO) => {
    return await request.post({ url: `/dms/shift-type/create`, data })
  },

  // 修改班次类型
  updateShiftType: async (data: ShiftTypeVO) => {
    return await request.put({ url: `/dms/shift-type/update`, data })
  },

  // 删除班次类型
  deleteShiftType: async (id: number) => {
    return await request.delete({ url: `/dms/shift-type/delete?id=` + id })
  },

  // 导出班次类型 Excel
  exportShiftType: async (params) => {
    return await request.download({ url: `/dms/shift-type/export-excel`, params })
  },

  // 查询班次类型分页
  pageWithBasic: async (params: any) => {
    return await request.get({ url: `/dms/shift-type/pageWithBasic`, params })
  },

// ==================== 子表（班次时间） ====================

  // 获得班次时间列表
  getShiftTimeListByTypeId: async (typeId) => {
    return await request.get({ url: `/dms/shift-type/shift-time/list-by-type-id?typeId=` + typeId })
  },
}
