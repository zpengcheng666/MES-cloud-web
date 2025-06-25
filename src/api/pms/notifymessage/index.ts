import request from '@/config/axios'

// 简易版,项目计划提醒用 VO
export interface NotifyMessageVO {
  id: number // 用户ID
  userId: number // 用户id
  templateNickname: string // 模版发送人名称
  templateContent: string // 模版内容
  type: number // 通知类型
  readStatus: boolean // 是否已读
  readTime: Date // 阅读时间
}

// 简易版,项目计划提醒用 API
export const NotifyMessageApi = {
  // 查询简易版,项目计划提醒用分页
  getNotifyMessagePage: async (params: any) => {
    return await request.get({ url: `/pms/notify-message/page`, params })
  },

  // 查询简易版,项目计划提醒用详情
  getNotifyMessage: async (id: number) => {
    return await request.get({ url: `/pms/notify-message/get?id=` + id })
  },

  // 新增简易版,项目计划提醒用
  createNotifyMessage: async (data: NotifyMessageVO) => {
    return await request.post({ url: `/pms/notify-message/create`, data })
  },

  // 修改简易版,项目计划提醒用
  updateNotifyMessage: async (data: NotifyMessageVO) => {
    return await request.put({ url: `/pms/notify-message/update`, data })
  },

  // 删除简易版,项目计划提醒用
  deleteNotifyMessage: async (id: number) => {
    return await request.delete({ url: `/pms/notify-message/delete?id=` + id })
  },

  // 导出简易版,项目计划提醒用 Excel
  exportNotifyMessage: async (params) => {
    return await request.download({ url: `/pms/notify-message/export-excel`, params })
  },

  // 修改简易版,项目计划提醒用
  selectListByEntity: async (params) => {
    return await request.get({ url: `/pms/notify-message/selectListByEntity`, params })
  },
}
