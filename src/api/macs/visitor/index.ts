import request from '@/config/axios'
import qs from "qs";

// 申请角色 VO
export interface VisitorVO {
  id: string // 主键id
  code: string // 编号/卡号
  idCard: string // 身份证号
  name: string // 真实姓名
  avatar: string // 头像
  facialFeature: byte[] // 人脸特征
  fingerprint: byte[] // 指纹特征
  sex: number // 性别(0-默认未知,1-男,2-女)
  phone: string // 电话
  status: number // 状态(1-正常,2-冻结)
  deleted: boolean // 删除状态(0-正常,1-已删除)
  organization: string // 公司/组织
  department: string // 部门
  regionId: string // 当前所在区域
  createBy: string // 创建人
  updateBy: string // 更新人
}

// 申请角色 API
export const VisitorApi = {
  // 查询申请角色分页
  getVisitorPage: async (params: any) => {
    return await request.get({ url: `/macs/visitor/page`, params })
  },

  // 查询申请角色详情
  getVisitor: async (id: number) => {
    return await request.get({ url: `/macs/visitor/get?id=` + id })
  },

  // 新增申请角色
  createVisitor: async (data: VisitorVO) => {
    return await request.post({ url: `/macs/visitor/create`, data })
  },

  // 修改申请角色
  updateVisitor: async (data: VisitorVO) => {
    return await request.put({ url: `/macs/visitor/update`, data })
  },

  // 删除申请角色
  deleteVisitor: async (id: number) => {
    return await request.delete({ url: `/macs/visitor/delete?id=` + id })
  },

  // 删除申请角色
  visitorDeparture: async (id: number) => {
    return await request.post({ url: `/macs/visitor/visitorDeparture`, data:{id: id} })
  },

  // 导出申请角色 Excel
  exportVisitor: async (params) => {
    return await request.download({ url: `/macs/visitor/export-excel`, params })
  },

  getAccessRecords: async (params) => {
    let url = `/macs/access-records/getAccessRecords?visitorId=` + params.visitorId;
    url = url + "&" +qs.stringify({'actions':params["actions"]}, { arrayFormat: 'repeat' })
    return await request.get({ url })
  },

  getPageByVisitor: async (params) => {
    return await request.get({ url: `/macs/visitor-region/getPageByVisitor`, params })
  },
}
