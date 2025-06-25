import request from '@/config/axios'

// 生产单元类型 VO
export interface ProcessingUnitTypeVO {
  id: string // id
  unitNumber: string // 单元编码
  unitName: string // 单元名称
}

// 生产单元类型 API
export const ProcessingUnitTypeApi = {
  // 查询生产单元类型分页
  getProcessingUnitTypePage: async (params: any) => {
    return await request.get({ url: `/dms/processing-unit-type/page`, params })
  },

  getProcessingUnitTypeList: async (params: any) => {
    return await request.get({ url: `/dms/processing-unit-type/list`, params })
  },

  // 查询生产单元类型详情
  getProcessingUnitType: async (id: number) => {
    return await request.get({ url: `/dms/processing-unit-type/get?id=` + id })
  },

  // 新增生产单元类型
  createProcessingUnitType: async (data: ProcessingUnitTypeVO) => {
    return await request.post({ url: `/dms/processing-unit-type/create`, data })
  },

  // 修改生产单元类型
  updateProcessingUnitType: async (data: ProcessingUnitTypeVO) => {
    return await request.put({ url: `/dms/processing-unit-type/update`, data })
  },

  // 删除生产单元类型
  deleteProcessingUnitType: async (id: number) => {
    return await request.delete({ url: `/dms/processing-unit-type/delete?id=` + id })
  },

  // 导出生产单元类型 Excel
  exportProcessingUnitType: async (params) => {
    return await request.download({ url: `/dms/processing-unit-type/export-excel`, params })
  },
}
