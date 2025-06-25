import request from '@/config/axios';

// 物料库存 VO
export interface MaterialStockVO {
  id: string; // ID
  materialTypeId: string; // 物料类型id
  barCode: string; // 物料条码
  batchNumber: string; // 物料批次号
  materialId: string; // 物料id
  storageId: string; // 储位id
  locationId: string; // 库位id
  bindType: number; // 绑定类型
  totality: number; // 总库存
  locked: number; // 锁定库存
  available: number; // 可用库存
  byOccupancyRatio: number; // 容器满载比例
  occupancyRatio: number; // 占用比例
}

// 物料库存 API
export const MaterialStockApi = {
  // 查询物料库存分页
  getMaterialStockPage: async (params: any) => {
    return await request.get({ url: `/wms/material-stock/page`, params });
  },

  // 查询物料库存列表
  getMaterialStockList: async () => {
    return await request.get({ url: `/wms/material-stock/list` });
  },

  // 查询容器库存列表
  getMaterialStockContainerList: async () => {
    return await request.get({ url: `/wms/material-stock/container-list` });
  },

  // 查询物料库存详情
  getMaterialStock: async (id: number) => {
    return await request.get({ url: `/wms/material-stock/get?id=` + id });
  },

  // 新增物料库存
  createMaterialStock: async (data: MaterialStockVO) => {
    return await request.post({ url: `/wms/material-stock/create`, data });
  },

  // 修改物料库存
  updateMaterialStock: async (data: MaterialStockVO) => {
    return await request.put({ url: `/wms/material-stock/update`, data });
  },

  // 删除物料库存
  deleteMaterialStock: async (id: number) => {
    return await request.delete({ url: `/wms/material-stock/delete?id=` + id });
  },

  // 导出物料库存 Excel
  exportMaterialStock: async (params) => {
    return await request.download({ url: `/wms/material-stock/export-excel`, params });
  },

  // 查询库存类型为容器列表（树）
  stockMenuTree: async (params?: any) => {
    return await request.get({ url: '/wms/material-stock/StockMenuTree', params });
  },

  // 查询物料储位详情
  getMaterialStorageListByStockId: async (id: number) => {
    return await request.get({ url: `/wms/material-stock/getStorageListByStockId?stockId=` + id });
  },

  // 查询储位详情
  getStorageStockDetail: async (id: number) => {
    return await request.get({ url: `/wms/material-stock/getStorageStockDetail?storageId=` + id });
  },

  // 查询物料库存列表（根据物料条码）
  getMaterialStockByMaterialNumber: async (params : any) => {
    return await request.get({ url: `/wms/material-stock/getMaterialStockByMaterialNumber`, params });
  }
};
