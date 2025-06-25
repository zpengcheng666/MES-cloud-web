import request from '@/config/axios'

// 物料配送申请 VO
export interface DistributionApplicationVO {
  id: string // id
  applicationNumber: string // 申请单号
  processingUnitId: string // 申请单元
  status: string // 申请状态
}

// 物料配送申请 API
export const DistributionApplicationApi = {
  // 查询物料配送申请分页
  getDistributionApplicationPage: async (params: any) => {
    return await request.get({ url: `/mcs/distribution-application/page`, params })
  },

  // 查询物料配送申请详情
  getDistributionApplication: async (id: number) => {
    return await request.get({ url: `/mcs/distribution-application/get?id=` + id })
  },

  // 新增物料配送申请
  createDistributionApplication: async (data: DistributionApplicationVO) => {
    return await request.post({ url: `/mcs/distribution-application/create`, data })
  },

  createApplication: async (data) => {
    return await request.post({ url: `/mcs/distribution-application/createApplication`, data })
  },

  // 修改物料配送申请
  updateDistributionApplication: async (data: DistributionApplicationVO) => {
    return await request.put({ url: `/mcs/distribution-application/update`, data })
  },

  // 删除物料配送申请
  deleteDistributionApplication: async (id: number) => {
    return await request.delete({ url: `/mcs/distribution-application/delete?id=` + id })
  },

  // 导出物料配送申请 Excel
  exportDistributionApplication: async (params) => {
    return await request.download({ url: `/mcs/distribution-application/export-excel`, params })
  },

  getRecordListByBatchAndType: async (params) => {
    return await request.get({ url: `/mcs/distribution-application/getRecordListByBatchAndType`, params })
  },

  // 获得物料配送申请详情列表
  listByApplication: async (applicationId) => {
    return await request.get({ url: `/mcs/distribution-record/listByApplication?applicationId=` + applicationId })
  },

  // 获取当前单元所有已下发任务
  getBatchRecordByUnitForDelivery: async (params: any) => {
    return await request.get({ url: `/mcs/distribution-application/getBatchRecordByUnitForDelivery`, params })
  },

  getUnitList: async () => {
    return await request.get({ url: `/mcs/distribution-application/getApplicationUnit` })
  },

  getDeviceListByUnitId: async (id: String) => {
    return await request.get({ url: `/mcs/batch-record/getDeviceListByUnitId?unitId=` + id })
  },

  submitApplication: async (id: number) => {
    return await request.post({ url: `/mcs/distribution-application/submitApplication?id=` + id })
  },

  recordRevokeById: async (id: number) => {
    return await request.post({ url: `/mcs/distribution-record/recordRevokeById?id=` + id })
  },
}
