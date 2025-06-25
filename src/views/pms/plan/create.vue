<template>

  <ContentWrap>

    <el-tabs
      v-model="activeName"
      type="card"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="申请信息" name="first">
        <el-card class="box-card">
          <div class="clearfix">
            <span class="el-icon-document">申请信息【{{ selectProcessDefinitionName }}】</span>
            <el-button style="float: right" type="primary" @click="selectOtherProcessDefinition">
              <Icon icon="ep:delete" /> 选择其它流程
            </el-button>
          </div>
          <el-row >
            <el-col :span="18" :offset="4" style="margin-top: 20px">
              <el-form
                ref="formRef"
                :model="formData"
                :rules="formRules"
                label-width="100px"
                v-loading="formLoading"
              >
                <el-form-item label="项目订单编号" prop="projectOrderId">
                  <el-select v-model="formData.projectOrderId" placeholder="请选择项目订单编号">
                    <el-option
                      v-for="item in projectOrderList"
                      :key="item.id"
                      :label="item.projectName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="formData.remark" placeholder="请输入备注" />
                </el-form-item>
              </el-form>

              <el-col v-if="startUserSelectTasks.length > 0">
                <el-card class="mb-10px">
                  <template #header>指定审批人</template>
                  <el-form
                    :model="startUserSelectAssignees"
                    :rules="startUserSelectAssigneesFormRules"
                    ref="startUserSelectAssigneesFormRef"
                  >
                    <el-form-item
                      v-for="userTask in startUserSelectTasks"
                      :key="userTask.id"
                      :label="`任务【${userTask.name}】`"
                      :prop="userTask.id"
                    >
                      <el-select
                        v-model="startUserSelectAssignees[userTask.id]"
                        multiple
                        placeholder="请选择审批人"
                      >
                        <el-option
                          v-for="user in userList"
                          :key="user.id"
                          :label="user.nickname"
                          :value="user.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-form>
                </el-card>
              </el-col>

              <!-- 子表的表单 -->
              <el-tabs v-model="subTabsName">
                <div style="margin-bottom: 20px">
                  <el-button @click="getPurchaseTime(formData.projectOrderId)" type="primary">获取采购完成时间</el-button>
                </div>
                <el-tab-pane label="项目计划子表，产品计划完善" name="planItem">
                  <PlanItemForm ref="planItemFormRef" :project-plan-id="formData.id" />
                </el-tab-pane>
              </el-tabs>

              <el-form-item>
                <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="流程图预览" :lazy="true" name="second">
        <ProcessInstanceBpmnViewer :bpmn-xml="bpmnXML as any" />
      </el-tab-pane>


    </el-tabs>
  </ContentWrap>

</template>
<script setup lang="ts">
import { PlanApi, PlanVO } from '@/api/pms/plan'
import { OrderApi } from '@/api/pms/order'
import PlanItemForm from './components/PlanItemForm.vue'
import { useTagsViewStore } from '@/store/modules/tagsView'
import * as UserApi from '@/api/system/user'
import * as DefinitionApi from '@/api/bpm/definition'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
/** bpm修改 */
import ProcessInstanceBpmnViewer from '../../bpm/processInstance/detail/ProcessInstanceBpmnViewer.vue'
/***********/
defineOptions({ name: 'PMSPlanCreate' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由
const { query } = useRoute()

/** bpm修改 */
const selectProcessDefinitionName = ref('');
const activeName = ref('first')
const bpmnXML = ref(null) // BPMN 数据

/***********/

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  projectOrderId: undefined,
  remark: undefined,
  status: undefined,
  processInstanceId: undefined,
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

//项目订单
const projectOrderList = ref([])

/** 子表的表单 */
const subTabsName = ref('planItem')
const planItemFormRef = ref()

// 指定审批人
const processDefineKey = 'pms_plan' // 流程定义 Key
const startUserSelectTasks = ref([]) // 发起人需要选择审批人的用户任务列表
const startUserSelectAssignees = ref({}) // 发起人选择审批人的数据
const startUserSelectAssigneesFormRef = ref() // 发起人选择审批人的表单 Ref
const startUserSelectAssigneesFormRules = ref({}) // 发起人选择审批人的表单 Rules
const userList = ref<any[]>([]) // 用户列表


/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 校验指定审批人
  if (startUserSelectTasks.value?.length > 0) {
    await startUserSelectAssigneesFormRef.value.validate()
  }

  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as PlanVO
    // 拼接子表的数据
    data.planItems = planItemFormRef.value.getData()
    // 设置指定审批人
    if (startUserSelectTasks.value?.length > 0) {
      data.startUserSelectAssignees = startUserSelectAssignees.value
    }
    await PlanApi.createPlanBpm(data)
    message.success(t('common.createSuccess'))
    // 发送操作成功的事件
    emit('success')
    // 关闭当前 Tab
    delView(unref(currentRoute))
    // await push({ name: 'OaMeeting' })
    await push({ name: 'BpmProcessInstanceMy' })
  } catch (e) {
    console.log(e)
  }

  finally {

    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    projectOrderId: undefined,
    remark: undefined,
    status: undefined,
    processInstanceId: undefined,
  }
  formRef.value?.resetFields()
}

