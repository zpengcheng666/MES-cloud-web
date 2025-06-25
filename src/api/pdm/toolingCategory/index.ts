import request from '@/config/axios'

// 产品分类信息 VO
export interface ToolingCategoryVO {
  id: number // 分类编号
  parentId: number // 父分类编号
  name: string // 分类名称
  code: string // 分类编码
  sort: number // 分类排序
  status: number // 开启状态（0正常 1停用）
}

// 产品分类信息 API
export const ToolingCategoryApi = {
  // 查询产品分类信息分页
  getToolingCategoryPage: async (params: any) => {
    return await request.get({ url: `/pdm/tooling-category/page`, params })
  },

  // 查询产品分类信息详情
  getToolingCategory: async (id: number) => {
    return await request.get({ url: `/pdm/tooling-category/get?id=` + id })
  },

  // 新增产品分类信息
  createToolingCategory: async (data: ToolingCategoryVO) => {
    return await request.post({ url: `/pdm/tooling-category/create`, data })
  },

  // 修改产品分类信息
  updateToolingCategory: async (data: ToolingCategoryVO) => {
    return await request.put({ url: `/pdm/tooling-category/update`, data })
  },

  // 删除产品分类信息
  deleteToolingCategory: async (id: number) => {
    return await request.delete({ url: `/pdm/tooling-category/delete?id=` + id })
  },

  // 导出产品分类信息 Excel
  exportToolingCategory: async (params) => {
    return await request.download({ url: `/pdm/tooling-category/export-excel`, params })
  },

  // 查询产品分类列表
  getProductCategoryList: async (params) => {
    return await request.get({ url: `/pdm/tooling-category/list`, params })
  },

  // 查询产品分类精简列表
  getProductCategorySimpleList: async () => {
    return await request.get({ url: `/pdm/tooling-category/simple-list` })
  },

}
