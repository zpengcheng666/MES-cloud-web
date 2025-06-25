import request from '@/config/axios'

// 刀具参数信息 VO
export interface ToolConfigParameterVO {
  id: number // 主键
  toolInformationId: number // 刀具ID
  name: string // 参数名称
  value: string // 参数值
  abbr: string // 参数缩写
  unit: string // 计量单位
  sort: number // 排序
  type: boolean // 分类 1 几何参数  2 切削参数
}

// 刀具参数信息 API
export const ToolConfigParameterApi = {
  // 查询刀具参数信息分页
  getToolConfigParameterPage: async (params: any) => {
    return await request.get({ url: `/tms/tool-config-parameter/page`, params })
  },

  // 查询刀具参数信息详情
  getToolConfigParameter: async (id: number) => {
    return await request.get({ url: `/tms/tool-config-parameter/get?id=` + id })
  },

  // 新增刀具参数信息
  createToolConfigParameter: async (data: ToolConfigParameterVO) => {
    return await request.post({ url: `/tms/tool-config-parameter/create`, data })
  },

  // 修改刀具参数信息
  updateToolConfigParameter: async (data: ToolConfigParameterVO) => {
    return await request.put({ url: `/tms/tool-config-parameter/update`, data })
  },

  // 删除刀具参数信息
  deleteToolConfigParameter: async (id: number) => {
    return await request.delete({ url: `/tms/tool-config-parameter/delete?id=` + id })
  },

  // 导出刀具参数信息 Excel
  exportToolConfigParameter: async (params) => {
    return await request.download({ url: `/tms/tool-config-parameter/export-excel`, params })
  },

  // 查询刀具参数信息详情
  getToolConfigParameterByConfigId: async (configId: string) => {
    return await request.get({ url: `/tms/tool-config-parameter/getToolConfigParameterByConfigId?configId=` + configId })
  },
}
