<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" class="dialog-custom-size">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="工步序号" prop="stepNum">
            <el-input v-model="formData.stepNum" placeholder="请输入工步序号" class="!w-200px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工步名称" prop="stepName">
            <el-input v-model="formData.stepName" placeholder="请输入工步名称" class="!w-200px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="关重属性" prop="stepProperty">
            <el-select v-model="formData.stepProperty" placeholder="请选择关重属性" clearable class="!w-200px">
              <el-option v-for="pr in getIntDictOptions(DICT_TYPE.PDM_PROCESSPLAN_PROPERTY)" :key="pr.value"
                :label="pr.label" :value="pr.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工时(min)" prop="processingTime">
            <el-input v-model="formData.processingTime" clearable class="!w-200px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="工步类型" prop="categoryId">
            <el-tree-select
              v-model="formData.categoryId"
              :data="categoryList"
              :props="defaultProps"
              check-strictly
              default-expand-all
              placeholder="请选择工步类型"
              class="w-1/1" @change="changeStepType()"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="工作说明" prop="description">
        <iframe ref="IframeRef"  :src="src"  width="100%" height="300px" style="border: none"></iframe>
      </el-form-item>
      <div class="node-name">自定义属性</div>
      <el-descriptions :column="2" border>
        <el-descriptions-item v-for="(item, index) in attributeList" :label="item.attrNameCn" :key="index+1">
          <el-input v-if="item.isMultvalues === 0" v-model="item.attrDefaultValue" clearable class="!w-200px" />
          <el-select v-if="item.isMultvalues === 1" v-model="item.attrDefaultValue" multiple placeholder="请选择" class="!w-200px">
            <el-option v-for="attrValue in item.attrEffectiveValue.split(',')" :key="attrValue"
                       :label="attrValue" :value="attrValue" />
          </el-select>
        </el-descriptions-item>
      </el-descriptions>
      <div style="margin-top: 10px">
        <el-button @click="openFormDeviceStep()" plain type="primary">
          <Icon class="mr-5px" icon="ep:plus" />选择设备
        </el-button>
        <el-table :data="deviceData" border>
          <el-table-column prop="code" label="设备编号" align="center" />
          <el-table-column prop="name" label="设备名称" align="center" />
          <el-table-column prop="specification" label="设备规格" align="center" />
          <el-table-column :width="60" align="center" label="操作">
            <template #default="scope">
              <el-button link type="danger"
                         @click="handleDeleteDeviceStep(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <!-- 工步表单弹窗：选择设备 -->
  <DeviceStepForm ref="formRefDeviceStep" @success="getDeviceListStep" />
</template>

<script lang="ts" setup>

import { ProcessPlanDetailApi, ProcessPlanDetailVO } from '@/api/pdm/processPlanDetail'
import { ProcessPlanApi } from "@/api/pdm/processPlan";
import { ref, defineExpose, reactive } from 'vue';
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { useI18n } from 'vue-i18n';
import { defaultProps, handleTree } from '@/utils/tree'
import { StepCategoryApi, StepCategoryVO } from '@/api/pdm/stepCategory'
import { CustomizedAttributeAPI } from '@/api/pdm/customizedAttribute'
import { generateUUID } from '@/utils'
import DeviceStepForm from "./DeviceStepForm.vue";
const VITE_BASE_EDITOR_URL = import.meta.env.VITE_BASE_EDITOR_URL
const src = ref(VITE_BASE_EDITOR_URL)
defineOptions({ name: 'StepForm' });
const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗
const dialogVisible = ref(false); // 弹窗的是否展示
const categoryList = ref<StepCategoryVO[]>([]) // 工步分类列表
const attributeList = ref([]) // 分类自定义属性
const resourcesData = ref([]) // 制造资源列表
const deviceData = ref([]) // 设备列表
const deviceIds = ref([]) // 设备id数组
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formRef = ref(); // 表单 Ref
const IframeRef = ref();
const formData = ref({
  id: '',
  processVersionId: '',
  procedureId: '',
  stepNum: '',
  stepName: '',
  stepProperty: '',
  description: '',
  descriptionPreview: '',
  processingTime: '',
  categoryId: undefined
});
const formRules = reactive({
  stepNum: [{ required: true, message: '工步序号不能为空', trigger: 'blur' }],
  stepName: [{ required: true, message: '工步名称不能为空', trigger: 'change' }],
  stepProperty: [{ required: true, message: '关重属性不能为空', trigger: 'change' }],
  processingTime: [{ required: true, message: '工时不能为空', trigger: 'change' }],
  categoryId: [{ required: true, message: '工步类型不能为空', trigger: 'blur' }],
});
const queryParamsResource = reactive({
  processVersionId: '',
  resourcesType: '1',
  resourcesTypeId: '',
  procedureId: '',
  stepId: '',
})
/** 重置表单 */
const resetForm = () => {
  const processVersionId = formData.value.processVersionId;
  const procedureId = formData.value.procedureId;
  formData.value = {
    id: '',
    processVersionId: '',
    procedureId: '',
    stepNum: '',
    stepName: '',
    stepProperty: '',
    description: '',
    processingTime: '',
  };
  formData.value.processVersionId = processVersionId;
  formData.value.procedureId = procedureId;
  formRef.value?.resetFields();
  attributeList.value = []
  deviceData.value = []
};

