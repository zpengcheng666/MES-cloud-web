import request from '@/config/axios'
import { CheckContainerVO } from '../checkcontainer'

export type taskVO = {
  chargeUserId?: number,
  storeMenutreeId?: number
  latestCheckTime: string
  planFlag:string
  pageNo:number
  pageSize:number
}




// 库存盘点任务 API
export const CheckTaskApi = {
  // 查询库位详情
  getWarehouseLocationDetail : async (checkPlanId:string) => {
    return await request.get({ url: `/wms/check-plan/getWarehouseLocationDetail?checkPlanId=` + checkPlanId})
  },
  // 开始盘点
  startCheckTask : async (data: any) => {
    return await request.post({ url: `/wms/check-plan/startCheckTask`, data })
  },
  // 保存盘点
  saveCheckPlanItem : async (data: any) => {
    return await request.post({ url: `/wms/check-plan/saveCheckPlanItem`, data })
  },
  // 提交盘点
  submitCheckPlanItem : async (data: any) => {
    return await request.post({ url: `/wms/check-plan/submitCheckPlanItem`, data })
  },
  // 提交盘点
  submitCheckPlan : async (checkPlanId: string) => {
    return await request.post({ url: `/wms/check-plan/submitCheckPlan?checkPlanId=` + checkPlanId })
  },
  // 查询物料库存
  getMaterialStock : async (barCode: string) => {
    return await request.get({ url: `/wms/material-stock/getMaterialsByBarCode?barCode=`+barCode })
  },


}


// 获得盘点任务分页列表 
export const getCheckPlan = async (params: taskVO) => {
  return await request.get({ url: 'knifetool/checkPlan/page',params })
}

// 盘库左侧仓库树 - 货架 
export const getTreeChildren = async (id,params) => {
  return await request.get({ url: `knifetool/storeLocation/treeChildren/${id}`,params })
}

// 盘库左侧仓库树 - 库位
export const getTreeLocation = async (id,params) => {
  return await request.get({ url: `knifetool/storeLocation/treeLocation/${id}`,params })
}

// 盘点任务 -  根据planId查询盘点任务信息
export const getCheckPlanItemByPlanId = async (params) => {
  return await request.get({ url: 'knifetool/checkPlan/checkPlanItemByPlanId', params })
}

// 盘点任务-扫码获取刀具信息
export const getInfoByCode = async (params) => {
  return await request.get({ url: 'knifetool/checkPlan/getInfoByCode', params })
}

// 异步加载节点(库位)
export const getStoreCheckLocation = async (params) => {
  return await request.get({ url: 'knifetool/checkPlan/getStoreCheckLocation', params })
}

// 盘点任务-获取指定货位及盘点方案待盘点刀具任务列表
export const getStoreCheckPlanItemInfoByLocationIdAndPlanId = async (params) => {
  return await request.get({ url: 'knifetool/checkPlan/getStoreCheckPlanItemInfoByLocationIdAndPlanId', params })
}

// 盘点任务-提交盘点结果
export const submitCheckPlan = async (data) => {
  return await request.post({ url: 'knifetool/checkPlan/submitCheckPlan',data })
}

// 盘点任务 -  保存盘点任务货位盘点结果
export const createCheckPlanItem = async (data) => {
  return await request.post({ url: 'knifetool/checkPlan/addCheckPlanItem',data })
}

// 获取当前货架的提交盘点状态
export const getSubmitFlag = async (params:{id:number|undefined,goodsId:number}) => {
  return await request.get({ url: 'knifetool/checkPlan/getSubmitFlag',params })
}

