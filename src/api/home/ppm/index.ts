import request from '@/config/axios'


// 采购申请主 API
export const PpmHomeApi = {
  // 查询采购申请主分页
    getPurchaseRequirementPage: async (params: any) => {
    return await request.get({ url: `/ppm/home/getPurchaseRequirementPage`, params })
  },
    //查询采购合同
    getPurchaseContractPage: async (params: any) => {
        return await request.get({ url: `/ppm/home/contractPage`, params })
    },
    //收货单
    getPurchaseConsignmentPage: async (params: any) => {
        return await request.get({ url: `/ppm/home/purchaseConsignmentPage`, params })
    },
    //企业退货率
    getCompanyReturnRate: async (createTimeRange: string[]) => {

        const params = {
            createTimeRange: createTimeRange
        }
        return await request.get({ url: `/ppm/home/getCompanyReturnRate`, params })
    },
    //合同详情进度
    getContractDetailPage: async (params: any) => {
        return await request.get({ url: `/ppm/home/getContractDetailPage`, params })
    },
    //质检分析
    getConsignmentQmsRate: async (createTimeRange: string[]) => {

        const params = {
            createTimeRange: createTimeRange
        }
        return await request.get({ url: `/ppm/home/getConsignmentQmsRate`, params })
    },
    //退货单
    getConsignmentReturnPage: async (params: any) => {
        return await request.get({ url: `/ppm/home/getConsignmentReturnPage`, params })
    },
    //收货异常处理
    getInboundExceptionHandlingPage: async (params: any) => {
        return await request.get({ url: `/ppm/home/getInboundExceptionHandlingPage`, params })
    },

    getContractShippingDetailPage: async (params: any) => {
        return await request.get({ url: `/ppm/shippingHome/getContractDetailPage`, params })
    },
    getShippingPage: async (params: any) => {
        return await request.get({ url: `/ppm/shippingHome/getShippingPage`, params })
    },
    getShippingReturnPage: async (params: any) => {
        return await request.get({ url: `/ppm/shippingHome/getShippingReturnPage`, params })
    },
    getContractAnalysis: async (params: any) => {
        return await request.get({ url: `/ppm/shippingHome/getContractAnalysis`, params })
    },
    getShippingContractPage: async (params: any) => {
        return await request.get({ url: `/ppm/shippingHome/contractPage`, params })
    },
}
