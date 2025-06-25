import request from '@/config/axios'

// 批次详情 VO
export interface BatchDetailVO {
  id: string // id
  detailNumber: string // 编号
  batchId: string // 订单id
  batchNumber: string // 订单编号
  qualityNumber: string // 质量编号
  processingUnitId: string // 生产单元
  status: number // 状态
  startTime: Date // 开始时间
  endTime: Date // 结束时间
}

// 批次详情 API
export const BatchDetailApi = {
  // 查询批次详情分页
  getBatchDetailPage: async (params: any) => {
    return await request.get({ url: `/mcs/batch-detail/page`, params })
  },

  splitDetailCount: async (data: any) => {
    return await request.post({ url: `/mcs/batch-order/splitDetail`, data })
  },

  // 查询批次详情详情
  getBatchDetail: async (id: number) => {
    return await request.get({ url: `/mcs/batch-detail/get?id=` + id })
  },

  // 新增批次详情
  createBatchDetail: async (data: BatchDetailVO) => {
    return await request.post({ url: `/mcs/batch-detail/create`, data })
  },

  // 修改批次详情
  updateBatchDetail: async (data: BatchDetailVO) => {
    return await request.put({ url: `/mcs/batch-detail/update`, data })
  },

  // 删除批次详情
  deleteBatchDetail: async (id: number) => {
    return await request.delete({ url: `/mcs/batch-detail/delete?id=` + id })
  },

  // 导出批次详情 Excel
  exportBatchDetail: async (params) => {
    return await request.download({ url: `/mcs/batch-detail/export-excel`, params })
  },
}
