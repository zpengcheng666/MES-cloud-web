import request from '@/config/axios'

// 物料配送申请详情 VO
export interface DistributionRecordVO {
  id: string // id
  applicationId: string // 申请id
  orderId: string // 订单id
  batchId: string // 批次订单Id
  resourceType: number // 资源类型
  resourceCode: string // 资源编码
  count: number // 需求数量
  planStartTime: Date // 计划开工时间
}

// 物料配送申请详情 API
export const DistributionRecordApi = {
  // 查询物料配送申请详情分页
  getDistributionRecordPage: async (params: any) => {
    return await request.get({ url: `/mcs/distribution-record/pageAll`, params })
  },

  // 查询物料配送申请详情详情
  getDistributionRecord: async (id: number) => {
    return await request.get({ url: `/mcs/distribution-record/get?id=` + id })
  },

  // 新增物料配送申请详情
  createDistributionRecord: async (data: DistributionRecordVO) => {
    return await request.post({ url: `/mcs/distribution-record/create`, data })
  },

  // 修改物料配送申请详情
  updateDistributionRecord: async (data: DistributionRecordVO) => {
    return await request.put({ url: `/mcs/distribution-record/update`, data })
  },

  // 删除物料配送申请详情
  deleteDistributionRecord: async (id: number) => {
    return await request.delete({ url: `/mcs/distribution-record/delete?id=` + id })
  },

  //配送订单撤销(关闭)
  distributionRecordRevoke: async (id: number) => {
    return await request.post({ url: `/mcs/distribution-record/recordRevokeById?id=` + id })
  },

  // 导出物料配送申请详情 Excel
  exportDistributionRecord: async (params) => {
    return await request.download({ url: `/mcs/distribution-record/export-excel`, params })
  },
}
