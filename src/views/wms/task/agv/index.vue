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
     
    <el-form-item label="小车编号" prop="carNo">
        <el-input
          v-model="queryParams.x"
          placeholder="请输入小车编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="运行模式" prop="mode">
        <el-select
          v-model="queryParams.mode"
          placeholder="请选择机器人运行模式"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MODE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="x 坐标" prop="x">
        <el-input
          v-model="queryParams.x"
          placeholder="请输入机器人的 x 坐标, 单位 m"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="y坐标" prop="y">
        <el-input
          v-model="queryParams.y"
          placeholder="请输入机器人的 y坐标, 单位 m"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="当前站点" prop="currentStation">
        <el-input
          v-model="queryParams.currentStation"
          placeholder="请输入机器人当前所在站点"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="上一站点" prop="lastStation">
        <el-input
          v-model="queryParams.lastStation"
          placeholder="请输入机器人上一个所在站点
"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="是否静止" prop="isStop">
        <el-select
          v-model="queryParams.isStop"
          placeholder="请选择机器人底盘是否静止（行走电机）"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否被阻挡" prop="blocked">
        <el-select
          v-model="queryParams.blocked"
          placeholder="请选择机器人是否被阻挡
"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否急停" prop="emergency">
        <el-select
          v-model="queryParams.emergency"
          placeholder="请选择true 表示急停按钮处于激活状态(按	下), false 表示急停按钮处于非激活状	态(拔起)"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="taskStatus">
        <el-select
          v-model="queryParams.taskStatus"
          placeholder="请选择0 = NONE, 1 = WAITING(目前不可能	出现该状态), 2 = RUNNING, 3 =	SUSPENDED, 4 = COMPLETED, 5 =	FAILED, 6 = CANCELED"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WMS_AGV_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="自身库位" prop="locationId">
        <el-select
          v-model="queryParams.locationId"
          placeholder="请选择自身库位"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
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
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['wms:AGV:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wms:AGV:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- <el-table-column label="ID" align="center" prop="id" /> -->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="小车编号" align="center" prop="carNo" />

      <el-table-column label="运行模式" align="center" prop="mode">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_MODE" :value="scope.row.mode" />
        </template>
      </el-table-column>
      <el-table-column label="x 坐标" align="center" prop="x" />
      <el-table-column label="y坐标" align="center" prop="y" />
      <el-table-column label="当前所在站点" align="center" prop="currentStation" />
      <el-table-column label="上一所在站点" align="center" prop="lastStation" />
      <el-table-column label="是否静止" align="center" prop="isStop">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.isStop" />
        </template>
      </el-table-column>
      <el-table-column label="是否被阻挡" align="center" prop="blocked">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.blocked" />
        </template>
      </el-table-column>
      <el-table-column label="是否急停" align="center" prop="emergency">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.emergency" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="taskStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_AGV_STATUS" :value="scope.row.taskStatus" />
        </template>
      </el-table-column>
      <el-table-column label="自身库位" align="center" prop="locationId" />
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['wms:AGV:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['wms:AGV:delete']"
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
  <AGVForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, getStrDictOptions, getBoolDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AGVApi, AGVVO } from '@/api/wms/agv'
import AGVForm from './AGVForm.vue'

/** AGV 信息 列表 */
defineOptions({ name: 'AGV' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<AGVVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  carNo: undefined,
  mode: undefined,
  x: undefined,
  y: undefined,
  currentStation: undefined,
  lastStation: undefined,
  isStop: undefined,
  blocked: undefined,
  emergency: undefined,
  taskStatus: undefined,
  locationId: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AGVApi.getAGVPage(queryParams)
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
    await AGVApi.deleteAGV(id)
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
    const data = await AGVApi.exportAGV(queryParams)
    download.excel(data, 'AGV 信息.xls')
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