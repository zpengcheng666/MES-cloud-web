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
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="编码分类" prop="classificationId">
        <el-input
          v-model="queryParams.classificationId"
          placeholder="请输入编码分类"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="启用状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择启用状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.MCC_ENABLE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="总位数" prop="totalBitNumber">
        <el-input
          v-model="queryParams.totalBitNumber"
          placeholder="请输入总位数"
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
          v-hasPermi="['mcc:encoding-rule:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['mcc:encoding-rule:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="encodingRuleDetail">
            <el-tab-pane label="编码规则配置详情" name="encodingRuleDetail">
              <EncodingRuleDetailList :encoding-rule-id="scope.row.id" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>

      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="编码分类" align="center" prop="classificationName" />
      <el-table-column label="编码Code" align="center" prop="classificationCode" />
      <el-table-column label="类别" align="center" prop="materialTypeName" />
      <el-table-column label="类别Code" align="center" prop="materialTypeCode" />
      <el-table-column label="启用状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.MCC_ENABLE_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="encodingRuleType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.MCC_ENCODING_RULE_TYPE" :value="scope.row.encodingRuleType" />
        </template>
      </el-table-column>

      <el-table-column label="是否自动释放" align="center" prop="autoRelease">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.MCC_AUTO_RELEASE" :value="scope.row.autoRelease" />
        </template>
      </el-table-column>
      <el-table-column label="总位数" align="center" prop="totalBitNumber" />
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
            v-hasPermi="['mcc:encoding-rule:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['mcc:encoding-rule:delete']"
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
  <EncodingRuleForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { EncodingRuleApi, EncodingRuleVO } from '@/api/mcc/encodingrule'
import EncodingRuleForm from './EncodingRuleForm.vue'
import EncodingRuleDetailList from './components/EncodingRuleDetailList.vue'

/** 编码规则配置 列表 */
defineOptions({ name: 'EncodingRule' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<EncodingRuleVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  name: undefined,
  classificationId: undefined,
  status: undefined,
  totalBitNumber: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await EncodingRuleApi.getEncodingRulePage(queryParams)
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
    await EncodingRuleApi.deleteEncodingRule(id)
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
    const data = await EncodingRuleApi.exportEncodingRule(queryParams)
    download.excel(data, '编码规则配置.xls')
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