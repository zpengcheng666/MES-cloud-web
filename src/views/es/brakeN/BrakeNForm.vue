<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
      :disabled="formType == 'detail'"
    >
      <el-form-item label="车牌号" prop="licensePlateNumber">
        <el-input v-model="formData.licensePlateNumber"/>
      </el-form-item>
      <el-form-item label="系统车位号" prop="systemSpotNumber">
        <el-input v-model="formData. systemSpotNumber"/>
      </el-form-item>
      <el-form-item label="车场车位号" prop="parkingSpotNumber">
        <el-input v-model="formData.parkingSpotNumber"/>
      </el-form-item>
      <el-form-item label="车主车位数" prop="ownerParkingSpaceCount">
        <el-input v-model="formData.ownerParkingSpaceCount"/>
      </el-form-item>
      <el-form-item label="车主名称" prop="ownerName">
        <el-input v-model="formData.ownerName"/>
      </el-form-item>
      <el-form-item label="车主编号" prop="ownerNo">
        <el-input v-model="formData.ownerNo"/>
      </el-form-item>
      <el-form-item label="车主身份证" prop="ownerIDCard">
        <el-input v-model="formData.ownerIDCard"/>
      </el-form-item>
      <el-form-item label="车主驾驶证" prop="ownerLicense">
        <el-input v-model="formData.ownerLicense"/>
      </el-form-item>
      <el-form-item label="车主住址" prop="ownerAddress">
        <el-input v-model="formData.ownerAddress"/>
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input v-model="formData.phoneNumber"/>
      </el-form-item>
      <el-form-item label="邮箱地址" prop="email">
        <el-input v-model="formData.email"/>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-input v-model="formData.startTime"/>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-input v-model="formData.endTime"/>
      </el-form-item>
      <el-form-item label="储值车余额" prop="storedVehicleBalance">
        <el-input v-model="formData.storedVehicleBalance"/>
      </el-form-item>
      <el-form-item label="车辆类型编号" prop="vehicleTypeNo">
        <el-input v-model="formData.vehicleTypeNo"/>
      </el-form-item>
      <el-form-item label="车辆类型名称" prop="vehicleTypeName">
        <el-input v-model="formData.vehicleTypeName"/>
      </el-form-item>
      <el-form-item label="车牌类型编号" prop="parkingCardTypeNo">
        <el-input v-model="formData.parkingCardTypeNo"/>
      </el-form-item>
      <el-form-item label="车牌类型名称" prop="parkingCardTypeName">
        <el-input v-model="formData.parkingCardTypeName"/>
      </el-form-item>
      <el-form-item label="操作人姓名" prop="operatorName">
        <el-input v-model="formData.operatorName"/>
      </el-form-item>
      <el-form-item label="添加时间" prop="creationTime">
        <el-input v-model="formData.creationTime"/>
      </el-form-item>
      <el-form-item label="备注信息" prop="remarks">
        <el-input v-model="formData.remarks"/>
      </el-form-item>
      <el-form-item label="车牌状态" prop="status">
        <el-input v-model="formData.status"/>
      </el-form-item>
      <el-form-item label="白名单使能" prop="enableOffline">
        <el-input v-model="formData.enableOffline"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading || formType == 'detail'">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { BrakeNApi, BrakeNVO } from '@/api/es/brakeN'

/** 旧厂车牌数据 表单 */
defineOptions({ name: 'BrakeNForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  uid: undefined,
  no: undefined,
  licensePlateNumber: undefined,
  systemSpotNumber: undefined,
  parkingSpotNumber: undefined,
  ownerParkingSpaceCount: undefined,
  ownerName: undefined,
  ownerNo: undefined,
  ownerIDCard: undefined,
  ownerLicense: undefined,
  ownerAddress: undefined,
  phoneNumber: undefined,
  email: undefined,
  startTime: undefined,
  endTime: undefined,
  storedVehicleBalance: undefined,
  vehicleTypeNo: undefined,
  vehicleTypeName: undefined,
  parkingCardTypeNo: undefined,
  parkingCardTypeName: undefined,
  operatorName: undefined,
  creationTime: undefined,
  remarks: undefined,
  status: undefined,
  enableOffline: undefined,
})
const formRules = reactive({
  registerPlate: [{ required: true, message: '车牌号不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type

  console.log("11111111111111111111111111111111111111111"+id)
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await BrakeNApi.getBrakeN(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// /** 提交表单 */
// const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
// const submitForm = async () => {
//   // 校验表单
//   await formRef.value.validate()
//   // 提交请求
//   formLoading.value = true
//   try {
//     const data = formData.value as unknown as BrakeVO
//     if (formType.value === 'create') {
//       await BrakeNApi.createBrake(data)
//       message.success(t('common.createSuccess'))
//     } else {
//       await BrakeNApi.updateBrake(data)
//       message.success(t('common.updateSuccess'))
//     }
//     dialogVisible.value = false
//     // 发送操作成功的事件
//     emit('success')
//   } finally {
//     formLoading.value = false
//   }
// }

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    Uid: undefined,
    No: undefined,
    LicensePlateNumber: undefined,
    SystemSpotNumber: undefined,
    ParkingSpotNumber: undefined,
    OwnerParkingSpaceCount: undefined,
    OwnerName: undefined,
    OwnerNo: undefined,
    OwnerIDCard: undefined,
    OwnerLicense: undefined,
    OwnerAddress: undefined,
    PhoneNumber: undefined,
    Email: undefined,
    StartTime: undefined,
    EndTime: undefined,
    StoredVehicleBalance: undefined,
    VehicleTypeNo: undefined,
    VehicleTypeName: undefined,
    ParkingCardTypeNo: undefined,
    ParkingCardTypeName: undefined,
    OperatorName: undefined,
    CreationTime: undefined,
    Remarks: undefined,
    Status: undefined,
    EnableOffline: undefined,
  }
  formRef.value?.resetFields()
}
</script>
