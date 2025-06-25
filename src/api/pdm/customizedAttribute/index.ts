import request from '@/config/axios'
import {StepCategoryVO} from "@/api/pdm/stepCategory";
import {DataObjectVO} from "@/api/pdm/dataObject";

export interface CustomizedAttributeVO {
id: string,
categoryId: string,
attrNameCn: string,
attrNameEn: string,
attrType: string,
attrUnit: string,
attrOrder: string,
attrDefault: string,
isMultvalues: string,
attrEffectiveValue: string,
}

// 自定义属性 API
export const CustomizedAttributeAPI = {
  // 查询工步分类列表
  getCustomizedAttributeVOList: async (params) => {
    return await request.get({ url: `/pdm/step-category/list`, params })
  },

  // 查询工步分类精简列表
  getCustomizedAttributeSimpleList: async () => {
    return await request.get({ url: `/pdm/step-category/simple-list` })
  },

  //编辑按钮
  updateIndex: async (data: CustomizedAttributeVO) => {
    return await request.put({ url: `/pdm/customizedAttribute/updateIndex`, data })
  },

  // 查询自定义属性详情
  getCustomizedAttribute: async (id: number) => {
    return await request.get({ url: `/pdm/customizedAttribute/get?id=` + id })
  },

  // 查询自定义属性
  getCustomizedAttributeById: async (id: number) => {
    return await request.get({ url: `/pdm/customizedAttribute/getById?id=` + id })
  },
  // 新增自定义属性
  createCustomizedAttribute: async (data: CustomizedAttributeVO) => {
    return await request.post({ url: `/pdm/customizedAttribute/create`, data })
  },

  // 修改自定义属性
  updateCustomizedAttribute: async (data: CustomizedAttributeVO) => {
    return await request.put({ url: `/pdm/customizedAttribute/update`, data })
  },

  // 删除自定义属性
  deleteCustomizedAttribute: async (id: number) => {
    return await request.delete({ url: `/pdm/customizedAttribute/delete?id=` + id })
  },
  // 查询工步分类列表
  getCustomizedAttributeList: async (params) => {
    return await request.get({ url: `/pdm/customizedAttribute/list`, params })
  },
}

