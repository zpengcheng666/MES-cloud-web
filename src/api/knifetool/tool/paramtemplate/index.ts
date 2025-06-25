/*
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-07 14:55:07
 * @LastEditTime: 2024-07-30 11:05:27
 * @FilePath: /cimp-tms-web/src/api/knifetool/paramtemplate/index.ts
 */
import request from '@/config/axios'

// 参数模版主 VO
export interface ParamTemplateVO {
  id: number // 主键
  templeteName: string // 模版名称
  toolCategoryId: number // 所属刀具分类ID
  toolTypeId: number|null // 刀具类型dicID
  version: number // 版本号， 每次更新递增
}
// 查询参数模版主分页
export const getParamTemplatePage = async (params: any) => {
  return await request.get({ url: `/knifetool/paramTemplate/page`, params })
}

// 查询参数模版主详情
export const getParamTemplate = async (id: number) => {
  return await request.get({ url: `/knifetool/paramTemplate/get?id=` + id })
}

// 新增参数模版主
export const createParamTemplate = async (data: ParamTemplateVO) => {
  return await request.post({ url: `/knifetool/paramTemplate/create`, data })
}

// 修改参数模版主
export const updateParamTemplate = async (data: ParamTemplateVO) => {
  return await request.put({ url: `/knifetool/paramTemplate/update`, data })
}

// 删除参数模版主
export const deleteParamTemplate = async (id: number) => {
  return await request.delete({ url: `/knifetool/paramTemplate/delete?id=` + id })
}

// 导出参数模版主 Excel
export const exportParamTemplate = async (params) => {
  return await request.download({ url: `/knifetool/paramTemplate/export-excel`, params })
}

// 根据刀具分类和类型查询参数模版
export const getTempleteByCategoryAndType = async (categoryId: number, typeId: number) => {
  return await request.get({ url: `/knifetool/paramTemplate/detail/category/type/${categoryId}/${typeId}` })
}
