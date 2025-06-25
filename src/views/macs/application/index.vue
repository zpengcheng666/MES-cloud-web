<template>
  <ContentWrap>
    <el-tabs
    v-model="activeName"
    type="card"
    class="demo-tabs"
    @tab-click="(tab) => activeName.name = tab.name"
  >
    <el-tab-pane label="申请信息" name="first">
      <ContentWrap>
        <div style="width: 60%;margin-left: 20%">
          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-width="100px"
            v-loading="formLoading"
          >
            <el-form-item label="申请单号" prop="applicationNumber">
              <el-input v-model="formData.applicationNumber" placeholder="请输入申请单号" />
            </el-form-item>
            <el-form-item label="申请代理人" prop="agent">
              <el-input v-model="formData.agent" placeholder="请输入申请代理人" />
            </el-form-item>
            <el-form-item label="公司组织" prop="organization">
              <el-input v-model="formData.organization" placeholder="请输入公司/组织" />
            </el-form-item>
            <el-form-item label="部门" prop="department">
              <el-input v-model="formData.department" placeholder="请输入部门" />
            </el-form-item>
            <el-form-item label="申请原因目的" prop="reason">
              <el-input type="textarea" v-model="formData.reason" placeholder="请输入申请原因/目的" />
            </el-form-item>
          </el-form>
          <el-button style="margin-left: 10%" @click="submitForm" type="primary" :disabled="formLoading">提 交</el-button>
        </div>
      </ContentWrap>
      <ContentWrap>
        <!-- 子表的表单 -->
        <el-tabs v-model="subTabsName">
          <el-tab-pane label="访客区域权限" name="visitorRegion">
            <VisitorRegionForm ref="visitorRegionFormRef" :application-id="formData.id" />
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
    </el-tab-pane>
    <el-tab-pane label="流程图预览" :lazy="true" name="second">
      <ProcessInstanceBpmnViewer :bpmn-xml="bpmnXML" />
    </el-tab-pane>
  </el-tabs>
  </ContentWrap>
</template>

<script lang="ts" setup>
import {ApplicationApi, ApplicationVO} from "@/api/macs/application";
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import VisitorRegionForm from './VisitorRegionForm.vue'
import { useRouter } from 'vue-router'
import ProcessInstanceBpmnViewer from "../../bpm/processInstance/detail/ProcessInstanceBpmnViewer.vue"
import * as DefinitionApi from '@/api/bpm/definition'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const { push } = useRouter()//路由

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  applicationNumber: undefined,
  agent: undefined,
  organization: undefined,
  department: undefined,
  reason: undefined,
  status: undefined
})
const formRules = reactive({
  applicationNumber: [{ required: true, message: '单号不能为空', trigger: 'blur' }],
  agent: [{ required: true, message: '代理人不能为空', trigger: 'blur' }],
  organization: [{ required: true, message: '公司不能为空', trigger: 'blur' }],
  department: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
  reason: [{ required: true, message: '申请原因不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const bpmnXML = ref() // BPMN 数据
const activeName = ref('first') // 列表 tab

const createBpmView = async () => {
  const processDefinitionDetail = await DefinitionApi.getProcessDefinition(
    undefined,
    "macs_application"
  )
  // const processDefinitionDetail = await DefinitionApi.getProcessDefinition(query.bid)
  if (!processDefinitionDetail) {
    message.error('访客申请流程模型未配置，请检查！')
    return
  }
  bpmnXML.value = processDefinitionDetail.bpmnXml
}

/** 子表的表单 */
const subTabsName = ref('visitorRegion')
const visitorRegionFormRef = ref()

const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  try {
    await visitorRegionFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'visitorRegion'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ApplicationVO
    // 拼接子表的数据
    data.visitorRegions = visitorRegionFormRef.value.getData();
    data.status = '0'
    await ApplicationApi.createAccessApplication(data)
    message.success(t('common.createSuccess'))
    setTimeout(()=>{push('/macs/access-application')},1000)
  } finally {
      formLoading.value = false;
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    applicationNumber: undefined,
    agent: undefined,
    organization: undefined,
    department: undefined,
    reason: undefined,
    status: undefined
  }
  formRef.value?.resetFields()
}

onMounted(() => {
  createBpmView()
})
</script>

<style scoped>

</style>
