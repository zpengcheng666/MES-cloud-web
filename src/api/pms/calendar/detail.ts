import request from '@/config/axios'

// 基础日历的工作日 VO
export interface CalendarDetailVO {
  id: string // id
  bcid: string // 基础日历id
  cdname: number // 休息/工作(1/2)
  cddate: string // 日期
}

// 基础日历的工作日 API
export const CalendarDetailApi = {
  // 查询基础日历的工作日分页
  getCalendarDetailPage: async (params: any) => {
    return await request.get({ url: `/dms/calendar-detail/page`, params })
  },

  // 查询基础日历的工作日详情
  getCalendarDetail: async (id: number) => {
    return await request.get({ url: `/dms/calendar-detail/get?id=` + id })
  },

  // 新增基础日历的工作日
  createCalendarDetail: async (data: CalendarDetailVO) => {
    return await request.post({ url: `/dms/calendar-detail/create`, data })
  },

  // 修改基础日历的工作日
  updateCalendarDetail: async (data: CalendarDetailVO) => {
    return await request.put({ url: `/dms/calendar-detail/update`, data })
  },

  // 删除基础日历的工作日
  deleteCalendarDetail: async (id: number) => {
    return await request.delete({ url: `/dms/calendar-detail/delete?id=` + id })
  },
  // 查询基础日历的工作日详情
  listByBasicId: async (id: number) => {
    return await request.get({ url: `/dms/calendar-detail/listByBasicId?id=` + id })
  },
}
