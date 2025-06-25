import request from '@/config/axios'

// 指令 VO
export interface InstructionVO {
  id: string // ID
  insCode: string // 指令编码
  materialStockId: string // 物料库存id
  insType: number // 指令类型（上架指令、下架指令）
  insStatus: number // 指令状态（未开始、进行中、已完成、已取消）
  startLocationId: string // 起始库位id
  targetLocationId: string // 目标库位id
  insContent: string // 指令内容
  insDescription: string // 指令描述
}

// 指令 API
export const InstructionApi = {
  // 查询指令分页
  getInstructionPage: async (params: any) => {
    return await request.get({ url: `/wms/instruction/page`, params })
  },

  // 查询指令详情
  getInstruction: async (id: number) => {
    return await request.get({ url: `/wms/instruction/get?id=` + id })
  },

  // 新增指令
  createInstruction: async (data: InstructionVO) => {
    return await request.post({ url: `/wms/instruction/create`, data })
  },

  // 修改指令
  updateInstruction: async (data: InstructionVO) => {
    return await request.put({ url: `/wms/instruction/update`, data })
  },

  // 删除指令
  deleteInstruction: async (id: number) => {
    return await request.delete({ url: `/wms/instruction/delete?id=` + id })
  },

  // 导出指令 Excel
  exportInstruction: async (params) => {
    return await request.download({ url: `/wms/instruction/export-excel`, params })
  },

  handleComplete: async (id: number) => {
    return await request.get({ url: `/wms/instruction/handle-complete?id=` + id })
  },

  
  // 上架指令
  onShelfInstruction: async (materialStockId: string, targetLocationId: string) => {
    const params = {
      materialStockId: materialStockId,
      targetLocationId: targetLocationId,
    }
    return await request.get({ url: `/wms/instruction/cronShelfInstructioneate`, params })
  },

    
  // 下架指令
  offShelfInstruction: async (materialStockId: string, targetLocationId: string) => {
    const params = {
      materialStockId: materialStockId,
      targetLocationId: targetLocationId,
    }
    return await request.get({ url: `/wms/instruction/offShelfInstruction`, params })
  },
}
