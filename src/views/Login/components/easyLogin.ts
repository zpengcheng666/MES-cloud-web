import * as LoginApi from '@/api/login'
import * as authUtil from '@/utils/auth'
const message = useMessage() // 消息弹窗

const loginData = reactive({
  isShowPassword: false,
  captchaEnable: import.meta.env.VITE_APP_CAPTCHA_ENABLE,
  tenantEnable: import.meta.env.VITE_APP_TENANT_ENABLE,
  loginForm: {
    tenantName: '上海弥彧',
    username: 'miyutech',
    password: 'admin123',
    captchaVerification: '',
    rememberMe: true // 默认记录我。如果不需要，可手动修改
  },
})

export interface  userLogin {
    tenantName: string,
    username: string,
    password: string,
    captchaVerification: string
}

export default function useEasyLogin() {
// 登录
async function handleLogin(user: userLogin){
    try {
      if (!validForm(user)) {
        message.error('请填写完整的登录信息')
        return
      }
      await getTenantId()
      loginData.loginForm.captchaVerification = user.captchaVerification
      const res = await LoginApi.login(user)
      if (!res) {
        return
      }
      authUtil.setToken(res)
      message.success('登录成功')
      return res.userId;
    } catch (error) {
      message.error('登录失败，请检查用户名或密码')
    }
  }
  // 获取租户 ID
  const getTenantId = async () => {
    if (loginData.tenantEnable === 'true') {
      const res = await LoginApi.getTenantIdByName(loginData.loginForm.tenantName)
      authUtil.setTenantId(res)
    }
  }

  // 获取登录用户绑定的签收库位
  const getBindedLocation = async (userId:string) => {
     if(userId){
        return await LoginApi.getBindedLocation(userId)
     }
  }

  const validForm = (user: userLogin) => {
    if(!user.username){
        return false
    }

    if(!user.password){
        return false
    }

    if(!user.tenantName){
        user.tenantName = loginData.loginForm.tenantName
    }

    return true
  }

  return {
    handleLogin,
    getBindedLocation
  }
}
