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
      <div v-show="isExpandAll">
       
        <el-form-item label="指令编码" prop="insCode">
          <el-input
            v-model="queryParams.insCode"
            placeholder="请输入指令编码"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="物料库存" prop="materialStockId">
          <el-select-v2
            v-model="queryParams.materialStockId"
            :options="materialstockList"
            filterable
            clearable
            placeholder="选择物料库存"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="起始库位" prop="startLocationId">
          <el-select-v2
            v-model="queryParams.startLocationId"
            :options="warehouselocationList"
            filterable
            clearable
            placeholder="选择起始库位"
            class="!w-300px"
          />
        </el-form-item>
        <el-form-item label="指令类型" prop="insType">
          <el-select
            v-model="queryParams.insType"
            placeholder="请选择指令类型"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.WMS_INSTRUCTION_TYPE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="指令状态" prop="insStatus">
          <el-select
            v-model="queryParams.insStatus"
            placeholder="请选择指令状态"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.WMS_INSTRUCTION_STATUS)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
       
        <el-form-item label="目标库位" prop="targetLocationId">
          <el-select-v2
            v-model="queryParams.targetLocationId"
            :options="warehouselocationList"
            filterable
            clearable
            placeholder="选择目标库位"
            class="!w-300px"
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
        
      </div>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['wms:instruction:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wms:instruction:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button type="danger" plain @click="isExpandAll = !isExpandAll">
          <Icon icon="ep:sort" class="mr-5px" /> 展开/折叠
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="指令编码" align="center" prop="insCode" min-width="200px" />
      <el-table-column label="物料库存" align="center" prop="materialStockId" min-width="150px">
        <template #default="scope">
          {{ getMaterialStockName(scope.row.materialStockId) }}
        </template>
      </el-table-column>
      <el-table-column label="指令类型" align="center" prop="insType" min-width="100px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_INSTRUCTION_TYPE" :value="scope.row.insType" />
        </template>
      </el-table-column>
      <el-table-column label="指令状态" align="center" prop="insStatus" min-width="100px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_INSTRUCTION_STATUS" :value="scope.row.insStatus" />
        </template>
      </el-table-column>
      <el-table-column label="起始库位" align="center" prop="startLocationId" min-width="300px">
        <template #default="scope">
          {{ getWarehouseLocationName(scope.row.startLocationId) }}
        </template>
      </el-table-column>
      <el-table-column label="目标库位" align="center" prop="targetLocationId" min-width="300px">
        <template #default="scope">
          {{ getWarehouseLocationName(scope.row.targetLocationId) }}
        </template>
      </el-table-column>
      <el-table-column label="指令内容" align="center" prop="insContent" min-width="200px" />
      <el-table-column label="指令描述" align="center" prop="insDescription" min-width="200px" />
      <el-table-column
        label="开始时间"
        align="center"
        prop="startTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="结束时间"
        align="center"
        prop="endTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" fixed="right" min-width="150px">
        <template #default="scope">
          <el-button link type="primary"  @click="openForm('detail', scope.row.id)">
            详情
          </el-button>

          <el-dropdown
            @command="(command) => handleCommand(command, scope.row)"
            v-hasPermi="['wms:instruction:update','wms:instruction:delete']"
          >
            <el-button type="success" link><Icon icon="ep:d-arrow-right" /> 更多</el-button>
            <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="handleComplete" >
                    完成指令
                  </el-dropdown-item>
                  <el-dropdown-item command="openForm" v-if="checkPermi(['wms:instruction:update'])">
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item command="handleDelete" v-if="checkPermi(['wms:instruction:delete'])">
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
            </template>
          </el-dropdown>
      
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
  <InstructionForm
    ref="formRef"
    @success="getList"
    :materialstockList="materialstockList"
    :warehouselocationList="warehouselocationList"
  />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { InstructionApi, InstructionVO } from '@/api/wms/instruction'
import InstructionForm from './InstructionForm.vue'
import { checkPermi } from '@/utils/permission'

/** 指令 列表 */
defineOptions({ name: 'Instruction' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<InstructionVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  insCode: undefined,
  materialStockId: undefined,
  insType: undefined,
  insStatus: undefined,
  startLocationId: undefined,
  targetLocationId: undefined,
  insContent: undefined,
  insDescription: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await InstructionApi.getInstructionPage(queryParams)
    getMaterialStockList()
    getWarehouseLocationList()
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
    await InstructionApi.deleteInstruction(id)
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
    const data = await InstructionApi.exportInstruction(queryParams)
    download.excel(data, '指令.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

/*********************************展开/折叠*********************************/

const isExpandAll = ref(true)

/*************************************物料库存*******************************/
import { MaterialStockApi } from '@/api/wms/materialstock'
const materialstockList = ref<any[]>([])
const getMaterialStockList = async () => {
  const data = await MaterialStockApi.getMaterialStockList()
  materialstockList.value = []
  for (let v of data) {
    materialstockList.value.push({
      value: v.id,
      label: v.barCode,
      key: v.id,
      ...v
    })
  }
}
const getMaterialStockName = (id: string): string => {
  let str = ''
  for (let v of materialstockList.value) {
    if (v.id == id) {
      str = v.barCode
    }
  }
  return str
}

/*************************************库位*******************************/
import { WarehouseLocationApi } from '@/api/wms/warehouselocation'
const warehouselocationList = ref<any[]>([])
const getWarehouseLocationList = async () => {
  const data = await WarehouseLocationApi.getWarehouseLocationList()
  warehouselocationList.value = []
  for (let v of data) {
    warehouselocationList.value.push({
      value: v.id,
      label: v.locationCode,
      key: v.id,
      ...v
    })
  }
}
const getWarehouseLocationName = (id: string): string => {
  let str = ''
  for (let v of warehouselocationList.value) {
    if (v.id == id) {
      str = v.locationCode
    }
  }
  return str
}

/** '更多'操作按钮 */
const handleCommand = (command, row) => {
  switch (command) {
    case 'openForm':
      openForm('update',row.id)
      break
    case 'handleDelete':
      handleDelete(row.id)
      break
    case 'handleComplete':
      handleComplete(row.id)
      break
    default:
      break
  }
}

// 注入无感刷新页面函数
const reload = inject<() => void>('reload')

/** 完成指令操作 */
const handleComplete = async (id: number) => {
    await InstructionApi.handleComplete(id);
    if (reload) reload()
    message.success(t('指令完成'))
}
</script>
