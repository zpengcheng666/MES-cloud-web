import request from '@/config/axios'

export interface BatchRecordVO {
  id: string // id
  orderId: string // 订单id
  batchId: string // 批次id
  processId: string // 工序Id
  number: string // 编码
  processingUnitId: string // 生产单元
  deviceNumber: string // 设备编号
  deviceId: string // 设备编号
  procedureNum: string // 工序序号
  status: number // 状态
  planStartTime: Date // 预计开始时间
  planEndTime: Date // 预计结束时间
  count: number // 数量
  preRecordId: string // 前置批次Id
  startTime: Date // 开始时间
  endTime: Date // 结束时间
  procesStatus: number // 加工类型
  aidMill: string // 外协厂家
}

// 批次级订单 API
export const BatchRecordApi = {
  // 查询批次级订单分页
  getBatchRecordList: async (orderId: String) => {
    return await request.get({ url: `/mcs/batch-record/listByBatchId?batchId=` + orderId })
  },

  getDetailList: async (recordId: String) => {
    return await request.get({ url: `/mcs/batch-record/getDetailList?recordId=` + recordId })
  },

  // 查询批次工序任务详情
  getBatchRecord: async (id: number) => {
    return await request.get({ url: `/mcs/batch-record/get?id=` + id })
  },

  // 修改批次工序任务
  updateBatchRecord: async (data: BatchRecordVO) => {
    return await request.put({ url: `/mcs/batch-record/update`, data })
  },

  getUnitListByRecordId: async (id: number) => {
    return await request.get({ url: `/mcs/batch-record/getUnitListByRecordId?recordId=` + id })
  },

  getDeviceListByUnitId: async (id: String) => {
      return await request.get({ url: `/mcs/batch-record/getDeviceListByUnitId?unitId=` + id })
  },

  getBeforeProcessList: async (id: String) => {
      return await request.get({ url: `/mcs/batch-record/getBeforeProcessList?recordId=` + id })
  },

  // 修改批次工序任务
  updateStatusState: async (data: BatchRecordVO) => {
    return await request.put({ url: `/mcs/batch-record/statusState`, data })
  },

  // 修改批次工序任务
  updateStatusEnd: async (data: BatchRecordVO) => {
    return await request.put({ url: `/mcs/batch-record/statusEnd`, data })
  },

}
