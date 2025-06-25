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
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="告警类型" prop="alarmType">
        <el-select
          v-model="queryParams.alarmType"
          placeholder="请选择告警类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WMS_ALARM_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="告警源" prop="alarmSource">
        <el-input
          v-model="queryParams.alarmSource"
          placeholder="请输入告警源"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="告警级别" prop="alarmLevel">
        <el-select
          v-model="queryParams.alarmLevel"
          placeholder="请选择告警级别"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WMS_ALARM_LEVEL)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="告警编号" prop="alarmNum">
        <el-input
          v-model="queryParams.alarmNum"
          placeholder="请输入告警编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="告警描述" prop="alarmDesc">
        <el-input
          v-model="queryParams.alarmDesc"
          placeholder="请输入告警描述"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="异常状态" prop="alarmState">
        <el-select
          v-model="queryParams.alarmState"
          placeholder="请选择异常状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WMS_ALARM_STATE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['wms:alarm:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wms:alarm:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">

      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="告警类型" align="center" prop="alarmType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_ALARM_TYPE" :value="scope.row.alarmType" />
        </template>
      </el-table-column>
      <el-table-column label="告警源" align="center" prop="alarmSource" />
      <el-table-column label="告警级别" align="center" prop="alarmLevel">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_ALARM_LEVEL" :value="scope.row.alarmLevel" />
        </template>
      </el-table-column>
      <el-table-column label="告警编号" align="center" prop="alarmNum" />
      <el-table-column label="告警描述" align="center" prop="alarmDesc" />
      <el-table-column
          label="解除时间"
          align="center"
          prop="alarmTime"
          :formatter="dateFormatter"
          width="180px"
        />
      <el-table-column label="告警态" align="center" prop="alarmState">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_ALARM_STATE" :value="scope.row.alarmState" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['wms:alarm:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['wms:alarm:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <AlarmForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AlarmApi, AlarmVO } from '@/api/wms/alarm'
import AlarmForm from './AlarmForm.vue'

/** 异常 列表 */
defineOptions({ name: 'Alarm' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<AlarmVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  alarmType: undefined,
  alarmSource: undefined,
  alarmLevel: undefined,
  alarmNum: undefined,
  alarmDesc: undefined,
  alarmTime: [],
  alarmState: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AlarmApi.getAlarmPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
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
    await AlarmApi.deleteAlarm(id)
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
    const data = await AlarmApi.exportAlarm(queryParams)
    download.excel(data, '异常.xls')
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
