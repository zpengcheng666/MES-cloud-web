import request from '@/config/axios'

//项目零件目录信息
export interface ProjPartBomVO {
  id: string
  partVersionId: string
  partNumber: string
  partName: string
  partVersion: string
  rootProductId: string
  customizedIndex: string
  reviewedBy: string
  reviewer: string
  deadline: string
  status: number
  source: number
}


export const PartNewApi = {
  //获取当前项目零件目录结构树
  getNewPartBomTreeList: async (params) => {
    return await request.get({ url: `/pdm/newpart/getNewPartBomTreeList`, params })
  },

}