/**
 * 监听项目订单id的变化,查询订单下的产品
 */
watch(() => formData.value.projectOrderId,(val) => {
  if (val) {
    getOrderList(val)
    setProjectCode(val)
  }

},{deep: true})

/**
 * 根据订单id获得具体的订单
 */
const getOrderList =async (val)=>{
  const data =await OrderApi.getOrderListByProjectOrderId(val);
  planItemFormRef.value.setData(data)

}
const setProjectCode = async (val)=>{
  const row =   await OrderApi.getOrder(val);
  planItemFormRef.value.projectCode = row.projectCode;
  // planItemFormRef.value.selectList(-1);
}

/** 初始化 */
onMounted(async () => {
  /** bpm修改   */
  // 加载流程图
  const processDefinitionDetail = await DefinitionApi.getProcessDefinition(
    undefined,
    processDefineKey
  )
  if(query.bid){
    selectProcessDefinitionName.value = query.bname;
  }else {
    selectProcessDefinitionName.value = processDefinitionDetail.name;
  }
  if (!processDefinitionDetail) {
    message.error('PMS 立项流程模型未配置，请检查！')
    return
  }
  bpmnXML.value = processDefinitionDetail.bpmnXml

  /**************/
  startUserSelectTasks.value = processDefinitionDetail.startUserSelectTasks
  // 设置指定审批人
  if (startUserSelectTasks.value?.length > 0) {
    // 设置校验规则
    for (const userTask of startUserSelectTasks.value) {
      startUserSelectAssignees.value[userTask.id] = []
      startUserSelectAssigneesFormRules.value[userTask.id] = [
        { required: true, message: '请选择审批人', trigger: 'blur' }
      ]
    }

  }
  // 加载用户列表
  userList.value = await UserApi.getSimpleUserList()
  projectOrderList.value =  await OrderApi.getAll()
  if(query.id){
    formData.value = await PlanApi.getPlan(query.id)
    const data = await PlanApi.getPlanItemListByProjectPlanId(formData.value.id)
    planItemFormRef.value.setData(data)

  }
})

/** bpm修改信息  */
const selectOtherProcessDefinition = ()=>{
  // 关闭当前 Tab
  delView(unref(currentRoute))
  push({name:'BpmProcessInstanceCreate'})
}

const handleClick = (tab, event) => {

}
/***************/
/**
 * 获取采购完成时间
 * @param id,项目订单id
 */
const getPurchaseTime = async (id)=>{
  if(id===undefined){
    message.warning("请先选择订单")
    return
  }
  const rows = projectOrderList.value.filter(val=>{
    return val.id === id;
  })
  const row = rows[0];
  console.log(row)
  const projectId = row.projectId;
  //根据id查询合同
  let ids = [1];
  const contractList =  await ContractApi.getContractListByType(ids);
  //TODO 合同这里暂时还没传我的项目id,我就先不过滤了
  const contractData = contractList.filter((val)=>{
    // return val.projectId === projectId;
    return true;
  })

  const contractProduct = [];
  for(let i=0;i<contractData.length;i++){
    const rows = await ContractApi.getContractOrderListByContractId(contractData[i].id)
    contractProduct.push(...rows);
  }


  //给时间赋值
  const data = planItemFormRef.value.getData()
  data.forEach((item=>{
    contractProduct.forEach((val)=>{
      if(item.materialId ===val.materialId){
        // item.purchaseCompletionTime = val.leadDate>item.purchaseCompletionTime?val.leadDate:item.purchaseCompletionTime;
        if(item.purchaseCompletionTime!=undefined){
          item.purchaseCompletionTime = val.leadDate>item.purchaseCompletionTime?val.leadDate:item.purchaseCompletionTime;
        }else {
          item.purchaseCompletionTime = val.leadDate;
        }

      }
    })
  }))
  planItemFormRef.value.setData(data)
}
</script>
