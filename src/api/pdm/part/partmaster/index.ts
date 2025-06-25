import request from '@/config/axios'

export interface PartMasterVO {
    id: string
    partMasterId: string
    partVersionId: string
    partVersion: string
    partNumber: string
    partName: string
    processCondition: string
    rootProductId: string
    domainId: string
    partType: string
    processType: string
    materialCode: string
    materialClassIf: string
    materialDesg: string
    materialCondition: string
    materialSpec: string
    materialDimension: string
    materialId: string
    creator: string
    updater: string
    companyName: string
    companyId: string
    source: number
}

export const PartMasterApi = {
    getAll: async (partVersionId: number) => {
        return await request.get({ url: `/pdm/part/getall?partVersionId=` + partVersionId })
    },
    //获取零件动态设计属性
    getPartAttrs: async (params) => {
        return await request.get({ url: `/pdm/part/getPartAttrs`, params})
    },
    //新增零件
    addPart: async (data) => {
        return await request.post({ url: `/pdm/part/addPart`, data})
    },
    //删除零件
    deletePart: async (data) => {
        return await request.delete({ url: `/pdm/part/deletePart` , data})
    }
}

