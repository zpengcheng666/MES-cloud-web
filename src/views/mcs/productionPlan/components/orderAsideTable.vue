<template>
  <ContentWrap v-show="sharedInfo.orderIdList?.length > 0">
    <el-button type="primary" @click="createPlanItem"><Icon icon="ep:plus" class="mr-5px" /> 下单</el-button>
  </ContentWrap>
  <ContentWrap class="h-1/1">
    <el-input
      v-model="filterText"
      placeholder="请输入订单编号"
      clearable
    />
    <el-tree ref="treeRef" :data="treeList" :expand-on-click-node="false" :check-on-click-node="true" :filter-node-method="filterNode" show-checkbox
             :props="defaultProps" default-expand-all node-key="id" @check="handleNodeClick" />
  </ContentWrap>
</template>

<script lang="ts" setup>
import {onMounted, watch, inject} from "vue";
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import {PlanApi} from "@/api/pms/plan";
import {ElTree} from "element-plus";

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const loading = ref(false)
const treeList = ref<Tree[]>([])
const filterText = ref()
const sharedInfo = inject("sharedInfo");

const defaultProps = {
  children: 'children',
  label: 'partNumber',
  value: 'id',
  emitPath: false // 用于 cascader 组件：在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
}

const getList = async () => {
  loading.value = true
  try {
    const data = await PlanApi.getPlanWith({})
    let dataMap = {};
    for (let element of data) {
      let parent = dataMap[element.projectCode]
      if (!parent) {
        parent = {
          partNumber: element.projectCode,
          children: []
        }
        dataMap[element.projectCode] = parent;
        treeList.value.push(parent)
      }
      parent.children.push(element);
    }
  } finally {
    loading.value = false
  }
}
sharedInfo.orderAsideReload = getList;

const treeRef = ref<InstanceType<typeof ElTree>>()
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const filterNode = (code: string, data: any) => {
  if (!code) return true
  return data.partNumber.includes(code)
}

const handleNodeClick = async () => {
  sharedInfo.orderIdList = treeRef.value.getCheckedKeys(true);
}
//原项目计划的下单
const createPlanItem = async () =>{
  await PlanApi.createPlanItemByIds(sharedInfo.orderIdList)
  message.success(t('common.createSuccess'))
}

onMounted(() => {
  getList()
})
</script>

<style scoped>

</style>
