import request from '@/config/axios'

// 工步分类 VO
export interface StepCategoryVO {
  id: number // 分类编号
  parentId: number // 父分类编号
  name: string // 分类名称
  code: string // 分类编码
  sort: number // 分类排序
  status: number // 开启状态
}

// 工步分类 API
export const StepCategoryApi = {
  // 查询工步分类列表
  getStepCategoryList: async (params) => {
    return await request.get({ url: `/pdm/step-category/list`, params })
  },

  // 查询工步分类精简列表
  getStepCategorySimpleList: async () => {
    return await request.get({ url: `/pdm/step-category/simple-list` })
  },

  // 查询工步分类详情
  getStepCategory: async (id: number) => {
    return await request.get({ url: `/pdm/step-category/get?id=` + id })
  },

  // 新增工步分类
  createStepCategory: async (data: StepCategoryVO) => {
    return await request.post({ url: `/pdm/step-category/create`, data })
  },

  // 修改工步分类
  updateStepCategory: async (data: StepCategoryVO) => {
    return await request.put({ url: `/pdm/step-category/update`, data })
  },

  // 删除工步分类
  deleteStepCategory: async (id: number) => {
    return await request.delete({ url: `/pdm/step-category/delete?id=` + id })
  }
}
