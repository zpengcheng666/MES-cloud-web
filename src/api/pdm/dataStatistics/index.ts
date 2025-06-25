import request from '@/config/axios'


//设计数据包接收VO
export interface DataStatisticsVO {
    id: string
    name: string
    size: string
    type: boolean
    md5: string
    vaultUrl: string
    receiveCode: string
    status: string
    productNumber: string
    projectCode: string
    projectName: string
    structureId: number
    useTime: string
    countPart: string
}
export const DataStatisticsApi = {
    //获得分页数据
    getDataStatisticsPage: async (params: any) => {
        return await request.get({ url: `/pdm/dataStatistics/page`, params })
    },
    //获取数据列表
    getDataStatistics: async (id: number) => {
        return await request.get({ url: `/pdm/dataStatistics/get?id=` + id })
    },

    //删除数据
    deleteDataStatistics: async (id: number) => {
        return await request.delete({ url: `/pdm/dataStatistics/delete?id=` + id })
    },

    //导出数据包
    exportDataStatistics: async (params) => {
      return request.download({
        url: '/pdm/dataStatistics/export-excel',
        params
      })
    },
}
