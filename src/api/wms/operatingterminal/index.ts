import request from '@/config/axios';

// 搬运任务 VO
export interface WaitInWarehouseDetailVO {
  id: string; // ID
  materialNumber: string; // 物料编号
  batchNumber: string; // 批号
  bindPositionCode: string; // 绑定库位
  bindType: string; // 绑定类型
  quantity: number; // 数量
}


export const waitInWarehouseDetailColumns = [
  {
    prop: 'orderType',
    label: '订单类型',
    width: '15%',
    align: 'center'
  },
  {
    prop: 'batchNumber',
    label: '物料批次号',
    width: '25%',
    align: 'center'
  },
  {
    prop: 'materialNumber',
    label: '物料编号',
    width: '30%',
    align: 'center'
  },
  {
    prop: 'chooseBarCode',
    label: '物料条码',
    width: '20%',
    align: 'center'
  },
  {
    prop: 'quantity',
    label: '数量',
    width: '10%',
    align: 'center'
  }
];

export const waitOrderDetailColumns = [
  {
    prop: 'orderType',
    label: '订单类型',
    width: '15%',
    align: 'center'
  },
  {
    prop: 'batchNumber',
    label: '物料批次号',
    width: '25%',
    align: 'center'
  },
  {
    prop: 'materialNumber',
    label: '物料编号',
    width: '30%',
    align: 'center'
  },
  {
    prop: 'chooseBarCode',
    label: '物料条码',
    width: '20%',
    align: 'center'
  },
  {
    prop: 'quantity',
    label: '数量',
    width: '10%',
    align: 'center'
  }
];

