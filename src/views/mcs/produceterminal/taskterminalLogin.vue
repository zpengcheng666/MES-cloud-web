<template>
  <div class="taskterminalLogin">
    <div class="h-7/100 w-full">
      <div class="w-full text-center pt-2" style="color: rgba(97, 250, 249, 255); font-size: 3vh">
        生产任务系统
      </div>
    </div>
    <div class="loginDiv w-1/2 h-1/2 m-auto mt-20">
      <el-form
        v-show="getShow"
        ref="formLogin"
        :model="loginData.loginForm"
        :rules="LoginRules"
        class="login-form"
        label-position="top"
        label-width="120px"
        size="large"
      >
        <el-row style="margin-right: -10px; margin-left: -10px">
          <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
            <el-form-item>
              <LoginFormTitle style="width: 100%; color: rgba(97, 250, 249, 255)" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
            <el-form-item v-if="loginData.tenantEnable === 'true'" prop="tenantName">
              <el-input
                v-model="loginData.loginForm.tenantName"
                :placeholder="t('login.tenantNamePlaceholder')"
                :prefix-icon="iconHouse"
                link
                type="primary"
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
            <el-form-item prop="username">
              <el-input
                v-model="loginData.loginForm.username"
                :placeholder="t('login.usernamePlaceholder')"
                :prefix-icon="iconAvatar"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
            <el-form-item prop="password">
              <el-input
                v-model="loginData.loginForm.password"
                :placeholder="t('login.passwordPlaceholder')"
                :prefix-icon="iconLock"
                show-password
                type="password"
                @keyup.enter="getCode()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
            <el-form-item>
              <XButton
                :loading="loginLoading"
                :title="t('login.login')"
                class="w-[100%]"
                type="primary"
                @click="getCode()"
              />
            </el-form-item>
          </el-col>
          <Verify
            ref="verify"
            :captchaType="captchaType"
            :imgSize="{ width: '400px', height: '200px' }"
            mode="pop"
            @success="handleLogin"
          />
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ElLoading } from 'element-plus'
import LoginFormTitle from '@/views/Login/components/LoginFormTitle.vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { useIcon } from '@/hooks/web/useIcon'

import * as authUtil from '@/utils/auth'
import { usePermissionStore } from '@/store/modules/permission'
import * as LoginApi from '@/api/login'
import { LoginStateEnum, useFormValid, useLoginState } from '@/views/Login/components/useLogin'

defineOptions({ name: 'LoginForm' })

const { t } = useI18n()
const message = useMessage()
const iconHouse = useIcon({ icon: 'ep:house' })
const iconAvatar = useIcon({ icon: 'ep:avatar' })
const iconLock = useIcon({ icon: 'ep:lock' })
const formLogin = ref()
const { validForm } = useFormValid(formLogin)
const { setLoginState, getLoginState } = useLoginState()
const { currentRoute, push } = useRouter()
const permissionStore = usePermissionStore()
const redirect = ref<string>('')
const loginLoading = ref(false)
const verify = ref()
const captchaType = ref('blockPuzzle') // blockPuzzle 滑块 clickWord 点击文字

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)

const LoginRules = {
  tenantName: [required],
  username: [required],
  password: [required]
}
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
  }
})

// 获取验证码
const getCode = async () => {
  // 情况一，未开启：则直接登录
  if (loginData.captchaEnable === 'false') {
    await handleLogin({})
  } else {
    // 情况二，已开启：则展示验证码；只有完成验证码的情况，才进行登录
    // 弹出验证码
    verify.value.show()
  }
}
// 获取租户 ID
const getTenantId = async () => {
  if (loginData.tenantEnable === 'true') {
    const res = await LoginApi.getTenantIdByName(loginData.loginForm.tenantName)
    authUtil.setTenantId(res)
  }
}
// 记住我
const getLoginFormCache = () => {
  const loginForm = authUtil.getLoginForm()
  if (loginForm) {
    loginData.loginForm = {
      ...loginData.loginForm,
      username: loginForm.username ? loginForm.username : loginData.loginForm.username,
      password: loginForm.password ? loginForm.password : loginData.loginForm.password,
      rememberMe: loginForm.rememberMe,
      tenantName: loginForm.tenantName ? loginForm.tenantName : loginData.loginForm.tenantName
    }
  }
}
// 根据域名，获得租户信息
const getTenantByWebsite = async () => {
  const website = location.host
  const res = await LoginApi.getTenantByWebsite(website)
  if (res) {
    loginData.loginForm.tenantName = res.name
    authUtil.setTenantId(res.id)
  }
}
const loading = ref() // ElLoading.service 返回的实例
// 登录
const handleLogin = async (params) => {
  loginLoading.value = true
  try {
    await getTenantId()
    const data = await validForm()
    if (!data) {
      return
    }
    loginData.loginForm.captchaVerification = params.captchaVerification
    const res = await LoginApi.login(loginData.loginForm)
    if (!res) {
      return
    }
    loading.value = ElLoading.service({
      lock: true,
      text: '正在加载系统中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    if (loginData.loginForm.rememberMe) {
      authUtil.setLoginForm(loginData.loginForm)
    } else {
      authUtil.removeLoginForm()
    }
    authUtil.setToken(res)
    if (!redirect.value) {
      redirect.value = '/produceterminal/mcs/taskterminal'
    }
    // 判断是否为SSO登录
    if (redirect.value.indexOf('sso') !== -1) {
      window.location.href = window.location.href.replace('/login?redirect=', '')
    } else {
      push({ path: redirect.value || permissionStore.addRouters[0].path })
    }
  } finally {
    loginLoading.value = false
    loading.value.close()
  }
}

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)
onMounted(() => {
  getLoginFormCache()
  getTenantByWebsite()
})
</script>

<style lang="scss" scoped>
@import url('@/assets/produceterminal/scss/taskterminalLogin.scss');

:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}

.login-code {
  float: right;
  width: 100%;
  height: 38px;

  img {
    width: 100%;
    height: auto;
    max-width: 100px;
    vertical-align: middle;
    cursor: pointer;
  }
}
</style>
