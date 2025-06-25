/*
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-11 16:23:29
 * @LastEditTime: 2024-06-17 16:16:37
 * @FilePath: /cimp-tms-web/src/api/store/storeWarn/index.ts
 */
import request from '@/config/axios'

// export interface Demo01ContactVO {
//   id?:number,
//   name: string,
//   type: number,
//   parentId: number,
//   classification: number,
//   location: string,
//   admin: string
// }




// 查询库存列表
export const getStoreWarn =  async (params:any) => {
  return await request.get({ url: 'knifetool/warn/page',params })
}




