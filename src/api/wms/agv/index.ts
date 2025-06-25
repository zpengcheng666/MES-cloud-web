import request from '@/config/axios'

// AGV 信息 VO
export interface AGVVO {
  id: string // ID
  mode: number // 机器人运行模式，手动模式=0，自动	模式=1
  x: string // 机器人的 x 坐标, 单位 m
  y: string // 机器人的 y坐标, 单位 m
  currentStation: string // 机器人当前所在站点的 id（该判断比	较严格，机器人必须很靠近某一个站	点(<30cm， 这个距离可以通过参数	配置中的 CurrentPointDist 修改)，否	则为空字符，即不处于任何站点
  lastStation: string // 机器人上一个所在站点的 id
  isStop: boolean // 机器人底盘是否静止（行走电机）
  blocked: boolean // 机器人是否被阻挡
  emergency: boolean // true 表示急停按钮处于激活状态(按	下), false 表示急停按钮处于非激活状	态(拔起)
  taskStatus: string // 0 = NONE, 1 = WAITING(目前不可能	出现该状态), 2 = RUNNING, 3 =	SUSPENDED, 4 = COMPLETED, 5 =	FAILED, 6 = CANCELED
  locationId: string // 自身库位id
}

// AGV 信息 API
export const AGVApi = {
  // 查询AGV 信息分页
  getAGVPage: async (params: any) => {
    return await request.get({ url: `/wms/AGV/page`, params })
  },

  // 查询AGV 信息详情
  getAGV: async (id: number) => {
    return await request.get({ url: `/wms/AGV/get?id=` + id })
  },

  // 新增AGV 信息
  createAGV: async (data: AGVVO) => {
    return await request.post({ url: `/wms/AGV/create`, data })
  },

  // 修改AGV 信息
  updateAGV: async (data: AGVVO) => {
    return await request.put({ url: `/wms/AGV/update`, data })
  },

  // 删除AGV 信息
  deleteAGV: async (id: number) => {
    return await request.delete({ url: `/wms/AGV/delete?id=` + id })
  },

  // 导出AGV 信息 Excel
  exportAGV: async (params) => {
    return await request.download({ url: `/wms/AGV/export-excel`, params })
  },
}