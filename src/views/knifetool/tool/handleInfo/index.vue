<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="96px"
    >
      <el-form-item label="刀柄品牌" prop="toolBrandId">
        <el-select
          v-model="queryParams.toolBrandId"
          placeholder="请选择刀柄品牌"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_BRAND)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="刀柄分类名称" prop="toolCategoryId">
        <el-tree-select
          placeholder="请选择刀柄分类"
          check-strictly
          :props="defaultProps"
          v-model="queryParams.toolCategoryId"
          :data="treeSelect"
          :render-after-expand="false"
          @change="handleChange"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="刀柄名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入刀柄名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
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
      <el-form-item label="刀柄类码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请选择刀柄类码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
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
          @click="openPage('create', null)"
          v-hasPermi="['knifetool:information:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <!-- <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['knifetool:information:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button> -->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="刀柄类别" align="center" prop="toolCategoryValue" />
      <el-table-column label="刀柄类码" align="center" prop="code" />
      <el-table-column label="刀柄名称" align="center" prop="name" />
      <el-table-column label="刀柄品牌" align="center" prop="toolBrandId">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.KNIFETOOL_BRAND" :value="scope.row.toolBrandId" />
        </template>
      </el-table-column>

      <el-table-column label="刀柄通用规格" align="center" prop="spec" />
      <el-table-column label="刀柄类型" align="center" prop="toolTypeId">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.KNIFETOOL_HILT_AXIS" :value="scope.row.toolTypeId" />
        </template>
      </el-table-column>
      <el-table-column label="状态" key="state">
        <template #default="scope">
          <el-switch
            v-model="scope.row.state"
            :active-value="1"
            :inactive-value="0"
            @click="handleStateChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openPage('view', scope.row.id)"
            v-hasPermi="['knifetool:information:query']"
          >
            <!-- <Icon icon="ep:view" /> -->
            查看
          </el-button>

          <el-button
            link
            type="primary"
            @click="openPage('update', scope.row.id)"
            v-hasPermi="['knifetool:information:update']"
          >
            <!-- <Icon icon="ep:edit" /> -->
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['knifetool:information:delete']"
          >
            <!-- <Icon icon="ep:delete" /> -->
            删除
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

  <!-- 表单弹窗：添加/修改 -->
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import download from '@/utils/download'
import * as InfoApi from '@/api/knifetool/tool/info'
import { KnifetoolStateEnum } from '@/utils/constants'
import { handleTree } from '@/utils/tree'
import { getCategoryList } from '@/api/knifetool/tool/category'
import formTreeSelect from '@/components/store/formTreeSelect.vue'
import { useRoute } from 'vue-router'

/** 刀具分类 列表 */
defineOptions({ name: 'Category' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由跳转
const exportLoading = ref(false)
const loading = ref(true) // 列表的加载中
const list = ref<any>([]) // 列表的数
const total = ref(0) // 列表的总页数
const treeSelect = ref<any>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  toolBrandId: undefined,
  toolCategoryId: undefined,
  name: undefined,
  type: undefined,
  code: undefined,
  spec: undefined,
  state: undefined,
  queryType: 2
})
const queryFormRef = ref() // 搜索的表单
const isExpandAll = ref(false) // 是否展开，默认全部折叠
const refreshTable = ref(true) // 重新渲染表格状态

const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id',
  isLeaf: 'leaf',
  emitPath: false // 用于 cascader 组件：在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
}

/** 刀具分类数据获取 */
const getCategoryTree = async () => {
  const data = await getCategoryList({ type: 2, state: 1 })
  treeSelect.value = handleTree(data, 'id', 'pid')
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await InfoApi.getHandlePage(queryParams)
    list.value = data.list
    total.value = data.total
    console.log(list.value)
  } finally {
    loading.value = false
  }
}

const handleChange = () => {}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}
const treeValue = ref()
const setFormTreeValue = (val: string, prop: string) => {
  queryParams[prop] = val
  console.log(queryParams)
}
const openPage = (type: string, id: any) => {
  if (null !== id) {
    push(`/handleInfoData/${type}/${id}`)
  } else {
    push(`/handleInfoData/${type}`)
  }
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number, pid?: number, toolType?: number) => {
  console.log('123', type, id, pid, toolType)
  formRef.value.open(type, id, pid, toolType)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await InfoApi.deleteInfo(id)
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
    const data = await InfoApi.exportInfo(queryParams)
    download.excel(data, '刀柄基本信息.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 修改刀具基本信息状态 */
const handleStateChange = async (row) => {
  try {
    // 修改状态的二次确认
    const text = row.state === KnifetoolStateEnum.ENABLE ? '开启' : '禁用'
    await message.confirm('确认要"' + text + '""' + row.name + '"刀柄基本信息吗?')
    // 发起修改状态
    await InfoApi.updateInfoState(row.id, row.state)

    // 刷新列表
    await getList()
  } catch {
    // 取消后，进行恢复按钮
    row.state =
      row.state === KnifetoolStateEnum.ENABLE
        ? KnifetoolStateEnum.DISABLE
        : KnifetoolStateEnum.ENABLE
  }
}

const route = useRoute()
watch(() => route.path, getList)

/** 初始化 **/
onMounted(() => {
  getList()
  getCategoryTree()
})
</script>