// 搬运任务 API
export const OperatingtTerminalApi = {
  // 查询搬运任务分页
  getWaitOrderDetailList: async (areaCode: string) => {
    return await request.get({ url: `/wms/operating-terminal/getWaitOrderDetailList?areaCode=${areaCode}` });
  },
  //根据查询库位信息
  getWarehouseLocation: async (areaCode: any) => {
    const params = {
      areaCode: areaCode
    };
    return await request.get({ url: `/wms/operating-terminal/getWarehouseLocation`, params });
  },
  // 根据库位查托盘信息
  getTrayByLocation: async (locationId: any) => {
    const params = {
      locationId: locationId
    };
    return await request.get({ url: `/wms/operating-terminal/getMaterialStockByLocationId`, params });
  },
  // 根据库位编码查物料信息
  getMaterialStockByLocationCode: async (locationCode: any) => {
    const params = {
      locationCode: locationCode
    };
    return await request.get({ url: `/wms/operating-terminal/getMaterialStockByLocationCode`, params });
  },
  // 查询托盘上绑定的物料信息
  getMaterialStockByTray: async (data: any) => {
    return await request.post({ url: `/wms/operating-terminal/getMaterialStockByTray`, data });
  },
  //  查询空托盘信息
  getEmptyTrayList: async () => {
    return await request.get({ url: `/wms/operating-terminal/getEmptyTrayList` });
  },
  //  查询此仓库出库详情单上的物料
  getMaterialStockByOutWarehouseDetail: async (areaCode: string) => {
    return await request.get({ url: `/wms/operating-terminal/getMaterialStockByOutWarehouseDetail?areaCode=` + areaCode });
  },

  //  查询绑定此接驳库位所在库区的的托盘
  getTrayListByLocationId: async (locationId: string) => {
    return await request.get({ url: `/wms/operating-terminal/getTrayListByLocationId?locationId=` + locationId });
  },

  //  呼叫空托盘
  getCallEmpryTrayList: async (areaCode: any) => {
    return await request.get({ url: `/wms/operating-terminal/getCallEmpryTrayList?areaCode=` + areaCode });
  },
  // 呼叫AGV
  callTray: async (data: any) => {
    return await request.post({ url: `/wms/operating-terminal/call-tray`, data });
  },

  //托盘入库(上架)操作
  available: async (sourceLocationCode) => {
    return await request.post({ url: `/wms/operating-terminal/available`, data: { sourceLocationCode } });
  },
  //托盘下架操作
  palletUnloading: async (materialStockId, startLocationId, targetLocationCode) => {
    return await request.post({ url: `/wms/operating-terminal/palletUnloading`, data: { materialStockId, startLocationId, targetLocationCode } });
  },

  //通过库区查询仓库出库单和单上物料
  getOutWarehouseDetailAndStockInfo: async (areaCode: any) => {
    return await request.get({ url: `/wms/operating-terminal/getOutWarehouseDetailAndStockInfo?areaCode=` + areaCode });
  },
  //当前仓库下的托盘和工装
  getMaterialStockByArea: async (areaCode: any) => {
    return await request.get({ url: `/wms/operating-terminal/getMaterialStockByArea?areaCode=` + areaCode });
  },

  //获取仓库下存储库区的托盘和工装
  getMaterialStockByAreaAndAreaTypeEq1: async (areaCode: any) => {
    return await request.get({ url: `/wms/operating-terminal/getMaterialStockByAreaAndAreaTypeEq1?areaCode=` + areaCode });
  },

  //改变绑定托盘----拣选页面
  changeBindTray: async (materialId: string, trayId: string, orderId: any) => {
    const data = {
      materialId: materialId,
      trayId: trayId,
      orderId: orderId
    };
    return await request.post({ url: `/wms/operating-terminal/changeBindTray`, data });
  },

  //通过设备Id获取工序任务  1811679144340156418
  getProcessTaskByDeviceId: async (deviceId: any) => {
    const params = {
      workstationId: deviceId
    };
    return await request.get({ url: `/mcs/terminal/getBatchPlan`, params });
  },
  // 根据批次任务id 获取工序详情
  getProcessByRecordId: async (recordId: any) => {
    const params = {
      recordId: recordId
    };
    return await request.get({ url: `/mcs/terminal/getProcess`, params });
  },
  //根据任务(批次)id 查询详细任务(零件)
  getBatchDetailByRecordId: async (recordId: any) => {
    const params = {
      recordId: recordId
    };
    return await request.get({ url: `/mcs/terminal/getBatchDetail`, params });
  },
  //根据任务(批次)id,工位/产线id 查询物料需求
  getBatchResourceByRecordId: async (recordId: any, workstationId: any) => {
    const params = {
      recordId: recordId,
      workstationId: workstationId
    };
    return await request.get({ url: `/mcs/terminal/getBatchResourceByRecordId`, params });
  },
  // 批次任务开始
  batchRecordStart: async (data: any) => {
    return await request.post({ url: `/mcs/terminal/batchRecordStart`, data });
  },
  //批次 任务完工
  batchRecordEnd: async (data: any) => {
    return await request.post({ url: `/mcs/terminal/batchRecordEnd`, data });
  },
  //通过库位id列表获得库位信息
  getWarehouseLocationListByIds: async (ids: any) => {
    const params = {
      ids: ids
    };
    return await request.get({ url: `/wms/operating-terminal/getWarehouseLocationListByIds?ids=${ids}` });
  },

  //根据工件查询绑定的工装
  getClampByMaterialBarCode: async (materialBarCode: any) => {
    const params = {
      materialBarCode: materialBarCode
    };
    return await request.get({ url: `/wms/operating-terminal/getClampByMaterialBarCode`, params });
  },

  //改变绑定托盘 ====装卸工位页面
  changeBindTrayLoadANDUnload: async (data) => {
    return await request.post({ url: `/wms/operating-terminal/changeBindTrayLoadANDUnload`, data });
  },

  //刀具待出库单信息列表
  getCutterWaitOrderDetailList: async (areaCode: string) => {
    return await request.get({ url: `/wms/operating-terminal/getCutterWaitOrderDetailList?areaCode=${areaCode}` });
  },

  
  //刀具待出库单信息列表
  getCutterWaitOutOrderDetailListByLocationCode: async (locationCode: string) => {
    const params = {
      locationCode: locationCode
    };
    return await request.get({ url: `/wms/operating-terminal/getCutterWaitOutOrderDetailList`, params });
  },

  //刀具所有入库单信息列表
  getCutterWaitInOrderDetailListByLocationCode: async (locationCode: string) => {
    const params = {
      locationCode: locationCode
    };
    return await request.get({ url: `/wms/operating-terminal/getCutterWaitInOrderDetailList`, params });
  },

  // 绑定刀具到托盘储位
  bindCutterToTray: async (cutterId: string, pickTrayId: string, storageCode: string) => {
    const data = {
      cutterId: cutterId,
      pickTrayId: pickTrayId,
      storageCode: storageCode
    };
    return await request.post({ url: `/wms/operating-terminal/bindCutterToTray`, data });
  },

  //  签入-刀具
  checkInCutter: async (data) => {
    return await request.post({ url: `/wms/in-warehouse-detail/check-in-cutter`, data });
  },

  //  签入-刀具
  checkInAssignCutter: async (data) => {
    return await request.post({ url: `/wms/in-warehouse-detail/check-in-assign-cutter`, data });
  },

  //  签出-刀具
  checkOutCutter: async (data) => {
    return await request.post({ url: `/wms/out-warehouse-detail/check-out-cutter`, data });
  },

  //  签入
  checkIn: async (data) => {
    return await request.post({ url: `/wms/in-warehouse-detail/check-in`, data });
  },

  //  签出
  checkOut: async (data) => {
    return await request.post({ url: `/wms/out-warehouse-detail/check-out`, data });
  },

  /******************************出入库终端********************************/
  // 获取待签收的收货单
  getSignConsignmentInfo: async () => {
    return await request.get({ url: `/wms/operating-terminal/getSignConsignmentInfo` });
  },

  // 获取收货单条码信息
  getSignConsignmentDetail: async (consignmentInfoId: any) => {
    return await request.get({ url: `/wms/operating-terminal/getSignConsignmentDetail?consignmentInfoId=` + consignmentInfoId });
  },

  //  条码签收
  signMaterial: async (data) => {
    return await request.post({ url: `/wms/operating-terminal/signMaterial`, data });
  },

  //  数量签收
  signNumber: async (data) => {
    return await request.post({ url: `/wms/operating-terminal/signNumber`, data });
  },

  //  退货签收
  returnConsignment: async (data) => {
    return await request.post({ url: `/wms/operating-terminal/returnConsignment`, data });
  },

  getStockForIn: async (locationId: any) => {
    return await request.get({ url: `/wms/operating-terminal/getStockForIn?locationId=` + locationId });
  },

  // 获取待发货的发货单
  getSignShippingInfo: async () => {
    return await request.get({ url: `/wms/operating-terminal/getSignShippingInfo` });
  },

  // 根据发货单信息Id获取发货条码信息
  getShippingDetailByShippingInfoId: async (shippingInfoId: any) => {
    return await request.get({ url: `/wms/operating-terminal/getShippingDetailByShippingInfoId?shippingInfoId=` + shippingInfoId });
  },

  //  销售发货条码签收
  signMaterialShipping: async (data) => {
    return await request.post({ url: `/wms/operating-terminal/signMaterialShipping`, data });
  },

  //  出库
  generatorOutBound: async (data) => {
    return await request.post({ url: `/wms/operating-terminal/generatorOutBound`, data });
  },

  //  入库
  generatorInBound: async (data) => {
    return await request.post({ url: `/wms/operating-terminal/generatorInBound`, data });
  },



  // 获取刀具接驳位库位信息
  getCutterLocationInfo: async (locationCode: any) => {
    const data = {
      locationCode: locationCode
    };
    return await request.post({ url: `/wms/operating-terminal/getCutterLocationInfo`, data });
  },

  // 获取刀具信息
  getCutterInfo: async(barCode: string) => {
    return await request.get({ url: `/wms/operating-terminal/get-cutter-info?barCode=`+ barCode})
  },

};
