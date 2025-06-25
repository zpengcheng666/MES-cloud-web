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
      <el-form-item label="模版名称" prop="templeteName">
        <el-input
          v-model="queryParams.templeteName"
          placeholder="请输入模版名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="刀具分类" prop="toolCategoryId">
        <formTreeSelect
          style="width: 100%"
          v-model="queryParams.toolCategoryId"
          ref="treeValue"
          @tree-value="(val) => setFormTreeValue(val, 'toolCategoryId')"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="刀具类型" prop="toolTypeId">
        <el-select
          v-model="queryParams.toolType"
          placeholder="请选择刀具类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_CUTTER_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择状态" clearable class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_STATUS_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"> <Icon icon="ep:search" class="mr-5px" /> 搜索 </el-button>
        <el-button @click="resetQuery"> <Icon icon="ep:refresh" class="mr-5px" /> 重置 </el-button>
        <el-button
          type="primary"
          plain
          @click="openUpdateForm('create')"
          v-hasPermi="['knifetool:param-template:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <!-- <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['knifetool:param-template:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button> -->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="序号" type="index" width="60" align="center">
        <template #default="scope">
          {{ (queryParams.pageNo - 1) * queryParams.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="模版名称" align="center" prop="templeteName" />
      <el-table-column label="刀具分类" align="center" prop="toolCategoryName" />
      <el-table-column label="刀具类型" align="center" prop="toolType">
        <template #default="scope">
          <dict-tag
            v-if="scope.row.toolType !== null"
            :type="DICT_TYPE.KNIFETOOL_CUTTER_TYPE"
            :value="scope.row.toolType"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="state">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.KNIFETOOL_STATUS_TYPE" :value="scope.row.state" />
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="creator" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            @click="openUpdateForm('view', row)"
            v-hasPermi="['knifetool:param-template:query']"
          >
            <!-- <Icon icon="ep:view" /> -->
            查看
          </el-button>
          <el-button
            link
            type="primary"
            @click="openUpdateForm('update', row)"
            v-hasPermi="['knifetool:param-template:update']"
          >
            <!-- <Icon icon="ep:edit" /> -->
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(row.id)"
            v-hasPermi="['knifetool:param-template:delete']"
          >
            <!-- <Icon icon="ep:delete" /> -->
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

  <createForm ref="createFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as ParamTemplateApi from '@/api/knifetool/tool/paramtemplate'
import createForm from './createForm.vue'

/** 参数模版主 列表 */
defineOptions({ name: 'ParamTemplate' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const category = reactive({
  id: undefined,
  toolCategoryId: undefined,
  type: undefined
})
const queryParams = reactive<{
  pageNo: number
  pageSize: number
  templeteName: string
  toolCategoryId?: null
  toolType?: number
  version: string
  createId?: number
  createTime: string
  updateId?: number
  state?: number
  organizationCode: string
}>({
  pageNo: 1,
  pageSize: 10,
  templeteName: '',
  toolCategoryId: undefined,
  toolType: undefined,
  version: '',
  createId: undefined,
  createTime: '',
  updateId: undefined,
  state: undefined,
  organizationCode: ''
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ParamTemplateApi.getParamTemplatePage(queryParams)
    console.log(data)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const treeValue = ref()
const setFormTreeValue = (val: string, prop: string) => {
  console.log("@@"+val,prop)
  category[prop] = val
  queryParams.toolCategoryId = category.toolCategoryId
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

/** 添加/查看操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 修改操作 */
const createFormRef = ref()
const openUpdateForm = (type: string, row?: any) => {
  createFormRef.value.open(type, row)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ParamTemplateApi.deleteParamTemplate(id)
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
    const data = await ParamTemplateApi.exportParamTemplate(queryParams)
    download.excel(data, '参数模版主.xls')
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
