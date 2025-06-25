/*
 * @Author: hyj
 * @Description: 旧刀
 * @Date: 2024-06-19 14:09:13
 * @LastEditTime: 2024-06-25 14:24:24
 * @FilePath: /cimp-tms-web/src/api/store/oldStore/index.ts
 */
import request from '@/config/axios'

// 查询旧刀列表
export const getOldGoodPage =  async (data:any) => {
  return await request.post({ url: 'knifetool/storeNewAndOldGood/oldGoodPage',data })
}

// 旧刀入库 - 添加
export const createOldGood =  async (data:any) => {
  return await request.post({ url: 'knifetool/storeNewAndOldGood/oldGoodAdd',data })
}


// 旧刀入库-物码失去焦点查询刀具信息
export const getOldGoodCodeInfo =  async (params:any) => {
  return await request.get({ url: 'knifetool/storeNewAndOldGood/getOldGoodInformationBycode',params })
}


// 推荐库位
export const suggestedLocation =  async (params:any) => {
  return await request.get({ url: 'knifetool/storeNewAndOldGood/newGoodSelectLocation',params })
}
