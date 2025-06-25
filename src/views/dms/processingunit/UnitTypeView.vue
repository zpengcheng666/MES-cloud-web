<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="" prop="unitNumber">
        <el-input
          v-model="queryParams.unitNumber"
          placeholder="请输入单元编码"
          clearable
          @keyup.enter="handleQuery"
          style="width: 270px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table max-height="450px" ref="batchTable" @cell-click="cellCheck" @select="selectionChange" v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column type="selection" width="55" />
      <el-table-column label="类型编码" align="center" prop="unitNumber" />
      <el-table-column label="名称" align="center" prop="unitName" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ProcessingUnitTypeForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ProcessingUnitTypeApi, ProcessingUnitTypeVO } from '@/api/dms/processingunittype'
import ProcessingUnitTypeForm from './ProcessingUnitTypeForm.vue'

/** 生产单元类型 列表 */
defineOptions({ name: 'UnitTypeView' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ProcessingUnitTypeVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  unitNumber: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

const emit = defineEmits(['type-select'])

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await ProcessingUnitTypeApi.getProcessingUnitTypeList(queryParams)
  } finally {
    loading.value = false
  }
}

const batchTable = ref();
let selectRowId = '';
const selectionChange = (newSelection: any[]) => {
  let row = null;
  if (newSelection.length > 0) {
    row = newSelection[newSelection.length - 1];
    selectRowId = row.id;
  } else {
    selectRowId = '';
  }
  batchTable.value.clearSelection();
  if (row) {
    batchTable.value.toggleRowSelection(row, true)
  }
  emit('type-select', row);
}

const cellCheck = (row: any) => {
  if (row.id == selectRowId) {
    selectionChange([])
  } else {
    selectionChange([row])
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ProcessingUnitTypeApi.deleteProcessingUnitType(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ProcessingUnitTypeApi.exportProcessingUnitType(queryParams)
    download.excel(data, '生产单元类型.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
