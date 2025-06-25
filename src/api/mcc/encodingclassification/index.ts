import request from '@/config/axios'

// 编码分类 VO
export interface EncodingClassificationVO {
  id: string // ID
  code: string // 编码分类CODE
  name: string // 编码分类名称
  service: string // 分类所属服务
  path: string // 分类查看编码使用地址
}

// 编码分类 API
export const EncodingClassificationApi = {
  // 查询编码分类分页
  getEncodingClassificationPage: async (params: any) => {
    return await request.get({ url: `/mcc/encoding-classification/page`, params })
  },

  // 查询编码分类详情
  getEncodingClassification: async (id: number) => {
    return await request.get({ url: `/mcc/encoding-classification/get?id=` + id })
  },

  // 新增编码分类
  createEncodingClassification: async (data: EncodingClassificationVO) => {
    return await request.post({ url: `/mcc/encoding-classification/create`, data })
  },

  // 修改编码分类
  updateEncodingClassification: async (data: EncodingClassificationVO) => {
    return await request.put({ url: `/mcc/encoding-classification/update`, data })
  },

  // 删除编码分类
  deleteEncodingClassification: async (id: number) => {
    return await request.delete({ url: `/mcc/encoding-classification/delete?id=` + id })
  },

  // 导出编码分类 Excel
  exportEncodingClassification: async (params) => {
    return await request.download({ url: `/mcc/encoding-classification/export-excel`, params })
  },


    // 查询编码分类集合
    getEncodingClassificationList: async (params: any) => {
        return await request.get({ url: `/mcc/encoding-classification/list`, params })
    },

}
