import request from '@/config/axios'

// 库存盘点详情 VO
export interface CheckDetailVO {
  id: string // ID
  materialStockId: string // 物料id
  realTotality: number // 账面数量
  checkTotality: number // 盘点数量
  checkTime: Date // 盘点时间
  checkContainerId: string // 盘点容器id
  checkType: number // 盘点类型 1-默认，2-盘盈新增
  materialManage: string // 物料管理模式
  materialNumber: string // 物料编号
  batchNumber: string // 批号
  barCode: string // 条码
}

// 库存盘点详情 API
export const CheckDetailApi = {
  // 查询库存盘点详情分页
  getCheckDetailPage: async (params: any) => {
    return await request.get({ url: `/wms/check-detail/page`, params })
  },

  // 查询库存盘点详情详情
  getCheckDetail: async (id: number) => {
    return await request.get({ url: `/wms/check-detail/get?id=` + id })
  },

  // 新增库存盘点详情
  createCheckDetail: async (data: CheckDetailVO) => {
    return await request.post({ url: `/wms/check-detail/create`, data })
  },

  // 修改库存盘点详情
  updateCheckDetail: async (data: CheckDetailVO) => {
    return await request.put({ url: `/wms/check-detail/update`, data })
  },

  // 删除库存盘点详情
  deleteCheckDetail: async (id: number) => {
    return await request.delete({ url: `/wms/check-detail/delete?id=` + id })
  },

  // 导出库存盘点详情 Excel
  exportCheckDetail: async (params) => {
    return await request.download({ url: `/wms/check-detail/export-excel`, params })
  },
}
