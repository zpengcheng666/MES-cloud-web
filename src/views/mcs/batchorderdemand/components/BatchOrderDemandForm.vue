<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="订单编号" prop="orderId">
        <el-select v-model="formData.orderId" @change="getBatchList" filterable placeholder="请选择订单编号" >
          <el-option
            v-for="order in orderList"
            :key="order.id"
            :label="order.orderNumber"
            :value="order.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="批次编码" prop="batchId">
        <el-select v-model="formData.batchId" @change="getBatchRecordList" filterable placeholder="请选择订单编号" >
          <el-option
            v-for="batch in batchList"
            :key="batch.id"
            :label="batch.batchNumber"
            :value="batch.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="任务编码" prop="batchRecordId">
        <el-select v-model="formData.batchRecordId" @change="batchRecordSelect" filterable placeholder="请选择订单编号" >
          <el-option
            v-for="batch in batchRecordList"
            :key="batch.id"
            :label="batch.number"
            :value="batch.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="生产单元" prop="processingUnitId">
        <el-select disabled v-model="formData.processingUnitId" filterable placeholder="请选择生成单元" >
          <el-option v-for="unit in unitList"
                     :key="unit.id"
                     :label="unit.name"
                     :value="unit.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="设备" prop="deviceId">
        <el-select v-model="formData.deviceId" filterable placeholder="请选择生成单元" >
          <el-option v-for="device in deviceList"
                     :key="device.id"
                     :label="device.name"
                     :value="device.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="资源类型" prop="resourceType">
        <el-select v-model="formData.resourceType" @change="clearTypeId" placeholder="请选择资源类型">
          <el-option v-for="dict in materialTypeList"
                     :key="dict.id"
                     :label="dict.name"
                     :value="dict.id"/>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="需求类型" prop="requirementType">
        <el-select v-model="formData.requirementType" placeholder="请选择需求类型">
          <el-option v-for="dict in getIntDictOptions('mcs_requirement_type')"
                     :key="dict.value"
                     :label="dict.label"
                     :value="dict.value"/>
        </el-select>
      </el-form-item>-->
      <el-form-item label="资源类码" prop="resourceTypeCode">
        <el-input readonly @click="openResourceTypeSelectView" @change="clearResourceId" v-model="formData.resourceTypeCode" placeholder="请输入资源类码" />
      </el-form-item>
      <el-form-item v-show="false" label="资源类型id" prop="resourceTypeId">
        <el-input v-model="formData.resourceTypeId" />
      </el-form-item>
      <el-form-item label="需求数量" prop="total">
        <el-input type="number" v-model="formData.total" placeholder="请输入需求数量" />
      </el-form-item>
      <el-form-item label="资源条码" prop="resourcebarCodes">
        <el-input readonly @click="openResourceSelectView" v-model="formData.resourcebarCodes" placeholder="请输入资源条码" />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input type="textarea" v-model="formData.remarks" placeholder="请输入需求数量" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
    <resource-type-select-view ref="resourceTypeSelectRef" @success="resourceTypeSelect" />
    <resource-select-view ref="resourceSelectRef" @success="resourceSelect" />
  </Dialog>
</template>
<script setup lang="ts">
import { BatchOrderDemandApi, BatchOrderDemandVO } from '@/api/mcs/batchorderdemand'
import {BatchRecordApi} from "@/api/mcs/batchRecord";
import ResourceTypeSelectView from './ResourceTypeSelectView.vue'
import {MaterialTypeApi} from "@/api/mcc/materialtype";
import ResourceSelectView from "@/views/mcs/batchorderdemand/components/ResourceSelectView.vue";

