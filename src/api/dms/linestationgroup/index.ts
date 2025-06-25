import request from '@/config/axios';

// 产线/工位组 VO
export interface LineStationGroupVO {
  id: string; // id
  code: string; // 编号
  name: string; // 名称
  type: number; // 产线/工位组
  enable: number; // 是否启用
  affiliationDeviceType: string; // 所属类型
  location: string; // 位置
  remark: string; // 备注
}

// 产线/工位组 API
export const LineStationGroupApi = {
  // 查询产线/工位组分页
  getLineStationGroupPage: async (params: any) => {
    return await request.get({ url: `/dms/line-station-group/page`, params });
  },

  // 查询产线/工位组详情
  getLineStationGroup: async (id: number) => {
    return await request.get({ url: `/dms/line-station-group/get?id=` + id });
  },

  // 新增产线/工位组
  createLineStationGroup: async (data: LineStationGroupVO) => {
    return await request.post({ url: `/dms/line-station-group/create`, data });
  },

  // 修改产线/工位组
  updateLineStationGroup: async (data: LineStationGroupVO) => {
    return await request.put({ url: `/dms/line-station-group/update`, data });
  },

  // 删除产线/工位组
  deleteLineStationGroup: async (id: number) => {
    return await request.delete({ url: `/dms/line-station-group/delete?id=` + id });
  },

  // 导出产线/工位组 Excel
  exportLineStationGroup: async (params) => {
    return await request.download({ url: `/dms/line-station-group/export-excel`, params });
  },

  // 获得产线/工位组列表
  getLineStationGroupList: async () => {
    return await request.get({ url: `/dms/line-station-group/list` });
  }
};
