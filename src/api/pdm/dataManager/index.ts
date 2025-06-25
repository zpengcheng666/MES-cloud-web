import request from '@/config/axios'

//数据包信息
export interface DataManagerVO {
  id: string
  name: string
  size: string
  type: boolean
  md5: string
  vaultUrl: string
  receiveCode: string
  status: string
  productNumber: string
  projectCode: string
  projectName: string
  companyId: string
  companyName: string
  structureId: number
  createTime: Date
  updateTime: Date
}

export const DataManagerApi = {
  //获取数据包的下拉列表
  getDataManagerList: async (params) => {
    return await request.get({ url: `/pdm/data-manager/list`, params})
  },
  //获取数据包详细信息
  getDataInfo: async (id: number) => {
    return await request.get({ url: `/pdm/data-manager/getDataInfo?id=` + id })
  },
  //获取当前数据包零件目录列表
  getPartListByReceiveInfoId: async (params) => {
    return await request.get({ url: `/pdm/data-manager/getPartListByReceiveInfoId`, params})
  },
}
