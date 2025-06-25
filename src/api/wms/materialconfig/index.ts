import request from '@/config/axios'

// 物料类型 VO
export interface MaterialConfigVO {
  id: string // ID
  materialNumber: string // 物料编号
  materialCode: string // 物料类码
  materialName: string // 物料名称
  materialProperty: number // 物料属性（成品、毛坯、辅助材料）
  materialType: number // 物料类型（零件、托盘、工装、夹具、刀具）
  materialSpecification: string // 物料规格
  materialBrand: string // 物料品牌
  materialUnit: string // 物料单位
  materialManage: number // 物料管理模式
  materialOutRule: number // 出库规则
  materialStorage: number // 是否单储位
  materialContainer: number // 是否为容器
  containerConfigIds: string // 存放指定容器
  materialLayer: number // 层
  materialRow: number // 排
  materialCol: number // 列
  defaultWarehouseId: string // 默认存放仓库
  materialParentId: string // 父物料类型
}

// 物料类型 API
export const MaterialConfigApi = {
  // 查询物料类型列表
  getMaterialConfigList: async () => {
    return await request.get({ url: `/wms/material-config/list` })
  },
  getMaterialConfigPage: async (params) => {
    return await request.get({ url: `/wms/material-config/page`, params })
  },
  // 查询物料类型详情
  getMaterialConfig: async (id: number) => {
    return await request.get({ url: `/wms/material-config/get?id=` + id })
  },

  // 新增物料类型
  createMaterialConfig: async (data: MaterialConfigVO) => {
    return await request.post({ url: `/wms/material-config/create`, data })
  },

  // 修改物料类型
  updateMaterialConfig: async (data: MaterialConfigVO) => {
    return await request.put({ url: `/wms/material-config/update`, data })
  },

  // 删除物料类型
  deleteMaterialConfig: async (id: number) => {
    return await request.delete({ url: `/wms/material-config/delete?id=` + id })
  },

  // 导出物料类型 Excel
  exportMaterialConfig: async (params) => {
    return await request.download({ url: `/wms/material-config/export-excel`, params })
  },

  // 根据库位查询 库位上托盘的物料类型对应的 默认存放仓库
  getDefalutWarehouse: async (locationId: string) => {
    return await request.get({ url: `/wms/material-config/getDefalutWarehouse?locationId=` + locationId })
  },
}
