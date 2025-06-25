import request from '@/config/axios'

// 入库异常处理 VO
export interface InboundExceptionHandlingVO {
  id: string // ID
  infoId: string // 产品表ID
  consignmentId: string // 入库单ID
  no: string // 入库单号
  consignedAmount: number // 应收数量
  signedAmount: number // 实收数量
  handleBy: string // 处理人
  handleTime: Date // 处理日期
  materialConfigId: string // 物料类型ID
  status: number // 状态  0待处理  1已处理
  consignmentType: number // 类型 1采购收货 2外协退货 3原材料入库 4 销售退货
  rusultType: number // 处理结果  1入库 2退货
  exceptionType: number // 异常类型 1来货不足 2收货收多 
  contratcId: string // 合同ID
  projectId: string // 项目ID
  companyId: string // 公司ID
}

// 入库异常处理 API
export const InboundExceptionHandlingApi = {
  // 查询入库异常处理分页
  getInboundExceptionHandlingPage: async (params: any) => {
    return await request.get({ url: `/ppm/inbound-exception-handling/page`, params })
  },

  // 查询入库异常处理详情
  getInboundExceptionHandling: async (id: number) => {
    return await request.get({ url: `/ppm/inbound-exception-handling/get?id=` + id })
  },

  // 新增入库异常处理
  createInboundExceptionHandling: async (data: InboundExceptionHandlingVO) => {
    return await request.post({ url: `/ppm/inbound-exception-handling/create`, data })
  },

  // 修改入库异常处理
  updateInboundExceptionHandling: async (data: InboundExceptionHandlingVO) => {
    return await request.put({ url: `/ppm/inbound-exception-handling/update`, data })
  },

  // 删除入库异常处理
  deleteInboundExceptionHandling: async (id: number) => {
    return await request.delete({ url: `/ppm/inbound-exception-handling/delete?id=` + id })
  },
    inbound: async (id: number) => {
    return await request.put({ url: `/ppm/inbound-exception-handling/inbound?id=` + id })
},
    returnSheet: async (id: number) => {
        return await request.put({ url: `/ppm/inbound-exception-handling/returnSheet?id=` + id })
    },
  // 导出入库异常处理 Excel
  exportInboundExceptionHandling: async (params) => {
    return await request.download({ url: `/ppm/inbound-exception-handling/export-excel`, params })
  },
}