/** 打开弹窗 */
const open = async (processVersionId, procedureId) => {
  dialogVisible.value = true
  dialogTitle.value = "添加工步"
  formData.value.processVersionId = processVersionId;
  formData.value.procedureId = procedureId;
  resetForm()
  // 工步类型
  const categoryData = await StepCategoryApi.getStepCategorySimpleList()
  categoryList.value = handleTree(categoryData, 'id', 'parentId')
  // 选设备关联工步id，更改为前端生成id
  let stepId = '';
  for (let i = 0; i < 19; i++) {
    stepId += Math.floor(Math.random() * 10); // 生成0-9之间的随机数
  }
  formData.value.id = stepId;
  // formData.value.id = generateUUID().replaceAll("-","");
  queryParamsResource.processVersionId = processVersionId;
  queryParamsResource.procedureId = procedureId;
  queryParamsResource.stepId = formData.value.id;
}
defineExpose({ open }); // 提供 open 方法，用于打开弹窗


const receivedContent = ref()
const receivedContentHtmls = ref()

window.addEventListener('message', (e) => {
  const data = e.data;
  if (data.type == 'description') {
    receivedContent.value = data.data;
    console.log(receivedContent.value)
    // 更新表单字段
    if (formData.value) {
      formData.value.description = receivedContent.value;
    } else {
      console.error('stepForm is not initialized');
    }
  } else if (data.type == 'contentHtml') {
    receivedContentHtmls.value = data.data;
    // 更新表单字段
    if (formData.value) {
      formData.value.descriptionPreview = receivedContentHtmls.value;
    } else {
      console.error('stepForm is not initialized');
    }
  } else {
    console.warn('Unknown message type:', data.type);
  }

}, false);



/**提交*/
const emit = defineEmits(['success']);// 定义操作成功事件
const submitForm = async () => {
  try {
    formLoading.value = true;
    const valid = await formRef.value.validate();
    if (!valid) {
      formLoading.value = false;
      return;
    }
    if(deviceData.value.length <=0 ) {
      message.error('请选择设备')
      return;
    }
    const data = formData.value as unknown as ProcessPlanDetailVO;
    formData.value.description =  receivedContent.value
    formData.value.descriptionPreview = receivedContentHtmls.value
    //自定义属性赋值-单值转数组
    attributeList.value.forEach((item) => {
      if(item.isMultvalues === 0 && item.attrDefaultValue != null && !(item.attrDefaultValue instanceof Array)) {
        item.attrDefaultValue = item.attrDefaultValue.split(",")
      }
    })
    data.attributeValList = attributeList.value;
    const stepId = await ProcessPlanDetailApi.addStep(data);
    message.success(t('common.createSuccess'));
    dialogVisible.value = false;
    // 发送操作成功的事件
    emit('success', stepId, data.stepNum, data.stepName);
  } finally {
    formLoading.value = false;
  }
};

/** 切换工步类型 */
const changeStepType = async () => {
  // 取分类自定义属性
  attributeList.value = await CustomizedAttributeAPI.getCustomizedAttribute(formData.value.categoryId);
}

//工步节点-选择制造资源
/** 工步-选择设备操作 */
const formRefDeviceStep = ref()
const openFormDeviceStep = () => {
  formRefDeviceStep.value.open(queryParamsResource.processVersionId, queryParamsResource.procedureId, queryParamsResource.stepId, deviceIds.value)
}
/** 工步-选中设备后重新加载列表 */
const getDeviceListStep = async () => {
  queryParamsResource.resourcesType = '1'
  resourcesData.value = await ProcessPlanDetailApi.getResourceListByStep(queryParamsResource);
  deviceIds.value = [];
  //制造资源列表过滤设备id
  resourcesData.value.forEach((item) => {
    deviceIds.value.push(item.resourcesTypeId)
  })
  deviceData.value = await ProcessPlanApi.getDeviceListByDeviceIds(deviceIds.value)
}
/** 工步-删除设备操作 */
const handleDeleteDeviceStep = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    queryParamsResource.resourcesType = '1'
    queryParamsResource.resourcesTypeId = id
    // 发起删除
    await ProcessPlanDetailApi.deleteSelectedResourceStep(queryParamsResource)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getDeviceListStep()
  } catch { }
}
</script>
<style scoped>
.node-name {
  margin-top: 10px;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: bold;
  color: #444;
  display: flex;
}
.node-name::before {
  content: "";
  width: 6px;
  height: 15px;
  background-color: rgb(2, 167, 240);
  margin-right: 5px;
  margin-top: 2px;
  border-radius: 8px;
}
.dialog-custom-size {
  width: 800px !important;
  height: 900px !important;
}
</style>
