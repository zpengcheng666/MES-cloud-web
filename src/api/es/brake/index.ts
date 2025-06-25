import request from '@/config/axios'

// 旧厂车牌数据 VO
export interface BrakeVO {
  id: string // 主键id(固定车id)
  registerPlate: string // 车牌号
  numberTimes: number // 剩余次数(用于充值扣次数)
  phoneNumber: string // 客户电话
  balance: number // 账户余额
  identiType: string // 证件类型
  clientType: string // 客户类型
  passTypeName: string // 通行证类型
  identiNumber: string // 证件编号
  clientNo: string // 客户编号
  email: string // 客户邮箱
  deadline: Date // 到期时间
  parkingSpaceType: string // 车位类型
  carTypeName: string // 车辆类型
  clientName: string // 客户名称
  address: string // 客户住址
  sex: string // 客户性别
}

// 旧厂车牌数据 API
export const BrakeApi = {
  // 查询旧厂车牌数据分页
  getBrakePage: async (params: any) => {
    return await request.get({ url: `/es/brake/page`, params })
  },

  // 查询旧厂车牌数据详情
  getBrake: async (id: string) => {
    return await request.get({ url: `/es/brake/get?id=` + id })
  },

  // 新增旧厂车牌数据
  createBrake: async (data: BrakeVO) => {
    return await request.post({ url: `/es/brake/create`, data })
  },

  // 修改旧厂车牌数据
  updateBrake: async (data: BrakeVO) => {
    return await request.put({ url: `/es/brake/update`, data })
  },

  // 删除旧厂车牌数据
  deleteBrake: async (id: number) => {
    return await request.delete({ url: `/es/brake/delete?id=` + id })
  },

  // 导出旧厂车牌数据 Excel
  exportBrake: async (params) => {
    return await request.download({ url: `/es/brake/export-excel`, params })
  },

  //批量同步
  syncBrake: async (ids: string[])=>{
    return await  request.put( {url: '/es/brake/syncBrake' , params: {ids: ids.join(',')}})
  }
}
