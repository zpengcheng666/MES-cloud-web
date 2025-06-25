/*
 * @Author: hyj
 * @Description: 新刀
 * @Date: 2024-06-19 14:09:13
 * @LastEditTime: 2024-06-20 10:57:43
 * @FilePath: /cimp-tms-web/src/api/store/newStore/index.ts
 */
import request from '@/config/axios'

// 查询新刀入库列表
export const getNewGoodPage =  async (params:any) => {
  return await request.get({ url: 'knifetool/storeNewAndOldGood/newGoodPage',params })
}

// 查询物码
export const getCodeDetail =  async (params:any) => {
  return await request.get({ url: 'knifetool/storeNewAndOldGood/newGoodCodeDetail',params })
}

// 查询盒码
export const getBoxCodeDetail =  async (params:any) => {
  return await request.get({ url: 'knifetool/storeNewAndOldGood/newGoodBoxCodeDetail',params })
}

// 物料批量入库
export const handleImport =  async (data:any) => {
  return await request.post({ url: 'knifetool/storeNewAndOldGood/import/handle',data })
}

// 添加新刀入库
export const createNewGoods =  async (data:any) => {
  return await request.post({ url: 'knifetool/storeNewAndOldGood/newGoodAdd',data })
}










