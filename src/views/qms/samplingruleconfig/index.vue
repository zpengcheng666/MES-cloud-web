<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="120px"
    >
      <el-form-item label="样本数字码" prop="sampleSizeCode">
        <el-input
          v-model="queryParams.sampleSizeCode"
          placeholder="请输入样本量字码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="检查类型" prop="samplingRuleType">
        <el-select
          v-model="queryParams.samplingRuleType"
          placeholder="请选择检查类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.QMS_SAMPLING_RULE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="接收质量限" prop="acceptanceQualityLimit">
        <el-input
          v-model="queryParams.acceptanceQualityLimit"
          placeholder="请输入接收质量限（AQL）"
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
          @click="openCreateForm('create',undefined, standardId)"
          v-hasPermi="['qms:sampling-rule:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['qms:sampling-rule:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
          type="primary"
          plain
          @click="openInfoForm()"
          :disabled="standardId == ''"
        >
          查看抽样主方案
        </el-button>
      </el-form-item>




    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" :span-method="objectSpanMethod">


      <el-table-column label="抽样标准" align="center" prop="samplingStandardName" />

      <el-table-column label="样本数字码" align="center" prop="sampleSizeCode">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_SAMPLE_SIZE_CODE" :value="scope.row.sampleSizeCode" />
        </template>
      </el-table-column>
      <el-table-column label="抽取样本数量" align="center" prop="sampleSize" />
      <el-table-column label="检查类型" align="center" prop="samplingRuleType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_SAMPLING_RULE_TYPE" :value="scope.row.samplingRuleType" />
        </template>
      </el-table-column>
      <el-table-column label="接收质量限（AQL）" align="center" prop="acceptanceQualityLimit" />
      <el-table-column label="接收数（Ac）" align="center" prop="acceptNum" />
      <el-table-column label="拒收数（Re）" align="center" prop="rejectionNum" />
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
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <SamplingRuleConfigForm ref="formRef" @success="getList" />
  <SamplingRuleConfigCreateForm ref="createFormRef" @success="getList" />
  <SamplingRuleConfigInfo ref="infoRef" @success="getList"  :standerdId = "standardId"/>
</template>

<script setup lang="ts">
import { getStrDictOptions,getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { SamplingRuleConfigApi, SamplingRuleConfigVO } from '@/api/qms/samplingruleconfig'
import SamplingRuleConfigForm from './SamplingRuleConfigForm.vue'
import SamplingRuleConfigCreateForm from './SamplingRuleConfigCreateForm.vue'
import SamplingRuleConfigInfo from './components/SamplingRuleConfigInfo.vue'

/** 抽样规则（检验抽样方案） 列表 */
defineOptions({ name: 'SamplingRuleConfig' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const list = ref<SamplingRuleConfigVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  sampleSizeCode: undefined,
  samplingRuleType: undefined,
  samplingStandardId: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const standardId = ref('') // 列表的总页数


/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await SamplingRuleConfigApi.getSamplingRuleConfigPage(queryParams)
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
const openForm = (type: string, id?: number,standardId?:string) => {
  formRef.value.open(type, id,standardId)
}
/** 添加/修改操作 */
const createFormRef = ref()
const openCreateForm = (type: string, id?: number,standardId?:string) => {
  createFormRef.value.open(type, id,standardId)
}



const queryInfos=async( val?:string)=> {

  queryParams.samplingStandardId = val
  handleQuery()
  standardId.value=val

}
defineExpose({ queryInfos })
/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await SamplingRuleConfigApi.deleteSamplingRuleConfig(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}


const  infoRef = ref()
const openInfoForm = (
) =>
{
  infoRef.value.open()
}


/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await SamplingRuleConfigApi.exportSamplingRuleConfig(queryParams)
    download.excel(data, '抽样规则（检验抽样方案）.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const objectSpanMethod = ({row, column, rowIndex, columnIndex}) => {
  if (columnIndex === 0 ||columnIndex === 1 ) {
    // 当前列为0的时候不进行操作单元格
    const name = row[column.property];
    const preRow = list.value[rowIndex - 1];
    const preValue = preRow ? preRow[column.property] : null;
    // 当前行的数据对象的name 是否和 上一行列的 name 是否相等 相等就不合并单元格
    if (name === preValue) {
      return {rowspan: 0, colspan: 0}; // 不生成单元格
    } else {
      let rowspan = 1;
      for (let i = rowIndex + 1; i < list.value.length; i++) {
        const nextRow = list.value[i];
        const nextValue = nextRow[column.property];
        if (nextValue === name) {
          rowspan++;
        } else {
          break;
        }
      }
      return {rowspan, colspan: 1};
    }
  }
};

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
