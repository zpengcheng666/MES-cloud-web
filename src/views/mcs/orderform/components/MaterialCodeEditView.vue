<template>
  <Dialog title="物料编码" v-model="dialogVisible">
    <el-form :inline="true">
      <el-form-item style="width: 70%" label="订单编号" prop="orderNumber">
        <el-input v-model="materialCode" placeholder="请输入订单编号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd"> <Icon icon="ep:plus" class="mr-5px" /> 添加</el-button>
      </el-form-item>
    </el-form>
    <span class="mr-5px" :key="item" v-for="item in materialCodeList">
      {{item}}
      <el-button @click="handleRemove(item)" link><Icon icon="ep:delete" /></el-button>
    </span>
    <template #footer>
      <el-button @click="submitForm" type="primary">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
const dialogVisible = ref(false) // 弹窗的是否展示
const materialCode = ref("") // 输入内容
const materialCodeList = ref([]) // 已输入的内容
const message = useMessage() // 消息弹窗

const open = (list: String[]) => {
  dialogVisible.value = true;
  if (list) {
    materialCodeList.value = list;
  } else {
    materialCodeList.value = [];
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const handleAdd = () => {
  if (!materialCode.value) {
    message.warning("无效编码");
    return
  }
  if (materialCodeList.value.includes(materialCode.value)) {
    message.warning("编码重复")
  } else {
    materialCodeList.value.push(materialCode.value);
    materialCode.value = "";
  }
}
const handleRemove = (val) => {
  materialCodeList.value = materialCodeList.value.filter(item => item !== val);
}

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = () => {
  if (materialCodeList.value) {
    emit('success', materialCodeList.value.join(","))
    dialogVisible.value = false;
  } else {
    emit('success', null)
  }
}

</script>

<style scoped>

</style>
