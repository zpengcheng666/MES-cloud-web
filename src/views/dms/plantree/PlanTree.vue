<template>
  <ContentWrap>
    <el-input v-model="filterText" placeholder="查找节点" />
    <el-row :gutter="20" style="margin: 10px">
      <el-col :span="8">
        <el-button type="success" @click="openForm('create', undefined)">新增</el-button>
      </el-col>
      <el-col :span="8">
        <el-button type="warning" @click="openForm('update', nowTree.id)">修改</el-button>
      </el-col>
      <el-col :span="8">
        <el-button type="danger" @click="handleDelete(nowTree)">删除</el-button>
      </el-col>
    </el-row>
  </ContentWrap>

  <ContentWrap>
    <el-tree
      style="margin-top: 10px"
      class="elTree"
      :data="treeData"
      ref="treeRef"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
      default-expand-all
      show-checkbox
      check-strictly
      highlight-current
      :expand-on-click-node="false"
      node-key="id"
      @check-change="funCheckChange"
    />
  </ContentWrap>
  <PlanTreeForm ref="planTreeFormRef" @success="getList" />
</template>

<script setup lang="ts">
/***************声明***************************/
import { PlanTreeApi } from '@/api/dms/plantree'
const emit = defineEmits(['click', 'noClick'])

/*****************通用********************/

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const treeRef = ref()

const treeData = ref<any[]>([])
const getList = async () => {
  treeData.value = await PlanTreeApi.getPlanTreeObject()
}

/******************搜索***************/
const filterText = ref('')
function filterNode(value, data, node) {
  if (data.label.includes(filterText.value)) {
    return true
  }
  return false
}

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

/*******************点击/选择******************/

const nowTree = ref({
  id: undefined,
  parent: undefined,
  name: undefined,
  remark: undefined,
  deviceId: undefined,
  deviceTypeId: undefined
})

let isSetCheck = false
async function setCheck(id) {
  isSetCheck = true
  if (isBlank(id)) {
    await treeRef.value.setCheckedKeys([])
  } else {
    await treeRef.value.setCheckedKeys([id])
  }
  isSetCheck = false
}

function isSelect(data) {
  nowTree.value = data
  setCheck(data.id)
  emit('click', data)
}
function isUnselect() {
  nowTree.value = {
    id: undefined,
    parent: undefined,
    name: undefined,
    remark: undefined,
    deviceId: undefined,
    deviceTypeId: undefined
  }
  setCheck(null)
  emit('noClick')
}

const handleNodeClick = (data) => {
  if (treeRef.value.getCheckedKeys().includes(data.id)) {
    isUnselect()
  } else {
    isSelect(data)
  }
}

function funCheckChange(data, isCheck) {
  if (isSetCheck == false) {
    if (isCheck) {
      isSelect(data)
    } else {
      isUnselect()
    }
  }
}

/********************新增/修改******************/

import PlanTreeForm from '../plantree/PlanTreeForm.vue'
const planTreeFormRef = ref()
const openForm = (type, id) => {
  if (type == 'create') {
    planTreeFormRef.value.open(type)
  } else if (type == 'update') {
    if (isBlank(id)) return
    planTreeFormRef.value.open(type, id)
  }
}

/**********************删除***************/

import { InspectionPlanApi, InspectionPlanVO } from '@/api/dms/inspectionplan'
import { MaintenancePlanApi, MaintenancePlanVO } from '@/api/dms/maintenanceplan'

/** 删除按钮操作 */
const handleDelete = async (tree) => {
  if (isBlank(tree) || isBlank(tree.id)) return
  if (tree.children.length != 0) {
    await message.alertError('存在子节点，无法删除')
    return
  }
  if (await MaintenancePlanApi.getMaintenancePlanTree(tree.id)) {
    await message.alertError('存在关联保养维护计划，无法删除')
    return
  }
  if (await InspectionPlanApi.hasInspectionPlanTree(tree.id)) {
    await message.alertError('存在关联检查计划，无法删除')
    return
  }
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await PlanTreeApi.deletePlanTree(tree.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/***********************初始化************/

onMounted(() => {
  getList()
})

/***********************工具*********************/
function isBlank(v: any): boolean {
  if (v == undefined || v == null || (typeof v?.trim == 'function' && v?.trim() == '')) {
    return true
  }
  return false
}
</script>
<style scope>
.elTree {
  width: 80%;
  padding-left: 20px;
}

.el-tree {
  --el-tree-node-content-height: 30px;
  font-size: 15px;
}
</style>
