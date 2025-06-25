import request from '@/config/axios'

// 设备台账 VO
export interface LedgerVO {
  id: string // id
  code: string // 设备编号
  name: string // 设备名称
  type: number //设备类型
  superintendent: string // 负责人
  maintenanceDate: Date //维护日期
  maintenanceBy: string // 维护人员
  inspectionDate: Date //检验日期
  purchaseDate: Date // 采购日期
  technicalParameter1: string // 参数1
  technicalParameter2: string // 参数2
  technicalParameter3: string // 参数3
  technicalParameter4: string // 参数4
}

// 设备台账 API
export const LedgerApi = {
  // 查询设备台账分页
  getLedgerPage: async (params: any) => {
    return await request.get({ url: `/dms/ledger/page`, params })
  },

  // 查询设备台账详情
  getLedger: async (id: number) => {
    return await request.get({ url: `/dms/ledger/get?id=` + id })
  },

  // 新增设备台账
  createLedger: async (data: LedgerVO) => {
    return await request.post({ url: `/dms/ledger/create`, data })
  },

  // 修改设备台账
  updateLedger: async (data: LedgerVO) => {
    return await request.put({ url: `/dms/ledger/update`, data })
  },

  // 删除设备台账
  deleteLedger: async (id: number) => {
    return await request.delete({ url: `/dms/ledger/delete?id=` + id })
  },

  // 导出设备台账 Excel
  exportLedger: async (params) => {
    return await request.download({ url: `/dms/ledger/export-excel`, params })
  },

  /*******************************************其他**********************************/

  // 列出设备台账
  getLedgerList: async () => {
    return await request.get({ url: `/dms/ledger/getList` })
  },

  // 通过ip获得设备台账
  getLedgerByIp: async (ip) => {
    if (ip == undefined || ip == null) {
      return await request.get({ url: `/dms/ledger/getByIp` })
    } else {
      return await request.get({ url: `/dms/ledger/getByIp?ip=${ip}` })
    }
  },

  // 通过角色获得用户列表
  getUsersByRole: async (data) => {
    return await request.post({ url: `/dms/ledger/ledgertouser/getUsers`, data })
  },

  /*****************************************LedgerToUser****************************/

  // 获得台账-用户对应表
  getLedgerToUserList: async (ledger, user) => {
    const hasLedger = ledger != undefined && ledger != null
    const hasUser = user != undefined && user != null
    let url = '/dms/ledger/ledgertouser/list'
    if (hasLedger || hasUser) {
      url += '?'
      if (hasLedger && !hasUser) url += `ledger=${ledger}`
      if (hasUser || !hasLedger) url += `user=${user}`
      if (hasLedger && hasUser) url += `ledger=${ledger}&&user=${user}`
    }
    return await request.get({ url: url })
  },

  // 删除台账-用户对应
  deleteLedgerToUser: async (data) => {
    return await request.delete({ url: `/dms/ledger/ledgertouser/delete`, data })
  },

  // 新增台账-用户对应
  createLedgerToUser: async (data) => {
    return await request.post({ url: `/dms/ledger/ledgertouser/create`, data })
  },

  /*******************************************LedgerToLocation***************************/

  // 获得台账-位置对应表
  getLedgerToLocationList: async (ledger) => {
    return await request.get({ url: `/dms/ledger/ledgertolocation/list?ledger=${ledger}` })
  },

  // 删除台账-位置对应
  deleteLedgerToLocation: async (id) => {
    return await request.delete({
      url: `/dms/ledger/ledgertolocation/delete`,
      data: { id: id }
    })
  },

  // 新增台账-位置对应
  createLedgerToLocation: async (data) => {
    return await request.post({ url: `/dms/ledger/ledgertolocation/create`, data })
  }
}
