<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
      :border="true"
    >

      <!--<el-row :gutter="20" >-->
        <!--<el-col :span="4" class="form-scheme">-->
          <!--<el-card shadow="hover" class="scheme-card"><el-tag type="primary">方案名称</el-tag> </el-card>-->
        <!--</el-col>-->
        <!--<el-col :span="4"  class="form-scheme">-->
          <!--<el-card shadow="hover" class="scheme-card"><el-tag type="info" >{{formData.schemeName}}</el-tag> </el-card>-->
        <!--</el-col>-->

        <!--<el-col :span="4" class="form-scheme">-->
          <!--<el-card shadow="hover" class="scheme-card"><el-tag type="primary">方案编号</el-tag> </el-card>-->
        <!--</el-col>-->
        <!--<el-col :span="4"  class="form-scheme">-->
          <!--<el-card shadow="hover" class="scheme-card"><el-tag type="info" >{{formData.schemeNo}}</el-tag> </el-card>-->
        <!--</el-col>-->

      <!--<el-col :span="4" class="form-scheme">-->
        <!--<el-card shadow="hover" class="scheme-card"><el-tag type="primary">方案类型</el-tag> </el-card>-->
      <!--</el-col>-->
      <!--<el-col :span="4"  class="form-scheme">-->
        <!--<el-card shadow="hover" class="scheme-card"><el-tag type="info" >{{formData.schemeType ==1?"来料检验" :"生产检验"}} </el-tag></el-card>-->
      <!--</el-col>-->
      <!--</el-row>-->


        <el-row :gutter="20" >
        <el-col :span="8"  >

          <el-form-item label="方案名称" prop="schemeName"  border>
            <el-input v-model="formData.schemeName" placeholder="请输入方案名称" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="方案编号" prop="schemeNo">
            <el-input v-model="formData.schemeNo" placeholder="请输入方案编号" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="方案类型" prop="schemeType">
            <el-select v-model="formData.schemeType" placeholder="" disabled>
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_SCHEME_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"

              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="false">
        <el-col :span="8">
          <el-form-item label="检验级别" prop="inspectionLevel">
            <el-input v-model="formData.inspectionLevel" placeholder="" disabled/>
          </el-form-item>
        </el-col>
        <!--<el-form-item label="是否生效" prop="isEffective">-->
        <!--<el-input v-model="formData.isEffective" placeholder="请输入是否生效"/>-->
        <!--</el-form-item>-->
        <el-col :span="8">
          <el-form-item label="抽样规则" prop="samplingNo">
            <el-input v-model="formData.samplingNo" placeholder="" disabled/>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row :gutter="20" v-if="false">
        <el-col :span="8">

          <el-form-item label="抽样准则" prop="samplingLimitType">

            <el-select v-model="formData.samplingLimitType" placeholder="请选择抽样准则" disabled>
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_SAMPLING_LIMIT_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            <!--<el-input v-model="formData.samplingLimitType" placeholder="请输入工艺ID"/>-->
          </el-form-item>
        </el-col>
        <el-col :span="8">

          <el-form-item label="接收质量限" prop="acceptanceQualityLimit">
            <el-input-number v-model="formData.acceptanceQualityLimit" placeholder="请输入接收质量限"  :precision="3" :step="0.1" disabled/>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="物料编号" prop="materialNumber">
            <el-input v-model="formData.materialNumber" placeholder="请输入物料编号" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物料名称" prop="materialName">
            <el-input v-model="formData.materialName" placeholder="请输入物料名称" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物料类型" prop="materialTypeName" >
            <el-input v-model="formData.materialTypeName" placeholder="请输入物料名称" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">

        <el-col :span="8">
          <el-form-item label="物料规格" prop="materialSpecification">
            <el-input v-model="formData.materialSpecification" placeholder="" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物料单位" prop="materialUnit">
            <el-input v-model="formData.materialUnit" placeholder="" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="工艺" prop="technologyName">
            <el-input v-model="formData.technologyName" placeholder="" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工序" prop="procedureName">
            <el-input v-model="formData.procedureName" placeholder="" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>



    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="检验方案检测项目详情" name="inspectionSchemeItem">
        <InspectionSchemeDetailList ref="inspectionSchemeItemFormRef" :inspection-scheme-id="formData.id"/>
      </el-tab-pane>


      <!--<el-tab-pane label="抽样规则" name="ruleName">-->
        <!--<ContentWrap>-->
          <!--<el-table v-loading="loading" :data="samplingrules"  :border="true">-->
            <!--&lt;!&ndash;<el-table-column label="主键" align="center" prop="id" />&ndash;&gt;-->
            <!--<el-table-column label="样本数字码" align="center" prop="samplingNo"/>-->
            <!--<el-table-column label="抽取数量（百分比）" align="center" prop="samplingNumber"/>-->
            <!--<el-table-column label="最大不合格数（百分比）" align="center" prop="maxUnqualifiedQuantity"/>-->
          <!--</el-table>-->
        <!--</ContentWrap>-->


      <!--</el-tab-pane>-->
    </el-tabs>

  </Dialog>
