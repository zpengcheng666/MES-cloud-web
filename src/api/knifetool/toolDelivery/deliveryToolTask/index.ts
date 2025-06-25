/*
 * @Author: hyj
 * @Description: 配送管理
 * @Date: 2024-07-01 14:58:56
 * @LastEditTime: 2024-07-09 16:59:57
 * @FilePath: /cimp-tms-web/src/api/toolDelivery/deliveryToolTask/index.ts
 */
import request from '@/config/axios'

// 分页列表 - 获取刀具配送列表
export const getDeliveryTaskList = async (params) => {
  return await request.get({ url: 'knifetool/deliveryTask/listPage',params })
}

// 根据rfid查询配刀信息
export const getParingAndPlanByRfid = async (params) => {
  return await request.get({ url: 'knifetool/toolParingPlan/getParingAndPlanByRfid',params })
}

// 查看按钮 - 根据配送记录id查询配刀任务及配刀记录
export const getParingAndPlanByDeliveryId = async (params) => {
  return await request.get({ url: 'knifetool/toolParingPlan/getParingAndPlanByDeliveryId',params })
}

// 刀具配送任务修改配送状态
export const updateDeliveryState = async (params) => {
  return await request.post({ url: 'knifetool/deliveryTask/updateDeliveryState',params })
}

// 刀具配送任务扫码配送保存
export const saveDeliveryState = async (data) => {
  return await request.post({ url: 'knifetool/deliveryTask/saveDeliveryState',data })
}

// // 未使用 - 获取刀具配送记录
// export const updateDeliveryState = async (params) => {
//   return await request.post({ url: 'knifetool/deliveryTask/listToolDeliveryRecordPage',params })
// }


// // 未使用 - 查询刀组装配信息分页
// export const updateDeliveryState = async (params) => {
//   return await request.get({ url: 'knifetool/toolGroup/useInfoPage',params })
// }
