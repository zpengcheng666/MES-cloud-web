import request from '@/config/axios'

// 编码类别属性表(树形结构) VO
export interface MaterialTypeVO {
  id: string // ID
  code: string // 编码
  name: string // 名称
  parentId: string // 父类型id
  bitNumber: number // 位数
}

// 编码类别属性表(树形结构) API
export const MaterialTypeApi = {
  // 查询编码类别属性表(树形结构)列表
  getMaterialTypeList: async (params) => {
    return await request.get({ url: `/mcc/material-type/list`, params })
  },

  // 查询编码类别属性表(树形结构)详情
  getMaterialType: async (id: number) => {
    return await request.get({ url: `/mcc/material-type/get?id=` + id })
  },

  // 新增编码类别属性表(树形结构)
  createMaterialType: async (data: MaterialTypeVO) => {
    return await request.post({ url: `/mcc/material-type/create`, data })
  },

  // 修改编码类别属性表(树形结构)
  updateMaterialType: async (data: MaterialTypeVO) => {
    return await request.put({ url: `/mcc/material-type/update`, data })
  },

  // 删除编码类别属性表(树形结构)
  deleteMaterialType: async (id: number) => {
    return await request.delete({ url: `/mcc/material-type/delete?id=` + id })
  },

  // 导出编码类别属性表(树形结构) Excel
  exportMaterialType: async (params) => {
    return await request.download({ url: `/mcc/material-type/export-excel`, params })
  },

  // 查询编码类别属性表(树形结构)列表
  getMaterialTypeConfigList: async (params) => {
    return await request.get({ url: `/mcc/material-type/config/list`, params })
  },
}
