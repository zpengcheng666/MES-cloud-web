<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading" style="max-width: 650px">
      <el-form-item label="申请单号" prop="applicationNumber">
        <el-col :span="20">
          <el-input v-model="formData.applicationNumber" placeholder="请输入订单编号" :disabled="true" />
        </el-col>
        <el-col :span="3" :push="1">
          <el-button @click="generatorCode" type="primary" :disabled="formLoading">生 码</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="申请单元" prop="unitId">
        <el-select v-model="formData.unitId" @change="unitSelect" placeholder="请选择申请单元" :disabled="true">
          <el-option v-for="unit in unitList" :key="unit.id" :label="unit.name" :value="unit.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="申请单元" prop="deviceId">
        <el-select clearable @clear="deviceClear" v-model="formData.deviceId" placeholder="请选择申请单元" :disabled="true">
          <el-option v-for="unit in deviceList" :key="unit.id" :label="unit.name" :value="unit.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="资源类型">
        <el-checkbox-group v-model="formData.type">
          <el-checkbox
            v-for="dict in getStrDictOptions('wms_material_type')"
            :disabled="dict.value === 'DJ' && !formData.deviceId"
            :key="dict.value"
            :label="dict.value"
            :value="dict.value"
          >
            {{ dict.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="批次任务" name="distributionRecord">
        <DistributionRecordForm ref="distributionRecordFormRef" :deviceUnitId="formData.deviceId || formData.unitId" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DistributionApplicationApi, DistributionApplicationVO } from '@/api/mcs/distributionapplication';
import DistributionRecordForm from '../../distributionapplication/components/DistributionRecordForm.vue';
import { getStrDictOptions } from '@/utils/dict';
import { reactive } from 'vue';
import { EncodingRuleApi } from '@/api/mcc/encodingrule';

/** 物料配送申请 表单 */
defineOptions({ name: 'terminalDistributionApplicationPreForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  applicationNumber: undefined,
  unitId: undefined,
  deviceId: undefined,
  type: [],
  batchRecordIdList: []
});
const formRules = reactive({
  applicationNumber: [{ required: true, message: '申请单号不能为空', trigger: 'blur' }],
  unitId: [{ required: true, message: '生产单元不能为空', trigger: 'blur' }]
});
const formRef = ref(); // 表单 Ref
const unitList = ref([]);
const deviceList = ref([]);

/** 子表的表单 */
const subTabsName = ref('distributionRecord');
const distributionRecordFormRef = ref();

/** 打开弹窗 */
const open = async (stationData, type: string, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = '新增申请';
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true;
    try {
      formData.value = await DistributionApplicationApi.getDistributionApplication(id);
    } finally {
      formLoading.value = false;
    }
  }
  unitList.value = await DistributionApplicationApi.getUnitList();
  if (stationData.lintStationGroup == null || stationData.lintStationGroup == '') {
    formData.value.unitId = stationData.id;
    await unitSelect();
    formData.value.deviceId = undefined;
  } else {
    formData.value.unitId = stationData.lintStationGroup;
    await unitSelect();
    formData.value.deviceId = stationData.id;
  }

  await generatorCode();
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗

const unitSelect = async () => {
  deviceList.value = [];
  formData.value.deviceId = undefined;
  if (formData.value.unitId) {
    deviceList.value = await DistributionApplicationApi.getDeviceListByUnitId(formData.value.unitId);
  }
};

const generatorCode = async () => {
  const data = {
    classificationCode: 'MCS_D',
    encodingRuleType: 1
  };
  const result = await EncodingRuleApi.createCode(data);
  formData.value.applicationNumber = result;
};

const deviceClear = () => {
  //5为刀具 根据数据字典修改
  formData.value.type = formData.value.type.filter((type) => type != 'DJ');
};

/** 提交表单 */
const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate();
  // 提交请求
  const data = formData.value;
  // 拼接子表的数据
  const batchRecords = distributionRecordFormRef.value.getData();
  if (batchRecords.length == 0) {
    message.warning('请至少选择一条批次任务!');
    return;
  }
  for (let batchRecord of batchRecords) {
    data.batchRecordIdList.push(batchRecord.id);
  }
  data.deviceUnitId = data.deviceId || data.unitId;
  emit('success', data);
  dialogVisible.value = false;
};

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    applicationNumber: undefined,
    unitId: undefined,
    deviceId: undefined,
    type: [],
    batchRecordIdList: []
  };
  deviceList.value = [];
  formRef.value?.resetFields();
};
</script>
