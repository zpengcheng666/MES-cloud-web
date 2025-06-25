import request from '@/config/axios'

// 生产订单 API
export const BatchOrderApsResultApi = {

  productionScheduling: async (data: any) => {
    return await request.post({ url: `/mcs/batch-order-aps-result/productionScheduling`, data })
  },

  schedulingAdopt: async (params: any) => {
    return await request.post({ url: `/mcs/batch-order-aps-result/schedulingAdopt`, params })
  },

  getLedgerNameListByApsId: async (params: any) => {
    return await request.get({ url: `/mcs/batch-order-aps-result/getLedgerNameListByApsId`, params})
  },

  getLedgerLoadByApsId: async (params: any) => {
    return await request.get({ url: `/mcs/batch-order-aps-result/getLedgerLoadByApsId`, params})
  },
}
