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
      <el-form-item label="编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>


      <el-form-item label="分类" prop="encodingProperty">
        <el-select
                v-model="queryParams.encodingProperty"
                placeholder="请选择分类"
                clearable
                class="!w-240px"
        >
          <el-option
                  v-for="dict in getStrDictOptions(DICT_TYPE.MCC_ENCODING_PROPERTY)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!--<el-form-item label="父类型id" prop="parentId">-->
        <!--<el-input-->
          <!--v-model="queryParams.parentId"-->
          <!--placeholder="请输入父类型id"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->
      <!--</el-form-item>-->
      <el-form-item label="位数" prop="bitNumber">
        <el-input
          v-model="queryParams.bitNumber"
          placeholder="请输入位数"
          clearable
          @keyup.enter="handleQuery"
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
          v-hasPermi="['mcc:material-type:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['mcc:material-type:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button type="danger" plain @click="toggleExpandAll">
          <Icon icon="ep:sort" class="mr-5px" /> 展开/折叠
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      row-key="id"
      :default-expand-all="isExpandAll"
      v-if="refreshTable"
    >
      <!--<el-table-column label="ID" align="center" prop="id" />-->
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="编码" align="center" prop="code" />

      <!--<el-table-column label="父类型id" align="center" prop="parentId" />-->
      <el-table-column label="位数" align="center" prop="bitNumber" />
      <!--<el-table-column label="限制层级" align="center" prop="levelLimit" />-->

      <el-table-column label="分类" align="center" prop="service">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.MCC_ENCODING_PROPERTY" :value="scope.row.encodingProperty" />
        </template>
      </el-table-column>
      <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
              :formatter="dateFormatter"
              width="180px"
      />

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['mcc:material-type:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['mcc:material-type:delete']"
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
  <MaterialTypeForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
    import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { handleTree } from '@/utils/tree'
import download from '@/utils/download'
import { MaterialTypeApi, MaterialTypeVO } from '@/api/mcc/materialtype'
import MaterialTypeForm from './MaterialTypeForm.vue'


/** 编码类别属性表(树形结构) 列表 */
defineOptions({ name: 'MaterialType' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<MaterialTypeVO[]>([]) // 列表的数据
const queryParams = reactive({
  createTime: [],
  code: undefined,
  name: undefined,
  parentId: undefined,
  bitNumber: undefined,
    encodingProperty: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MaterialTypeApi.getMaterialTypeList(queryParams)
    list.value = handleTree(data, 'id', 'parentId')
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
    await MaterialTypeApi.deleteMaterialType(id)
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
    const data = await MaterialTypeApi.exportMaterialType(queryParams)
    download.excel(data, '编码类别属性表(树形结构).xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 展开/折叠操作 */
const isExpandAll = ref(true) // 是否展开，默认全部展开
const refreshTable = ref(true) // 重新渲染表格状态
const toggleExpandAll = async () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  await nextTick()
  refreshTable.value = true
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>