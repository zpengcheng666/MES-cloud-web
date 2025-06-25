/*
 * @Author: hyj
 * @Description: 出库登记
 * @Date: 2024-06-11 16:23:29
 * @LastEditTime: 2024-06-20 11:19:45
 * @FilePath: /cimp-tms-web/src/api/store/StoreRegister/index.ts
 */
import request from '@/config/axios'


// 查询出库登记列表
export const getStoreRegisterPage =  async (params:any) => {
  return await request.get({ url: 'knifetool/register/storeRegisterPage',params })
}

// 出库登记-选择库位和类型显示信息
export const getStoreByLocationAndType = async (params: any) => {
  return await request.get({ url: `/knifetool/register/getStoreByLocationAndType`, params })
}

// 出库登记 - 出库提交
export const outGoodSubmit = async (data: any) => {
  return await request.post({ url: `knifetool/register/outGoodSubmit`, data })
}

// 获取出库单查询数据列表
export const getOutGoodPage =  async (params:any) => {
  return await request.get({ url: 'knifetool/register/outGoodPage',params })
}


// 根据物码获取基本信息
export const getToolInformationByObjectCode =  async (params:any) => {
  return await request.get({ url: 'knifetool/information/getToolInformationByObjectCode',params })
}


// 查询所有配刀任务工单号
export const getParingPlanList =  async (params:any) => {
  return await request.get({ url: 'knifetool/toolParingPlan/getParingPlanList',params })
}
