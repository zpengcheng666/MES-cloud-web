import request from '@/config/axios'

// 生产单元签收记录 VO
export interface ReceiptRecordVO {
  id: string // id
  applicationId: string // 申请id
  processingUnitId: string // 申请单元
  resourceType: number // 资源类型
  resourceCode: string // 资源编码
  count: number // 需求数量
}

// 生产单元签收记录 API
export const ReceiptRecordApi = {
  // 查询生产单元签收记录分页
  getReceiptRecordPage: async (params: any) => {
    return await request.get({ url: `/mcs/receipt-record/page`, params })
  },

  // 查询生产单元签收记录详情
  getReceiptRecord: async (id: number) => {
    return await request.get({ url: `/mcs/receipt-record/get?id=` + id })
  },

  // 新增生产单元签收记录
  createReceiptRecord: async (data: ReceiptRecordVO) => {
    return await request.post({ url: `/mcs/receipt-record/create`, data })
  },

  // 修改生产单元签收记录
  updateReceiptRecord: async (data: ReceiptRecordVO) => {
    return await request.put({ url: `/mcs/receipt-record/update`, data })
  },

  // 删除生产单元签收记录
  deleteReceiptRecord: async (id: number) => {
    return await request.delete({ url: `/mcs/receipt-record/delete?id=` + id })
  },

  // 导出生产单元签收记录 Excel
  exportReceiptRecord: async (params) => {
    return await request.download({ url: `/mcs/receipt-record/export-excel`, params })
  },
}