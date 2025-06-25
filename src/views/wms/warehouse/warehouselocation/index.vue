<template>
  <h4>&nbsp;库位管理</h4>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <div v-show="showSearch">
<!--        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="queryParams.createTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            class="!w-240px"
          />
        </el-form-item>-->
        <el-form-item label="库位编码" prop="locationCode">
          <el-input
            v-model="queryParams.locationCode"
            placeholder="请输入库位编码"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="库区编码" prop="warehouseAreaId">
          <el-select
            v-model="queryParams.warehouseAreaId"
            placeholder="请选择库区编码"
            clearable
            filterable
            class="!w-240px"
          >
            <el-option
              v-for="warehouseArea in warehouseAreaList"
              :key="warehouseArea.id"
              :label="warehouseArea.areaCode"
              :value="warehouseArea.id+''"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否锁定" prop="locked">
          <el-select
            v-model="queryParams.locked"
            placeholder="请选择库区属性"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_TINYINT)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
<!--              <el-switch v-model="queryParams.locked" active-value="1" inactive-value="0" active-text="是" inactive-text="否" inline-prompt />-->
        </el-form-item>
        <el-form-item label="是否有效" prop="valid">
          <el-select
            v-model="queryParams.valid"
            placeholder="请选择库区属性"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_TINYINT)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        </div>
        <el-form-item>
          <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>

  <!--        <el-button
            type="primary"
            plain
            @click="openForm('create')"
            v-hasPermi="['wms:warehouse-location:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" /> 新增
          </el-button>-->
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['wms:warehouse-location:export']"
          >
            <Icon icon="ep:download" class="mr-5px" /> 导出
          </el-button>
          <el-button type="danger" plain  @click="search">
            <Icon icon="ep:sort" class="mr-5px" /> 展开/折叠
          </el-button>
        </el-form-item>
      </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
<!--      <el-table-column label="ID" align="center" prop="id" />-->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="库位编码" align="center" prop="locationCode" />
      <el-table-column label="库区编码" align="center" prop="areaCode" />
      <el-table-column label="是否锁定" align="center" prop="locked" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_TINYINT" :value="scope.row.locked" />
        </template>
      </el-table-column>
      <el-table-column label="是否有效" align="center" prop="valid" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_TINYINT" :value="scope.row.valid" />
        </template>
      </el-table-column>
     <!-- <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['wms:warehouse-location:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['wms:warehouse-location:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column> -->
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
  <WarehouseLocationForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { WarehouseLocationApi, WarehouseLocationVO } from '@/api/wms/warehouselocation'
import WarehouseLocationForm from './WarehouseLocationForm.vue'
import {WarehouseAreaApi} from "@/api/wms/warehousearea";
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** 库位 列表 */
defineOptions({ name: 'WarehouseLocation' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const route = useRoute() // 路由

const loading = ref(true) // 列表的加载中
const list = ref<WarehouseLocationVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  locationCode: undefined,
  warehouseAreaId:  route.query.warehouseAreaId,
  defaultWarehouseId: undefined,
  locked: undefined,
  valid: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const warehouseAreaList = ref<any[]>([]) // 仓库区域列表

const treeSelectNode = inject('treeSelectNode') as any
watch(
  () => treeSelectNode.id,
  (val) => {
    val &&
    val.length &&
    nextTick(() => {
      queryParams.warehouseAreaId = treeSelectNode.id
      getList()
    })
  },
  { immediate: true }
)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WarehouseLocationApi.getWarehouseLocationPage(queryParams)
    list.value = data.list
    total.value = data.total
    // 加载仓库区域列表
    warehouseAreaList.value = await WarehouseAreaApi.getWarehouseAreaList()
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
    await WarehouseLocationApi.deleteWarehouseLocation(id)
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
    const data = await WarehouseLocationApi.exportWarehouseLocation(queryParams)
    download.excel(data, '库位.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const showSearch = ref(true)
function search(){
  if(showSearch.value){
    showSearch.value = false
  }else{
    showSearch.value = true
  }

}
/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