</template>
<script setup lang="ts">
  import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
  import {InspectionSchemeApi, InspectionSchemeVO} from '@/api/qms/inspectionscheme'
  import InspectionSchemeDetailList from './components/InspectionSchemeDetailList.vue'
  import { SamplingRuleApi, SamplingRuleVO } from '@/api/qms/samplingrule'
  /** 检验方案 表单 */
  defineOptions({name: 'InspectionSchemeInfo'})

  const {t} = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formType = ref('') // 表单的类型：create - 新增；update - 修改
  const formData = ref({
    id: undefined,
    schemeName: undefined,
    schemeNo: undefined,
    schemeType: undefined,
    materialConfigId: undefined,
    inspectionLevel: undefined,
    isEffective: undefined,
    materialNumber: undefined,
    materialName: undefined,
    materialType: undefined,
    materialTypeName: undefined,
    materialSpecification: undefined,
    materialUnit: undefined,
    technologyId: undefined,
    processId: undefined,
    samplingRuleId: undefined,
  })
  const formRules = reactive({
  })
  const formRef = ref() // 表单 Ref

  /** 子表的表单 */
  const subTabsName = ref('inspectionSchemeItem')
  const inspectionSchemeItemFormRef = ref()
  const samplingrules = ref<SamplingRuleVO[]>([]) // 列表的数据
  /** 打开弹窗 */
  const open = async (type: string, id
    ? : number
  ) =>
  {
    subTabsName.value='inspectionSchemeItem'
    dialogVisible.value = true
    dialogTitle.value = '方案详情'
    samplingrules.value=[]
    formType.value = type
    resetForm()
    formData.value.id= id;
    // 修改时，设置数据
    if (id) {
      formLoading.value = true
      try {
        formData.value = await
        InspectionSchemeApi.getInspectionScheme(id)


        const  samplingRule = {
          samplingNo: formData.value.samplingNo,
          samplingNumber: formData.value.samplingNumber,
          maxUnqualifiedQuantity: formData.value.maxUnqualifiedQuantity
        }
        samplingrules.value.push(samplingRule)
      } finally {
        formLoading.value = false
      }
    }
  }
  defineExpose({open}) // 提供 open 方法，用于打开弹窗

  /** 重置表单 */
  const resetForm = () => {
    formData.value = {
      id: undefined,
      schemeName: undefined,
      schemeNo: undefined,
      schemeType: undefined,
      materialConfigId: undefined,
      inspectionLevel: undefined,
      isEffective: undefined,
      materialNumber: undefined,
      materialName: undefined,
      materialType: undefined,
      materialTypeName: undefined,
      materialSpecification: undefined,
      materialUnit: undefined,
      technologyId: undefined,
      processId: undefined,
      samplingRuleId: undefined,
    }
    formRef.value?.resetFields()
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

