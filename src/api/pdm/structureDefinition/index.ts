import request from '@/config/axios'

// PDM 数据包结构 VO
export interface StructureVO {
  id?: number
  name: string
  parentId: number
  type: number
  compressType: string
  designUnit: string
  status: number
  fileType: string
  dirPath: string
  absolutePath: string
  excelJson: string
  xmlJson: string
  createTime: Date
}

// PDM 数据包结构 API
export const StructureApi = {
  // 查询数据包结构列表
  getStructureList: async (params) => {
    return await request.get({ url: `/pdm/structure-definition/list`, params })
  },

  // 查询数据包结构精简列表
  getStructureSimpleList: async () => {
    return await request.get({ url: `/pdm/structure-definition/simple-list` })
  },

  // 查询数据包结构详情
  getStructure: async (id: number) => {
    return await request.get({ url: `/pdm/structure-definition/get?id=` + id })
  },

  // 新增数据包结构
  createStructure: async (data: StructureVO) => {
    return await request.post({ url: `/pdm/structure-definition/create`, data })
  },

  // 修改数据包结构
  updateStructure: async (data: StructureVO) => {
    return await request.put({ url: `/pdm/structure-definition/update`, data })
  },

  // 删除数据包结构
  deleteStructure: async (id: number) => {
    return await request.delete({ url: `/pdm/structure-definition/delete?id=` + id })
  },

  // 获得excel规则详情列表
  getStructureExcelListByStructureId: async (structureId) => {
    return await request.get({ url: `/pdm/structure-definition/structure-excel/list-by-structure-id?structureId=` + structureId })
  },

  // 查询数据包结构子级列表
  getStructureChildList: async (params) => {
    return await request.get({ url: `/pdm/structure-definition/childList`, params })
  },
}

