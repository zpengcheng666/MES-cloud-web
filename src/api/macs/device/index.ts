import request from '@/config/axios'

// 设备 VO
export interface DeviceVO {
  id: string // 主键id
  code: string // 编码
  name: string // 名称
  status: number // 状态(0未连接,1正常,2故障...)
  ip: string // ip
  port: string // 端口号
  accountNumber: string // 账户
  password: string // 密码
  enableStatus: number // 启用状态(1启用,0禁用)
  createBy: string // 创建人
  updateBy: string // 更新人
}

// 设备 API
export const DeviceApi = {
  // 查询设备分页
  getDevicePage: async (params: any) => {
    return await request.get({ url: `/macs/device/page`, params })
  },

  getRegionList: async () => {
    return await request.get({ url: `/macs/region/list` })
  },

  // 查询设备详情
  getDevice: async (id: number) => {
    return await request.get({ url: `/macs/device/get?id=` + id })
  },

  // 新增设备
  createDevice: async (data: DeviceVO) => {
    return await request.post({ url: `/macs/device/create`, data })
  },

  // 修改设备
  updateDevice: async (data: DeviceVO) => {
    return await request.put({ url: `/macs/device/update`, data })
  },

  // 删除设备
  deleteDevice: async (id: number) => {
    return await request.delete({ url: `/macs/device/delete?id=` + id })
  },

  // 导出设备 Excel
  exportDevice: async (params) => {
    return await request.download({ url: `/macs/device/export-excel`, params })
  }
}
