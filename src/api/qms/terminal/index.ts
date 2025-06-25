import request from '@/config/axios'

export const QmsTerminalApi = {
  //入库
  putInStorage: async (data) => {
    return await request.post({ url: `/qms/terminal/putInStorage`, data })
  }
}
