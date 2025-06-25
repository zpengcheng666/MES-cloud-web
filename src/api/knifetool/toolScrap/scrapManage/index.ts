/*
 * @Author: hyj
 * @Description: 报废管理
 * @Date: 2024-07-01 14:58:56
 * @LastEditTime: 2024-07-10 11:08:34
 * @FilePath: /cimp-tms-web/src/api/toolScrap/scrapManage/index.ts
 */
import request from '@/config/axios'

// 登记报废分页列表
export const getScrapList = async (params) => {
  return await request.get({ url: 'knifetool/scrap/page',params })
}

// 登记报废添加
export const createScrap = async (data) => {
  return await request.post({ url: 'knifetool/scrap/add',data })
}

// 根据id查询刀具明细  -  添加使用
export const getDetailByParam = async (data) => {
  return await request.post({ url: 'knifetool/toolDetail/getDetailByParam',data })
}

// 登记报废修改审核状态
export const updateStatus = async (data) => {
  return await request.post({ url: 'knifetool/scrap/update/status',data })
}


