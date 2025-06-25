import request from '@/config/axios'

// 设备日历,记录设备每天的可用时间 VO
export interface CalendarDeviceVO {
  id: string // id
  deviceId: string // 设备id
  date: Date // 日期
  startTime: localtime // 开始时间
  endTime: localtime // 结束时间
}

// 设备日历,记录设备每天的可用时间 API
export const CalendarDeviceApi = {
  // 查询设备日历,记录设备每天的可用时间分页
  getCalendarDevicePage: async (params: any) => {
    return await request.get({ url: `/dms/calendar-device/page`, params })
  },

  // 查询设备日历,记录设备每天的可用时间详情
  getCalendarDevice: async (id: number) => {
    return await request.get({ url: `/dms/calendar-device/get?id=` + id })
  },

  // 新增设备日历,记录设备每天的可用时间
  createCalendarDevice: async (data: CalendarDeviceVO) => {
    return await request.post({ url: `/dms/calendar-device/create`, data })
  },

  // 修改设备日历,记录设备每天的可用时间
  updateCalendarDevice: async (data: CalendarDeviceVO) => {
    return await request.put({ url: `/dms/calendar-device/update`, data })
  },

  // 删除设备日历,记录设备每天的可用时间
  deleteCalendarDevice: async (id: number) => {
    return await request.delete({ url: `/dms/calendar-device/delete?id=` + id })
  },

  // 导出设备日历,记录设备每天的可用时间 Excel
  exportCalendarDevice: async (params) => {
    return await request.download({ url: `/dms/calendar-device/export-excel`, params })
  },

  // 设备班次绑定
  bindShift: async (data) => {
    return await request.post({ url: `/dms/calendar-device/bindShift`, data })
  },

  // 设备班次解绑
  unbindShift: async (data) => {
    return await request.post({ url: `/dms/calendar-device/unbindShift`, data })
  },

  // 查询设备日历,记录设备每天的可用时间详情
  getByDeviceId: async (id: number) => {
    return await request.get({ url: `/dms/calendar-device/getByDeviceId?id=` + id })
  },

  // 修改设备日历,记录设备每天的可用时间
  updateCalendarDeviceByTime: async (data) => {
    return await request.put({ url: `/dms/calendar-device/updateCalendarDevice`, data })
  },

  // 删除设备日历
  deleteByDate: async (data) => {
    return await request.post({ url: `/dms/calendar-device/deleteByDate`, data })
  },
  // 查询设备班次时间
  getShiftByDeviceId: async (id: number) => {
    return await request.get({ url: `/dms/calendar-productionline/getShiftByDeviceId?id=` + id })
},
}
