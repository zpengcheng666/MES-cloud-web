import request from '@/config/axios'

// 追溯 VO
export interface RetraceVO {
  id: string // 主键
  name: string // 检测工具名称
}

// 追溯 API
export const RetraceApi = {

  // 追溯
  getRetrace: async (no: string,batchNo:string) => {
    return await request.get({ url: `/qms/inspection-scheme/getRetrace?no=` + no+'&batchNo='+batchNo })
  },

}
