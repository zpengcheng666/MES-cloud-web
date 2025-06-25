import request from '@/config/axios'
import {ProcedureSchemaItemVO} from "@/api/pdm/feasibilityDetail";

export interface ProcessPlanDetailVO {
  id: string
  processCode: string
  projectCode: string
  partVersionId: string
  reviewedBy: string
  reviewer: string
  partNumber: string
  partName: string
  partVersion: string
  deadline: Date
  status: string
  processVersionId: string
  processInstanceId: string
  approvalStatus: string
  processName: string
  proccessVersion: string
  property: string
  type: string
  parentId: string
  name: string
  serialnum: string
  processSchemeCode: string
  customizedIndex: string
  rootProductId: string
  processScheme: string
  materialId: string
  materialDesg: string
  materialCode: string
  materialName: string
  materialCondition: string
  materialSpec: string
  materialSpecification: string
  singleSize: string
  groupSize: string
  processRouteName: string
  singleQuatity: string
  processId: string
  //工序
  procedureNum: string
  procedureName: string
  isInspect: string
  // inspectType: string[]
  preparationTime: string
  processingTime: string
  description:string
  descriptionPreview:string
  descriptionProcedure: string
  isOut: string
  processType: string
  //工步
  procedureId: string
  stepNumber: string[]
  stepNum: string
  stepName: string
  descriptionPreview:string
  stepProperty: string
  cutternum: string
  //草图
  sketchName: string
  sketchCode: string
  sketchId: string
  //数控程序
  ncId: string
  ncName: string
  ncUrl: string
  //检测项
  id:string
  processVersionId:string
  procedureId:string
  inspectionItemId:string
  number:bigint
  referenceType:string
  largestValue:string
  minValue:string
  content:string
  judgement:string
  acceptanceQualityLimit:string
  items:[]
  //工步自定义属性
  attributeValList:[]
}

//工艺更改单
export interface ProcessChangeVO {
  id: string
  projectCode: string
  processVersionId: string
  changeCode: string
  changeReason: string
  changeContent: string
  workingOpinions: string
  isPass: number
  reason: string
}

