import request from '@/config/axios'

// 编码规则配置 VO
export interface EncodingRuleVO {
  id: string // ID
  name: string // 名称
  classificationId: string // 编码分类
  status: number // 启用状态  1启用 0未启用
  totalBitNumber: number // 总位数
}

// 编码规则配置 API
export const EncodingRuleApi = {
  // 查询编码规则配置分页
  getEncodingRulePage: async (params: any) => {
    return await request.get({ url: `/mcc/encoding-rule/page`, params })
  },

  // 查询编码规则配置详情
  getEncodingRule: async (id: number) => {
    return await request.get({ url: `/mcc/encoding-rule/get?id=` + id })
  },

  // 新增编码规则配置
  createEncodingRule: async (data: EncodingRuleVO) => {
    return await request.post({ url: `/mcc/encoding-rule/create`, data })
  },

  // 修改编码规则配置
  updateEncodingRule: async (data: EncodingRuleVO) => {
    return await request.put({ url: `/mcc/encoding-rule/update`, data })
  },

  // 删除编码规则配置
  deleteEncodingRule: async (id: number) => {
    return await request.delete({ url: `/mcc/encoding-rule/delete?id=` + id })
  },

  // 导出编码规则配置 Excel
  exportEncodingRule: async (params) => {
    return await request.download({ url: `/mcc/encoding-rule/export-excel`, params })
  },

// ==================== 子表（编码规则配置详情） ====================

  // 获得编码规则配置详情列表
  getEncodingRuleDetailListByEncodingRuleId: async (encodingRuleId) => {
    return await request.get({ url: `/mcc/encoding-rule/encoding-rule-detail/list-by-encoding-rule-id?encodingRuleId=` + encodingRuleId })
  },
    //获取规则详情预览
    getRuleDetail: async (encodingRuleId) => {
        return await request.get({ url: `/mcc/encoding-rule/getRuleDetail?encodingRuleId=` + encodingRuleId })
    },

    //获取编码规则集合
    getEncodingRuleList: async (params: any) => {
        return await request.get({ url: `/mcc/encoding-rule/list`, params })
    },
    //创建编码
    createCode: async (data: EncodingRuleVO) => {
        return await request.put({ url: `/mcc/encoding-rule/createCode`, data })
    },
    updateCode: async (data: any) => {
        return await request.put({ url: `/mcc/encoding-rule/updateCode`, data })
    },


}
