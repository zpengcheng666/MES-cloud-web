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
  materialId: string
  materialDesg: string
  materialCode: string

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

//工艺方案
export interface ProcessPlanVO {
  id: string
  processCode: string
  isValid: string
  processVersion: string
  partVersionId: string
  reviewedBy: string
  reviewer: string
  deadline: string
  status: string
  askMessageId: string
  processVersionId: string
  processInstanceId: string
  approvalStatus: string
  cutternum: string
}

//工艺规程
export interface ProcessRegulationsVO {
  id: string
  name: string
  processCode: string
  partVersionId: string
  processName: string
  processVersion: string
  property: string
  description: string
  processRegulations: string
  processRoute: string
  processingTime: string
  singleQuatity: string
  singleSize: string
  groupSize: string
  processRouteName: string
  processRouteDetailDOList: string
  processRouteList: []
  materialId: string
  materialDesg: string
  materialCode: string
  materialName: string
  materNumber: string
  materialSpecification: string
  processVersionId: string
  processId: string
  processType: string

}
export const ProcessPlanApi = {

  //获取工艺方案信息
  getProcess: async (id: number) => {
    return await request.get({ url: `/pdm/process-detail/getProcessInformation?id=` + id })
  },
  //新增工艺方案信息
  createProcess: async (data: ProcessRegulationsVO) => {
    return await request.post({ url: '/pdm/process-detail/createProcessInformation', data })
  },
  //更改工艺方案信息
  updateProcess: async (data: ProcessRegulationsVO) => {
    return await request.put({ url: '/pdm/process-detail/updateProcessInformation', data })
  },
  //删除工艺方案信息
  deleteProcess: async (data: ProcessRegulationsVO) => {
    return await request.delete({ url: '/pdm/process-detail/deleteProcessInformation', data })
  },
  //获得加工路线信息
  getProcessRouteList: async (params) => {
    return await request.get({ url: `/pdm/process-detail/getProcessRouteDetailList`, params })
  },
  //获取当前项目零件目录列表
  getProjPartBomListByProjectCode: async (params) => {
    return await request.get({ url: `/pdm/process-detail/getProjPartBomListByProjectCode`, params })
  },
  //获取当前项目零件目录结构树
  getProjPartBomTreeList: async (params) => {
    return await request.get({ url: `/pdm/process-detail/getProjPartBomTreeList`, params })
  },
  //获取单个零件工艺方案结构树
  getProjPartBomTreeByPartVersionId: async (params) => {
    return await request.get({ url: `/pdm/process-detail/getProjPartBomTreeByPartVersionId`, params })
  },
  //获取零件工艺方案详细信息
  getPartDetailByTaskId: async (id: number) => {
    return await request.get({ url: `/pdm/process-detail/getPartDetailByTaskId?id=` + id })
  },
  //获取技术评估结果
  getFeasibilityResultInfo: async (params) => {
    return await request.get({ url: `/pdm/process-detail/getFeasibilityResultInfo`, params })
  },
  //新增技术评估结果
  createFeasibilityResult: async (data: FeasibilityResultVO) => {
    return await request.post({ url: '/pdm/process-detail/createFeasibilityResult', data })
  },
  //修改技术评估结果
  updateFeasibilityResult: async (data: FeasibilityResultVO) => {
    return await request.put({ url: '/pdm/process-detail/updateFeasibilityResult', data })
  },

  //获取零件关联制造资源列表
  getResourceListByPart: async (params) => {
    return await request.get({ url: `/pdm/process-detail/getResourceListByPart`, params })
  },
  //获取零件关联设备列表
  getDeviceListByDeviceIds: async (ids: number[]) => {
    return await request.get({
      url: `/pdm/device/getDeviceListByDeviceIds`,
      params: {
        ids: ids.join(',')
      }
    })
  },
  //依据产线/单机id,获得所有设备类型
  getDeviceTypeListByLineType: async (ids: number[]) => {
    return await request.get({
      url: `/pdm/device/getDeviceTypeListByLineType`,
      params: {
        ids: ids.join(',')
      }
    })
  },
  //获取设备列表
  getDeviceList: async (params) => {
    return await request.get({ url: `/pdm/device/getDeviceList`, params })
  },
  //获取产线或单机设备列表
  getProductionLineDeviceList: async (params) => {
    return await request.post({ url: `/pdm/device/getProductionLineDeviceList`, params })
  },
  //保存选中资源(设备、刀具、工装)
  saveSelectedResource: async (params) => {
    return await request.post({ url: `/pdm/process-detail/saveSelectedResource`, params })
  },
  //删除选中资源(设备、刀具、工装)
  deleteSelectedResource: async (params) => {
    return await request.post({ url: `/pdm/process-detail/deleteSelectedResource`, params })
  },

  //获取工装或材料列表
  getMaterialList: async (params) => {
    return await request.post({ url: `/pdm/material/getMaterialList`, params })
  },
  //获取零件关联工装列表
  getMaterialListByMaterialIds: async (ids: number[]) => {
    return await request.get({
      url: `/pdm/material/getMaterialListByMaterialIds`,
      params: {
        ids: ids.join(',')
      }
    })
  },

  //获取刀组列表
  getCombinationList: async (params) => {
    return await request.get({ url: `/pdm/combination/getCombinationList`, params })
  },
  //获取零件关联刀组列表
  getCombinationListByCombinationIds: async (ids: number[]) => {
    return await request.get({
      url: `/pdm/combination/getCombinationListByCombinationIds`,
      params: {
        ids: ids.join(',')
      }
    })
  },

  //获取单件定额信息
  getQuotaPerPartInfo: async (params) => {
    return await request.get({ url: `/pdm/process-detail/getQuotaPerPartInfo`, params })
  },
  //新增单件定额
  createQuotaPerPart: async (data: QuotaPerPartVO) => {
    return await request.post({ url: '/pdm/process-detail/createQuotaPerPart', data })
  },
  //修改单件定额
  updateQuotaPerPart: async (data: QuotaPerPartVO) => {
    return await request.put({ url: '/pdm/process-detail/updateQuotaPerPart', data })
  },

  //更新技术评估任务状态为2评估中
  updateFeasibilityTaskStatus: async (data) => {
    return await request.put({ url: '/pdm/process-detail/updateFeasibilityTaskStatus', data })
  },

  //获得零件下已定版工艺规程数量
  getProcessCountByPartVersionId: async (partVersionId: number, processCondition: number) => {
    return await request.get({ url: `/pdm/process-detail/getProcessCountByPartVersionId?partVersionId=` + partVersionId +`&processCondition=`+processCondition })
  },
  //获得零件下已定版工艺规程列表
  getProcessListByPartVersionId: async (partVersionId: number, processCondition: number) => {
    return await request.get({ url: `/pdm/process-detail/getProcessListByPartVersionId?partVersionId=` + partVersionId +`&processCondition=`+processCondition })
  },
  //保存选中的零件已定版工艺规程
  saveSelectedProcess: async (params) => {
    return await request.post({ url: `/pdm/process-detail/saveSelectedProcess`, params })
  },
  //零件已定版工艺规程升版
  saveProcessUp: async (params) => {
    return await request.post({ url: `/pdm/process-detail/saveProcessUp`, params })
  },
  //发起流程
  startProcessInstance: async (data) => {
    return await request.put({ url: `/pdm/process-detail/startProcessInstance`, data })
  },

  //获取未关闭项目零件目录结构树
  getProjPartBomTreeListNew: async (params) => {
    return await request.get({ url: `/pdm/process-detail-new/getProjPartBomTreeListNew`, params })
  },
  //获取零件工艺方案详细信息
  getPartDetailByTaskIdNew: async (id: number) => {
    return await request.get({ url: `/pdm/process-detail-new/getPartDetailByTaskIdNew?id=` + id })
  },

  // //主页获取零件工艺方案
  getPartDetailNewHome: async (params) => {
    return await request.get({ url: `/pdm/process-detail-new/getPartDetailNewHome`,params })
  },
}
