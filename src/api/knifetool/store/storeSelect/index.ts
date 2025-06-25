/*
 * @Author: hyj
 * @Description: 库存查询
 * @Date: 2024-06-11 16:23:29
 * @LastEditTime: 2024-06-18 15:12:14
 * @FilePath: /cimp-tms-web/src/api/store/storeSelect/index.ts
 */
import request from '@/config/axios'



// 查询库存列表
export const getStoreSelect =  async (params:any) => {
  return await request.get({ url: 'knifetool/storeSelect/page',params })
}

// 详情
export const getSubPage =  async (data:any) => {
  return await request.post({ url: 'knifetool/storeSelect/sub/page',data })
}




