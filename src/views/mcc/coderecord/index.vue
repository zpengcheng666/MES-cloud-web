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
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.MCC_RECORD_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="编码规则" prop="encodingRuleId">
        <el-input
          v-model="queryParams.encodingRuleId"
          placeholder="请输入编码规则"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <!--<el-button-->
          <!--type="primary"-->
          <!--plain-->
          <!--@click="openForm('create')"-->
          <!--v-hasPermi="['mcc:code-record:create']"-->
        <!--&gt;-->
          <!--<Icon icon="ep:plus" class="mr-5px" /> 新增-->
        <!--</el-button>-->
        <el-button
                type="primary"
                plain
                @click="openGeneratorForm('create')"
                v-hasPermi="['mcc:code-record:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 生码
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['mcc:code-record:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">

      <el-table-column label="编码" align="center" prop="code" />
      <!--<el-table-column label="名称" align="center" prop="name" />-->
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.MCC_RECORD_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="编码规则" align="center" prop="encodingRuleName" />
      <el-table-column label="编码分类" align="center" prop="classificationName" />
      <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
              :formatter="dateFormatter"
              width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <!--<el-button-->
            <!--link-->
            <!--type="primary"-->
            <!--@click="openForm('update', scope.row.id)"-->
            <!--v-hasPermi="['mcc:code-record:update']"-->
          <!--&gt;-->
            <!--编辑-->
          <!--</el-button>-->
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['mcc:code-record:delete']"
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
  <CodeRecordForm ref="formRef" @success="getList" />
  <GeneratorCodeForm ref="generatorFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { CodeRecordApi, CodeRecordVO } from '@/api/mcc/coderecord'
import CodeRecordForm from './CodeRecordForm.vue'
import GeneratorCodeForm from './GeneratorCodeForm.vue'

/** 编码记录 列表 */
defineOptions({ name: 'CodeRecord' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<CodeRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  code: undefined,
  name: undefined,
  parentId: undefined,
  status: undefined,
  encodingRuleId: undefined,
  classificationId: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CodeRecordApi.getCodeRecordPage(queryParams)
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


/** 添加/修改操作 */
const generatorFormRef = ref()
const openGeneratorForm = (type: string, id?: number) => {
    generatorFormRef.value.open(type, id)
}
/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CodeRecordApi.deleteCodeRecord(id)
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
    const data = await CodeRecordApi.exportCodeRecord(queryParams)
    download.excel(data, '编码记录.xls')
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