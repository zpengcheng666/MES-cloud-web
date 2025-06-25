import request from '@/config/axios'
export interface PartDocumentVersionVO {
    id: string,
    documentMasterId: string,
    documentVersion: string,
    domainId: string,
    description: string,
    keywords: string,
    maturity: string,
    status: string,
    isLocked: string,
    partVersionId: string,
    documentName: string,
    documentType: string,
}
export const PartDocumentVersionApi = {
    getDocumentVersion: async (partVersionId: number) => {
        return await request.get({ url: `/pdm/part/getdocument?partVersionId=` + partVersionId })
    }
}

