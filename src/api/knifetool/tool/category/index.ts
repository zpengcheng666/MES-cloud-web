import request from '@/config/axios'

// 刀具分类 VO
export interface CategoryVO {
  id: number // 自增主键
  pid: number // 父节点ID  pid=0为一级分类
  name: string // 分类名称
  level: number // 层级
  type: number // 类型： 1 刀具  2 刀柄 3刀片 4配件
  code: string // 编码
  interfaceModel: string // 接口型号
  partsAssemblyId: number // 组装配方ID
  workbenchTypeId: number // 托盘类型ID
  createId: number // 创建人主键
  createBy: string // 创建人姓名
  updateId: number // 修改人主键
  updateBy: string // 修改人姓名
  state: number // 状态(0:失效 1:有效)
  organizationCode: string // 组织机构
}

// 查询刀具分类分页
export const getCategoryPage = (params: any) => {
  return request.get({ url: `/knifetool/category/page`, params })
}

// 查询刀具分类分页
export const getCategoryList = (params: any) => {
  return request.get({ url: `/knifetool/category/list`, params })
}

// 查询刀具分类详情
export const getCategory = (id: number) => {
  return request.get({ url: `/knifetool/category/get?id=` + id })
}

// 新增刀具分类
export const createCategory = (data: CategoryVO) => {
  return request.post({ url: `/knifetool/category/create`, data })
}

// 修改刀具分类
export const updateCategory = (data: CategoryVO) => {
  return request.put({ url: `/knifetool/category/update`, data })
}

// 刀具分类状态修改
export const updateCategoryState = (id: number, state: number) => {
  const data = {
    id,
    state
  }
  return request.put({ url: '/knifetool/category/update-state', data: data })
}

// 删除刀具分类
export const deleteCategory = (id: number) => {
  return request.delete({ url: `/knifetool/category/delete?id=` + id })
}

// 导出刀具分类 Excel
export const exportCategory = (params) => {
  return request.download({ url: `/knifetool/category/export-excel`, params })
}

// 刀具分类被调用次数
export const useCount = (id: number) => {
  return request.get({ url: `/knifetool/category/use/count?id=` + id });
}
