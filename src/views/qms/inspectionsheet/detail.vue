<template>
  <el-tabs>
    <el-tab-pane label="申请信息">
      <el-form
      ref="formRef"
      :model="formData"
      label-width="100px"
      v-loading="formLoading"
      :border="true"
      >
        <el-row :gutter="24" >
          <el-col :span="8"  >
            <el-form-item label="检验单名称" prop="sheetName" border>
              <el-input v-model="formData.sheetName" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检验单编号" prop="sheetNo" >
              <el-input v-model="formData.sheetNo" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产单号" prop="recordNumber" >
              <el-input v-model="formData.recordNumber" disabled/>
<!--              <el-select v-model="formData.sourceType" disabled>-->
<!--                <el-option-->
<!--                  v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_SHEET_SOURCE_TYPE)"-->
<!--                  :key="dict.value"-->
<!--                  :label="dict.label"-->
<!--                  :value="dict.value"-->
<!--                />-->
<!--              </el-select>-->
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" >
          <el-col :span="8"  >
            <el-form-item label="方案类型" prop="schemeType"  border>
              <el-select v-model="formData.schemeType" disabled>
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.QMS_SCHEME_TYPE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="检验单来源" prop="sourceType" >
              <el-select v-model="formData.sourceType" disabled>
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_SHEET_SOURCE_TYPE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检验人员" prop="assignmentName">
              <el-input v-model="formData.assignmentName" disabled/>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row :gutter="20" >
          <el-col :span="8"  >
            <el-form-item label="物料编号" prop="materialNumber"  border>
              <el-input v-model="formData.materialNumber" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料名称" prop="materialName">
              <el-input v-model="formData.materialName" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物料类型" prop="materialTypeName">
              <el-input v-model="formData.materialTypeName" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 子表的表单 -->
      <el-tabs v-model="subTabsName">
        <el-tab-pane label="不合格品登记" name="unqualifiedItem">
          <UnqualifiedMaterialListForm ref="unqualifiedFormRef" :sheet-scheme-id="inspectionSheetSchemeId" :task-definition-key="taskDefinitionKey" @getCustomVariables="getCustomVariables" :source-type="formData.sourceType"/>
        </el-tab-pane>
      </el-tabs>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
  import UnqualifiedMaterialListForm from './components/sheetScheme/UnqualifiedMaterialListForm.vue'
  import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
  import {InspectionSheetApi } from '@/api/qms/inspectionsheet'

  /** 不合格品登记表单 */
  defineOptions({ name: 'BpmUnqualifiedRegistrationDetail' })
  const props = defineProps<{
    id?: number
    taskDefinitionKey?: string
  }>()
  const route = useRoute()
  const message = useMessage() // 消息弹窗

  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formData = ref({})
  const formRef = ref() // 表单 Ref

  const inspectionSheetSchemeId = ref()
  /** 子表的表单 */
  const subTabsName = ref('unqualifiedItem')
  const unqualifiedFormRef = ref()

  /** 初始化 */
  onMounted(async () => {
    const id = props.id || route.params.id
    if (!id) {
      message.warning('参数错误，合同不能为空！')
      close()
      return
    }
    inspectionSheetSchemeId.value = id;
    formData.value = await InspectionSheetApi.getInspectionSheetInfoBySchemeId(id)
  })

  //定义getCustomVariables 事件，用于作成功后的回调
  const emit = defineEmits(['getCustomVariables'])
  /**
   * 获取表单自定义参数
   */
  const getCustomVariables = async (data) => {
    if(props.taskDefinitionKey=='Activity_1yb07mr' || props.taskDefinitionKey=='Activity_0t9w9z5' || props.taskDefinitionKey=='Activity_19c0j9s' || props.taskDefinitionKey=='Activity_17uqw1a' || props.taskDefinitionKey=='Activity_1srykdr' || props.taskDefinitionKey=='Activity_1afvbwk'){
      let dataMap = {};
      dataMap['unqualifiedMaterials'] = data
      emit('getCustomVariables', dataMap)
    }
  }
</script>

<style lang="scss" scoped>

  .form-scheme {
    padding-left: 0px !important;
    padding-right: 0px !important;
    text-align: center !important;
  }
  .el-card{
    --el-card-padding : 10px  !important;
  }

</style>

