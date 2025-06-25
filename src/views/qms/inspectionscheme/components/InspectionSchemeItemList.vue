<template>

  <!-- 列表 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item>
        <el-button type="primary" @click="openForm('create')"
                   v-hasPermi="['qms:inspection-scheme:create']"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
        </el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--<el-table-column label="主键" align="center" prop="id" />-->


      <el-table-column label="方案" align="center" prop="inspectionSchemeName"/>
      <el-table-column label="分类" align="center" prop="itemTypeName"/>
      <el-table-column label="检测项目" align="center" prop="inspectionItemName"/>
      <el-table-column label="检测工具" align="center" prop="inspectionToolName"/>
      <el-table-column label="检测顺序" align="center" prop="number"/>
      <el-table-column label="技术要求" align="center" prop="content"/>
      <el-table-column label="上限值" align="center" prop="maxValue"/>
      <el-table-column label="下限值" align="center" prop="minValue"/>

      <el-table-column label="判断方式" align="center" prop="referenceType">

        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_REFERENCE_TYPE" :value="scope.row.referenceType"/>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['qms:inspection-scheme:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['qms:inspection-scheme:delete']"
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
  <InspectionSchemeItemFormInfo ref="formRef" @success="getList"/>
  <InspectionSchemeItemFormDetail ref="formDetailRef" @success="getList"/>
</template>

<script setup lang="ts">
  import {dateFormatter} from '@/utils/formatTime'
  import download from '@/utils/download'
  import {InspectionSchemeItemApi, InspectionSchemeItemVO} from '@/api/qms/inspectionschemeitem'
  import InspectionSchemeItemFormInfo from '../../inspectionschemeitem/InspectionSchemeItemFormInfo.vue'
  import InspectionSchemeItemFormDetail from '../../inspectionschemeitem/InspectionSchemeItemFormDetail.vue'
  import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
  /** 检验方案检测项目详情 列表 */
  defineOptions({name: 'InspectionSchemeItemList'})

  const message = useMessage() // 消息弹窗
  const {t} = useI18n() // 国际化
  const props = defineProps < {
    inspectionScheme: undefined // 检测项目ID（主表的关联字段）
  } > ()
  const loading = ref(true) // 列表的加载中
  const list = ref < InspectionSchemeItemVO[] > ([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    createTime: [],
    inspectionSchemeId: undefined,
    inspectionItemId: undefined,
    number: undefined,
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中


  /** 监听主表的关联字段的变化，加载对应的子表数据 */
  watch(
    () => props.inspectionScheme,
    (val) => {
      queryParams.inspectionSchemeId = val.id
      handleQuery()
    },
    {immediate: false}
  )

  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await InspectionSchemeItemApi.getInspectionSchemeItemPage(queryParams)
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
  const openForm = (type: string, id
    ? : number
  ) =>
  {

    if (!props.inspectionScheme.id) {
      message.error('请选择一个检测项目')
      return
    }
    formRef.value.open(type, id, props.inspectionScheme.id, props.inspectionScheme.schemeName)
  }


  const formDetailRef = ref()
  const openFormDetail = (type: string, id
    ? : number
  ) =>
  {

    if (!props.inspectionScheme.id) {
      message.error('请选择一个检测项目')
      return
    }
    formDetailRef.value.open(type, id, props.inspectionScheme.id, props.inspectionScheme.schemeName)
  }






  /** 删除按钮操作 */
  const handleDelete = async (id: number) => {
    try {
      // 删除的二次确认
      await message.delConfirm()
      // 发起删除
      await InspectionSchemeItemApi.deleteInspectionSchemeItem(id)
      message.success(t('common.delSuccess'))
      // 刷新列表
      await getList()
    } catch {
    }
  }

  /** 导出按钮操作 */
  const handleExport = async () => {
    try {
      // 导出的二次确认
      await message.exportConfirm()
      // 发起导出
      exportLoading.value = true
      const data = await InspectionSchemeItemApi.exportInspectionSchemeItem(queryParams)
      download.excel(data, '检验方案检测项目详情.xls')
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
