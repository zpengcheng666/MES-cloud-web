import request from '@/config/axios'

// 设备台账 API
export const OperatingTerminalApi = {
  // 查询所有终端
  getDeviceUnitList: async () => {
    return await request.get({ url: `/dms/line-station-group/getDeviceUnitList` })
  },

  getBatchRecordPlan: async (workstationId: string) => {
    return await request.get({ url: `/mcs/terminal/getBatchPlan?workstationId=` + workstationId})
  },
}
