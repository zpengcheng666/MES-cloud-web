import request from '@/config/axios'

// 质量管理关联树 VO
export interface ManagementTreeVO {
  id: string // id
  parent: string // 父节点.
  nodeId: string // 节点关联字段ID
  nodeName: string // 节点名
  nodeType: string // 节点类型
  remark: string // 备注
}

// 质量管理关联树 API
export const ManagementTreeApi = {
  // 查询质量管理关联树分页
  getManagementTreePage: async (params: any) => {
    return await request.get({ url: `/qms/management-tree/page`, params })
  },

  // 查询质量管理关联树详情
  getManagementTree: async (id: number) => {
    return await request.get({ url: `/qms/management-tree/get?id=` + id })
  },

  // 新增质量管理关联树
  createManagementTree: async (data: ManagementTreeVO) => {
    return await request.post({ url: `/qms/management-tree/create`, data })
  },

  // 修改质量管理关联树
  updateManagementTree: async (data: ManagementTreeVO) => {
    return await request.put({ url: `/qms/management-tree/update`, data })
  },

  // 删除质量管理关联树
  deleteManagementTree: async (id: number) => {
    return await request.delete({ url: `/qms/management-tree/delete?id=` + id })
  },

  // 导出质量管理关联树 Excel
  exportManagementTree: async (params) => {
    return await request.download({ url: `/qms/management-tree/export-excel`, params })
  },

  // 获得计划关联树列表
  getPlanTreeList: async () => {
    return await request.get({ url: `/qms/management-tree/getList` })
  },

  // 获得计划关联树
  getPlanTreeObject: async () => {
    const list = await ManagementTreeApi.getPlanTreeList()

    const data: any[] = []
    const stack: any[] = []
    let temp: any

    for (const v of list) {
      v.isAdd = false
      if (v.parent == null || v.parent == '') {
        temp = {
          label: v.nodeName,
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
            label: v.nodeName,
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
          label: v.nodeName,
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
