import request from '@/config/axios'

//项目零件目录信息
export interface ProjPartBomVO {
  id: string
  partVersionId: string
  partNumber: string
  partName: string
  partVersion: string
  rootProductId: string
  customizedIndex: string
  reviewedBy: string
  reviewer: string
  deadline: string
  status: number
}

//评估结果信息
export interface FeasibilityResultVO {
  id: string
  projectCode: string
  partVersionId: string
  isPass: number
  reason: string
}

//设备信息
export interface DeviceVO {
  id: string
  code: string
  name: string
  specification: string
}

//刀组信息
export interface CombinationVO {
  id: string
  cutternum: string
  taperTypeName: string
  hiltMark: string
  cutterMark: string
}

//工装信息
export interface MaterialVO {
  id: string
  materialNumber: string
  materialName: string
  materialSpecification: string
}
//量具信息
export interface MeasureVO {
  id: string
  measureCode: string
  measureNumber: string
  measureName: string
  measureSpecification: string
}
//设备采购意见信息
export interface DemandDeviceVO {
  id: string
  projectCode: string
  partVersionId: string
  deviceCode: string
  deviceName: string
  deviceSpecification: string
  description: string
}
//工装采购意见信息
export interface DemandMaterialVO {
  id: string
  projectCode: string
  partVersionId: string
  materiaCode: string
  materiaName: string
  materiaSpecification: string
  description: string
}
//量具采购意见信息
export interface DemandMeasureVO {
  id: string
  projectCode: string
  partVersionId: string
  measureCode: string
  measureName: string
  measureSpecification: string
  description: string
}
//刀具采购意见信息
export interface DemandCutterVO {
  id: string
  projectCode: string
  partVersionId: string
  length: string
  bladeLength: string
  bladeNum: string
  diameter: string
  rrAngle: string
  reducingDiameter: string
  description: string
}
//刀柄采购意见信息
export interface DemandHiltVO {
  id: string
  projectCode: string
  partVersionId: string
  taperTypeId: string
  length: string
  frontEndDiameter: string
  frontEndLength: string
  dipAngle: string
  description: string
}

//检测项
export interface ProcedureSchemaItemVO{
  id:string
  procedureVersionId:string
  procedureId:string
  inspectionItemId:string
  number:bigint
  referenceType:string
  maxValue:string
  minValue:string
  content:string
  judgement:string
  acceptanceQualityLimit:string
  items:[]
}
//单件定额信息
export interface QuotaPerPartVO {
  id: string
  partVersionId: string
  length: string
  width: string
  height: string
  materialDesg: string
  materialCondition: string
  timeQuota: string
}


