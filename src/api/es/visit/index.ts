import request from '@/config/axios'

// 访客记录 VO
export interface VisitVO {
  visitRecordId: string // 访问记录ID
  name: string // 访客姓名
  visitorCancelTime: Date // 访客签退时间
  status: number // 访问记录状态(1：创建访客访问记录 2：取消访客访问记录 3：签到)
  company: string // 		访客单位
  cause: string // 		来访目的
  followCount: string // 		同行人数
  planBeginTime: Date // 计划开始时间
  planEndTime: Date // 计划结束时间
  visitorRecordTime: Date // 访客签到时间
  visitorCheckCode: string // 访客签到码
  visitTpId: string // 被访人tpId
  deviceSn: string // 设备 SN
}

// 访客记录 API
export const VisitApi = {
  // 查询访客记录分页
  getVisitPage: async (params: any) => {
    return await request.get({ url: `/es/visit/page`, params })
  },

  // 查询访客记录详情
  getVisit: async (id: number) => {
    return await request.get({ url: `/es/visit/get?id=` + id })
  },

  // 新增访客记录
  createVisit: async (data: VisitVO) => {
    return await request.post({ url: `/es/visit/create`, data })
  },

  // 修改访客记录
  updateVisit: async (data: VisitVO) => {
    return await request.put({ url: `/es/visit/update`, data })
  },

  // 删除访客记录
  deleteVisit: async (id: number) => {
    return await request.delete({ url: `/es/visit/delete?id=` + id })
  },

  // 导出访客记录 Excel
  exportVisit: async (params) => {
    return await request.download({ url: `/es/visit/export-excel`, params })
  },
}