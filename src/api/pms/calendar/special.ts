import request from '@/config/axios'

// 基础日历的工作日（特别版，调休节假日等特殊日期） VO
export interface CalendarSpecialVO {
  id: string // id
  bcid: string // 基础日历id
  csname: number // 休息/工作(1/2)
  csdate: string // 日期
}

// 基础日历的工作日（特别版，调休节假日等特殊日期） API
export const CalendarSpecialApi = {
  // 查询基础日历的工作日（特别版，调休节假日等特殊日期）分页
  getCalendarSpecialPage: async (params: any) => {
    return await request.get({ url: `/dms/calendar-special/page`, params })
  },

  // 查询基础日历的工作日（特别版，调休节假日等特殊日期）详情
  getCalendarSpecial: async (id: number) => {
    return await request.get({ url: `/dms/calendar-special/get?id=` + id })
  },

  // 新增基础日历的工作日（特别版，调休节假日等特殊日期）
  createCalendarSpecial: async (data: CalendarSpecialVO) => {
    return await request.post({ url: `/dms/calendar-special/create`, data })
  },

  // 修改基础日历的工作日（特别版，调休节假日等特殊日期）
  updateCalendarSpecial: async (data: CalendarSpecialVO) => {
    return await request.put({ url: `/dms/calendar-special/update`, data })
  },

  // 删除基础日历的工作日（特别版，调休节假日等特殊日期）
  deleteCalendarSpecial: async (id: number) => {
    return await request.delete({ url: `/dms/calendar-special/delete?id=` + id })
  },

  // 删除特殊日历
  deleteByDate: async (data: CalendarSpecialVO) => {
    return await request.post({ url: `/dms/calendar-special/deleteByDate`, data })
  },

  // 删除特殊日历
  listAll: async () => {
    return await request.get({ url: `/dms/calendar-special/list`})
  },
}
