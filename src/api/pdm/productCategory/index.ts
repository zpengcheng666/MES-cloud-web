import request from '@/config/axios'

// PDM 产品分类 VO
export interface ProductCategoryVO {
  id: number // 分类编号
  parentId: number // 父分类编号
  name: string // 分类名称
  code: string // 分类编码
  sort: number // 分类排序
  status: number // 开启状态
}

// PDM 产品分类 API
export const ProductCategoryApi = {
  // 查询产品分类列表
  getProductCategoryList: async (params) => {
    return await request.get({ url: `/pdm/product-category/list`, params })
  },

  // 查询产品分类精简列表
  getProductCategorySimpleList: async () => {
    return await request.get({ url: `/pdm/product-category/simple-list` })
  },

  // 查询产品分类详情
  getProductCategory: async (id: number) => {
    return await request.get({ url: `/pdm/product-category/get?id=` + id })
  },

  // 新增产品分类
  createProductCategory: async (data: ProductCategoryVO) => {
    return await request.post({ url: `/pdm/product-category/create`, data })
  },

  // 修改产品分类
  updateProductCategory: async (data: ProductCategoryVO) => {
    return await request.put({ url: `/pdm/product-category/update`, data })
  },

  // 删除产品分类
  deleteProductCategory: async (id: number) => {
    return await request.delete({ url: `/pdm/product-category/delete?id=` + id })
  },

  // 导出产品分类 Excel
  exportProductCategory: async (params) => {
    return await request.download({ url: `/pdm/product-category/export-excel`, params })
  }
}
