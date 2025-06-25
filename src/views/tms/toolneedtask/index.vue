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
        <el-form-item label="工单号" prop="orderNumber">
          <el-input
            v-model="queryParams.orderNumber"
            placeholder="请输入工单号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="目标位置" prop="targetLocation">
          <el-input
            v-model="queryParams.targetLocation"
            placeholder="请输入目标位置"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="物料类型id" prop="materialConfigId">
          <el-select
            v-model="queryParams.materialConfigId"
            placeholder="请选择物料类型id"
            clearable
            class="!w-240px"
          >
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态（启用、作废）" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态（启用、作废）"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
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
            v-hasPermi="['tms:assemble-task:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" /> 新增
          </el-button>
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['tms:assemble-task:export']"
          >
            <Icon icon="ep:download" class="mr-5px" /> 导出
          </el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>
  
    <!-- 列表 -->
    <ContentWrap>
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <!-- <el-table-column label="ID" align="center" prop="id" />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        /> -->
        <el-table-column label="工单号" align="center" prop="orderNumber" />
        <el-table-column label="需求数量" align="center" prop="needCount" />
        <el-table-column label="目标位置" align="center" prop="targetLocationCode" />
        <el-table-column
          label="配送截止时间"
          align="center"
          prop="distributionDeadline"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="刀具编号" align="center" prop="materialNumber" />
        <el-table-column label="刀具名称" align="center" prop="materialName" />
        <el-table-column label="最短加工时长" align="center" prop="minimumTime" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            {{scope.row.status === 0? '待处理' : (scope.row.status === 1? '装配中' : (scope.row.status === 3? '已完成' : '未知状态'))}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template #default="scope">
            <el-button
              link
              type="success"
              @click="handleDistribution(scope.row)"
              v-hasPermi="['tms:assemble-task:update']"
              v-if="scope.row.status === 0 || scope.row.status === 3"
            >
              配送
            </el-button>
            <el-button
              link
              type="primary"
              @click="handleAccept(scope.row)"
              v-hasPermi="['tms:assemble-task:update']"
              v-if="scope.row.status === 0"
            >
              配刀
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

    <ToolNeedTaskDistribution ref="distributionRef"  @getTool="handleGetTool" />
  </template>
  
  <script setup lang="ts">
  import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
  import { dateFormatter } from '@/utils/formatTime'
  import download from '@/utils/download'
  import { AssembleTaskApi, AssembleTaskVO } from '@/api/tms/assembletask'
  import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
  import ToolNeedTaskDistribution from './components/ToolNeedTaskDistribution.vue'
  
  /** 刀具装配任务 列表 */
  defineOptions({ name: 'AssembleTask' })
  
  const message = useMessage() // 消息弹窗
  const { t } = useI18n() // 国际化
  
  const loading = ref(true) // 列表的加载中
  const list = ref<AssembleTaskVO[]>([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    createTime: [],
    orderNumber: undefined,
    targetLocation: undefined,
    materialConfigId: undefined,
    status: undefined,
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中
  const { wsCache } = useCache()
  const distributionRef = ref() // 接单弹窗
  const orderNumbers = new Array<string>() // 工单号
  const currOrderNumber = ref('') // 当前工单号

  /** 配送 */
  const handleDistribution = async (row: AssembleTaskVO) => {
    currOrderNumber.value = row.orderNumber
    distributionRef.value.open(row.materialConfigId)
  }
  // 配刀
  const handleAccept = async(row: AssembleTaskVO) => {
    ElMessageBox.confirm('确认生成刀具装配任务吗？').then(async () => {
      const data = {
        orderNumber: row.orderNumber,
        needCount: row.needCount,
        targetLocation: row.targetLocation,
        distributionDeadline: row.distributionDeadline,
        materialConfigId: row.materialConfigId,
        minimumTime: row.minimumTime,
        status: 1,// 待接单
      } as AssembleTaskVO
      await AssembleTaskApi.createAssembleTask(data)
      message.success('生成刀具装配任务成功')
      // 刷新列表
      await getList()
    })
  }

  const handleGetTool = async(row: AssembleTaskVO) => {
    const data = {
      orderNumber: currOrderNumber.value,
      materialId: row.materialStockId,
    }
    await AssembleTaskApi.updateCuttingToolDemand(data);
    message.success('操作成功！')
  }
  
  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await AssembleTaskApi.getToolNeedTaskPage(queryParams)
      data.list.forEach(element => {
        orderNumbers.push(element.orderNumber)
      });

      const assembletaskList = await AssembleTaskApi.getAssembleTaskByOrderNumber(orderNumbers)
      const orderNumberMap = new Map(assembletaskList.map(item => [item.orderNumber, item]));
      data.list.forEach(item => {
        if(orderNumberMap.has(item.orderNumber)){
          if(orderNumberMap.get(item.orderNumber).status === 3){
            item.status = 3;//已完成
          }else{
            item.status = 1;//装配中
          }
        }else{
          item.status = 0;//未开始
        }
      })

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
      await AssembleTaskApi.deleteAssembleTask(id)
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
      const data = await AssembleTaskApi.exportAssembleTask(queryParams)
      download.excel(data, '刀具装配任务.xls')
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