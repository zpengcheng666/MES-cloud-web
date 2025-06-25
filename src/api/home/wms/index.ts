import request from '@/config/axios'


export const WmsHomeApi = {
  
    // 获取仓库占用率
    getWarehouseOccupancyRate: async () => {
        return await request.get({url: '/wms/home/warehouseOccupancyRate'})
    },
    // 出入库统计
    getWarehouseInOutAnalysis: async(createTimeRange: string[]) => {
        const params = {
            createTimeRange: createTimeRange
        }
        return await request.get({url: '/wms/home/warehouseInOutAnalysis', params})
    },
    // 人工待出入库列表
    getManualInList: async() => {
        return await request.get({url: '/wms/home/getManualInList'})
    },
    // 人工待出入库列表
    getManualOutList: async() => {
        return await request.get({url: '/wms/home/getManualOutList'})
    }
}
