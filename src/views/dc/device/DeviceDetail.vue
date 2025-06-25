<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      label-width="100px"
      v-loading="formLoading"
      disabled
    >

      <el-form-item label="设备" prop="deviceId">
        <el-select-v2
          v-model="formData.deviceId"
          :options="props.ledgerList"
          filterable
          clearable
          placeholder="选择设备"
        />
      </el-form-item>

      <el-row :gutter="20">
      <el-col :span="8">
      <el-form-item label="通信类型" prop="commType">
        <el-select-v2
          v-model="formData.commType"
          :options="getIntDictOptions(DICT_TYPE.DC_COMM_TYPE)"
          clearable
        />
      </el-form-item>
      </el-col>
      <el-col :span="12">
      <el-form-item label="服务器地址" prop="deviceUrl" >
        <el-input v-model="formData.deviceUrl"  />
      </el-form-item>
      </el-col>
      </el-row>

      <el-row :gutter="20">
      <el-col :span="9">
        <el-form-item label="客户端id" prop="deviceClientId" v-if="formData.commType == 1">
          <el-input v-model="formData.deviceClientId"  />
        </el-form-item>
      </el-col>
      <el-col :span="8">
      <el-form-item label="账号" prop="username" v-if="formData.commType == 1">
        <el-input v-model="formData.username"  />
      </el-form-item>
      </el-col>
      <el-col :span="6">
      <el-form-item label="密码" prop="password" v-if="formData.commType == 1">
        <el-input v-model="formData.password" />
      </el-form-item>
      </el-col>
      </el-row>

      <!--      <el-form-item label="通信url" prop="deviceUrl" v-if="formData.commType == 2">-->
      <!--        <el-input v-model="formData.deviceUrl" placeholder="请输入通信url" />-->
      <!--      </el-form-item>-->

      <!--      <el-form-item label="匹配标签码" prop="deviceText" v-if="formData.commType == 1">-->
      <!--        <el-input v-model="formData.matchId" placeholder="请输入匹配标签码" class="!w-240px" :disabled="formData.topicId != null" />-->
      <!--      </el-form-item>-->

      <!-- 子表的表单 -->
      <el-tabs v-model="subTabsName">
        <el-tab-pane label="产品类型信息" name="deviceCollect">
          <DeviceCollectType ref="deviceCollectFormRef" :device-id="deviceId" />
        </el-tab-pane>
      </el-tabs>

    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {  DICT_TYPE , getIntDictOptions} from '@/utils/dict'
import { DeviceApi, DeviceVO } from '@/api/dc/device'
import DeviceCollectType from "@/views/dc/device/DeviceCollectType.vue";

/** 设备 表单 */
defineOptions({ name: 'DeviceForm' })

const props = defineProps(['productTypeList' ,'ledgerList'])
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('详情') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  deviceId: undefined,
  deviceName: undefined,
  deviceStatus: undefined,
  deviceText: undefined,
  productTypeId: undefined,
  deviceTypeId: undefined,
  matchId: undefined,
  topicId: undefined,
  commType: undefined,
  deviceClientId: undefined,
  deviceUrl: undefined,
  device: undefined,
})

let deviceId = ref()

const formRef = ref() // 表单 Ref

/** 子表的表单 */
const subTabsName = ref('deviceCollect')
const deviceCollectFormRef = ref()

/** 打开弹窗 */
const open = async (id?: number) => {
  deviceId.value = id
  dialogVisible.value = true
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await DeviceApi.getDevice(id)
      // deviceId = formData.value.id
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗


/** 重置表单 */
const resetForm = () => {
  formData.value = {
    deviceId: undefined,
    deviceName: undefined,
    deviceStatus: undefined,
    deviceText: undefined,
    productTypeId: undefined,
    deviceTypeId: undefined,
    matchId: undefined,
    topicId: undefined,
    commType: undefined,
    deviceClientId: undefined,
    deviceUrl: undefined,
    device: undefined,
  }
  formRef.value?.resetFields()
}
</script>
