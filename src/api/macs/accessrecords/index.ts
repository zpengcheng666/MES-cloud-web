import request from '@/config/axios'

// 通行记录 VO
export interface AccessRecordsVO {
  id: string // 主键id
  userId: string // 访问人员id
  visitorId: string // 访客访问人员id
  userCode: string // 访问人员编号
  userName: string // 访问人员姓名
  operatorId: string // 操作人员id
  deviceId: string // 设备id
  doorId: string // 门id
  doorName: string // 门名称
  collectorId: string // 采集器Id
  collectorName: string // 采集器名称
  collectorCode: string // 采集器编码
  regionId: string // 位置Id
  regionName: string // 位置名称
  action: number // 动作(-1,未知,0校验,1进,2出,3开门,4关门)
  message: string // 备注信息
}

// 通行记录 API
export const AccessRecordsApi = {
  // 查询通行记录分页
  getAccessRecordsPage: async (params: any) => {
    return await request.get({ url: `/macs/access-records/page`, params })
  },

  // 查询通行记录详情
  getAccessRecords: async (id: number) => {
    return await request.get({ url: `/macs/access-records/get?id=` + id })
  },

  // 新增通行记录
  createAccessRecords: async (data: AccessRecordsVO) => {
    return await request.post({ url: `/macs/access-records/create`, data })
  },

  // 修改通行记录
  updateAccessRecords: async (data: AccessRecordsVO) => {
    return await request.put({ url: `/macs/access-records/update`, data })
  },

  // 删除通行记录
  deleteAccessRecords: async (id: number) => {
    return await request.delete({ url: `/macs/access-records/delete?id=` + id })
  },

  // 导出通行记录 Excel
  exportAccessRecords: async (params) => {
    return await request.download({ url: `/macs/access-records/export-excel`, params })
  }
}