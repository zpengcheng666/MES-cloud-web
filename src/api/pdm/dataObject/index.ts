import request from '@/config/axios'

// 产品数据对象 VO
export interface DataObjectVO {
    id: string // 主键id
    rootproductId: string // 产品表ID
    productName: string // 产品名称
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
    list: {} //假数据换成真数据之后的集合
    WinTableDataStr: string
}

// 产品数据对象 API
export const DataObjectApi = {
    // 查询产品数据对象分页
    getDataObjectPage: async (params: any) => {
        return await request.get({ url: `/pdm/data-object/page`, params })
    },

    // 查询产品数据对象详情
    getDataObject: async (id: number) => {
        return await request.get({ url: `/pdm/data-object/get?id=` + id })
    },

    // 新增产品数据对象
    createDataObject: async (data: DataObjectVO) => {
        return await request.post({ url: `/pdm/data-object/create`, data })
    },

    // 修改产品数据对象
    updateDataObject: async (data: DataObjectVO) => {
        return await request.put({ url: `/pdm/data-object/update`, data })
    },

    // 删除产品数据对象
    deleteDataObject: async (data: DataObjectVO) => {
        return await request.delete({ url: `/pdm/data-object/delete`, data })
    },
    //获取客户化标识列表
    getCustomizedIndicesByRootProductId: async (rootproductId: number) => {
        return await request.get({ url: `/pdm/data-object/getCustomizedIndicesByRootProductId?rootproductId=` + rootproductId })
    },
    //编辑按钮
    updateIndex: async (data: DataObjectVO) => {
        return await request.put({ url: `/pdm/data-object/updateIndex`, data })
    },

    //实例化按钮
    createIndex: async (data: DataObjectVO) => {
        return await request.post({ url: `/pdm/data-object/createIndex`, data })
    },
    //查看详细属性
    getSelectOneById: async (id: number) => {
        return await request.get({ url: `/pdm/data-object/selectOneById?id=` + id })
    }
}
