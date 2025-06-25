import request from '@/config/axios'

// OA 会议申请 VO
export interface OaMeetingVO {
  id: number // 请假表单主键
  title: string // 会议主题
  mDate: Date // 会议日期
  staff: string // 参会人员
  startTime: localtime // 开始时间
  endTime: localtime // 结束时间
  mRoom: string // 会议室
  description: string // 描述
  document: string // 文件
}

// OA 会议申请 Type
export type OaMeetingType = {
  id: number // 请假表单主键
  title: string // 会议主题
  mDate: Date // 会议日期
  staff: string // 参会人员
  startTime: localtime // 开始时间
  endTime: localtime // 结束时间
  mRoom: string // 会议室
  description: string // 描述
  document: string // 文件
}

// OA 会议申请 API
export const OaMeetingApi = {
  // 查询OA 会议申请分页
  getOaMeetingPage: async (params: any) => {
    return await request.get({ url: `/bpm/oa-meeting/page`, params })
  },

  // 查询OA 会议申请详情
  getOaMeeting: async (id: number) => {
    return await request.get({ url: `/bpm/oa-meeting/get?id=` + id })
  },

  // 新增OA 会议申请
  createOaMeeting: async (data: OaMeetingVO) => {
    return await request.post({ url: `/bpm/oa-meeting/create`, data })
  },

  // 修改OA 会议申请
  updateOaMeeting: async (data: OaMeetingVO) => {
    return await request.put({ url: `/bpm/oa-meeting/update`, data })
  },

  // 删除OA 会议申请
  deleteOaMeeting: async (id: number) => {
    return await request.delete({ url: `/bpm/oa-meeting/delete?id=` + id })
  },

  // 导出OA 会议申请 Excel
  exportOaMeeting: async (params) => {
    return await request.download({ url: `/bpm/oa-meeting/export-excel`, params })
  }
}