/** 批次订单需求 表单 */
defineOptions({ name: 'BatchOrderDemandForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  orderId: undefined,
  batchId: undefined,
  resourceType: undefined,
  resourceTypeCode: undefined,
  total: undefined,
  minimum: undefined,
  status: undefined,
  confirmedBy: undefined,
  confirmedTime: undefined,
  processingUnitId: undefined,
  deviceId: undefined,
  requirementType: 1,
  batchDemandResourceList: [],
  resourcebarCodes: undefined,
})
const formRules = reactive({
  orderId: [{ required: true, message: '订单编号不能为空', trigger: 'blur' }],
  batchId: [{ required: true, message: '批次编号不能为空', trigger: 'blur' }],
  batchRecordId: [{ required: true, message: '批次编号不能为空', trigger: 'blur' }],
  processingUnitId: [{ required: true, message: '生产单元不能为空', trigger: 'blur' }],
  deviceId: [{ required: true, message: '设备不能为空', trigger: 'blur' }],
  resourceType: [{ required: true, message: '资源类别不能为空', trigger: 'blur' }],
  requirementType: [{ required: true, message: '需求类型不能为空', trigger: 'blur' }],
  resourceTypeCode: [{ required: true, message: '资源类码不能为空', trigger: 'blur' }],
  total: [{ required: true, message: '需求数量不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const orderList = ref([]);
const unitList = ref([]);
const deviceList = ref([]);
const batchList = ref([]);
const batchRecordList = ref([]);
const materialTypeList = ref([]);

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  dialogTitle.value = '新增'
  resetForm()
  orderList.value = await BatchOrderDemandApi.getOrderList({status: [0,1,4]})
  unitList.value = await BatchOrderDemandApi.getUnitList();
  const res = await MaterialTypeApi.getMaterialTypeList({});
  materialTypeList.value = res.filter(item => item.level == 0);
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const getBatchList = async () => {
  formData.value.batchId = null;
  batchList.value = await BatchOrderDemandApi.getBatchList({'orderId': formData.value.orderId});
}

const getDeviceList = async (val: String) => {
  formData.value.deviceIdList = [];
  deviceList.value = await BatchRecordApi.getDeviceListByUnitId(val);
}

const getBatchRecordList = async () => {
  formData.value.batchRecordId = null;
  batchRecordList.value = await BatchOrderDemandApi.getBatchRecordList({'batchId': formData.value.batchId});
}

const resourceTypeSelectRef = ref();
const openResourceTypeSelectView = () => {
  if (!formData.value.resourceType) {
    message.warning("请先选择物料类型!")
    return
  }
  resourceTypeSelectRef.value.open(formData.value.resourceType);
}

const resourceSelectRef = ref();
const openResourceSelectView = () => {
  if (!formData.value.resourceTypeId) {
    message.warning("请先输入资源类型编码!")
    return
  }
  if (!formData.value.total) {
    message.warning("请先输入资源数量!")
    return
  }
  let resourceType = materialTypeList.value.find(item => item.id == formData.value.resourceType);
  if (resourceType) {
    resourceSelectRef.value.open(resourceType.code,formData.value.resourceTypeId,formData.value.total);
  }
}

const resourceTypeSelect = (row) => {
  formData.value.resourceTypeId = row.id;
  formData.value.resourceTypeCode = row.materialNumber;
}

const resourceSelect = (rows: any[]) => {
  formData.value.batchDemandResourceList = rows;
  formData.value.resourcebarCodes = '';
  for (let row of rows) {
    if (formData.value.resourcebarCodes) formData.value.resourcebarCodes += ','
    formData.value.resourcebarCodes += row.barCode;
  }

}

const clearTypeId = () => {
  formData.value.resourceTypeId = null;
  formData.value.resourceTypeCode = null;
  clearResourceId()
}

const clearResourceId = () => {
  formData.value.batchDemandResourceList = [];
  formData.value.resourcebarCodes = null;
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as BatchOrderDemandVO
    data.resourceType = materialTypeList.value.find(item => item.id == data.resourceType || item.code == data.resourceType).code
    await BatchOrderDemandApi.createBatchOrderExtraDemand(data)
    message.success(t('common.createSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const batchRecordSelect = (value: any) => {
  if (!batchRecordList) return;
  const batchRecord = batchRecordList.value.find((item)=> item.id == value);
  if (batchRecord)  {
    formData.value.processingUnitId = batchRecord.processingUnitId
    getDeviceList(batchRecord.processingUnitId);
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    orderNumber: undefined,
    batchCode: undefined,
    resourceType: undefined,
    resourceCode: undefined,
    total: undefined,
    minimum: undefined,
    status: undefined,
    confirmedBy: undefined,
    confirmedTime: undefined,
    processingUnitId: undefined,
    deviceId: undefined,
    requirementType: 1,
  }
  orderList.value = []
  batchList.value = []
  batchRecordList.value = []
  deviceList.value = []
  formRef.value?.resetFields()
}
</script>
