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
      <el-form-item label="库区编码" prop="warehouseAreaId">
        <el-select
          v-model="queryParams.warehouseAreaId"
          placeholder="请选择库区编码"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="warehouseArea in warehouseAreaList"
            :key="warehouseArea.id"
            :label="warehouseArea.areaCode"
            :value="warehouseArea.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料编号" prop="materialConfigId">
        <el-select
          v-model="queryParams.materialConfigId"
          placeholder="请选择物料编号"
          clearable
          filterable
          class="!w-240px"
        >
          <el-option
            v-for="materialConfig in materialConfigList"
            :key="materialConfig.id"
            :label="materialConfig.materialNumber"
            :value="materialConfig.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['wms:material-config-area:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wms:material-config-area:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- <el-table-column label="ID" align="center" prop="id" /> -->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />

      <el-table-column label="库区编码" align="center" prop="areaCode" />
      <el-table-column label="物料编号" align="center" prop="materialNumber" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['wms:material-config-area:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['wms:material-config-area:delete']"
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
  <MaterialConfigAreaForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { MaterialConfigAreaApi, MaterialConfigAreaVO } from '@/api/wms/materialconfigarea'
import MaterialConfigAreaForm from './MaterialConfigAreaForm.vue'
import { WarehouseAreaApi } from '@/api/wms/warehousearea';
import { MaterialConfigApi } from '@/api/wms/materialconfig';

/** 物料类型关联库区配置 列表 */
defineOptions({ name: 'MaterialConfigArea' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const route = useRoute() // 路由

const loading = ref(true) // 列表的加载中
const list = ref<MaterialConfigAreaVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  warehouseAreaId: route.query.warehouseAreaId,
  materialConfigId: route.query.materialConfigId,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const warehouseAreaList = ref<any[]>([]) // 仓库区域列表
const materialConfigList =ref() //物料类型

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MaterialConfigAreaApi.getMaterialConfigAreaPage(queryParams)
    list.value = data.list
    total.value = data.total
    // 加载仓库区域列表
    warehouseAreaList.value = await WarehouseAreaApi.getWarehouseAreaList()
    materialConfigList.value = await MaterialConfigApi.getMaterialConfigList()
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
  formRef.value.open(type, id, queryParams.warehouseAreaId, queryParams.materialConfigId)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await MaterialConfigAreaApi.deleteMaterialConfigArea(id)
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
    const data = await MaterialConfigAreaApi.exportMaterialConfigArea(queryParams)
    download.excel(data, '物料类型关联库区配置.xls')
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