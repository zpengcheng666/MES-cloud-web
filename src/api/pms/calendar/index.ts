import request from '@/config/axios'

// 基础日历 VO
export interface BasicCalendarVO {
  id: string // id
  name: string // 日历名称
  startDate: Date // 开始日期
  endDate: Date // 结束日期
}

// 基础日历 API
export const BasicCalendarApi = {
  // 查询基础日历分页
  getBasicCalendarPage: async (params: any) => {
    return await request.get({ url: `/dms/basic-calendar/page`, params })
  },

  // 查询基础日历详情
  getBasicCalendar: async (id: number) => {
    return await request.get({ url: `/dms/basic-calendar/get?id=` + id })
  },

  // 新增基础日历
  createBasicCalendar: async (data: BasicCalendarVO) => {
    return await request.post({ url: `/dms/basic-calendar/create`, data })
  },

  // 修改基础日历
  updateBasicCalendar: async (data: BasicCalendarVO) => {
    return await request.put({ url: `/dms/basic-calendar/update`, data })
  },

  // 删除基础日历
  deleteBasicCalendar: async (id: number) => {
    return await request.delete({ url: `/dms/basic-calendar/delete?id=` + id })
  },

  // 导出基础日历 Excel
  exportBasicCalendar: async (params) => {
    return await request.download({ url: `/dms/basic-calendar/export-excel`, params })
  },
  // 查询基础日历详情
  getBasicCalendarTest: async (id: number) => {
    return await request.get({ url: `/dms/basic-calendar/getTest?id=` + id })
  },

  // 查询基础日历的工作日详情
  listByBasicId: async (id: number) => {
    return await request.get({ url: `/dms/basic-calendar/listByBasicId?id=` + id })
  },
}
