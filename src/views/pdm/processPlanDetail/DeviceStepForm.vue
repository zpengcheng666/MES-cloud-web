<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <ContentWrap>
      <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px" label-width="68px">
        <el-form-item label="设备编号" prop="code">
          <el-input v-model="queryParams.code" class="!w-240px" clearable placeholder="请输入设备编号" />
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="queryParams.name" class="!w-240px" clearable placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item>
          <el-button @click="getDeviceData">
            <Icon class="mr-5px" icon="ep:search" />搜索
          </el-button>
          <el-button @click="resetQuery">
            <Icon class="mr-5px" icon="ep:refresh" />重置
          </el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>
    <ContentWrap>
      <el-table ref="multipleTable" :data="deviceDataList" style="height:400px;overflow-y: auto"
        @selection-change="handleSelectionChange" :row-key="getRowKeys">
        <el-table-column width="30" label="选择" type="selection" :reserve-selection="true" />
        <el-table-column align="center" label="设备编号" prop="code" />
        <el-table-column align="center" label="设备名称" prop="name" />
        <el-table-column align="center" label="设备规格" prop="specification" />
      </el-table>
    </ContentWrap>
    <template #footer>
      <el-button type="primary" @click="saveSelectedDevice(selectionList.map((item) => item.id))"
        :disabled="selectionList.length === 0">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ProcessPlanApi, DeviceVO } from "@/api/pdm/processPlan";
import { ProcessPlanDetailApi } from '@/api/pdm/processPlanDetail'
import { watch } from 'vue';

defineOptions({ name: 'FeasibilityDeviceForm' })

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const queryFormRef = ref() // 搜索的表单
const deviceDataList = ref([]) // 设备列表
const multipleTable = ref()
const deviceIds = ref([]) // 零件关联的设备id数组

const queryParams = reactive({
  code: '',
  name: '',
  deviceIds: []
})

const selectedDeviceParams = reactive({
  ids: '',
  processVersionId: '',
  procedureId: '',
  stepId: '',
  resourcesType: '1',
  status: '2'
})

/** 打开弹窗 */
const open = async (processVersionId: string, procedureId: string, stepId: string, deviceIdss: string[]) => {
  dialogVisible.value = true
  dialogTitle.value = '选择设备'
  selectedDeviceParams.processVersionId = processVersionId
  selectedDeviceParams.procedureId = procedureId
  selectedDeviceParams.stepId = stepId
  deviceIds.value = deviceIdss
  //获取工序关联设备列表(产线或单机设备)
  let procedureDeviceData = await ProcessPlanDetailApi.getResourceListByProcedure(selectedDeviceParams);
  //过滤产线下设备id
  queryParams.deviceIds = [];
  procedureDeviceData.forEach((item) => {
    queryParams.deviceIds.push(item.resourcesTypeId)
  })
  await getDeviceData()
}

/** 搜索按钮操作 */
const getDeviceData = async () => {
  deviceDataList.value = await ProcessPlanApi.getDeviceTypeListByLineType(queryParams.deviceIds)
  //默认选中已关联的设备
  deviceDataList.value.forEach((item) => {
    if (deviceIds.value.indexOf(item.id) >= 0) {
      multipleTable.value.toggleRowSelection(item, true)
    }
  })
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  getDeviceData()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 选中操作 */
const selectionList = ref<DeviceVO[]>([])
const handleSelectionChange = (rows: DeviceVO[]) => {
  selectionList.value = rows
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

const getRowKeys = (row) => {
  return row.id
}
/** 确定按钮操作 */
const saveSelectedDevice = async (ids: number[]) => {
  try {
    let idsStr = ids.join(',')
    selectedDeviceParams.ids = idsStr;
    await ProcessPlanDetailApi.saveSelectedResourceStep(selectedDeviceParams)
    dialogVisible.value = false
    selectionList.value = selectionList.value.filter((item) => !ids.includes(item.id))
    // 发送操作成功的事件
    emit('success')
  } catch { }
}

watch(dialogVisible, (newFormValue, oldFormValue) => {
  if (!newFormValue && oldFormValue) {
    resetQuery();
  }
});
</script>
