import request from '@/config/axios'

// CAPP 典型工艺路线 VO
export interface ProcessRouteTypicalVO {
  id: string
  name: string
  procedureName: string
  processRouteName: string
  description: string
  createTime: Date
}

// PPM 典型工艺路线 API
export const ProcessRouteTypicalApi ={
  //查询典型工艺路线列表
  getProcessRouteTypicalPage: async (params: PageParam) => {
    return await request.get({url: '/pdm/process-route-typical/page',params})
  },
  //查询典型工艺路线
  getProcessRouteTypical: async (id: number) => {
    return await request.get({url: '/pdm/process-route-typical/get?id=' + id})
  },
  //新增典型工艺路线
  createProcessRouteTypical: async (data: ProcessRouteTypicalVO) => {
    return await request.post({url: '/pdm/process-route-typical/create', data})
  },
  //修改典型工艺路线
  updateProcessRouteTypical: async (data: ProcessRouteTypicalVO) => {
    return await request.put({url: '/pdm/process-route-typical/update', data})
  },
  //删除典型工艺路线
  deleteProcessRouteTypical: async (id: number) => {
    return await request.delete({url: '/pdm/process-route-typical/delete?id=' + id})
  },

}

