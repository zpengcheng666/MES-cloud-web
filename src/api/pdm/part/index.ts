import request from '@/config/axios'

export interface PartVO {
    id: string // id
    rootproductId: string // 产品表ID
    stdDataObject: string // 标准数据对象
    customizedDataObject: string // 客户化数据对象
    customizedIndex: string // 客户化标识
    customizedType: number // 客户化类型:0固有 1客户化 
    tableName: string // 数据表表名
    description: string // 客户化数据对象说明
    status: string // 数据表实例化状态(1已实例化，不可更改；0未实例化)
    intrinsicAttrs: string // 属性内容json(固有属性)
    customizedAttrs: string // 属性内容json(客户化属性)
    serialNumber: number // 排序
}
export const PartApi = {
    // 查询产品数据对象分页
    getpartPage: async (params: any) => {
        return await request.get({ url: `/pdm/part/page`, params })
    },

    // 查询产品数据对象详情
    getpart: async (id: number) => {
        return await request.get({ url: `/pdm/part/get?id=` + id })
    },
    //树的列表
    getStdPartInstanceList: async (params: any) => {
        return await request.get({ url: `/pdm/part/list`, params })
    },

}
