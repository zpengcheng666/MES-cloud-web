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
      <el-form-item label="物料名称" prop="toolName">
        <el-input
          v-model="queryParams.toolName"
          placeholder="请输入物料名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="物料编号" prop="materialNumber">
          <el-input
            v-model="queryParams.materialNumber"
            placeholder="请输入物料编号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
      </el-form-item>
      <el-form-item label="物料类别" prop="materialNumber">
        <el-tree-select
          placeholder="请选择物料类别"
          check-strictly
          :props="defaultProps"
          default-expand-all
          :data="materialTypeTreeList"
          :render-after-expand="false"
          v-model="queryParams.materialTypeId" class="!w-240px" />
      </el-form-item>
      <el-form-item label="物料类码" prop="materialTypeCode">
        <el-input
          v-model="queryParams.materialTypeCode"
          placeholder="请输入物料类码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="型号" prop="toolModel">
        <el-input
          v-model="queryParams.toolModel"
          placeholder="请输入型号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
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
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['tms:tool-config:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="物料名称" align="center" prop="toolName" width="120"/>
      <el-table-column label="物料编号" align="center" prop="materialNumber" width="120"/>
      <el-table-column label="物料类别" align="center" prop="materialTypeName" width="100"/>
      <el-table-column label="物料类码" align="center" prop="materialTypeCode" width="100"/>
      <el-table-column label="型号" align="center" prop="toolModel" />
      <el-table-column label="重量" align="center" prop="toolWeight" />
      <el-table-column label="材质" align="center" prop="toolTexture" />
      <el-table-column label="涂层" align="center" prop="toolCoating" />
      <el-table-column label="额定寿命" align="center" prop="ratedLife" />
      <el-table-column label="最高转速(mm)" align="center" prop="maxSpeed" />
      <el-table-column label="总长上限(mm)" align="center" prop="lengthUpper" />
      <el-table-column label="总长下限(mm)" align="center" prop="lengthFloor" />
      <el-table-column label="玄长上限(mm)" align="center" prop="hangingLengthUpper" />
      <el-table-column label="玄长下限(mm)" align="center" prop="hangingLengthFloor" />
      <el-table-column label="刃径上偏差(mm)" align="center" prop="bladeUpperDeviation" />
      <el-table-column label="刃径下偏差(mm)" align="center" prop="bladeFloorDeviation" />
      <el-table-column label="底R上偏差(mm)" align="center" prop="rUpperDeviation" />
      <el-table-column label="底R下偏差(mm)" align="center" prop="rFloorDeviation" />
      <el-table-column label="规格" align="center" prop="spec" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['tms:tool-config:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['tms:tool-config:delete']"
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
  <ToolConfigForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getBoolDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ToolConfigApi, ToolConfigVO } from '@/api/tms/toolconfig'
import ToolConfigForm from './ToolConfigForm.vue'
import {MaterialTypeApi} from "@/api/mcc/materialtype";
import { handleTree } from '@/utils/tree'

/** 刀具类型 列表 */
defineOptions({ name: 'ToolConfig' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ToolConfigVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  materialConfigId: undefined,
  materialTypeId: undefined,
  materialNumber: undefined,
  materialTypeCode: undefined,
  toolName: undefined,
  toolModel: undefined,
  toolWeight: undefined,
  toolTexture: undefined,
  toolCoating: undefined,
  ratedLife: undefined,
  status: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ToolConfigApi.getToolConfigPage(queryParams)
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
  queryParams.materialTypeId = undefined
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
    await ToolConfigApi.deleteToolConfig(id)
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
    const data = await ToolConfigApi.exportToolConfig(queryParams)
    download.excel(data, '刀具类型.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

// 刀具分类
const materialTypeTreeList = ref<any>([]) // 刀具分类数据
/** 获取刀具分类树 */
const getCategoryList = async () => {
  const data = await MaterialTypeApi.getMaterialTypeList()
  materialTypeTreeList.value = handleTree(data, 'id', 'parentId').filter((item) => item.code == 'DJ')
}

const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id',
  isLeaf: 'leaf',
  emitPath: false // 用于 cascader 组件：在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
}

/** 初始化 **/
onMounted(() => {
  getList()
  getCategoryList()
})
</script>
