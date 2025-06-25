import request from '@/config/axios'

// 门禁用户 VO
export interface UserVO {
  id: string // 主键id
  userId: string // 用户id
  code: string // 编号/卡号
  facialFeature: byte[] // 人脸特征
  fingerprint: byte[] // 指纹特征
  regionId: string // 当前所在区域
  facePicture: string // 人脸图片
  fingerprintPicture: string // 指纹图片
}

// 门禁用户 API
export const UserApi = {
  // 查询门禁用户分页
  getUserPage: async (params: any) => {
    return request.get({ url: '/system/user/page', params })
  },

  getMacsUserPage: async () => {
    return request.get({ url: '/macs/user/list' })
  },


  // 查询门禁用户详情
  getUser: async (id: number) => {
    return await request.get({ url: `/macs/user/getByUserId?id=` + id })
  },

  // 新增门禁用户
  createUser: async (data: UserVO) => {
    return await request.post({ url: `/macs/user/create`, data })
  },

  // 修改门禁用户
  updateUser: async (data: UserVO) => {
    return await request.put({ url: `/macs/user/update`, data })
  },

  // 删除门禁用户
  deleteUser: async (id: number) => {
    return await request.delete({ url: `/macs/user/delete?id=` + id })
  },

  // 导出门禁用户 Excel
  exportUser: async (params) => {
    return await request.download({ url: `/macs/user/export-excel`, params })
  },
  getCollectorList: async (params) => {
    return await request.get({ url: `/macs/collector/list`, params })
  },
  queryTreeListForUserRegion: async (params) => {
    return await request.get({ url: `/macs/userRoleRegion/userRegion`, params })
  },
  userRegionUpdate: async (data) => {
    return await request.post({ url: `/macs/userRoleRegion/userRegionUpdate`, data })
  },
}
