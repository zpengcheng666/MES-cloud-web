import request from '@/config/axios'

// 项目订单 VO
export interface OrderMaterialRelationVO {
  id: string // 订单id
  projectId: string // 项目id
  planId:string//主计划id
  planItemId:string//子计划id
  orderId:string//订单id
  materialCode:string//物料条码
  variableCode:string//变码
  productCode:string//产品码
  materialStatus:number//物料状态
}

// 订单物料关系表,那些物料属于这个订单 API
export const RelationApi = {


  // 根据id查询
  getRelation: async (id: number) => {
    return await request.get({ url: `/pms/order-material-relation/get?id=` + id })
  },
  //根据订单id查询
  getRelationListByOrderId:async (id: number)=>{
    return await request.get({ url: `/pms/order-material-relation/getRelationListByOrderId?id=` + id })
  },
  // 查询订单物料关系表分页
  getOrderMaterialRelationPage: async (params: any) => {
    return await request.get({ url: `/pms/order-material-relation/page`, params })
  },

  // 条件查询
  getOrderMaterialRelationWith: async (params: any) => {
    return await request.get({ url: `/pms/order-material-relation/getOrderMaterialRelationWith`, params })
  },

  getSelectedAmount:async (params: any)=>{
    return await request.get({ url: `/pms/order-material-relation/getSelectedAmount`, params})
  },

  // 新增订单物料关系表
  createOrderMaterialRelation: async (data: OrderMaterialRelationVO) => {
    return await request.post({ url: `/pms/order-material-relation/create`, data })
  },
  // 修改订单物料关系表
  updateOrderMaterialRelation: async (data: OrderMaterialRelationVO) => {
    return await request.put({ url: `/pms/order-material-relation/update`, data })
  },
  //备料更新
  updatePrepare: async (data: OrderMaterialRelationVO) => {
    return await request.post({ url: `/pms/order-material-relation/prepareUpdate`, data })
  },

  // 根据id查询可用的物码,整单外协用
  selectCompleteMaterialCodeByRelationId: async (id: number) => {
    return await request.get({ url: `/pms/order-material-relation/selectCompleteMaterialCodeByRelationId?id=` + id })
  },
  // 根据id查询可用的物码,整单外协用
  selectCompleteMaterialCodeByRelationId2: async (id,planId) => {
    return await request.get({ url: `/pms/order-material-relation/selectCompleteMaterialCodeByRelationId2?id=` + id+`&planId=`+planId})
  },
  // 根据id查询可用的物码,工序外协用
  selectStorageMaterialCodeByRelationId: async (id: number) => {
    return await request.get({ url: `/pms/order-material-relation/selectStorageMaterialCodeByRelationId?id=` + id })
  },
  //外协完成
  outsourceComplete: async (data: OrderMaterialRelationVO) => {
    return await request.post({ url: `/pms/order-material-relation/outsourceComplete`, data })
  },
  //外协入库
  outsourceInStorage: async (data: OrderMaterialRelationVO) => {
    return await request.post({ url: `/pms/order-material-relation/outsourceInStorage`, data })
  },

  // 新增订单物料关系,废弃处理用
  addRelation: async (data: OrderMaterialRelationVO) => {
    return await request.post({ url: `/pms/order-material-relation/addRelation`, data })
  },

  // 释放关系码
  releaseCode: async (id: number) => {
    return await request.delete({ url: `/pms/order-material-relation/releaseCode?id=` + id })
  },

}
