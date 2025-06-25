import request from '@/config/axios'

// 工装申请信息 VO
export interface ToolingTaskVO {
  id: string // id
  applyCode: string // 申请单号(GS+年月日+三位流水，如GS20240101001)
  productNumber: string // 产品图号
  tid: string
  toolingNumber: string
  toolingCode: string // 工装编号(唯一，即类码)
  toolingName: string // 工装名称
  categoryId: number // 工装分类编号
  applyId: string
  applyName: string // 申请人(默认当前登录人-可更改)
  applyDepartment: string // 申请部门
  toolingVersion: string
  quantity: number // 数量
  applyReason: string // 申请理由：1新品试制2生产需要3工艺更新4原工装损坏或报废5其它
  requireTime: Date // 需求日期
  customizedIndex: string
  name: string
  equipmentName: string // 设备名称
  equipmentNumber: string // 设备型号
  toolingStyle: string // 工装形式(1通用 0专用)
  toolingType: string // 工装类别(0制造工装 1装配工装 2试验工装 3检验工装)
  processType: string // 加工类型(0采购 1外委 2自制 3改造)
  technicalRequirement: string // 技术条件
  status: number // 状态(0工作中 1审批中 2审批失败 3已完成)
  processInstanceId: string // 流程实例的编号
  approvalStatus: number // 流程审批状态
  toolingApplyId: string // 工装申请id
  toolingApplyIdArr: string[] // 工装申请id数组
  taskId: string
  reviewedBy: string
  reviewer: string
  deadline: Date
}
export const  ToolingTaskApi = {
  //获取项目详细信息
  getToolingTask: async (id: number) => {
    return await request.get({ url: `/pdm/tooling-task/getToolingTask?id=` + id })
  },

  //指派工装设计任务
  addToolingTask: async (data: ToolingTaskVO) => {
    return await request.post({ url: `/pdm/tooling-task/add`, data })
  },

  //编辑工艺任务
  updateToolingTask: async (data: ToolingTaskVO) => {
    return await request.put({ url: `/pdm/tooling-task/update`, data })
  },

  //获取当前工装列表
  getToolingTaskDataList: async (params) => {
    return await request.get({ url: `/pdm/tooling-task/getToolingTaskDataList`, params})
  },

  //获取工装详细列表
getToolingDetailList: async (params) => {
  return await request.get({ url: `/pdm/tooling-task/getToolingDetailList`, params})
},

  //右侧详细信息
  getToolingDetailById: async (id: string) => {
    return await request.get({ url: `/pdm/tooling-task/getToolingDetailById?id=` + id })
  },

  //发起流程
startDetailInstance: async (data) => {
    return await request.put({ url: `/pdm/tooling-task/startDetailInstance`, data })
  },

  // 查询工装信息详情
  getToolingDetail: async (id: number) => {
    return await request.get({ url: `/pdm/tooling-task/get?id=` + id })
  },

  //根据客户化标识获取对应文件目录
  getFile: async (customizedIndex: string) => {
    return await request.get({ url: `/pdm/tooling-task/getFileByCustomizedIndex?customizedIndex=` + customizedIndex })
  },
}
