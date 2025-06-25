import request from '@/config/axios'

export const StockActiveApi = {

     // 查询上架库存分页
    getStockOnShelfPage: async (params: any) => {
        return await request.get({ url: `/wms/stock-active/on-shelf-page`, params })
    },
    // 查询下架库存分页
    getStockOffShelfPage: async (params: any) => {
        return await request.get({ url: `/wms/stock-active/off-shelf-page`, params })
    },
    // 查询库位绑定库存分页
    getStockBindPage: async (params: any) => {
        return await request.get({ url: `/wms/stock-active/stock-bind-page`, params })
    },

    // 绑定物料库存
    bindMaterialStock: async (data: any) => {
        return await request.put({ url: `/wms/stock-active/bind-material`, data })
    },
  
    // 库存下架
    stockOffShelf: async (containerStockId: string, offLocationId: string) => {
        return await request.get({ url: `/wms/stock-active/stock-off-shelf?containerStockId=` + containerStockId + `&offLocationId=` + offLocationId })
    },
  
    // 库存上架
    stockOnShelf: async (containerStockId: string) => {
        return await request.get({ url: `/wms/stock-active/stock-on-shelf?containerStockId=` + containerStockId })
    },
  
    // 签收物料
    SignForMaterial: async (data: any) => {
        return await request.post({ url: `/wms/stock-active/sign-for-material`, data })
    },
  
}