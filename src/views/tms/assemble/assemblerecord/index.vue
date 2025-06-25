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
        <!-- <el-form-item label="创建人" prop="creator">
          <el-select
            v-model="queryParams.creator"
            clearable
            filterable
            placeholder="请选择创建人"
            class="!w-240px"
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.nickname"
              :value="item.id"
            />
          </el-select>
        </el-form-item> -->
       
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
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" highlight-current-row
      @current-change="handleCurrentChange">
        <!-- <el-table-column label="ID" align="center" prop="id" />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        /> -->
         <!-- <el-table-column label="成品刀具id" align="center" prop="toolInfoId" /> -->
        <el-table-column label="工单号" width="150"  align="center" prop="orderNumber" />
        <el-table-column label="目标位置" width="150" align="center" prop="targetLocationCode" />
        <el-table-column label="配送截止时间" width="150" align="center" prop="distributionDeadline" />
        <el-table-column label="物料编码" width="150" align="center" prop="materialNumber" />
        <el-table-column label="加工时长" align="center" prop="minimumTime" />
        <el-table-column label="Rfid" width="150" align="center" prop="barCode" />
        <el-table-column label="所在托盘" width="150" align="center" prop="storageCode" />
        <el-table-column label="所在库位" width="150" align="center" prop="rootLocationCode" />
        <el-table-column label="刀具直径" align="center" prop="diameter" />
        <el-table-column label="刀具总长" align="center" prop="totalLength" />
        <el-table-column label="刀具r角" align="center" prop="rangle" />
        <el-table-column label="额定寿命" align="center" prop="ratedLife" />
        <el-table-column label="剩余寿命" align="center" prop="remainLife" />
        <el-table-column label="状态" width="90" align="center" prop="status" >
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ASSEMBLE_STATUS" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['tms:tool-info:update']"
              v-if="scope.row.status === 2"
            >
              维修
            </el-button>
            <el-button
              link
              type="primary"
              @click="openToolDisassemblyForm(scope.row.id)"
              v-hasPermi="['tms:tool-info:update']"
              v-if="scope.row.status === 2 || scope.row.status === 4"
            >
              拆卸
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
  
    <ToolDisassemblyForm ref="toolDisassemblyRef"  @success="getList" />
    <!-- 子表的列表 -->
    <ContentWrap v-show="currentRow.id">
        <AssembleRecordList :tool-info-id="currentRow.id" />
    </ContentWrap>
  </template>
  <script setup lang="ts">
  import { AssembleTaskApi } from '@/api/tms/assembletask'
  import { UserVO } from '@/api/system/user'
  import download from '@/utils/download'
  import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
  import ToolDisassemblyForm from './components/ToolDisassemblyForm.vue'
  import AssembleRecordList from '../toolinfo/components/AssembleRecordList.vue'

  
  const message = useMessage() // 消息弹窗
  const { t } = useI18n() // 国际化
  
  const loading = ref(true) // 列表的加载中
  const list = ref<any[]>([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    createTime: [],
    creator: undefined
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中
  const userList = ref<UserVO[]>([]) // 用户列表
  
  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await AssembleTaskApi.getAssembleRecordPage(queryParams)
      list.value = data.list
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  const toolDisassemblyRef = ref()
  const openToolDisassemblyForm = (id: number) => {
    toolDisassemblyRef.value.open(id)
  }
  
  /** 选中行操作 */
  const currentRow = ref({}) // 选中行
  const handleCurrentChange = (row) => {
    currentRow.value = row
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
      download.excel(data, '刀具装配记录.xls')
    } catch {
    } finally {
      exportLoading.value = false
    }
  }
  
  /** 初始化 **/
  onMounted(async () => {
    await getList()
    // userList.value = await UserApi.getSimpleUserList()
  })
  </script>
