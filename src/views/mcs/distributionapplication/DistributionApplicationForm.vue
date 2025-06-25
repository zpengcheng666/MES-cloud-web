<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1120">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="150px"
      v-loading="formLoading"
      style="max-width: 750px;margin-left: 95px"
    >
      <el-form-item label="申请单号" prop="applicationNumber">
        <el-input disabled v-model="formData.applicationNumber" placeholder="请输入订单编号" />
      </el-form-item>
      <el-form-item label="申请单元" prop="unitId">
        <el-select disabled v-model="formData.unitId" placeholder="请选择申请单元">
          <el-option
            v-for="unit in unitList"
            :key="unit.id"
            :label="unit.name"
            :value="unit.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请单元" prop="deviceId">
        <el-select disabled v-model="formData.deviceId" placeholder="请选择申请单元">
          <el-option
            v-for="unit in deviceList"
            :key="unit.id"
            :label="unit.name"
            :value="unit.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="资源类型">
        <el-checkbox-group disabled v-model="formData.type">
          <el-checkbox v-for="dict in getStrDictOptions('wms_material_type')" :key="dict.value"  :label="dict.value" :value="dict.value" >
            {{dict.label}}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="需求详情" name="distributionRecord" max-height="300">
        <el-table ref="recordTable" v-loading="formLoading" :data="formData.distributionRecordRespVOList" :stripe="true" :show-overflow-tooltip="true">
          <el-table-column type="selection" align="center" :selectable="(row: any)=>row.status === 0"/>
          <el-table-column label="批次订单编码" align="center" prop="batchRecordNumber" width="180" />
          <el-table-column label="资源类型" align="center" prop="resourceType" width="90" >
            <template #default="scope">
              <dict-Tag :type="'wms_material_type'" :value="scope.row.resourceType" />
            </template>
          </el-table-column>
          <el-table-column label="批次编码" align="center" prop="barCode" width="180" />
          <el-table-column label="资源编码" align="center" prop="materialNumber" width="180" />
          <el-table-column label="资源条码" align="center" prop="barCode" width="180" />
          <el-table-column label="需求数量" align="center" prop="count" width="100" />
          <el-table-column label="状态" align="center" prop="status" >
            <template #default="{ row }">
              <dict-tag :type="'mcs_distribution_status'" :value="row.status" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DistributionApplicationApi, DistributionApplicationVO } from '@/api/mcs/distributionapplication'
import { getStrDictOptions } from '@/utils/dict'
import {reactive} from "vue";
import {EncodingRuleApi} from "@/api/mcc/encodingrule";

/** 物料配送申请 表单 */
defineOptions({ name: 'DistributionApplicationPreForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  applicationNumber: undefined,
  deviceId: undefined,
  unitId: undefined,
  deviceUnitId: undefined,
  type: [],
  distributionRecordRespVOList: [],
  batchRecordIdList: [],
})
const formRules = reactive({
  applicationNumber: [{ required: true, message: '申请单号不能为空', trigger: 'blur' }],
  unitId: [{ required: true, message: '生产单元不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const unitList = ref([]);
const deviceList = ref([]);

/** 子表的表单 */
const subTabsName = ref('distributionRecord')

/** 打开弹窗 */
const open = async (data: any) => {
  dialogVisible.value = true
  dialogTitle.value = "新增"
  resetForm()
  // 修改时，设置数据
  formLoading.value = true
  try {
    formData.value = await DistributionApplicationApi.getRecordListByBatchAndType(data)
    formData.value.deviceId = data.deviceId;
    formData.value.unitId = data.unitId;
  } finally {
    formLoading.value = false
  }
  unitList.value = await DistributionApplicationApi.getUnitList();
  deviceList.value = await DistributionApplicationApi.getDeviceListByUnitId(formData.value.unitId);
  if (!formData.value.type) formData.value.type = []
  if (formData.value.type.length == 0) {
    let materialType = getStrDictOptions('wms_material_type');
    for (let type of materialType) {
      if (type.value != 5 || formData.value.deviceId) {
        formData.value.type.push(type.value)
      }
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const recordTable = ref()
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 提交请求
  formLoading.value = true
  try {
    const data = {
      applicationNumber: formData.value.applicationNumber,
      deviceUnitId: formData.value.deviceUnitId,
      batchRecordIdList: formData.value.batchRecordIdList,
      demandDeliveryList: recordTable.value.getSelectionRows(),
    }
    const msg = await DistributionApplicationApi.createApplication(data)
    message.success(msg)
    dialogVisible.value = false
    const update={code:data.applicationNumber,status:2}
    EncodingRuleApi.updateCode(update)
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const openSelectView = (row: any) => {

}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    applicationNumber: undefined,
    deviceUnitId: undefined,
    deviceId: undefined,
    unitId: undefined,
    type: [],
    distributionRecordRespVOList: [],
    batchRecordIdList: [],
  }
  formRef.value?.resetFields()
}
</script>
