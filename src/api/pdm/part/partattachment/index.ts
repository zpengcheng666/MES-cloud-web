import request from '@/config/axios'

export interface PartAttachmentVO {
    id: string
    datapackageBomId: string
    fileSource: string
    fileId: string
    creator: string
    fileName: string
    fileType: string
    vaultUrl: string
}
export const PartAttachmentApi = {
    getdatapackageBomId: async (partVersionId: number) => {
      return await request.get({ url: `/pdm/part/getdatapackageBomId?partVersionId=` + partVersionId })
    },
    getModelUrl: async (fileName: number, fileType: number) => {
        return await request.get({ url: `/pdm/part/getModelUrl?fileName=` + fileName + `&fileType=` + fileType})
    },
  getNewFile: async (id: number) => {
    return await request.get({ url: `/pdm/part/getNewFile`, id })
  },
  saveNewFile: async (data) => {
    return await request.post({ url: `/pdm/part/saveNewFile`,data })
  },
  deleteNewFile: async (params) => {
    return await request.delete({ url: `/pdm/part/deleteNewFile`, params })
  },
}

