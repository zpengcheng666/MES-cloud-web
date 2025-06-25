<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="刀组编码" prop="groupCode">
        <el-input v-model="queryParams.groupCode" placeholder="请输入刀组编码" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_STATUS_TYPE)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="onAdd('create')" v-hasPermi="['knifetool:toolGroup:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <!-- <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['knifetool:category:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button> -->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-if="refreshTable" v-loading="loading" :data="list" :default-expand-all="isExpandAll" row-key="id">
      <el-table-column label="刀组编码" align="center" prop="groupCode" />
      <el-table-column label="最高转速" align="center" prop="maxSpeed" />
      <el-table-column label="刀柄类码" align="center" prop="hiltCode" />
      <el-table-column label="刀柄类型" align="center" prop="toolTypeId">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.KNIFETOOL_HILT_AXIS" :value="scope.row.toolTypeId" />
        </template>
      </el-table-column>
      <el-table-column label="刀柄通用规格" align="center" prop="hiltSpec" />
      <el-table-column label="刀组号" align="center" prop="groupNum" />
      <el-table-column label="设备名称" align="center" prop="equName" />
      <el-table-column label="状态" key="status">
        <template #default="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
            @click="handleStatusChange(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="onAdd('view', scope.row.id)"
            v-hasPermi="['knifetool:toolGroup:query']">
            <!-- <Icon icon="ep:view" /> -->
            查看
          </el-button>

          <el-button link type="primary" @click="onAdd('update', scope.row.id)"
            v-hasPermi="['knifetool:toolGroup:update']">
            <!-- <Icon icon="ep:edit" /> -->
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['knifetool:toolGroup:delete']">
            <!-- <Icon icon="ep:delete" /> -->
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as GroupListApi from '@/api/knifetool/tool/groupList'
import { KnifetoolStateEnum } from '@/utils/constants'
import { useRoute } from 'vue-router'

/** 刀具分类 列表 */
defineOptions({ name: 'GroupList' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由跳转
const route = useRoute()
const exportLoading = ref(false)
const loading = ref(true) // 列表的加载中
const list = ref<any>([]) // 列表的数
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  groupCode: undefined,
  toolTypeId: undefined,
  spec: undefined,
  status: undefined
})
const queryFormRef = ref() // 搜索的表单
const isExpandAll = ref(false) // 是否展开，默认全部折叠
const refreshTable = ref(true) // 重新渲染表格状态

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await GroupListApi.getToolGroupPage(queryParams)
    console.log(data)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

const onAdd = (type: string, id?: number) => {
  console.log(id)
  id !== undefined ? push(`/groupDataAdd/${type}/${id}`) : push(`/groupDataAdd/${type}`)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await GroupListApi.deleteToolGroup(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}

/** 修改刀具组合状态 */
const handleStatusChange = async (row: any) => {
  try {
    // 修改状态的二次确认
    const text = row.status === KnifetoolStateEnum.ENABLE ? '开启' : '禁用'
    await message.confirm('确认要"' + text + '""' + row.groupCode + '"刀具组合吗?')
    // 发起修改状态
    await GroupListApi.updateToolGroupState(row.id, row.status)

    // 刷新列表
    await getList()
  } catch {
    // 取消后，进行恢复按钮
    row.status =
      row.status === KnifetoolStateEnum.ENABLE
        ? KnifetoolStateEnum.DISABLE
        : KnifetoolStateEnum.ENABLE
  }
}

watch(() => route.path, getList)

/** 初始化 **/
onMounted(() => {
  console.log('mounted')
  getList()
})
</script>
