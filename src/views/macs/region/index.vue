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
      <el-form-item>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['macs:region:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
<!--        <el-button
          type="primary"
          plain
          @click="editDoor()"
          v-hasPermi="['macs:region:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 门管理
        </el-button>-->
        <el-button
          type="primary"
          plain
          @click="editAuthority()"
          v-hasPermi="['macs:region:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 授权
        </el-button>
        <el-button
          type="primary"
          plain
          @click="editAuthorities()"
          v-hasPermi="['macs:region:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 批量授权
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['macs:region:export']"
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
      ref="regionTableRef"
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      row-key="id"
      :default-expand-all="isExpandAll"
      v-if="refreshTable"
      @header-click="checkAllSelection"
    >
      <el-table-column type="selection" width="55">
        <template #default="{row}">
          <el-checkbox :model-value="selectionIdList.includes(row.id)" @click="handleSelect(row)" size="large" />
        </template>
      </el-table-column>
      <el-table-column label="区域编码" align="center" prop="code" />
      <el-table-column label="区域名称" align="center" prop="name" />
      <el-table-column label="公开状态" align="center" prop="publicStatus">
        <template #default="scope">
          <dict-tag :type="'publicStatus'" :value="scope.row.publicStatus" />
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="更新人" align="center" prop="updateBy" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['macs:region:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['macs:region:delete']"
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
  <RegionForm ref="formRef" @success="getList" />
  <regionDoorList ref="regionDoorRef" @success="getList" />
  <regionAuthority ref="regionAuthorityRef" @success="getList" />
</template>

<script setup lang="ts">
import { getBoolDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { handleTree } from '@/utils/tree'
import download from '@/utils/download'
import { RegionApi, RegionVO } from '@/api/macs/region'
import RegionForm from './RegionForm.vue'
import regionDoorList from './regionDoorList.vue'
import regionAuthority from './regionAuthority.vue'

/** 区域 列表 */
defineOptions({ name: 'Region' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<RegionVO[]>([]) // 列表的数据
const queryParams = reactive({
  code: undefined,
  name: undefined,
  publicStatus: undefined,
  description: undefined,
  parentId: undefined,
  createBy: undefined,
  createTime: [],
  updateBy: undefined
})
const queryFormRef = ref() // 搜索的表单
const regionTableRef = ref() // table表格
const exportLoading = ref(false) // 导出的加载中
const selectionIdList = ref([]);
const dataList = ref([]);

let selectAll = false;
let selectionList = [];

const handleSelect = (row: any) => {
  let index = selectionIdList.value.indexOf(row.id)
  if (index == -1) {
    selectionIdList.value.push(row.id);
    selectionList.push(row)
  } else {
    selectionIdList.value.splice(index, 1);
    selectionList = selectionList.filter(item => item.id !== row.id);
  }
}

const checkAllSelection = (column: any, event: Event) => {
  if (column.type == 'selection') {
    if (event.target.nodeName == 'SPAN') {
      if (!selectAll) {
        selectionIdList.value = dataList.value.map(item => item.id)
        selectionList = dataList.value
      } else {
        selectionIdList.value = [];
        selectionList = [];
      }
      selectAll = !selectAll;
    }
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await RegionApi.getRegionList(queryParams)
    dataList.value = data;
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

const regionDoorRef = ref()
const editDoor = () => {
  if (selectionIdList.value.length == 0) {
    message.alertWarning('请选择一条记录!')
    return;
  }
  if (selectionIdList.value.length > 1) {
    selectionIdList.value = [selectionIdList.value[0]];
    selectionList = [selectionList[0]];
  }
  regionDoorRef.value.open(selectionList[0]);
}
const regionAuthorityRef = ref()
const editAuthority = () => {
  if (selectionIdList.value.length == 0) {
    message.alertWarning('请选择一条记录!')
    return;
  }
  if (selectionIdList.value.length > 1) {
    selectionIdList.value = [selectionIdList.value[0]];
    selectionList = [selectionList[0]];
  }
  regionAuthorityRef.value.open(selectionList, true);
}
const editAuthorities = () => {
  if (selectionIdList.value.length == 0) {
    message.alertWarning('请选择一条记录!')
    return;
  }
  regionAuthorityRef.value.open(selectionList, false);
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await RegionApi.deleteRegion(id)
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
    const data = await RegionApi.exportRegion(queryParams)
    download.excel(data, '区域.xls')
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
