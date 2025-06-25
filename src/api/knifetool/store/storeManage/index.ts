/*
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-11 16:23:29
 * @LastEditTime: 2024-07-03 11:19:36
 * @FilePath: /cimp-tms-web/src/api/store/storeManage/index.ts
 */
import request from '@/config/axios'

export interface Demo01ContactVO {
  id?:number,
  name: string,
  type: number,
  parentId: number,
  classification: number,
  location: string,
  admin: string
}

export interface Demo02ContactVO {
  id?: number,
  name: string,
  type?: number,
  specifications: string,
  parentId?: number,
  goods?: any
}

// 查询库位列表（树）
export const getSimpleLocationList = async (params?: any) => {
  return await request.get({ url: '/knifetool/storeLocation/treeStump', params })
}

// 查询仓库
export const getSotreLocation =  async (params:any) => {
  return await request.get({ url: '/knifetool/storeLocation/page',params })
}

// 新增仓库
export const createWarehouse = async (data: Demo01ContactVO) => {
  return await request.post({ url: `/knifetool/storeLocation/create`, data })
}

// 修改仓库
export const updateWarehouse = async (data: Demo01ContactVO) => {
  return await request.put({ url: `knifetool/storeLocation/update`, data })
}

// 删除仓库|货架
export const deleteWarehouse = async (params: any) => {
  return await request.delete({ url: `knifetool/storeLocation/delete`, params })
}


// 查询货架
export const getSotreRack =  async (params:any) => {
  return await request.get({ url: '/knifetool/storeLocation/RackPage',params })
}

// 新增货架
export const createStoreRack = async(data: any)=>{
  return await request.post({url: 'knifetool/storeLocation/addRackAndLocation', data})
}

// 修改货架
export const updateStoreRack = async(data: any)=>{
  return await request.put({url: 'knifetool/storeLocation/update-second', data})
}

// 修改货架 - 查询 goods
export const getStoreRackGoods = async(treeid: number)=>{
  return await request.get({url: `knifetool/storeLocation/treeLocation/${treeid}`})
}

// 查询货位管理
export const getLocationMange =  async (params:any) => {
  return await request.get({ url: '/knifetool/storeLocation/locationMange',params })
}

// 查询货位详情
export const getLocationInfo =  async (params:any) => {
  return await request.get({ url: '/knifetool/storeLocation/locationInfo',params })
}

// 查询货位详情 - 列表（库存信息）
export const getLocationGoodPage =  async (params:any) => {
  return await request.get({ url: '/knifetool/storeLocation/locationGoodPage',params })
}

export interface isFullVO {
  id: number
  isfull: number
}

// 货位详情 是否满仓
export const putLocationIsfull =  async (data:isFullVO) => {
  return await request.put({ url: '/knifetool/storeLocation/locationIsfull',data })
}


// 库位块状数据
export const getlocationMangeNo =  async (params:any) => {
  return await request.get({ url: 'knifetool/storeLocation/locationMangeNo',params })
}

// 查询货架表头信息
// export const getRackTitle =  async (params:any) => {
//   return await request.get({ url: 'knifetool/storeLocation/getRackTitle',params })
// }



