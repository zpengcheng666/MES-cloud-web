import request from '@/config/axios'

// 加工单元 VO
export interface ProcessingUnitVO {
  id: string // id
  typeId: string // 类型Id
  unitNumber: string // 单元编码
  unitName: string // 单元名称
  unitStatus: number // 状态
  remarks: string // 备注
}

// 加工单元 API
export const ProcessingUnitApi = {
  // 查询加工单元分页
  getProcessingUnitPage: async (params: any) => {
    return await request.get({ url: `/dms/processing-unit/page`, params })
  },

  // 查询加工单元详情
  getProcessingUnit: async (id: number) => {
    return await request.get({ url: `/dms/processing-unit/get?id=` + id })
  },

  // 新增加工单元
  createProcessingUnit: async (data: ProcessingUnitVO) => {
    return await request.post({ url: `/dms/processing-unit/create`, data })
  },

  // 修改加工单元
  updateProcessingUnit: async (data: ProcessingUnitVO) => {
    return await request.put({ url: `/dms/processing-unit/update`, data })
  },

  // 删除加工单元
  deleteProcessingUnit: async (id: number) => {
    return await request.delete({ url: `/dms/processing-unit/delete?id=` + id })
  },

  // 导出加工单元 Excel
  exportProcessingUnit: async (params) => {
    return await request.download({ url: `/dms/processing-unit/export-excel`, params })
  },

  // 列出加工单元
  getProcessingUnitList: async () => {
    return await request.get({ url: `/dms/processing-unit/getList` })
  }
}
