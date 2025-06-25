<template>
    <Dialog :title="dialogTitle" v-model="dialogVisible" width="60%" >
      <ContentWrap>
        <!-- 搜索工作栏 -->
        <el-form
          class="-mb-15px"
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          label-width="68px"
        >
        <el-form-item label="物料名称" prop="toolName">
          <el-input
            v-model="queryParams.toolName"
            placeholder="请输入物料名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="物料编号" prop="materialNumber">
          <el-input
            v-model="queryParams.materialNumber"
            placeholder="请输入物料编号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        </el-form-item>
      </el-form>
      </ContentWrap>
      <!-- 列表 -->
      <ContentWrap>
        <el-table v-loading="formLoading"
                  ref="projectTableRef"
                  :data="list"
                  :stripe="true"
                  :show-overflow-tooltip="true"
                  highlight-current-row
                  @select="handleSelectionChange"
                  @row-click="handleSelectionChange">
          <el-table-column width="30" label="选择" type="selection" />
          <el-table-column label="名称" align="center" prop="toolName" />
          <el-table-column label="编号" align="center" prop="materialNumber" />
          <el-table-column label="类别" align="center" prop="materialTypeName" />
          <el-table-column label="型号" align="center" prop="toolModel" />
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
  // import { MaterialConfigApi, MaterialConfigVO } from '@/api/mcc/materialconfig';

  import { ToolConfigApi, ToolConfigVO } from '@/api/tms/toolconfig'

  /** 刀具类型 列表 */
  defineOptions({ name: 'ToolTypeChoose' })
  
  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const formLoading = ref(true) // 列表的加载中
  const list = ref<MaterialConfigVO[]>([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    createTime: [],
    materialNumber: undefined,
    toolName: undefined,
    materialTypeId: undefined,
    materialParentTypeId: undefined,
    materialSpecification: undefined,
    materialBrand: undefined,
    materialUnit: undefined,
    materialSourceId: undefined,
    materialTypeCode: undefined,
  })
  const queryFormRef = ref() // 搜索的表单
  const toolTypeId = ref('')
  const toolTypeCode = ref('')

  /** 打开弹窗 */
  const open = async (id: string, type: string) => {
    dialogVisible.value = true
    dialogTitle.value = "刀具类型选择"
    toolTypeId.value = id
    toolTypeCode.value = type
    handleQuery();
  }
  
  defineExpose({ open }) // 提供 open 方法，用于打开弹窗
  
  /** 查询列表 */
  const getList = async () => {
    formLoading.value = true
    try {
     if(toolTypeId.value) queryParams.materialTypeId = toolTypeId.value
      if(toolTypeCode.value) queryParams.materialTypeCode = toolTypeCode.value

      const data = await ToolConfigApi.getToolConfigPage(queryParams)
      list.value = data.list
      total.value = data.total
    } finally {
      formLoading.value = false
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
  
  
  const emit = defineEmits(['getToolType']) // 定义 success 事件，用于操作成功后的回调
  /** 确认 **/
  const submitForm = async () => {
    formLoading.value = true
    try {
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('getToolType', selectionToolType.value)
    } finally {
      formLoading.value = false
    }
  }
  
  /**
   * 实现单选行
   */
  const selectionToolType = ref('')
  const projectTableRef = ref() // 表格的 Ref
  const handleSelectionChange = (selection) => {
    // 点击复选框
    if(selection instanceof Array){
      // 点击复选框传数组
      if (selection.length > 1) {
        //移除上一次选中行数据
        selection.shift();
      }
      //修改选中图标为未选中状态
      projectTableRef.value.clearSelection();
      //将当前选中行改为选中状态
      projectTableRef.value.toggleRowSelection(selection[0]);
      selectionToolType.value = selection[0]
    }
    // 点击行
    else {
      projectTableRef.value.clearSelection();
      projectTableRef.value.toggleRowSelection(selection);
      selectionToolType.value = selection
    }
  }
  
  </script>
  
  <style lang="scss" scoped>
  /**找到表头那一行，然后把里面的复选框隐藏掉**/
  ::v-deep .el-table__header-wrapper .el-table__header .el-checkbox {
    display: none;
  }
  </style>
