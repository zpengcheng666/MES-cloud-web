import request from '@/config/axios'

// 编码自定义属性 VO
export interface EncodingAttributeVO {
  id: string // ID
  name: string // 属性名称
  code: string // 属性值
}

// 编码自定义属性 API
export const EncodingAttributeApi = {
  // 查询编码自定义属性分页
  getEncodingAttributePage: async (params: any) => {
    return await request.get({ url: `/mcc/encoding-attribute/page`, params })
  },

  // 查询编码自定义属性详情
  getEncodingAttribute: async (id: number) => {
    return await request.get({ url: `/mcc/encoding-attribute/get?id=` + id })
  },

  // 新增编码自定义属性
  createEncodingAttribute: async (data: EncodingAttributeVO) => {
    return await request.post({ url: `/mcc/encoding-attribute/create`, data })
  },

  // 修改编码自定义属性
  updateEncodingAttribute: async (data: EncodingAttributeVO) => {
    return await request.put({ url: `/mcc/encoding-attribute/update`, data })
  },

  // 删除编码自定义属性
  deleteEncodingAttribute: async (id: number) => {
    return await request.delete({ url: `/mcc/encoding-attribute/delete?id=` + id })
  },

  // 导出编码自定义属性 Excel
  exportEncodingAttribute: async (params) => {
    return await request.download({ url: `/mcc/encoding-attribute/export-excel`, params })
  },


    // 查询编码自定义属性集合
    getEncodingAttributeList: async (params: any) => {
        return await request.get({ url: `/mcc/encoding-attribute/list`, params })
    },
}
