import request from '@/config/axios'

// 策略 VO
export interface StrategyVO {
  id: string // 主键id
  code: string // 编码
  name: string // 名称
  description: string // 描述
  status: number // 状态（1启用 0不启用）
  createBy: string // 创建人
  updateBy: string // 更新人
}

// 策略 API
export const StrategyApi = {
  // 查询策略分页
  getStrategyPage: async (params: any) => {
    return await request.get({ url: `/macs/strategy/page`, params })
  },

  // 查询策略详情
  getStrategy: async (id: number) => {
    return await request.get({ url: `/macs/strategy/get?id=` + id })
  },

  // 新增策略
  createStrategy: async (data: StrategyVO) => {
    return await request.post({ url: `/macs/strategy/create`, data })
  },

  // 修改策略
  updateStrategy: async (data: StrategyVO) => {
    return await request.put({ url: `/macs/strategy/update`, data })
  },

  // 删除策略
  deleteStrategy: async (id: number) => {
    return await request.delete({ url: `/macs/strategy/delete?id=` + id })
  },

  // 导出策略 Excel
  exportStrategy: async (params) => {
    return await request.download({ url: `/macs/strategy/export-excel`, params })
  }
}