import request from '@/config/axios'

import { MaterialConfigApi } from '@/api/wms/materialconfig'

export const TerminalApi = {
  // 根据工位查询生产任务
  getBatchPlanByWorkstation: async (id: string) => {
    return await request.get({ url: `/mcs/terminal/getBatchPlan?workstationId=` + id })
  },
  // 根据任务(批次)id 查询物料需求
  getBatchResourceByRecordId: async (recordId: string, workstationId: string) => {
    return await request.get({
      url: `/mcs/terminal/getBatchResourceByRecordId?recordId=${recordId}&&workstationId=${workstationId}`
    })
  },
  // 根据任务(批次)id 查询详细任务(零件)
  getBatchDetailByRecordId: async (id: string) => {
    return await request.get({ url: `/mcs/terminal/getBatchDetail?recordId=` + id })
  },
  // 根据批次任务id 查询工序(包含工步)
  getProcessByRecordId: async (id: string) => {
    return await request.get({ url: `/mcs/terminal/getProcess?recordId=` + id })
  },

  //批次 任务开工
  batchRecordStart: async (data) => {
    return await request.post({ url: `/mcs/terminal/batchRecordStart`, data })
  },
  //批次 任务完工
  batchRecordEnd: async (data) => {
    return await request.post({ url: `/mcs/terminal/batchRecordEnd`, data })
  },
  //工步 任务开工/完工
  stepPlanEvent: async (data) => {
    return await request.post({ url: `/mcs/terminal/stepPlanEvent`, data })
  },

  //工位/设备 暂停/恢复
  stepWorkstationEvent: async (data) => {
    return await request.post({ url: `/mcs/terminal/workstationEvent`, data })
  },
  // 根据工位查询是否暂停 暂停true
  getWorkstationPause: async (id: string) => {
    return await request.get({ url: `/mcs/terminal/getWorkstationPause?workstationId=` + id })
  },

  //入库
  putInStorage: async (deviceId, data) => {
    return await request.post({ url: `/mcs/terminal/putInStorage/${deviceId}`, data })
  },
  //移交(下一工位)
  transfer: async (deviceId, data) => {
    return await request.post({ url: `/mcs/terminal/transfer/${deviceId}`, data })
  },
  //根据物料id集合 查询零件当前任务
  getCurrentPlanByMaterialIds: async (ids: string[]) => {
    let query = ''
    ids.forEach((v) => {
      query += `materialIds=${v}&&`
    })
    query = query.slice(0, -2)
    return await request.get({
      url: `/mcs/terminal/getCurrentPlanByMaterialIds?${query}`
    })
  },

  // 根据库位id获取物料库存列表
  getMaterialStockListByLocationId: async (id) => {
    let list = await request.get({
      url: `/wms/operating-terminal/getMaterialStockListByLocationId?locationId=` + id
    })
    list = await Promise.all(
      list.map(async (v) => {
        const type = await MaterialConfigApi.getMaterialConfig(v.materialConfigId)
        return {
          type: type,
          ...v
        }
      })
    )
    return list
  },

  //检验单生成
  createInspectionSheet: async (data) => {
    return await request.post({ url: `/mcs/terminal/createInspectionSheet`, data })
  },

  getMaterialCarryReadyStatus: async (list) => {
    let query = ''
    list.forEach((v) => {
      query += `barCodeList=${v}&&`
    })
    query = query.slice(0, -2)
    return await request.get({
      url: `/mcs/terminal/getMaterialCarryReadyStatusMap?${query}`
    })
  }
}
