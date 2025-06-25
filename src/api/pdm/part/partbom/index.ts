import request from '@/config/axios'

export interface PartBomVO {
    id: string
    partVersionId: string
    quantity: number
    receiveInfoId: string
    tableName: string
    creator: string
    updater: string
    datapackageBomId: string
    fileName: string
    fileType: string
    vaultUrl: string
    FileId: string
}

export const PartBomApi = {
    getDetails: async (partVersionId: number) => {
        return await request.get({ url: `/pdm/part/getdetails?partVersionId=` + partVersionId })
    }
}