<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="父节点" prop="parent">
        <el-tree-select
          v-model="formData.parent"
          :data="treeData"
          :render-after-expand="false"
          clearable
          check-strictly
          placeholder="请选择父节点"
          :disabled="formType == 'update'"
          @current-change="onChangeNodeType"
        />
      </el-form-item>
      <el-form-item label="节点名" prop="nodeName">
        <el-select
          v-model="formData.nodeId"
          placeholder="请选择"
          clearable
          @change="onChangeNode"
          v-show="formData.selectFlag == 0"
        >
          <el-option
            v-for="dict in nodeDataList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
        <el-input v-show="(formData.parent == null || formData.selectFlag == 1)" v-model="formData.nodeName" placeholder="请输入节点名" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows="5" v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ManagementTreeApi, ManagementTreeVO } from '@/api/qms/managementtree'
import {CompanyApi} from '@/api/ppm/company'
import {MaterialConfigApi} from "@/api/wms/materialconfig";
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

defineOptions({ name: 'PlanTreeForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const treeData = ref<any[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  parent: undefined,
  nodeId: undefined,
  nodeName: undefined,
  nodeType: undefined,
  remark: undefined,
  // 标记是否为下拉
  selectFlag: undefined
})
const formRules = reactive({
  nodeName: [{ required: true, message: '节点名不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  treeData.value = await ManagementTreeApi.getPlanTreeObject()

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ManagementTreeApi.getManagementTree(id)

      if(formData.value.parent == null){
        return
      }
      const parentNode = await ManagementTreeApi.getManagementTree(formData.value.parent)
      await onChangeNodeType(parentNode)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/**
 * 选择节点查节点名称
 */
const onChangeNode = async () => {
  const nodes = nodeDataList.value.filter((item) => item.value == formData.value.nodeId)
  formData.value.nodeName = nodes[0].label
}

// 节点集合
const nodeDataList = ref([])
/** 修改节点类型 */
const onChangeNodeType = async (node) => {
  formData.value.selectFlag = 0

  // 选中根节点
  if(node.nodeType == 0){
    // 查询销售客户列表
    const companyList = await CompanyApi.getCompanyListByType("2,3")
    nodeDataList.value = companyList.map(d =>({label:d.name, value:d.id}) )
  }
  // 选中销售客户
  else if (node.nodeType == 1){

    console.log(111, node.nodeType)

    // 查询物料类型
    const materialTypeList = await MaterialConfigApi.getMaterialConfigList()
    nodeDataList.value = materialTypeList.map(d =>({label:d.materialName, value:d.id}) )
  }
  // 选中产品
  else if (node.nodeType == 2){

    console.log(222, node.nodeType)

    // 查询资料库集合
    // const datebaseList = getIntDictOptions(DICT_TYPE.QMS_MANAGEMENT_DATABASE_TYPE)
    // nodeDataList.value = datebaseList
    formData.value.selectFlag = 1
  }
}

/** 提交表单 */
const emit = defineEmits(['success'])
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ManagementTreeVO
    if (formType.value === 'create') {
      await ManagementTreeApi.createManagementTree(data)
      message.success(t('common.createSuccess'))
    } else {
      await ManagementTreeApi.updateManagementTree(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    parent: undefined,
    nodeId: undefined,
    nodeName: undefined,
    nodeType: undefined,
    remark: undefined,
    selectFlag: undefined
  }
  formRef.value?.resetFields()
}

</script>