// PDM   工艺规程编制API
export const ProcessPlanDetailApi = {
  //获取当前零件目录列表
  getPartListByProcessPlanDetailId: async (projectCode: string) => {
    return await request.get({ url: `/pdm/process-plan-detail/getPartListByProcessPlanDetailId?projectCode=` + projectCode })
  },

  //获取当前项目零件目录结构树（含工序工步）
  getProjPartBomTreeList: async (params) => {
    return await request.get({ url: `/pdm/process-plan-detail/getProjPartBomTreeList`, params })
  },

  getProcessPlanDetailList: async (params) => {
    return await request.get({ url: `/pdm/process-plan-detail/getProcessPlanDetailList`, params })
  },

  //获取零件工艺规程详细信息
  getProcessPlanDetail: async (id: number) => {
    return await request.get({ url: `/pdm/process-plan-detail/getProcessPlanDetail?id=` + id })
  },

  //获取单个工序工艺详细设计结构树
  getProjPartBomTreeByTaskId: async (params) => {
    return await request.get({ url: `/pdm/process-plan-detail/getProjPartBomTreeByTaskId`, params })
  },

  //树列表
  getProcessPlanDetailTreeList: async (params) => {
    return await request.get({ url: `/pdm/process-plan-detail/getProcessPlanDetailTreeList`, params })
  },

  //工艺规程属性
  getProcess: async (id: string) => {
    return await request.get({ url: `/pdm/process-plan-detail/getProcess?id=` + id })
  },
  //工序属性
  getProcedure: async (id: string) => {
    return await request.get({ url: `/pdm/process-plan-detail/getProcedure?id=` + id })
  },
  //工步属性
  getStep: async (id: string) => {
    return await request.get({ url: `/pdm/process-plan-detail/getStep?id=` + id })
  },
  //添加工序
  addProcedure: async (data: ProcessPlanDetailVO) => {
    return await request.post({ url: '/pdm/process-plan-detail/addProcedure', data })
  },
  //添加工步
  addStep: async (data: ProcessPlanDetailVO) => {
    return await request.post({ url: '/pdm/process-plan-detail/addStep', data })
  },

  //工序-获取关联制造资源列表
  getResourceListByProcedure: async (params) => {
    return await request.get({ url: `/pdm/process-plan-detail/getResourceListByProcedure`, params })
  },
  //工序-删除选中资源(设备、刀具、工装)
  deleteSelectedResourceProcedure: async (params) => {
    return await request.post({ url: `/pdm/process-plan-detail/deleteSelectedResourceProcedure`, params })
  },
  //工序-保存选中资源(设备、刀具、工装)
  saveSelectedResourceProcedure: async (params) => {
    return await request.post({ url: `/pdm/process-plan-detail/saveSelectedResourceProcedure`, params })
  },
  //工步-获取关联制造资源列表
  getResourceListByStep: async (params) => {
    return await request.get({ url: `/pdm/process-plan-detail/getResourceListByStep`, params })
  },
  //工步-删除选中资源(设备、刀具、工装)
  deleteSelectedResourceStep: async (params) => {
    return await request.post({ url: `/pdm/process-plan-detail/deleteSelectedResourceStep`, params })
  },
  //工步-保存选中资源(设备、刀具、工装)
  saveSelectedResourceStep: async (params) => {
    return await request.post({ url: `/pdm/process-plan-detail/saveSelectedResourceStep`, params })
  },
  //工步-更改刀简号
  updateCutternum: async (params) => {
    return await request.post({url: `/pdm/process-plan-detail/updateCutternum`, params})
  },
  //获得工艺草图列表
  getProcedureFile: async (params) => {
    return await request.get({ url: `/pdm/process-plan-detail/getProcedureFiles`, params })
  },
  //获得工艺草图
  getProcedureFileById: async (id: number) => {
    return await request.get({ url: `/pdm/process-plan-detail/getProcedureFileById?id=` + id })
  },
  //保存工艺草图
  saveProcedureFile: async (data) => {
    return await request.post({ url: '/pdm/process-plan-detail/saveProcedureFile', data })
  },
  //删除工艺草图
  deleteProcedureFile: async (id: number) => {
    return await request.delete({
      url: '/pdm/process-plan-detail/deleteProcedureFile?id=' + id
    })
  },
  /**修改保存工序，此处为合并代码后新增方法*/
  updateProcedure: async (data: ProcessPlanDetailVO) => {
    return await request.put({ url: `/pdm/process-plan-detail/updateProcedure`, data })
  },

  /**删除工序，此处为合并代码后新增方法*/
  deleteProcedure: async (id: number) => {
    return await request.delete({ url: '/pdm/process-plan-detail/deleteProcedure?id=' + id })
  },
  /**修改保存工步，此处为合并代码后新增方法*/
  updateStep: async (data: ProcessPlanDetailVO) => {
    return await request.put({ url: `/pdm/process-plan-detail/updateStep`, data })
  },
  /**删除工步，此处为合并代码后新增方法*/
  deleteStep: async (id: number) => {
    return await request.delete({ url: '/pdm/process-plan-detail/deleteStep?id=' + id })
  },
  //获得数控程序信息
  getNc: async (params) => {
    return await request.get({ url: `/pdm/process-plan-detail/getNC`, params })
  },
  //保存数控程序信息
  saveNc: async (data) => {
    return await request.post({ url: '/pdm/process-plan-detail/saveNC', data })
  },
  //删除数控程序信息
  deleteNc: async (params) => {
    return await request.delete({ url: '/pdm/process-plan-detail/deleteNC', params })
  },
  //发起流程
  startProcessInstance: async (data) => {
    return await request.put({ url: `/pdm/process-plan-detail/startProcessInstance`, data })
  },
  //获得工步草图
  getStepFile: async (params) => {
    return await request.get({ url: `/pdm/process-plan-detail/getStepFiles`, params })
  },
  //保存工步草图
  saveStepFile: async (data) => {
    return await request.post({ url: '/pdm/process-plan-detail/saveStepFile', data })
  },
  //删除工步草图
  deleteStepFile: async (id: number) => {
    return await request.delete({ url: '/pdm/process-plan-detail/deleteStepFile?id=' + id })
  },
  //更新工艺详细设计任务状态为2编制中
  updateProcessDetailTaskStatus: async (data) => {
    return await request.put({ url: '/pdm/process-plan-detail/updateProcessDetailTaskStatus', data })
  },

  //查询检测项
  getProcedureSchemaItem: async (params) => {
    return await request.get({url: `/pdm/process-plan-detail/getProcedureSchemaItemList`, params  })
  },
  //新增检测项
  saveProcedureSchemaItem: async (data: ProcessPlanDetailVO) => {
    return await request.post({url: '/pdm/process-plan-detail/saveProcedureSchemaItem', data})
  },
  //修改检测项
  updateProcedureSchemaItem: async (data: ProcedureSchemaItemVO) => {
    return await request.put({url: '/pdm/process-plan-detail/updateProcedureSchemaItem', data})
  },
  //删除检测项
  deleteProcedureSchemaItem: async (id: number) => {
    return await request.delete({url: '/pdm/process-plan-detail/deleteProcedureSchemaItem?id=' + id})
  },

  //获取修改单列表
  getChangeOrderList: async (params) => {
    return await request.get({url: '/pdm/process-plan-detail/getChangeOrderList', params})
  },
  //查询工艺更改单
  getChangeOrder: async (id: number) => {
    return await request.get({url: '/pdm/process-plan-detail/getChangeOrderById?id=' + id})
  },
  //删除工艺更改单
  deleteChangeOrderById: async (id: number) => {
    return await request.delete({url: '/pdm/process-plan-detail/deleteChangeOrderById?id=' + id})
  },
  getChangeDetail: async (processChangeId: String) => {
    return await request.get({ url: `/pdm/process-plan-detail/getChangeDetailList?processChangeId=` + processChangeId })
  },
  saveOrderItem: async (data: ProcessChangeVO) => {
    return await request.post({url: '/pdm/process-plan-detail/saveOrderItem', data})
  },
  updateOrderItem: async (data: ProcessChangeVO) => {
    return await request.put({url: '/pdm/process-plan-detail/updateOrderItem', data})
  },
  //删除更改单详情
  deleteOrderDetailById: async (id: number) => {
    return await request.delete({url: '/pdm/process-plan-detail/deleteOrderDetailById?id=' + id})
  },
  //查询更改单动态项
  getChangeDetailItem: async (params) => {
    return await request.get({ url: `/pdm/process-plan-detail/getChangeDetailItemList` , params })
  },
  //新增工艺修改单
  //发起流程
  startOrderChangeInstance: async (data) => {
    return await request.put({ url: `/pdm/process-plan-detail/startProcessChangeInstance`, data })
  },
  //获取更改单进度页数据
  getProcessChangeById: async (id: string) => {
    return await request.get({ url: `/pdm/process-plan-detail/getProcessChangeById?id=` + id })
  },
  getProcessChangeDetailById: async (id: string) => {
    return await request.get({ url: `/pdm/process-plan-detail/getProcessChangeDetailById?id=`+id })
  },
  //根据工步id获取工步自定义属性
  getStepAttributeValList: async (id: string) => {
    return await request.get({ url: `/pdm/process-plan-detail/getStepAttributeValList?objectId=` + id })
  },

}

