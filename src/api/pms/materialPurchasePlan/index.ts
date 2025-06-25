import request from '@/config/axios'
import {PlanVO} from "@/api/pms/plan";

// 项目计划 API
export const MaterialPurchaseApi = {
  //获取详细计划,物料采购计划用
  getMaterial: async (projectIds: any) => {
    return await request.get({ url: `/pms/materialPurchasePlan/getMaterial?projectIds=`+projectIds })
  },

  // 查询项目分页，项目和评审都要通过
  getApprovalPageWithPass: async (params: any) => {
    return await request.get({ url: `/pms/materialPurchasePlan/getApprovalPageWithPass`, params })
  },
  // 查询项目列表,和上面那个一样,项目和评审都要通过
  getApprovalListWithPass: async (params: any) => {
    return await request.get({ url: `/pms/materialPurchasePlan/getApprovalListWithPass`, params })
  },
  // 查询项目分页，查询准备中和生产中的数据
  getApprovalPageByStatus: async (params: any) => {
    return await request.get({ url: `/pms/materialPurchasePlan/getApprovalPageByStatus`, params })
  },

  // 修改项目计划明细
  updatePlanItem: async (data:any) => {
    return await request.put({ url: `/pms/materialPurchasePlan/updatePlanItem`, data })
  },
  //获得工艺编程type3节点(这个方法已经不适用了,现在直接用评审的数据，而不是看每道工序下用的设备，刀具等)
  getProcessDetailDesign: async (params: any) => {
    return await request.get({ url: `/pms/materialPurchasePlan/getProcessDetailDesign`, params })
  },
  //获得产品零件下的资源列表,就是加工用到的工具,不够了也要采购
  getPurchaseResource:async (projectPlanItemId: any) => {
    return await request.get({ url: `/pms/materialPurchasePlan/getPurchaseResource?projectPlanItemId=`+projectPlanItemId })
  },

  getPurchaseResourceByProjectIds:async (projectIds: any) => {
    return await request.get({ url: `/pms/materialPurchasePlan/getPurchaseResourceByProjectIds?projectIds=`+projectIds })
  },

  getPurchaseResourceAll:async () => {
    return await request.get({ url: `/pms/materialPurchasePlan/getPurchaseResourceAll` })
  },

  startPurchase:async (data)=>{
    return await request.post({ url: `/pms/materialPurchasePlan/startPurchase`,data })
  }
}
