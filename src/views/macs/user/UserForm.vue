<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="卡号" prop="code">
        <el-input v-model="formData.code" readonly placeholder="请录入卡号" >
          <template #append>
            <el-button v-if="readModel !== 'code'" type="primary" @click="readUserInfo('code')">{{formData.code?'修改':'录入'}}</el-button>
            <span v-else>等待扫描...{{readModelNumber}}s</span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="人脸信息" prop="facePicture">
        <el-button v-if="readModel !== 'face'" type="primary" @click="readUserInfo('face')">{{formData.facePicture?'修改':'录入'}}</el-button>
        <span v-else>等待扫描...{{readModelNumber}}s</span>
      </el-form-item>
      <el-form-item v-show="formData.facePicture" >
        <img :src="formData.facePicture" width="70" height="70" />
      </el-form-item>
      <el-form-item label="指纹信息" prop="fingerprintPicture">
        <el-button v-if="readModel !== 'fingerprint'" type="primary" @click="readUserInfo('fingerprint')">{{formData.fingerprintPicture?'修改':'录入'}}</el-button>
        <span v-else>等待扫描...{{readModelNumber}}s</span>
      </el-form-item>
      <el-form-item v-show="formData.fingerprintPicture" >
        <img :src="formData.fingerprintPicture" width="70" height="70" />
      </el-form-item>
      <el-form-item label="采集器" prop="userId">
        <el-select v-model="collector" clearable placeholder="请选择采集器">
          <el-option
            v-for="item in collectorList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer v-if="footerShow">
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { UserApi, UserVO } from '@/api/macs/user'
import {connectWebSocket, onWebSocket, useMyWebSocket} from "./useWebSocket";
import {useUserStore} from "@/store/modules/user";

/** 门禁用户 表单 */
defineOptions({ name: 'UserForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  userId: undefined,
  code: undefined,
  facialFeature: undefined,
  fingerprint: undefined,
  regionId: undefined,
  facePicture: undefined,
  fingerprintPicture: undefined
})
const userStore = useUserStore()
const userId:string = userStore.user.id +"";
const formRules = reactive({
})
const formRef = ref() // 表单 Ref
const collector = ref('');
const collectorList = ref([]);
const readModel = ref('');
const readModelNumber = ref(60);
const footerShow = ref(true);
let timer:any;
let websocket;

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await UserApi.getUser(id);
    } finally {
      formLoading.value = false
    }
    collectorList.value = await UserApi.getCollectorList({type: 2});
    initWebSocket();
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

function initWebSocket() {
  let url = 'ws://127.0.0.1:7011/macs/websocket/' + userId;
  connectWebSocket(url);
  onWebSocket(onWebSocketMessage);
  websocket = useMyWebSocket();
}

function onWebSocketMessage(data) {
  if (readModel.value == 'code') {
    formData.value.code = data.code;
  } else if (readModel.value == 'face') {
    formData.value.facePicture = data.facePicture;
    formData.value.facialFeatureString = data.facialFeatureString;
  } else if (readModel.value == 'fingerprint') {
    formData.value.fingerprintString = data.fingerprintString;
    formData.value.fingerprintPicture = data.fingerprintPicture;
  }
  clearInterval(timer);
  readModel.value = '';
  footerShow.value = true;
}

function readUserInfo(key) {
  if (websocket && websocket.status.value == 'OPEN') {
    if (collector.value) {
      let msg ='collectorRead:' + JSON.stringify({'collectorCode': collector.value, 'userId': userId})
      websocket.send(msg);
      message.success("已连接,请录入信息")
      readModel.value = key;
      readModelNumber.value = 60;
      clearInterval(timer);
      timer = setInterval(countdown, 1000);
    }else {
      message.warning("请选择采集设备!");
    }
  } else {
    message.error("websocket连接失败!")
  }
}

function countdown() {
  readModelNumber.value--;
  if (readModelNumber.value == 0) {
    clearInterval(timer);
    readModel.value = '';
    if (websocket && websocket.status.value == 'OPEN') {
      let msg ='collectorReadClean:' + userId;
      websocket.send(msg);
    }
  }
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as UserVO
    await UserApi.updateUser(data)
    message.success(t('common.updateSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

function handleCancel() {
  clearInterval(timer);
  readModel.value = '';
  if (websocket && websocket.status.value == 'OPEN') {
    let msg ='collectorReadClean:' + userId;
    websocket.send(msg);
  }
  dialogVisible.value = false;
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    userId: undefined,
    code: undefined,
    facialFeature: undefined,
    fingerprint: undefined,
    regionId: undefined,
    facePicture: undefined,
    fingerprintPicture: undefined
  }
  formRef.value?.resetFields()
}
</script>
