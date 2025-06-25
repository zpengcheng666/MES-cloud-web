import request from '@/config/axios'

// 检验单 VO
export interface InspectionSheetVO {
  id: string // 主键
  sheetName: string // 检验单名称
  sheetNo: string // 检验单号
  recordNumber: string // 生产单号
  status: number // 质检状态  0待派工1待检验2检验中3检验完成
  header: string // 负责人
  beginTime: Date // 开始时间
  endTime: Date // 结束时间
}

// 检测结果 VO
export interface InspectionResultVO {
  materialId : string,
  inspectionSheetSchemeMaterialId: string,
  inspectionSheetSchemeId : string,
  content: string,
  inspectionResult: number
  records: [] // 检验记录集合
}

// 检验单 API
export const InspectionSheetApi = {
  // 查询检验单分页
  getInspectionSheetPage: async (params: any) => {
    return await request.get({ url: `/qms/inspection-sheet/page`, params })
  },

  // 查询检验单详情
  getInspectionSheet: async (id: number) => {
    return await request.get({ url: `/qms/inspection-sheet/get?id=` + id })
  },

  // 新增检验单
  createInspectionSheet: async (data: InspectionSheetVO) => {
    return await request.post({ url: `/qms/inspection-sheet/create`, data })
  },

  // 新增检验单
  createInspectionSheetSelfCheck: async (data: InspectionSheetVO) => {
    return await request.post({ url: `/qms/inspection-sheet/self-inspection/create`, data })
  },

  // 新增检验单 （检验任务）
  createInspectionSheetTask: async (data: InspectionSheetVO) => {
    return await request.post({ url: `/qms/inspection-sheet/task/create`, data })
  },

  // 修改检验单
  updateInspectionSheet: async (data: InspectionSheetVO) => {
    return await request.put({ url: `/qms/inspection-sheet/update`, data })
  },

  // 删除检验单
  deleteInspectionSheet: async (id: number) => {
    return await request.delete({ url: `/qms/inspection-sheet/delete?id=` + id })
  },

  // 导出检验单 Excel
  exportInspectionSheet: async (params) => {
    return await request.download({ url: `/qms/inspection-sheet/export-excel`, params })
  },

  // 查询检验单详情（检验任务产品）
  getInspectionSheetInfo: async (data) => {
    return await request.put({ url: `/qms/inspection-sheet/get-inspection-sheet-info`, data })
  },

  // 查询检验单详情（检验任务）
  getInspectionSheetInfoBySchemeId: async (id: string) => {
    return await request.get({ url: `/qms/inspection-sheet/get-inspection-sheet-info-by-scheme-id?id=` +id })
  },

  // 检验任务id 查询检验单
  getInspectionSheetBySchemeId: async (id: string) => {
    return await request.get({ url: `/qms/inspection-sheet/get-inspection-sheet-by-scheme-id?id=` +id })
  },

  // 检验任务id 查询检验单
  outBoundInspection: async (data) => {
    return await request.post({ url: `/qms/inspection-sheet/outBound`, data })
  },

  // 检验任务
  // 查询检验单分页
  getInspectionSheetTaskPage: async (params: any) => {
    return await request.get({ url: `/qms/inspection-sheet/task/page`, params })
  },

  getInspectionClaimTaskList: async () => {
    return await request.get({ url: `/qms/inspection-sheet/task/claim/list` })
  },

  getInspectionTaskList: async () => {
    return await request.get({ url: `/qms/inspection-sheet/task/inspection/list` })
  },

  getUnqualifiedTaskList: async () => {
    return await request.get({ url: `/qms/inspection-sheet/task/unqualified/list` })
  },

  // ==================== 子表（检验单任务） ====================
  // 查询检验单方案任务计划详情
  getInspectionSheetScheme: async (id: string) => {
    return await request.get({ url: `/qms/inspection-sheet-scheme/get?id=` + id })
  },

  // 获得检验单方案任务计划分页
  getInspectionSheetSchemePage: async (params) => {
    return await request.get({ url: `/qms/inspection-sheet/inspection-sheet-scheme/page`, params })
  },

  // 分配检验人员
  updateInspectionSheetSchemeAssignment: async (data) => {
    return await request.put({ url: `/qms/inspection-sheet-scheme/updateAssign`, data })
  },

  // 自检完成分配检验人员
  updateInspectionSheetSchemeSelfAssignment: async (data) => {
    return await request.put({ url: `/qms/inspection-sheet-scheme/updateSelfAssign`, data })
  },

  // 专检人员领取任务
  updateInspectionSheetSchemeClaim: async (id: string) => {
    return await request.put({
      url: '/qms/inspection-sheet-scheme/updateSelfSchemeClaim',
      data: {
        id: id
      }
    })
  },

  // 检验任务 检验获取检验单信息
  getInspectionSheetSchemeInfo: async (id: string) => {
    return await request.get({ url: `/qms/inspection-sheet-scheme/get-sheet-scheme-info-by-id?id=` + id })
  },

  // 更新检验结果
  updateInspectionSheetSchemeResult: async (data: any) => {
    return await request.post({ url: `/qms/inspection-sheet-scheme/update-inspection-scheme-result`, data })
  },

  // ==================== 子表（检验单产品） ====================
  // 查询检验单产品分页
  getInspectionSheetSchemeMaterialPage: async (params: any) => {
    return await request.get({ url: `/qms/inspection-sheet-scheme-material/page`, params })
  },

  // 查询检验单产品分页 (呼叫物料)
  getInspectionSheetSchemeMaterialTaskPage: async (params: any) => {
    return await request.get({ url: `/qms/inspection-sheet-scheme-material/task/page`, params })
  },

  // 检验任务id获取检验产品集合
  getMaterialListBySchemeId: async (id: string) => {
    return await request.get({ url: `/qms/inspection-sheet-scheme-material/list-by-scheme-id?schemeId=` + id })
  },

  // 更新产品检验结果
  updateInspectionSheetMaterialResult: async (data: InspectionSheetVO) => {
    return await request.post({ url: `/qms/inspection-sheet-scheme-material/update-inspection-material-result`, data })
  },

  // 物料编码和批次号查询检验单信息
  getInspectionSheetInfoMaterial: async (params: any) => {
    return await request.get({ url: `/qms/inspection-sheet/get-inspection-sheet-info-material`, params })
  },

  // 检验任务id获取不合格品集合
  getUnqualifiedMaterialListBySchemeId: async (id: string) => {
    return await request.get({ url: `/qms/inspection-sheet-scheme-material/list-unqualified-material-by-scheme-id?id=` + id })
  },

  // 检验任务id获取不合格品集合
  getUnqualifiedMaterialDefectiveListBySchemeId: async (id: string) => {
    return await request.get({ url: `/qms/inspection-sheet-scheme-material/list-unqualified-material-defective-by-scheme-id?id=` + id })
  },


  // ==================== 子表（检验记录） ====================
  getInspectionSheetRecordListByMaterialId: async (id: string) => {
    return await request.get({ url: `/qms/inspection-sheet-record/list-record-by-material-id?id=` + id })
  },

  // 产品检验更新检验记录
  updateInspectionSheetRecord: async (data: InspectionSheetVO) => {
    return await request.post({ url: `/qms/inspection-sheet-record/update-inspection-record`, data })
  },
  // 暂存
  updateInspectionSheetRecordTemp: async (data: InspectionSheetVO) => {
    return await request.post({ url: `/qms/inspection-sheet-record//update-inspection-record-temp`, data })
  },

  // 产品检验
  // 不合格提交并审核
  updateAndAuditInspectionSheetRecord: async (data) => {
    return await request.post({ url: `/qms/inspection-sheet-record/update-inspection-record-and-audit`, data })
  },

  // ==================== 生产任务（检验信息录入） ====================

  // 获得检验任务
  getInspectionSheetSchemeList4Terminal: async (params) => {
    return await request.get({ url: `/qms/inspection-sheet-scheme/terminal/list`, params })
  },

  // 获得检验任务
  getInspectionSheetSchemeListByBarCode4Terminal: async (params) => {
    return await request.get({ url: `/qms/inspection-sheet-scheme/terminal/scanBarCode`, params })
  },

  // 获得检验任务
  validInspectionSchemeBarCode: async (params) => {
    return await request.get({ url: `/qms/inspection-sheet-scheme/terminal/validInspectionSchemeBarCode`, params })
  },

  // 获得检验任务
  getInspectionSheetRecordList4Terminal: async (params) => {
    return await request.get({ url: `/qms/inspection-sheet-record/terminal/list`, params })
  },

  // 产品检验更新检验记录
  updateInspectionSheetRecordTerminal: async (data: InspectionSheetVO) => {
    return await request.post({ url: `/qms/inspection-sheet-record/update-inspection-record-terminal`, data })
  },

  // 工序检验任务开始
  updateMcsRecordBegin: async (data) => {
    return await request.post({ url: `/qms/inspection-sheet-record/terminal/updateMcsRecordBegin`, data })
  },
}
