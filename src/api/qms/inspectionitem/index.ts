import request from '@/config/axios'

// 检测项目 VO
export interface InspectionItemVO {
  id: string // 主键
  itemName: string // 检测项目名称
  itemNo: string // 检测项目编号
  desc: string // 检测项目描述
  inspectionType: number // 检测方式  1定性 2定量
  inspectionTool: number // 检测工具  目测 皮尺测量 
  itemTypeId: string // 检测项目分类ID
}

// 检测项目 API
export const InspectionItemApi = {
  // 查询检测项目分页
  getInspectionItemPage: async (params: any) => {
    return await request.get({ url: `/qms/inspection-item/page`, params })
  },

  // 查询检测项目详情
  getInspectionItem: async (id: number) => {
    return await request.get({ url: `/qms/inspection-item/get?id=` + id })
  },

  // 新增检测项目
  createInspectionItem: async (data: InspectionItemVO) => {
    return await request.post({ url: `/qms/inspection-item/create`, data })
  },

  // 修改检测项目
  updateInspectionItem: async (data: InspectionItemVO) => {
    return await request.put({ url: `/qms/inspection-item/update`, data })
  },

  // 删除检测项目
  deleteInspectionItem: async (id: number) => {
    return await request.delete({ url: `/qms/inspection-item/delete?id=` + id })
  },

  // 导出检测项目 Excel
  exportInspectionItem: async (params) => {
    return await request.download({ url: `/qms/inspection-item/export-excel`, params })
  },


}
