import request from '@/config/axios'

// (通行卡,人脸,指纹)采集器 VO
export interface CollectorVO {
  id: string // 主键id
  code: string // 编号
  name: string // 名称
  locationCode: string // 位置(0内侧,1外侧...)
  doorId: string // 关联门id
  deviceId: string // 关联设备id
  devicePort: number // 关联设备位置
  status: number // 设备状态(0未连接,1正常,2读取,3故障...)
  type: number // 采集设备类型(1读取设备,2读写设备)
  description: string // 描述/备注
  connectionInformation: string // 连接信息
  createBy: string // 创建人
  updateBy: string // 更新人
}

// (通行卡,人脸,指纹)采集器 API
export const CollectorApi = {
  // 查询(通行卡,人脸,指纹)采集器分页
  getCollectorPage: async (params: any) => {
    return await request.get({ url: `/macs/collector/page`, params })
  },

  // 查询(通行卡,人脸,指纹)采集器详情
  getCollector: async (id: number) => {
    return await request.get({ url: `/macs/collector/get?id=` + id })
  },

  // 新增(通行卡,人脸,指纹)采集器
  createCollector: async (data: CollectorVO) => {
    return await request.post({ url: `/macs/collector/create`, data })
  },

  // 修改(通行卡,人脸,指纹)采集器
  updateCollector: async (data: CollectorVO) => {
    return await request.put({ url: `/macs/collector/update`, data })
  },

  // 删除(通行卡,人脸,指纹)采集器
  deleteCollector: async (id: number) => {
    return await request.delete({ url: `/macs/collector/delete?id=` + id })
  },

  // 导出(通行卡,人脸,指纹)采集器 Excel
  exportCollector: async (params) => {
    return await request.download({ url: `/macs/collector/export-excel`, params })
  },

  getDeviceList: async () => {
    return await request.get({ url: `/macs/device/list` })
  },

  getDoorList: async () => {
    return await request.get({ url: `/macs/door/list` })
  }
}