export const FeasibilityDetailApi = {
  //获取当前项目零件目录列表
  getProjPartBomListByProjectCode: async (params) => {
    return await request.get({ url: `/pdm/feasibility-detail/getProjPartBomListByProjectCode`, params})
  },
  //获取技术评估结果
  getFeasibilityResultInfo: async (params) => {
    return await request.get({ url: `/pdm/feasibility-detail/getFeasibilityResultInfo`, params})
  },
  //新增技术评估结果
  createFeasibilityResult: async (data: FeasibilityResultVO) => {
    return await request.post({url: '/pdm/feasibility-detail/createFeasibilityResult', data})
  },
  //修改技术评估结果
  updateFeasibilityResult: async (data: FeasibilityResultVO) => {
    return await request.put({url: '/pdm/feasibility-detail/updateFeasibilityResult', data})
  },

  //获取零件关联制造资源列表
  getResourceListByPart: async (params) => {
    return await request.get({ url: `/pdm/feasibility-detail/getResourceListByPart`, params})
  },
  //获取零件关联设备列表
  getDeviceListByDeviceIds: async (ids: number[]) => {
    return await request.get({ url: `/pdm/device/getDeviceListByDeviceIds`,
      params: {
        ids: ids.join(',')
      }})
  },
  //获取设备列表
  getDeviceList: async (params) => {
    return await request.post({ url: `/pdm/device/getDeviceList`, params})
  },
  //保存选中资源(设备、刀具、工装)
  saveSelectedResource: async (params) => {
    return await request.post({url: `/pdm/feasibility-detail/saveSelectedResource`, params})
  },
  //删除选中资源(设备、刀具、工装)
  deleteSelectedResource: async (params) => {
    return await request.post({url: `/pdm/feasibility-detail/deleteSelectedResource`, params})
  },
  //更改设备预估工时
  updateProcessingTime: async (params) => {
    return await request.post({url: `/pdm/feasibility-detail/updateProcessingTime`, params})
  },

  //获取工装列表
  getMaterialList: async (params) => {
    return await request.post({ url: `/pdm/material/getMaterialList`, params})
  },
  //获取零件关联工装列表
  getMaterialListByMaterialIds: async (ids: number[]) => {
    return await request.get({ url: `/pdm/material/getMaterialListByMaterialIds`,
      params: {
        ids: ids.join(',')
      }})
  },
  //获取刀组列表
  getCombinationList: async (params) => {
    return await request.get({ url: `/pdm/combination/getCombinationList`, params})
  },
  //获取零件关联刀组列表
  getCombinationListByCombinationIds: async (ids: number[]) => {
    return await request.get({ url: `/pdm/combination/getCombinationListByCombinationIds`,
      params: {
        ids: ids.join(',')
      }})
  },

  //获取零件关联设备采购意见列表
  getDemandDeviceList: async (params) => {
    return await request.get({ url: `/pdm/feasibility-detail/getDemandDeviceList`, params})
  },
  //查询设备采购意见
  getDemandDevice: async (id: number) => {
    return await request.get({url: '/pdm/feasibility-detail/getDemandDevice?id=' + id})
  },
  //新增设备采购意见
  createDemandDevice: async (data: DemandDeviceVO) => {
    return await request.post({url: '/pdm/feasibility-detail/createDemandDevice', data})
  },
  //修改设备采购意见
  updateDemandDevice: async (data: DemandDeviceVO) => {
    return await request.put({url: '/pdm/feasibility-detail/updateDemandDevice', data})
  },
  //删除设备采购意见
  deleteDemandDevice: async (id: number) => {
    return await request.delete({url: '/pdm/feasibility-detail/deleteDemandDevice?id=' + id})
  },

  //获取零件关联工装采购意见列表
  getDemandMaterialList: async (params) => {
    return await request.get({ url: `/pdm/feasibility-detail/getDemandMaterialList`, params})
  },
  //查询工装采购意见
  getDemandMaterial: async (id: number) => {
    return await request.get({url: '/pdm/feasibility-detail/getDemandMaterial?id=' + id})
  },
  //新增工装采购意见
  createDemandMaterial: async (data: DemandDeviceVO) => {
    return await request.post({url: '/pdm/feasibility-detail/createDemandMaterial', data})
  },
  //修改工装采购意见
  updateDemandMaterial: async (data: DemandDeviceVO) => {
    return await request.put({url: '/pdm/feasibility-detail/updateDemandMaterial', data})
  },
  //删除工装采购意见
  deleteDemandMaterial: async (id: number) => {
    return await request.delete({url: '/pdm/feasibility-detail/deleteDemandMaterial?id=' + id})
  },
//
  //获取零件关联量具采购意见列表
  getDemandMeasureList: async (params) => {
    return await request.get({ url: `/pdm/feasibility-detail/getDemandMeasureList`, params})
  },
  //查询量具采购意见
  getDemandMeasure: async (id: number) => {
    return await request.get({url: '/pdm/feasibility-detail/getDemandMeasure?id=' + id})
  },
  //新增量具采购意见
  createDemandMeasure: async (data: DemandDeviceVO) => {
    return await request.post({url: '/pdm/feasibility-detail/createDemandMeasure', data})
  },
  //修改量具采购意见
  updateDemandMeasure: async (data: DemandDeviceVO) => {
    return await request.put({url: '/pdm/feasibility-detail/updateDemandMeasure', data})
  },
  //删除量具采购意见
  deleteDemandMeasure: async (id: number) => {
    return await request.delete({url: '/pdm/feasibility-detail/deleteDemandMeasure?id=' + id})
  },
  //
  //获取零件关联刀具采购意见列表
  getDemandCutterList: async (params) => {
    return await request.get({ url: `/pdm/feasibility-detail/getDemandCutterList`, params})
  },
  //查询刀具采购意见
  getDemandCutter: async (id: number) => {
    return await request.get({url: '/pdm/feasibility-detail/getDemandCutter?id=' + id})
  },
  //新增刀具采购意见
  createDemandCutter: async (data: DemandCutterVO) => {
    return await request.post({url: '/pdm/feasibility-detail/createDemandCutter', data})
  },
  //修改刀具采购意见
  updateDemandCutter: async (data: DemandCutterVO) => {
    return await request.put({url: '/pdm/feasibility-detail/updateDemandCutter', data})
  },
  //删除刀具采购意见
  deleteDemandCutter: async (id: number) => {
    return await request.delete({url: '/pdm/feasibility-detail/deleteDemandCutter?id=' + id})
  },

  //获取零件关联刀柄采购意见列表
  getDemandHiltList: async (params) => {
    return await request.get({ url: `/pdm/feasibility-detail/getDemandHiltList`, params})
  },
  //查询刀柄采购意见
  getDemandHilt: async (id: number) => {
    return await request.get({url: '/pdm/feasibility-detail/getDemandHilt?id=' + id})
  },
  //新增刀柄采购意见
  createDemandHilt: async (data: DemandHiltVO) => {
    return await request.post({url: '/pdm/feasibility-detail/createDemandHilt', data})
  },
  //修改刀柄采购意见
  updateDemandHilt: async (data: DemandHiltVO) => {
    return await request.put({url: '/pdm/feasibility-detail/updateDemandHilt', data})
  },
  //删除刀柄采购意见
  deleteDemandHilt: async (id: number) => {
    return await request.delete({url: '/pdm/feasibility-detail/deleteDemandHilt?id=' + id})
  },

  //获取零件关联量具采购意见列表
  getDemandMeasureList: async (params) => {
    return await request.get({ url: `/pdm/feasibility-detail/getDemandMeasureList`, params})
  },

  //获取单件定额信息
  getQuotaPerPartInfo: async (params) => {
    return await request.get({ url: `/pdm/feasibility-detail/getQuotaPerPartInfo`, params})
  },
  //新增单件定额
  createQuotaPerPart: async (data: QuotaPerPartVO) => {
    return await request.post({url: '/pdm/feasibility-detail/createQuotaPerPart', data})
  },
  //修改单件定额
  updateQuotaPerPart: async (data: QuotaPerPartVO) => {
    return await request.put({url: '/pdm/feasibility-detail/updateQuotaPerPart', data})
  },

  //更新技术评估任务状态为2评估中
  updateFeasibilityTaskStatus: async (data) => {
    return await request.put({url: '/pdm/feasibility-detail/updateFeasibilityTaskStatus', data})
  },

  //发起流程
  startProcessInstance: async (data) => {
    return await request.put({ url: `/pdm/feasibility-detail/startProcessInstance`, data })
  },

  //获取零件技术评估详细信息
  getPartDetailByTaskId: async (id: number) => {
    return await request.get({ url: `/pdm/feasibility-detail/getPartDetailByTaskId?id=` + id })
  },

  //获取当前零件目录列表
  getPartListByProjectCode: async (params) => {
    return await request.get({ url: `/pdm/feasibility-detail-new/getPartListByProjectCode`, params})
  },

  //获取零件技术评估详细信息
  getPartDetailByTaskIdNew: async (id: number) => {
    return await request.get({ url: `/pdm/feasibility-detail-new/getPartDetailByTaskId?id=` + id })
  },
}
