<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
<!--    <template #header="{ close }">-->
<!--      <div class="relative h-54px flex items-center justify-between pl-15px pr-15px">-->
<!--        <slot name="title">区域授权1</slot>-->
<!--        <div class="absolute right-15px top-[50%] h-54px flex translate-y-[-50%] items-center justify-between">-->
<!--          <Icon class="is-hover cursor-pointer" icon="ep:close" hover-color="var(&#45;&#45;el-color-primary)" color="var(&#45;&#45;el-color-info)" @click="close"/>-->
<!--        </div>-->
<!--      </div>-->
<!--    </template>-->
    <el-checkbox v-model="checkAll" label="全选" @change="treeMenuClick" />
    <el-tree
      ref="treeRef"
      style="max-width: 600px"
      :data="treeData"
      :props="defaultProps"
      node-key="key"
      default-expand-all
      check-strictly
      show-checkbox
      :expand-on-click-node="false"
      :check-on-click-node="true"
    />
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import {UserApi, UserVO} from "@/api/macs/user";
import type Node from 'element-plus/es/components/tree/src/model/node'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('区域授权') // 弹窗的标题
const formLoading = ref(false)

let userId = '';
const open = async (row: any) => {
  dialogVisible.value = true;
  checkAll.value = false;
  userId = row.id;
  const userRegionResult = await UserApi.queryTreeListForUserRegion({userId});
  treeData.value = userRegionResult.treeList;
  allTreeKeys.value = userRegionResult.allTreeKeys;
  treeRef.value!.setCheckedKeys(userRegionResult.checkedKeys, false)
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

//tree
const treeRef = ref();
const treeData = ref([]);
const allTreeKeys = ref([]);
const checkAll = ref(false);
const defaultProps = {
  children: 'children',
  label: 'title',
}
const treeMenuClick = () =>  {
  if (checkAll.value) {
    treeRef.value.setCheckedKeys(allTreeKeys.value, false)
  } else {
    treeRef.value!.setCheckedKeys([], false)
  }
}

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 提交请求
  formLoading.value = true
  try {
    await UserApi.userRegionUpdate({'userIds': [userId],'regionIds': treeRef.value!.getCheckedKeys(false)})
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

function handleCancel() {

  dialogVisible();
}
</script>

<style scoped>

</style>
