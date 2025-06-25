<template>
  <h4>&nbsp;仓库管理</h4>
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
      <!-- <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item label="仓库编码" prop="warehouseCode">
        <el-input
          v-model="queryParams.warehouseCode"
          placeholder="请输入仓库编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="仓库性质" prop="warehouseNature">
        <el-select
          v-model="queryParams.warehouseNature"
          placeholder="请选择仓库性质"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_WAREHOUSE_NATURE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="仓库类型" prop="warehouseType">
        <el-select
          v-model="queryParams.warehouseType"
          placeholder="请选择仓库类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_WAREHOUSE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="仓库状态" prop="warehouseState">
        <el-select
          v-model="queryParams.warehouseState"
          placeholder="请选择仓库状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_ENABLE_STOP_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="仓库主管" prop="userId">
        <el-select
          v-model="queryParams.userId"
          placeholder="请选择仓库主管"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="user in userList"
            :key="user.id"
            :label="user.nickname"
            :value="user.id+''"
          />
        </el-select>
<!--        <el-input
          v-model="queryParams.userId"
          placeholder="请输入仓库主管"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />-->
      </el-form-item>
    </div>

    <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['wms:warehouse:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wms:warehouse:export']"
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
      <el-table-column label="仓库名称" align="center" width="150px" prop="warehouseName" />
      <el-table-column label="仓库编码" align="center" prop="warehouseCode" />
      <el-table-column label="仓库地址" align="center" prop="warehouseAddress" />
      <el-table-column label="仓库容量" align="center" prop="warehouseCapacity" />
      <el-table-column label="仓库性质" align="center" prop="warehouseNature">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_WAREHOUSE_NATURE" :value="scope.row.warehouseNature" />
        </template>
      </el-table-column>
      <el-table-column label="仓库类型" align="center" prop="warehouseType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_WAREHOUSE_TYPE" :value="scope.row.warehouseType" />
        </template>
      </el-table-column>
      <el-table-column label="仓库状态" align="center" prop="warehouseState">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_ENABLE_STOP_TYPE" :value="scope.row.warehouseState" />
        </template>
      </el-table-column>
      <el-table-column label="仓库主管" align="center" prop="nickName" />
      <!-- <el-table-column label="创建者" align="center" prop="creator" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="更新者" align="center" prop="updater" />
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        :formatter="dateFormatter"
        width="180px"
      /> -->
      <el-table-column label="操作" align="center" width="200px" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['wms:warehouse:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['wms:warehouse:delete']"
          >
            删除
          </el-button>
          <!-- <el-button
            link
            type="success"
            @click="handleArea(scope.row.id)"
            v-hasPermi="['wms:material-storage:query']"
          >
            库区展示
          </el-button> -->
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
  <WarehouseForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { WarehouseApi, WarehouseVO } from '@/api/wms/warehouse'
import WarehouseForm from './WarehouseForm.vue'
import { DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import * as UserApi from "@/api/system/user";
import WarehouseArea from "@/views/wms/warehouse/warehousearea/index.vue";

/** 仓库表 列表 */
defineOptions({ name: 'Warehouse' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push} = useRouter() // 路由跳转

const loading = ref(true) // 列表的加载中
const showSearch = ref(true)
const list = ref<WarehouseVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  warehouseCode: undefined,
  warehouseNature: undefined,
  warehouseType: undefined,
  warehouseState: undefined,
  userId: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const userList = ref<any[]>([]) // 用户列表

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WarehouseApi.getWarehousePage(queryParams)
    list.value = data.list
    total.value = data.total
    // 加载用户列表
    userList.value = await UserApi.getSimpleUserList()
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
    await WarehouseApi.deleteWarehouse(id)
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
    const data = await WarehouseApi.exportWarehouse(queryParams)
    download.excel(data, '仓库表.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}
function search(){
  if(showSearch.value){
      showSearch.value = false
  }else{
    showSearch.value = true
  }

}

 const handleArea = (id: any) => {
  // 跳转到物料储位页面
  push({name: WarehouseArea.name, query: { warehouseId:id }})
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
