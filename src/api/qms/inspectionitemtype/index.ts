import request from '@/config/axios'

// 检测项目分类 VO
export interface InspectionItemTypeVO {
  id: string // 主键
  parentId: string // 父项目分类ID
  name: string // 检测项目分类名称
}

// 检测项目分类 API
export const InspectionItemTypeApi = {
  // 查询检测项目分类列表
  getInspectionItemTypeList: async (params) => {
    return await request.get({ url: `/qms/inspection-item-type/list`, params })
  },

  // 查询检测项目分类详情
  getInspectionItemType: async (id: number) => {
    return await request.get({ url: `/qms/inspection-item-type/get?id=` + id })
  },

  // 新增检测项目分类
  createInspectionItemType: async (data: InspectionItemTypeVO) => {
    return await request.post({ url: `/qms/inspection-item-type/create`, data })
  },

  // 修改检测项目分类
  updateInspectionItemType: async (data: InspectionItemTypeVO) => {
    return await request.put({ url: `/qms/inspection-item-type/update`, data })
  },

  // 删除检测项目分类
  deleteInspectionItemType: async (id: number) => {
    return await request.delete({ url: `/qms/inspection-item-type/delete?id=` + id })
  },

  // 导出检测项目分类 Excel
  exportInspectionItemType: async (params) => {
    return await request.download({ url: `/qms/inspection-item-type/export-excel`, params })
  },
}
