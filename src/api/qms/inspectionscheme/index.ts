import request from '@/config/axios'

// 检验方案 VO
export interface InspectionSchemeVO {
  id: string // 主键
  schemeName: string // 方案名称
  schemeNo: string // 方案编号
  schemeType: number // 方案类型 来料检验  过程检验 完工检验
  materialConfigId: string // 物料类型ID
  inspectionLevel: number // 检验级别
  isEffective: number // 是否生效
  materialNumber: string // 物料编号
  materialCode: string // 物料类码
  materialName: string // 物料名称
  materialProperty: number // 物料属性（成品、毛坯、辅助材料）
  materialType: string // 物料类型（零件、托盘、工装、夹具、刀具）
  materialSpecification: string // 物料规格
  materialBrand: string // 物料品牌
  materialUnit: string // 物料单位
  technologyId: string // 工艺ID
  processId: string // 工序ID
  samplingRuleId: string // 抽样规则ID
}

// 检验方案 API
export const InspectionSchemeApi = {
  // 查询检验方案分页
  getInspectionSchemePage: async (params: any) => {
    return await request.get({ url: `/qms/inspection-scheme/page`, params })
  },

  // 查询检验方案详情
  getInspectionScheme: async (id: number) => {
    return await request.get({ url: `/qms/inspection-scheme/get?id=` + id })
  },

  // 新增检验方案
  createInspectionScheme: async (data: InspectionSchemeVO) => {
    return await request.post({ url: `/qms/inspection-scheme/create`, data })
  },

  // 修改检验方案
  updateInspectionScheme: async (data: InspectionSchemeVO) => {
    return await request.put({ url: `/qms/inspection-scheme/update`, data })
  },

  // 删除检验方案
  deleteInspectionScheme: async (id: number) => {
    return await request.delete({ url: `/qms/inspection-scheme/delete?id=` + id })
  },


  // 提交审核
  submitEffective: async (id: string, isEffective: number) => {
    return await request.put({
      url: `/qms/inspection-scheme/submitEffective`,
      params: {
        id,
        isEffective
      }
    })
  },

  // 查询检验方案分页
  getInspectionSchemeList4InspectionSheet: async (params: any) => {
    return await request.get({ url: `/qms/inspection-scheme/list-4-inspection-sheet`, params })
  },

  // 导出检验方案 Excel
  exportInspectionScheme: async (params) => {
    return await request.download({ url: `/qms/inspection-scheme/export-excel`, params })
  },


    getProcessPage: async (params: any) => {
        return await request.get({ url: `/qms/inspection-scheme/getProcessPage`, params })
    },

    getProcedure: async (id: number) => {
        return await request.get({ url: `/qms/inspection-scheme/getProcedure?id=` + id })
    },

// ==================== 子表（检验方案检测项目详情） ====================

  // 获得检验方案检测项目详情列表
  getInspectionSchemeItemListByInspectionSchemeId: async (inspectionSchemeId) => {
    return await request.get({ url: `/qms/inspection-scheme/inspection-scheme-item/list-by-inspection-scheme-id?inspectionSchemeId=` + inspectionSchemeId })
  },
}
