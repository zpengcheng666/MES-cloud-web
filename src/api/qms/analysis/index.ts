import request from '@/config/axios'

// 质量分析 VO
export interface AnalysisVO {
    id: string // 主键
    name: string // 检测工具名称
}

// 追质量分析API
export const AnalysisApi = {
    //质检数量统计
    getAnalysisNumber: async (params: any) => {
        return await request.get({url: `/qms/analysis/getAnalysisNumber`, params})
    },
    // 获取不同批次产品的检验合格率
    getBatchAnalysis: async (params: any) => {
        return await request.get({url: `/qms/analysis/getBatchAnalysis`, params})
    },
    //获取缺陷
    getDefectives: async (params: any) => {
        return await request.get({url: `/qms/analysis/getDefectives`, params})
    },
    //获取检测项的合格率
    getItemAnalysis: async (params: any) => {
        return await request.get({url: `/qms/analysis/getItemAnalysis`, params})
    },
    //报废返修率统计
    getScrapAndRepair: async (params: any) => {
        return await request.get({url: `/qms/analysis/getScrapAndRepair`, params})
    },
    //工人生产质量统计
    getWorkerAnalysis: async (params: any) => {
        return await request.get({url: `/qms/analysis/getWorkerAnalysis`, params})
    },
    //工序质检统计
    getProcessAnalysis: async (params: any) => {
        return await request.get({url: `/qms/analysis/getProcessAnalysis`, params})
    },
    // 检验工时统计
    getWorkerHoursAnalysis: async (params: any) => {
      return await request.get({url: `/qms/analysis/getWorkerHoursAnalysis`, params})
    },
}
