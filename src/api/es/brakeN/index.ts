import request from '@/config/axios'

// 新厂车牌数据 VO

export interface BrakeNVO{
  Uid: number,
  No: string,
  LicensePlateNumber: string,
  SystemSpotNumber: string,
  ParkingSpotNumber: string,
  OwnerParkingSpaceCount: number,
  OwnerName: string,
  OwnerNo: string,
  OwnerIDCard: string,
  OwnerLicense: string,
  OwnerAddress: string,
  PhoneNumber: string,
  Email: string,
  StartTime: string,
  EndTime: string,
  StoredVehicleBalance: number,
  VehicleTypeNo: string,
  VehicleTypeName: string,
  ParkingCardTypeNo: string,
  ParkingCardTypeName: string,
  OperatorName: string,
  CreationTime: string,
  Remarks: string,
  Status: number,
  EnableOffline: number,
}

// 新车厂车牌数据API
export const BrakeNApi = {
  // 查询新厂车牌数据分页
  getBrakeNPage: async (params: any) => {
    return await request.get({ url: `/es/brakeN/page`, params })
  },

  // 查询新厂车牌数据详情
  getBrakeN: async (id: string) => {
    return await request.get({ url: `/es/brakeN/get?id=` + id })
  },

  // 导出旧厂车牌数据 Excel
  exportBrakeN: async (params) => {
    return await request.download({ url: `/es/brakeN/export-excel`, params })
  },
}
