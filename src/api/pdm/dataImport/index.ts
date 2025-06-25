import request from '@/config/axios'

// PDM 数据包导入 VO
export interface DataImportVO {
  rootProductId: string
  projectCode: string
  structureId: number
}

// PDM 数据包结构 API
export const DataImportApi = {
  // 数据包导入
  dataImport: async (data: DataImportVO) => {
    return await request.put({ url: `/pdm/data-import/import`, data })
  },

}
