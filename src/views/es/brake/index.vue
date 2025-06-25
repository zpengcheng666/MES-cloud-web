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
      <el-form-item label="车牌号" prop="carPlateNo">
        <el-input
          v-model="queryParams.carPlateNo"
          placeholder="请输入车牌号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>

<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          @click="openForm('create')"-->
<!--          v-hasPermi="['es:brake:create']"-->
<!--        >-->
<!--          <Icon icon="ep:plus" class="mr-5px" /> 新增-->
<!--        </el-button>-->

        <el-button
          type="warning"
          plain
          @click="openSyncForm('update',1)"
        >
          <Icon icon="fa:newspaper-o" class="mr-5px" /> 配置
        </el-button>

        <el-button
          type="primary"
          plain
          @click="handleSync(selectionList.map((item) => item.registerPlate))"
          v-hasPermi="['es:brake:update']"
          :disabled="selectionList.length === 0"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 同步
        </el-button>

<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          @click="handleExport"-->
<!--          :loading="exportLoading"-->
<!--          v-hasPermi="['es:brake:export']"-->
<!--        >-->
<!--          <Icon icon="ep:download" class="mr-5px" /> 导出-->
<!--        </el-button>-->

      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true"  @selection-change="handleSelectionChange">
      <el-table-column width="30" label="选择" type="selection" />
      <el-table-column label="固定车id" align="center" prop="id" />
      <el-table-column label="车牌号" align="center" prop="registerPlate" />
      <el-table-column label="剩余扣款次数" align="center" prop="numberTimes" />
      <el-table-column label="客户电话" align="center" prop="phoneNumber" />
      <el-table-column label="账户余额" align="center" prop="balance" />
      <el-table-column label="客户类型" align="center" prop="clientType" />
      <el-table-column label="通行证类型" align="center" prop="passTypeName" />
      <el-table-column label="到期时间" align="center" prop="deadline" />
      <el-table-column label="车位类型" align="center" prop="parkingSpaceType" />
      <el-table-column label="车辆类型" align="center" prop="carTypeName" />
      <el-table-column label="客户名称" align="center" prop="clientName" />
      <el-table-column label="操作" align="center">
        <template #default="scope">

<!--          <el-button-->
<!--            link-->
<!--            type="primary"-->
<!--            @click="openForm('update', scope.row.id)"-->
<!--            v-hasPermi="['es:brake:update']"-->
<!--          >-->
<!--            编辑-->
<!--          </el-button>-->

          <el-button
            link
            type="primary"
            @click="openForm('detail', scope.row.registerPlate)"
          >
            详情
          </el-button>

<!--          <el-button-->
<!--            link-->
<!--            type="danger"-->
<!--            @click="handleDelete(scope.row.id)"-->
<!--            v-hasPermi="['es:brake:delete']"-->
<!--          >-->
<!--            删除-->
<!--          </el-button>-->

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <BrakeForm ref="formRef" @success="getList" />
  <BrakeSyncForm ref="formSyncRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { BrakeApi, BrakeVO } from '@/api/es/brake'
import { BrakeSyncApi} from "@/api/es/brakesync";
import BrakeForm from './BrakeForm.vue'
import BrakeSyncForm from "@/views/es/brake/BrakeSyncFrom.vue";

/** 旧厂车牌数据 列表 */
defineOptions({ name: 'Brake' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<BrakeVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  carPlateNo: undefined,
  registerPlate: undefined,
  numberTimes: undefined,
  phoneNumber: undefined,
  balance: undefined,
  identiType: undefined,
  clientType: undefined,
  passTypeName: undefined,
  identiNumber: undefined,
  clientNo: undefined,
  email: undefined,
  deadline: undefined,
  parkingSpaceType: undefined,
  carTypeName: undefined,
  clientName: undefined,
  address: undefined,
  sex: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await BrakeApi.getBrakePage(queryParams)
    list.value = data.data
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 选中操作 */
const selectionList = ref<BrakeVO[]>([])
const handleSelectionChange = (rows: BrakeVO[]) => {
  selectionList.value = rows
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNum = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  formRef.value.open(type, id)
}

/** 配置操作 */
const formSyncRef = ref()
const openSyncForm = ( type: string, id?: string) => {
  formSyncRef.value.open(type, id)
}

/** 同步按钮操作 */
const handleSync = async (ids: string[]) => {
  try {
    // 同步的二次确认
    await message.confirm("您确定将所选数据同步至新厂系统吗")
    // 发起同步
    loading.value = true
    await BrakeApi.syncBrake(ids)
    message.success(t('同步数据成功！'))
    loading.value = false
    // 刷新列表
    await getList()
  } catch {}
}

// /** 删除按钮操作 */
// const handleDelete = async (id: number) => {
//   try {
//     // 删除的二次确认
//     await message.delConfirm()
//     // 发起删除
//     await BrakeApi.deleteBrake(id)
//     message.success(t('common.delSuccess'))
//     // 刷新列表
//     await getList()
//   } catch {}
// }

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await BrakeApi.exportBrake(queryParams)
    download.excel(data, '旧厂车牌数据.xls')
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
