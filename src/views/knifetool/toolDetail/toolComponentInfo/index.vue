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
      <el-form-item label="分类名称" prop="toolCategoryId">
        <formTreeSelect
          ref="treeValue"
          @tree-value="(val) => setFormTreeValue(val, 'toolCategoryId')"
        />
      </el-form-item>
      <el-form-item label="通用规格" prop="spec">
        <el-input
          v-model="queryParams.spec"
          placeholder="请输入通用规格"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="刀具名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入刀具名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="刀具类码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入刀具类码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="currentStatus">
        <el-select
          v-model="queryParams.currentStatus"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option value="1" key="1" label="闲置">闲置</el-option>
          <el-option value="2" key="2" label="配刀进行中">配刀进行中</el-option>
          <el-option value="3" key="3" label="配刀完成">配刀完成</el-option>
          <!-- <el-option value="4" key="4" label="待配送">待配送</el-option> -->
          <el-option value="5" key="5" label="配送中">配送中</el-option>
          <el-option value="6" key="6" label="配送完成(加工中)">配送完成(加工中)</el-option>
          <el-option value="7" key="7" label="报废审批">报废审批</el-option>
          <el-option value="8" key="8" label="报废">报废</el-option>
          <el-option value="9" key="9" label="已领取">已领取</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="当前位置" prop="code">
        <el-input
          v-model="queryParams.currentLocation"
          placeholder="请输入当前位置"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="管理人员" prop="managerId">
        <el-input
          v-model="queryParams.managerId"
          placeholder="请选择管理人员"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="刀具物码" prop="objectCode">
        <el-input
          v-model="queryParams.objectCode"
          placeholder="请输入刀具物码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"> <Icon icon="ep:search" class="mr-5px" /> 搜索 </el-button>
        <el-button @click="resetQuery"> <Icon icon="ep:refresh" class="mr-5px" /> 重置 </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['knifetool:information:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true">
      <template v-for="column in columns" :key="column.dataIndex">
        <el-table-column
          :label="column.title"
          align="center"
          :prop="column.dataIndex"
          :width="column.width"
        />
      </template>

      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openDetail(scope.row)"
            v-hasPermi="['knifetool:information:query']"
          >
            <!-- <Icon icon="ep:view" /> -->
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <viewDetails ref="detailRef" />
</template>

<script setup lang="ts">
import download from '@/utils/download'
import * as AccountApi from '@/api/knifetool/toolDetail/toolComponentInfo'
import formTreeSelect from '@/components/store/formTreeSelect.vue'
import viewDetails from './viewDetails.vue'

/** 刀具分类 列表 */
defineOptions({ name: 'Category' })

const message = useMessage() // 消息弹窗

const exportLoading = ref(false)

const loading = ref(true) // 列表的加载中
const list = ref<any>([]) // 列表的数
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  currentStatus: undefined,
  code: undefined,
  spec: undefined,
  currentLocation: undefined,
  managerId: undefined,
  objectCode: undefined,
  queryType: 1
})
const queryFormRef = ref() // 搜索的表单

const columns = [
  { title: '刀具物码', align: 'center', dataIndex: 'objectCode', width: '180px' },
  { title: '名称', align: 'center', dataIndex: 'name' },
  { title: '刀具通用规格', align: 'center', dataIndex: 'spec', width: '150px' },
  { title: '当前状态', align: 'center', dataIndex: 'currentStatusValue', width: '100px' },
  { title: '当前位置', align: 'center', dataIndex: 'currentLocationValue', width: '150px' },
  { title: '分类', align: 'center', dataIndex: 'toolCategoryValue', width: '150px' },
  { title: '刀具类码', align: 'center', dataIndex: 'code' },
  { title: '盒码', align: 'center', dataIndex: 'boxCode', width: '150px' },
  { title: '装配次数', align: 'center', dataIndex: 'serviceLife' },
  { title: '操作员', align: 'center', dataIndex: 'managerName', width: '150px' },
  { title: '最近出库时间', align: 'center', dataIndex: 'lastOutTime', width: '120px' },
  { title: '最近入库时间', align: 'center', dataIndex: 'lastInTime', width: '120px' },
  { title: '最近领用人', align: 'center', dataIndex: 'getUserName', width: '100px' },
  { title: '供应商', align: 'center', dataIndex: 'supplier', width: '150px' }
]

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AccountApi.getToolAccountQuery(queryParams)
    list.value = data.list
    total.value = data.total
    console.log(list.value)
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}

const treeValue = ref()
const setFormTreeValue = (val: string, prop: string) => {
  queryParams[prop] = val
  console.log(queryParams)
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  treeValue.value.toolCategoryValue = ''
  handleQuery()
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    // const data = await InfoApi.exportInfo(queryParams)
    // download.excel(data, '刀具基本信息.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 详情操作 */
const detailRef = ref()
const openDetail = (data: any) => {
  detailRef.value.open(data)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
