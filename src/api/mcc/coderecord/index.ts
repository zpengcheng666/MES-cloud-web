import request from '@/config/axios'

// 编码记录 VO
export interface CodeRecordVO {
  id: string // ID
  code: string // 编码
  name: string // 名称
  parentId: string // 父类型id
  status: number // 状态  1 预生成 2 已使用  3释放
  encodingRuleId: string // 编码规则ID
  classificationId: string // 编码分类ID
}

// 编码记录 API
export const CodeRecordApi = {
  // 查询编码记录分页
  getCodeRecordPage: async (params: any) => {
    return await request.get({ url: `/mcc/code-record/page`, params })
  },

  // 查询编码记录详情
  getCodeRecord: async (id: number) => {
    return await request.get({ url: `/mcc/code-record/get?id=` + id })
  },

  // 新增编码记录
  createCodeRecord: async (data: CodeRecordVO) => {
    return await request.post({ url: `/mcc/code-record/create`, data })
  },

  // 修改编码记录
  updateCodeRecord: async (data: CodeRecordVO) => {
    return await request.put({ url: `/mcc/code-record/update`, data })
  },

  // 删除编码记录
  deleteCodeRecord: async (id: number) => {
    return await request.delete({ url: `/mcc/code-record/delete?id=` + id })
  },

  // 导出编码记录 Excel
  exportCodeRecord: async (params) => {
    return await request.download({ url: `/mcc/code-record/export-excel`, params })
  },
}