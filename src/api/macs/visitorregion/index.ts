import request from '@/config/axios'

// 访客区域权限 VO
export interface VisitorRegionVO {
  id: string // 主键id
  visitorId: string // 访客id
  regionId: string // 区域id
  applicationId: string // 访客申请id
  effectiveDate: Date // 生效日期
  invalidDate: Date // 失效日期
}

// 访客区域权限 API
export const VisitorRegionApi = {
  // 查询访客区域权限分页
  getVisitorRegionPage: async (params: any) => {
    return await request.get({ url: `/macs/visitor-region/page`, params })
  },

  // 查询访客区域权限详情
  getVisitorRegion: async (id: number) => {
    return await request.get({ url: `/macs/visitor-region/get?id=` + id })
  },

  // 新增访客区域权限
  createVisitorRegion: async (data: VisitorRegionVO) => {
    return await request.post({ url: `/macs/visitor-region/create`, data })
  },

  // 修改访客区域权限
  updateVisitorRegion: async (data: VisitorRegionVO) => {
    return await request.put({ url: `/macs/visitor-region/update`, data })
  },

  // 删除访客区域权限
  deleteVisitorRegion: async (id: number) => {
    return await request.delete({ url: `/macs/visitor-region/delete?id=` + id })
  },

  // 导出访客区域权限 Excel
  exportVisitorRegion: async (params) => {
    return await request.download({ url: `/macs/visitor-region/export-excel`, params })
  }
}