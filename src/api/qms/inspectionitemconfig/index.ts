import request from '@/config/axios'

// 检测项配置表（检测内容名称） VO
export interface InspectionItemConfigVO {
  id: string // 主键
  name: string // 检测项配置表名称
  no: string // 编号
}

// 检测项配置表（检测内容名称） API
export const InspectionItemConfigApi = {
  // 查询检测项配置表（检测内容名称）分页
  getInspectionItemConfigPage: async (params: any) => {
    return await request.get({ url: `/qms/inspection-item-config/page`, params })
  },

  // 查询检测项配置表（检测内容名称）详情
  getInspectionItemConfig: async (id: number) => {
    return await request.get({ url: `/qms/inspection-item-config/get?id=` + id })
  },

  // 新增检测项配置表（检测内容名称）
  createInspectionItemConfig: async (data: InspectionItemConfigVO) => {
    return await request.post({ url: `/qms/inspection-item-config/create`, data })
  },

  // 修改检测项配置表（检测内容名称）
  updateInspectionItemConfig: async (data: InspectionItemConfigVO) => {
    return await request.put({ url: `/qms/inspection-item-config/update`, data })
  },

  // 删除检测项配置表（检测内容名称）
  deleteInspectionItemConfig: async (id: number) => {
    return await request.delete({ url: `/qms/inspection-item-config/delete?id=` + id })
  },

  // 导出检测项配置表（检测内容名称） Excel
  exportInspectionItemConfig: async (params) => {
    return await request.download({ url: `/qms/inspection-item-config/export-excel`, params })
  },


  // 查询检测项配置表（检测内容名称）集合
  getInspectionItemConfigList: async (params: any) => {
    return await request.get({ url: `/qms/inspection-item-config/list`, params })
  },
}
