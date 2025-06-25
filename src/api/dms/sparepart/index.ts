import request from '@/config/axios'

// 备品/备件 VO
export interface SparePartVO {
  code: string // 备件编码
  name: string // 备件名称
  number: number // 备件数量
  type: string // 备件类型
  remark: string // 备注
}

// 备品/备件 API
export const SparePartApi = {
  // 查询备品/备件分页
  getSparePartPage: async (params: any) => {
    return await request.get({ url: `/dms/spare-part/page`, params })
  },

  // 查询备品/备件详情
  getSparePart: async (id: number) => {
    return await request.get({ url: `/dms/spare-part/get?id=` + id })
  },

  // 新增备品/备件
  createSparePart: async (data: SparePartVO) => {
    return await request.post({ url: `/dms/spare-part/create`, data })
  },

  // 修改备品/备件
  updateSparePart: async (data: SparePartVO) => {
    return await request.put({ url: `/dms/spare-part/update`, data })
  },

  // 删除备品/备件
  deleteSparePart: async (id: number) => {
    return await request.delete({ url: `/dms/spare-part/delete?id=` + id })
  },

  // 导出备品/备件 Excel
  exportSparePart: async (params) => {
    return await request.download({ url: `/dms/spare-part/export-excel`, params })
  },

  // 获得备品/备件列表
  getSparePartList: async () => {
    return await request.get({ url: `/dms/spare-part/getList` })
  }
}
