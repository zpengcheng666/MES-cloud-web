<template>

  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1280" >
  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      ref="processTableRef"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      highlight-current-row
      @select="handleSelectionChange"
      @row-click="handleSelectionChange"
    >
      <el-table-column width="30" label="选择" type="selection" />
      <el-table-column  label="工艺规程编号"   align="center" prop="processCode" />
      <el-table-column label="加工方案码" align="center" prop="processSchemeCode" />
      <el-table-column label="工艺规程名称" align="center" prop="processName" />
      <el-table-column label="版次" align="center" prop="processVersion" />

      <el-table-column label="零件图号" align="center" prop="partNumber" />
      <el-table-column label="零件名" align="center" prop="partName" />
      <el-table-column label="零件版本" align="center" prop="partVersion" />
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
  import { handleTree } from '@/utils/tree'

  import { DICT_TYPE, getIntDictOptions} from "@/utils/dict";
  import {InspectionSchemeApi, InspectionSchemeVO} from '@/api/qms/inspectionscheme'
  import { checkPermi } from '@/utils/permission'
  const { push } = useRouter() // 路由



  /** 工艺规程 列表 */
  defineOptions({ name: 'ProcessChooseList' })

  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const message = useMessage() // 消息弹窗
  const { t } = useI18n() // 国际化
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const loading = ref(true) // 列表的加载中
  const list = ref<MaterialConfigVO[]>([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中
  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data1 = await InspectionSchemeApi.getProcessPage(queryParams)
      total.value = data1.total
      list.value = data1.list
    } finally {
      loading.value = false
    }
  }

  /** 打开弹窗 */
  const open = async () => {
    dialogVisible.value = true
    dialogTitle.value = "工艺规程选择"
    handleQuery();
  }
  defineExpose({open}) // 提供 open 方法，用于打开弹窗


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



  /**
   * 实现单选行
   */
  const selectionProcess= ref()
  const processTableRef = ref() // 表格的 Ref
  const handleSelectionChange = (selection) => {
    // 点击复选框
    if(selection instanceof Array){
      // 点击复选框传数组
      if (selection.length > 1) {
        //移除上一次选中行数据
        selection.shift();
      }
      //修改选中图标为未选中状态
      processTableRef.value.clearSelection();
      //将当前选中行改为选中状态
      processTableRef.value.toggleRowSelection(selection[0]);
      selectionProcess.value = selection[0]
    }
    // 点击行
    else {
      processTableRef.value.clearSelection();
      processTableRef.value.toggleRowSelection(selection);
      selectionProcess.value = selection
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


  const emit = defineEmits(['getProcess']) // 定义 success 事件，用于操作成功后的回调
  /** 确认 **/
  const submitForm = async () => {
    formLoading.value = true
    try {
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('getProcess', selectionProcess.value)
    } finally {
      formLoading.value = false
    }
  }

</script>

<style lang="scss" scoped>
  /**找到表头那一行，然后把里面的复选框隐藏掉**/
  ::v-deep .el-table__header-wrapper .el-table__header .el-checkbox {
    display: none;
  }
</style>
