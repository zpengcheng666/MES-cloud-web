/*
 * @Author: hyj
 * @Description: 
 * @Date: 2024-07-25 15:00:52
 * @LastEditTime: 2024-07-26 09:48:45
 * @FilePath: /cimp-tms-web/src/api/toolDetail/toolComponentInfo/index.ts
 */
import request from '@/config/axios'

// 查询刀具分类分页
export const getToolAccountQuery = (data: any) => {
  return request.post({ url: `/knifetool/toolDetail/accountPage`, data })
}

// 刀具组件履历详情
export const getDetailByParam = (data: any) => {
  return request.post({ url: `knifetool/toolDetail/getDetailByParam`, data })
}


// 报废
export const history = (params: any) => {
  return request.get({ url: `knifetool/scrap/detail/history`, params })
}


// 配送记录
export const listToolDeliveryRecordPage = (data: any) => {
  return request.post({ url: `knifetool/deliveryTask/listToolDeliveryRecordPage`, data })
}

// 出入库 1: 入库， 3：出库
export const getStoreInOutRecordByCodeAndTypePage = (data: any) => {
  return request.post({ url: `knifetool/storeNewAndOldGood/getStoreInOutRecordByCodeAndTypePage`, data })
}

// 配刀
export const listPageByCode = (params: any) => {
  return request.get({ url: `knifetool/toolParing/listPageByCode`, params })
}

// 刃磨
export const listToolCutterGrindingByPage = (params: any) => {
  return request.get({ url: `knifetool/information/listToolCutterGrindingByPage`, params })
}
