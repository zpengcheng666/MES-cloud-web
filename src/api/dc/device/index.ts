import request from '@/config/axios'

// 设备 VO
export interface DeviceVO {
  deviceName: string // 设备名称
  deviceStatus: number // 启用状态(0未接入平台 1在线 2离线 3已禁用)
  deviceText: string // 设备介绍
  productTypeId: string // 产品类型id
  deviceTypeId: string // 设备分组id
}

// 设备 API
export const DeviceApi = {

  // 查询设备信息
  getDeviceList: async () => {
    return await  request.get({ url: `/dc/device/getList`})
  },

  // 查询设备分页
  getDevicePage: async (params: any) => {
    return await request.get({ url: `/dc/device/page`, params })
  },

  // 查询设备详情
  getDevice: async (id: number) => {
    return await request.get({ url: `/dc/device/get?id=` + id })
  },

  // 新增设备
  createDevice: async (data: DeviceVO) => {
    return await request.post({ url: `/dc/device/create`, data })
  },

  // 修改设备
  updateDevice: async (data: DeviceVO) => {
    return await request.put({ url: `/dc/device/update`, data })
  },

  // 删除设备
  deleteDevice: async (id: number ) => {
    return await request.delete({ url: `/dc/device/delete?id=` + id })
  },

  // 导出设备 Excel
  exportDevice: async (params) => {
    return await request.download({ url: `/dc/device/export-excel`, params })
  },

  //查询设备运行监控分页
  getDeviceOfflinePage: async (params: any) => {
    return await  request.get({ url: `/dc/device/getDeviceOfflinePage` ,  params})
  },

  //获取启用状态设备分类
  getDeviceTypeList: async () => {
    return await  request.get({ url: `/dc/device/getDeviceTypeList`})
  },

  //获取未生成的设备
  getDeviceListByCollet: async (id: number) => {
    return await request.get({ url: `/dc/device/getDeviceListByCollet?id=` + id })
  },

}
