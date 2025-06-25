import request from '@/config/axios'

// 物料类型 VO
export interface MaterialConfigVO {
  id: string // ID
  materialNumber: string // 物料编号
  materialName: string // 物料名称
  materialTypeId: string // 当前类别
  materialParentTypeId: string // 主类别（工件、托盘、工装、夹具、刀具）
  materialSpecification: string // 物料规格
  materialBrand: string // 物料品牌
  materialUnit: string // 物料单位
  materialSourceId: string // 来源物料类型
  materialTypeCode: string // 类码
}

// 物料类型 API
export const MaterialConfigApi = {
  // 查询物料类型分页
  getMaterialConfigPage: async (params: any) => {
    return await request.get({ url: `/mcc/material-config/page`, params })
  },
    getMaterialConfigList: async () => {
        return await request.get({ url: `/mcc/material-config/list` })
    },
  // 查询物料类型详情
  getMaterialConfig: async (id: number) => {
    return await request.get({ url: `/mcc/material-config/get?id=` + id })
  },

  // 新增物料类型
  createMaterialConfig: async (data: MaterialConfigVO) => {
    return await request.post({ url: `/mcc/material-config/create`, data })
  },

  // 修改物料类型
  updateMaterialConfig: async (data: MaterialConfigVO) => {
    return await request.put({ url: `/mcc/material-config/update`, data })
  },

  // 删除物料类型
  deleteMaterialConfig: async (id: number) => {
    return await request.delete({ url: `/mcc/material-config/delete?id=` + id })
  },

  // 导出物料类型 Excel
  exportMaterialConfig: async (params) => {
    return await request.download({ url: `/mcc/material-config/export-excel`, params })
  },


}
