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

// 查询仓库列表（树）
export const warehouseMenuTree = async (params?: any) => {
  return await request.get({ url: '/wms/warehouse/warehouseMenuTree', params })
}


// 查询库区详情
export const getwarehouseareadetail =  async (params:any) => {
  return await request.get({ url: '/wms/warehouse-area/getwarehouseareadetail',params })
}

// 查询仓库列表（树）
export const warehouseLocationTree = async (params?: any) => {
  return await request.get({ url: '/wms/warehouse/warehouseLocationMenuTree', params })
}

