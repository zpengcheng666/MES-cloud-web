import request from '@/config/axios'

// 现场作业记录 VO
export interface ProductionRecordsVO {
}

// 现场作业记录 API
export const ProductionRecordsApi = {
  // 查询现场作业记录分页
  getProductionRecordsPage: async (params: any) => {
    return await request.get({ url: `/mcs/production-records/page`, params })
  },

  // 查询现场作业记录详情
  getProductionRecords: async (id: number) => {
    return await request.get({ url: `/mcs/production-records/get?id=` + id })
  },

  // 新增现场作业记录
  createProductionRecords: async (data: ProductionRecordsVO) => {
    return await request.post({ url: `/mcs/production-records/create`, data })
  },

  // 修改现场作业记录
  updateProductionRecords: async (data: ProductionRecordsVO) => {
    return await request.put({ url: `/mcs/production-records/update`, data })
  },

  // 删除现场作业记录
  deleteProductionRecords: async (id: number) => {
    return await request.delete({ url: `/mcs/production-records/delete?id=` + id })
  },

  // 导出现场作业记录 Excel
  exportProductionRecords: async (params) => {
    return await request.download({ url: `/mcs/production-records/export-excel`, params })
  },

  getDeviceList: async () => {
    return await request.get({ url: `/dms/ledger/getList`})
  },
}
