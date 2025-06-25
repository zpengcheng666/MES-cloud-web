/*
 * @Author: hyj
 * @Description:
 * @Date: 2024-06-21 10:54:26
 * @LastEditTime: 2024-06-21 10:57:10
 * @FilePath: /cimp-tms-web/src/api/knifetool/info/index.ts
 */
import request from '@/config/axios'


export const getBaseInfoList = async(params: any) =>{
    return await request.get({url:'knifetool/information/page', params})
}


export const getToolInfoPage = async(params: any) =>{
    return await request.get({url:'knifetool/information/tool/page', params})
}

// 获取刀具基本信息详情
export const getInformation = async(params: any) =>{
    return await request.get({url:'knifetool/information/get', params})
}

// 刀具基本信息新增
export const createInformation = async (data: any) => {
    return await request.post({ url: 'knifetool/information/create',data })
}

// 刀具基本信息修改
export const updateInformation = async (data: any) => {
    return await request.put({ url: 'knifetool/information/update',data })
}

// 刀具基本信息状态修改
export const updateInfoState = async (id,state) => {
    const data = {
        id: id,
        state: state
    }
    return await request.post({ url: 'knifetool/information/update/state',data })
}

// 导出刀具基本信息 Excel
export const exportInfo = (params) => {
    return request.download({ url: `/knifetool/information/export-excel`, params })
}

// 删除刀具基本信息
export const deleteInfo = (id: number) => {
    return request.delete({ url: `/knifetool/information/delete?id=` + id })
}

// 分页查询刀具、刀柄及配件
export const getHandlePage = async(params: any) =>{
    return await request.get({url:'knifetool/information/total/page', params})
}