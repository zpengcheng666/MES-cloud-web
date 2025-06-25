import request from '@/config/axios'

export const getProcessDefinition = async (id: number, key: string) => {
  return await request.get({
    url: '/bpm/process-definition/get',
    params: { id, key }
  })
}

export const getProcessDefinitionPage = async (params) => {
  return await request.get({
    url: '/bpm/process-definition/page',
    params
  })
}

export const getProcessDefinitionList = async (params) => {
  return await request.get({
    url: '/bpm/process-definition/list',
    params
  })
}
/**
 * 获取常用审批
 */
export const getCommonUse = async () => {
  return await request.get({
    url: '/bpm/process-definition/getCommonUse'
  })
}
