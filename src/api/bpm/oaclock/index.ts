import request from '@/config/axios'

// OA 打卡 VO
export interface OaClockVO {
  id: number // 主键
  name: string // 用户名
  userId: number // 用户id
  type: number // 打卡类型
  clockStatus: number // 打卡状态
  dept: string // 部门
  job: string // 岗位
  clockTime: Date // 打卡时间
  reason: string // 打卡异常原因
  // status: number // 审批结果
  // processInstanceId: string // 流程实例的编号
}

// OA 打卡 type
export type OaClockType ={
  id: number // 主键
  name: string // 用户名
  userId: number // 用户id
  type: number // 打卡类型
  clockStatus: number // 打卡状态
  dept: string // 部门
  job: string // 岗位
  clockTime: Date // 打卡时间
  reason: string // 打卡异常原因
  // status: number // 审批结果
  // processInstanceId: string // 流程实例的编号
}

// OA 打卡 API
export const OaClockApi = {
  // 查询OA 打卡分页
  getOaClockPage: async (params: any) => {
    return await request.get({ url: `/bpm/oa-clock/page`, params })
  },

  // 查询OA 打卡详情
  getOaClock: async (id: number) => {
    return await request.get({ url: `/bpm/oa-clock/get?id=` + id })
  },

  // 新增OA 打卡
  createOaClock: async (data: OaClockVO) => {
    return await request.post({ url: `/bpm/oa-clock/create`, data })
  },

  // 修改OA 打卡
  updateOaClock: async (data: OaClockVO) => {
    return await request.put({ url: `/bpm/oa-clock/update`, data })
  },

  // 删除OA 打卡
  deleteOaClock: async (id: number) => {
    return await request.delete({ url: `/bpm/oa-clock/delete?id=` + id })
  },

  // 导出OA 打卡 Excel
  exportOaClock: async (params) => {
    return await request.download({ url: `/bpm/oa-clock/export-excel`, params })
  }
}
