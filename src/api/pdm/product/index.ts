import request from '@/config/axios'

export interface ProductVO {
  id: string
  productName: string
  productNumber: string
  designUnit: string
  description: string
  status: number
  productTypeId: string
  createTime: Date
  updateTime: Date
}

// 查询产品列表
export const getProductPage = async (params: PageParam) => {
  return await request.get({ url: '/pdm/product/page', params })
}

// 查询产品详情
export const getProduct = async (id: number) => {
  return await request.get({ url: '/pdm/product/get?id=' + id })
}

// 新增产品
export const createProduct = async (data: ProductVO) => {
  return await request.post({ url: '/pdm/product/create', data })
}

// 修改产品
export const updateProduct = async (data: ProductVO) => {
  return await request.put({ url: '/pdm/product/update', data })
}

// 删除产品
export const deleteProduct = async (id: number) => {
  return await request.delete({ url: '/pdm/product/delete?id=' + id })
}

// 导出产品
export const exportProduct = (params) => {
  return request.download({
    url: '/pdm/product/export-excel',
    params
  })
}

// 查询产品启用的下拉列表
export const getProductList = async (params) => {
  return await request.get({ url: '/pdm/product/simple-list', params })
}

// 查询临时项目列表
export const getProjectList = async (params) => {
  return await request.get({ url: '/pdm/project/list1', params })
}
