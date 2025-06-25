import request from '@/config/axios'

// pdm_std_part_instance VO
export interface PartInstanceVO {
    id: string // 主键
    name: string // 实例号
    rootproductId: string // 产品根节点ID
    partVersionId: string // 零部件版本ID
    parentId: string // 父节点ID
    customizedIndex: string // 客户化标识
    serialNumber: string // 排序
    vmatrix01: string // 位置坐标系，坐标原点X值
    vmatrix02: string // 位置坐标系，坐标原点Y值
    vmatrix03: string // 位置坐标系，坐标原点Z值
    vmatrix04: string // 位置坐标系，X轴方向向量X值
    vmatrix05: string // 位置坐标系，X轴方向向量Y值
    vmatrix06: string // 位置坐标系，X轴方向向量Z值
    vmatrix07: string // 位置坐标系，Y轴方向向量X值
    vmatrix08: string // 位置坐标系，Y轴方向向量Y值
    vmatrix09: string // 位置坐标系，Y轴方向向量Z值
    vmatrix10: string // 位置坐标系，Z轴方向向量X值
    vmatrix11: string // 位置坐标系，Z轴方向向量Y值
    vmatrix12: string // 位置坐标系，Z轴方向向量Z值
    type: string // 节点类型，root产品根节点、comp部件、part零件
    targetId: string // 对象id(节点类型对应部件时存部件id)
}


export const PartInstanceApi = {

    getPartInstanceList: async (params) => {
        return await request.get({ url: `/pdm/partinstance/list`, params })
    },

    // 查询pdm_std_part_instance详情
    getPartInstance: async (id: number) => {
        return await request.get({ url: `/pdm/instance/get?id=` + id })
    }
}
