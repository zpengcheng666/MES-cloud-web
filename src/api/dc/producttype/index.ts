import request from '@/config/axios'

// 产品类型 VO
export interface ProductTypeVO {
  productTypeId: string // 产品类型id
  productTypeName: string // 产品类型名称
  productTypeText: string // 产品类型介绍
  deviceCollect: string
  collectAttributesDetails: Date
}

// 产品类型 API
export const ProductTypeApi = {

  //获取全部设备类型
  getProductTypeList: async () => {
    return await request.get({ url: `/dc/product-type/getList` })
  },

  // 查询产品类型分页
  getProductTypePage: async (params: any) => {
    return await request.get({ url: `/dc/product-type/page`, params })
  },

  // 查询产品类型详情
  getProductType: async (id: number) => {
    return await request.get({ url: `/dc/product-type/get?id=` + id })
  },

  // 新增产品类型
  createProductType: async (data: ProductTypeVO) => {
    return await request.post({ url: `/dc/product-type/create`, data })
  },

  // 修改产品类型
  updateProductType: async (data: ProductTypeVO) => {
    return await request.put({ url: `/dc/product-type/update`, data })
  },

  // 删除产品类型
  deleteProductType: async (id: number) => {
    return await request.delete({ url: `/dc/product-type/delete?id=` + id })
  },

  // 导出产品类型 Excel
  exportProductType: async (params) => {
    return await request.download({ url: `/dc/product-type/export-excel`, params })
  },

  // 获取产品类型详细信息
  queryProductByDeviceId: async (id: number) => {
    return await request.get({ url: `/dc/product-type/queryProductByDeviceId?id=` + id })
  },

  //根据设备获取产品信息
  getProductListByDeviceId: async (id: number) => {
    return await request.get({ url: `/dc/product-type/getProductListByDeviceId?id=` + id })
  }

  //根据topicId获取设备

}
