import request from '@/config/axios'

// CAPP 加工路线 VO
export interface ProcessRouteVO {
  id: string
  name: string
  description: string
  createTime: Date
}

// PPM 加工路线 API
export const ProcessRouteApi ={
  //查询加工路线列表
  getProcessRoutePage: async (params: PageParam) => {
    return await request.get({url: '/pdm/process-route/page',params})
  },
  //查询加工路线
  getProcessRoute: async (id: number) => {
    return await request.get({url: '/pdm/process-route/get?id=' + id})
  },
  //新增加工路线
  createProcessRoute: async (data: ProcessRouteVO) => {
    return await request.post({url: '/pdm/process-route/create', data})
  },
  //修改加工路线
  updateProcessRoute: async (data: ProcessRouteVO) => {
    return await request.put({url: '/pdm/process-route/update', data})
  },
  //删除加工路线
  deleteProcessRoute: async (id: number) => {
    return await request.delete({url: '/pdm/process-route/delete?id=' + id})
  },

  //查询加工路线启用下拉列表
  // getProcessRouteList: async () => {
  //   return await request.get({url: '/pdm/process-route/simple-list'})
  // }

}

