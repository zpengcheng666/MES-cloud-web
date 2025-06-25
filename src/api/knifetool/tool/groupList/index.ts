import request from '@/config/axios'

// 刀具组装 VO

// 查询刀具组装分页
export const getToolGroupPage = (params: any) => {
  return request.get({ url: `/knifetool/toolGroup/page`, params })
}

// 刀组添加
export const createToolGroup = async (data: any) => {
  return await request.post({ url: '/knifetool/toolGroup/subGroupData',data })
}

// 刀组修改
export const subToolGroup = async (data: any) => {
  return await request.post({ url: '/knifetool/toolGroup/subGroupData',data })
}

// 刀组状态修改
export const updateToolGroupState = async (id,status) => {
  const data = {
    id: id,
    status: status
  }
  return await request.post({ url: '/knifetool/toolGroup/updateGroupStatus',data })
}

// 删除刀具组装
export const deleteToolGroup = (id: number) => {
  return request.delete({ url: `/knifetool/toolGroup/deleteGroupData?id=` + id })
}

// 根据id查询刀组明细
export const getGroupDetail = (params: any) => {
  return request.get({ url: '/knifetool/toolGroup/getGroupDetail', params })
}
