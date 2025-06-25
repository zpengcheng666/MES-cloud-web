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
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入真实姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select
          v-model="queryParams.sex"
          placeholder="请选择性别"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions('sex2')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions('macsVisitorStatus')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="公司组织" prop="organization">
        <el-input
          v-model="queryParams.organization"
          placeholder="请输入公司组织"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-input
          v-model="queryParams.department"
          placeholder="请输入部门"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['macs:visitor:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="身份证号" align="center" prop="idCard" />
      <el-table-column label="头像" align="center" prop="facePicture" >
        <template #default="{row}">
          <img v-if="row.facePicture" :src="row.facePicture" height="23" width="23" />
          <span v-else >未录入</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" prop="sex">
        <template #default="scope">
          <dict-tag :type="'sex2'" :value="scope.row.sex" />
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center" prop="phone" />
      <el-table-column label="状态" align="center" prop="status" >
        <template #default="scope">
          <dict-tag :type="'macsVisitorStatus'" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="公司组织" align="center" prop="organization" />
      <el-table-column label="部门" align="center" prop="department" />
      <el-table-column label="操作" align="center" width="200px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openItinerary(scope.row.id)"
            v-hasPermi="['macs:visitor:update']"
          >
            行程
          </el-button>
          <el-button
              link
              type="primary"
              @click="openRegion(scope.row.id)"
              v-hasPermi="['macs:visitor:update']"
          >
            权限
          </el-button>
          <el-button
            link
            type="primary"
            @click="handleDeparture(scope.row.id)"
            v-hasPermi="['macs:visitor:update']"
            v-show="scope.row.status == 1"
          >
            离厂
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['macs:visitor:delete']"
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
  <VisitorForm ref="formRef" @success="getList" />
  <VisitorItinerary ref="itineraryRef"/>
  <VisitorRegion ref="regionRef"/>
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import download from '@/utils/download'
import { VisitorApi, VisitorVO } from '@/api/macs/visitor'
import VisitorForm from './VisitorForm.vue'
import VisitorItinerary from './VisitorItinerary.vue'
import VisitorRegion from './VisitorRegion.vue'

/** 申请角色 列表 */
defineOptions({ name: 'Visitor' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<VisitorVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  idCard: undefined,
  name: undefined,
  sex: undefined,
  phone: undefined,
  status: undefined,
  organization: undefined,
  department: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await VisitorApi.getVisitorPage(queryParams)
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

const itineraryRef = ref()
const openItinerary = (id) => {
  itineraryRef.value.open(id)
}
const regionRef = ref()
const openRegion = (id) => {
  regionRef.value.open(id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await VisitorApi.deleteVisitor(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

const handleDeparture = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm("确认离厂")
    // 发起删除
    await VisitorApi.visitorDeparture(id)
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
    const data = await VisitorApi.exportVisitor(queryParams)
    download.excel(data, '申请角色.xls')
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
