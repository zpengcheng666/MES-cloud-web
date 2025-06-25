import request from '@/config/axios'

// 刀具参数模板 VO
export interface ToolParamTemplateVO {
  id: string // ID
  templateName: string // 模板名称
  toolType: number // 刀具类型 1：整体、2：可转位
  version: number // 版本号， 每次更新递增
  status: boolean // 状态(0:失效 1:有效)
}

// 刀具参数模板 API
export const ToolParamTemplateApi = {
  // 查询刀具参数模板分页
  getToolParamTemplatePage: async (params: any) => {
    return await request.get({ url: `/tms/tool-param-template/page`, params })
  },

  // 查询刀具参数模板详情
  getToolParamTemplate: async (id: number) => {
    return await request.get({ url: `/tms/tool-param-template/get?id=` + id })
  },

  // 导出刀具参数模板 Excel
  exportToolParamTemplate: async (params) => {
    return await request.download({ url: `/tms/tool-param-template/export-excel`, params })
  },

  // 新增参数模版主
  createToolParamTemplate: async (data: ToolParamTemplateVO) => {
    return await request.post({ url: `/tms/tool-param-template/create`, data })
  },

  // 修改参数模版主
  updateToolParamTemplate: async (data: ToolParamTemplateVO) => {
    return await request.put({ url: `/tms/tool-param-template/update`, data })
  },

  // 删除刀具参数模板
  deleteToolParamTemplate: async (id: number) => {
    return await request.delete({ url: `/tms/tool-param-template/delete?id=` + id })
  },

  getToolParamTemplateByMaterialTypeId: async (materialTypeId: string) => {
    return await request.get({ url: `/tms/tool-param-template/getToolParamTemplateByMaterialTypeId?materialTypeId=` + materialTypeId })
  },
}
