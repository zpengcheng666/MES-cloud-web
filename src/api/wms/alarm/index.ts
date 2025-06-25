import request from '@/config/axios'

// 异常 VO
export interface AlarmVO {
  id: string // ID
  alarmType: string // 告警类型(1-系统,2-agv)
  alarmSource: string // 告警源
  alarmLevel: string // 告警级别(1-信息,2-警告,3-错误)
  alarmNum: string // 告警编号
  alarmDesc: string // 告警描述
  alarmState: string // 异常状态,1-未解决,2-已解决,3-忽略
}

// 异常 API
export const AlarmApi = {
  // 查询异常分页
  getAlarmPage: async (params: any) => {
    return await request.get({ url: `/wms/alarm/page`, params })
  },

  // 查询异常详情
  getAlarm: async (id: number) => {
    return await request.get({ url: `/wms/alarm/get?id=` + id })
  },

  // 新增异常
  createAlarm: async (data: AlarmVO) => {
    return await request.post({ url: `/wms/alarm/create`, data })
  },

  // 修改异常
  updateAlarm: async (data: AlarmVO) => {
    return await request.put({ url: `/wms/alarm/update`, data })
  },

  // 删除异常
  deleteAlarm: async (id: number) => {
    return await request.delete({ url: `/wms/alarm/delete?id=` + id })
  },

  // 导出异常 Excel
  exportAlarm: async (params) => {
    return await request.download({ url: `/wms/alarm/export-excel`, params })
  },
}