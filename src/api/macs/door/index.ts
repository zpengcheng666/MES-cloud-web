import request from '@/config/axios'
import { handleTree } from '@/utils/tree'
import {RegionApi} from "@/api/macs/region";
import {c} from "vite/dist/node/types.d-jgA8ss1A";

export interface DoorVO {
  name: string
  code: string
  regionId: string
  deviceId: string
  locationName: string
  doorStatus: boolean
  description: string
  devicePort: number
}

// 查询门列表
export const getDoorPage = async (params) => {
  return await request.get({ url: '/macs/door/page', params })
}

// 查询门详情
export const getDoor = async (id: string) => {
  return await request.get({ url: '/macs/door/get?id=' + id })
}

// 新增门
export const createDoor = async (data: DoorVO) => {
  return await request.post({ url: '/macs/door/create', data })
}

// 修改门
export const updateDoor = async (data: DoorVO) => {
  return await request.put({ url: '/macs/door/update', data })
}

// 删除门
export const deleteDoor = async (id: string) => {
  return await request.delete({ url: '/macs/door/delete?id=' + id })
}

export const openDoor = async (id: string) => {
  return await request.post({ url: '/macs/door/openDoor?id=' + id })
}

export const closeDoor = async (id: string) => {
  return await request.post({ url: '/macs/door/closeDoor?id=' + id })
}

// 导出门 Excel
export const exportDoorApi = async (params) => {
  return await request.download({ url: '/macs/door/export-excel', params })
}

export const getRegionList = async (params) => {
  return await request.get({ url: `/macs/region/list`, params })
}

export const getDeviceList = async (params) => {
  return await request.get({ url: `/macs/device/list`, params })
}

