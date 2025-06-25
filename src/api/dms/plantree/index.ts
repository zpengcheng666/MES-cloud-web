import request from '@/config/axios'

// 计划关联树 VO
export interface PlanTreeVO {
  id: string // ID
  parent: string // 父节点
  name: string // 节点名
  remark: string // 备注
  deviceId: string // 关联设备
  deviceTypeId: string // 关联设备类型
}

// 计划关联树 API
export const PlanTreeApi = {
  // 查询计划关联树分页
  getPlanTreePage: async (params: any) => {
    return await request.get({ url: `/dms/plan-tree/page`, params })
  },

  // 查询计划关联树详情
  getPlanTree: async (id: number) => {
    return await request.get({ url: `/dms/plan-tree/get?id=` + id })
  },

  // 新增计划关联树
  createPlanTree: async (data: PlanTreeVO) => {
    return await request.post({ url: `/dms/plan-tree/create`, data })
  },

  // 修改计划关联树
  updatePlanTree: async (data: PlanTreeVO) => {
    return await request.put({ url: `/dms/plan-tree/update`, data })
  },

  // 删除计划关联树
  deletePlanTree: async (id: number) => {
    return await request.delete({ url: `/dms/plan-tree/delete?id=` + id })
  },

  // 导出计划关联树 Excel
  exportPlanTree: async (params) => {
    return await request.download({ url: `/dms/plan-tree/export-excel`, params })
  },

  // 获得计划关联树列表
  getPlanTreeList: async () => {
    return await request.get({ url: `/dms/plan-tree/getList` })
  },

  // 获得计划关联树
  getPlanTreeObject: async () => {
    const list = await PlanTreeApi.getPlanTreeList()

    const data: any[] = []
    const stack: any[] = []
    let temp: any

    for (const v of list) {
      v.isAdd = false
      if (v.parent == null || v.parent == '') {
        temp = {
          label: v.name,
          value: v.id,
          children: [],
          ...v
        }
        v.isAdd = true
        data.push(temp)
        stack.push(temp)
      }
    }

    while (stack.length != 0) {
      const top = stack.pop()

      for (const v of list) {
        if (v.parent == top.id) {
          temp = {
            label: v.name,
            value: v.id,
            children: [],
            ...v
          }
          v.isAdd = true
          top.children.push(temp)
          stack.push(temp)
        }
      }
    }

    for (const v of list) {
      if (!v.isAdd) {
        temp = {
          label: v.name,
          value: v.id,
          children: [],
          ...v
        }
        v.isAdd = false
        data.push(temp)
      }
    }

    return data
  }
}
