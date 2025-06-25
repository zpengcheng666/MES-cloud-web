import request from '@/config/axios'

// 刀具类型 VO
export interface ToolConfigVO {
  id: string // ID
  materialConfigId: string // 物料类型id
  toolName: string // 名称
  toolModel: string // 型号
  toolWeight: number // 重量
  toolTexture: string // 材质
  toolCoating: string // 涂层
  ratedLife: number // 额定寿命
  templeteId: string // 参数模板id
  maxSpeed: number // 最高转速(mm)
  lengthUpper: number // 总长上限(mm)
  lengthFloor: number // 总长下限(mm)
  hangingLengthUpper: number // 玄长上限(mm)
  hangingLengthFloor: number // 玄长下限(mm)
  bladeUpperDeviation: number // 刃径上偏差(mm)
  bladeFloorDeviation: number // 刃径下偏差(mm)
  rUpperDeviation: number // 底R上偏差(mm)
  rFloorDeviation: number // 底R下偏差(mm)
  status: boolean // 刀组状态0停用1正常
}

// 刀具类型 API
export const ToolConfigApi = {
  // 查询刀具类型分页
  getToolConfigPage: async (params: any) => {
    return await request.get({ url: `/tms/tool-config/page`, params })
  },

  // 查询刀具类型详情
  getToolConfig: async (id: number) => {
    return await request.get({ url: `/tms/tool-config/get?id=` + id })
  },

  // 新增刀具类型
  createToolConfig: async (data: ToolConfigVO) => {
    return await request.post({ url: `/tms/tool-config/create`, data })
  },

  // 修改刀具类型
  updateToolConfig: async (data: ToolConfigVO) => {
    return await request.put({ url: `/tms/tool-config/update`, data })
  },

  // 删除刀具类型
  deleteToolConfig: async (id: number) => {
    return await request.delete({ url: `/tms/tool-config/delete?id=` + id })
  },

  // 导出刀具类型 Excel
  exportToolConfig: async (params) => {
    return await request.download({ url: `/tms/tool-config/export-excel`, params })
  },

  // 查询刀具类型详情
  getToolConfigByMaterialConfigId: async (id: string) => {
    return await request.get({ url: `/tms/tool-config/getByMaterialConfigId?materialConfigId=` + id })
  },


  // 查询适配刀具类型分页
  getFitToolConfigPageByType: async (params: any) => {
    return await request.get({ url: `/tms/tool-config/getFitToolConfigPageByType`, params })
  },

  // 查询刀具类型分页
  getToolConfigPageByType: async (params: any) => {
    return await request.get({ url: `/tms/tool-config/getToolConfigPageByType`, params })
  },
}
