import request from '@/config/axios'

// 设备类型 VO
export interface DeviceTypeVO {
  id: string // id
  code: string // 类型编号
  name: string // 类型名称
  specification: string // 规格型号
  manufacturer: string //生产厂家
  countryRegion: string // 产地
  contacts: string // 厂家联系人
  contactPhone: string // 厂家联系电话
  remark: string // 备注
  creator: string // 创建者
  createTime: Date // 创建时间
  updater: string // 更新者
  updateTime: Date // 更新时间
}

// 设备类型 API
export const DeviceTypeApi = {
  // 查询设备/工位类型分页
  getDeviceTypePage: async (params: any) => {
    return await request.get({ url: `/dms/device-type/page`, params })
  },

  // 查询设备/工位类型详情
  getDeviceType: async (id: number) => {
    return await request.get({ url: `/dms/device-type/get?id=` + id })
  },

  // 新增设备/工位类型
  createDeviceType: async (data: DeviceTypeVO) => {
    return await request.post({ url: `/dms/device-type/create`, data })
  },

  // 修改设备/工位类型
  updateDeviceType: async (data: DeviceTypeVO) => {
    return await request.put({ url: `/dms/device-type/update`, data })
  },

  // 删除设备/工位类型
  deleteDeviceType: async (id: number) => {
    return await request.delete({ url: `/dms/device-type/delete?id=` + id })
  },

  // 导出设备/工位类型 Excel
  exportDeviceType: async (params) => {
    return await request.download({ url: `/dms/device-type/export-excel`, params })
  },

  // 列出设备/工位类型
  listDeviceType: async (type: any) => {
    if (type == undefined || type == null) {
      return await request.get({
        url: `/dms/device-type/getList`
      })
    } else {
      return await request.get({
        url: `/dms/device-type/getList?type=${type}`
      })
    }
  }
}
