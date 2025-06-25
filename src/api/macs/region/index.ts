import request from '@/config/axios'

// 区域 VO
export interface RegionVO {
  id: string // 主键id
  code: string // 区域编码
  name: string // 区域名称
  publicStatus: boolean // 公开状态(0未公开,1公开)
  description: string // 描述
  parentId: string // 上级id
  createBy: string // 创建人
  updateBy: string // 更新人
}

// 区域 API
export const RegionApi = {
  // 查询区域列表
  getRegionList: async (params) => {
    return await request.get({ url: `/macs/region/list`, params })
  },

  // 查询区域详情
  getRegion: async (id: number) => {
    return await request.get({ url: `/macs/region/get?id=` + id })
  },

  // 新增区域
  createRegion: async (data: RegionVO) => {
    return await request.post({ url: `/macs/region/create`, data })
  },

  // 修改区域
  updateRegion: async (data: RegionVO) => {
    return await request.put({ url: `/macs/region/update`, data })
  },

  // 删除区域
  deleteRegion: async (id: number) => {
    return await request.delete({ url: `/macs/region/delete?id=` + id })
  },

  // 导出区域 Excel
  exportRegion: async (params) => {
    return await request.download({ url: `/macs/region/export-excel`, params })
  },

  getUserList: async (params) => {
    return await request.get({ url: `/system/user/page`, params })
  },
  getRoleList: async (params) => {
    return await request.get({ url: `/system/role/page`, params })
  },
  getExistingPermissions: async (params) => {
    return await request.get({ url: `/macs/userRoleRegion/getPermissionsByRegionId`, params})
  },
  updateUserRoleForAuthority: async (data) => {
    return await request.post({ url: `/macs/userRoleRegion/updateUserRoleForAuthority`, data})
  },
  addUserRoleForAuthority: async (data) => {
    return await request.post({ url: `/macs/userRoleRegion/addUserRoleForAuthority`, data})
  },
}
