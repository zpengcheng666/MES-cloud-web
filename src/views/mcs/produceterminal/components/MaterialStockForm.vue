<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="850" class="inspection-call-dialog">
    <ContentWrap>
      <!-- 搜索工作栏 -->
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
      >
        <div>
          <el-form-item label="物料编号" prop="materialNumber">
            <el-input
              v-model="queryParams.materialNumber"
              placeholder="请输入物料编号"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item label="物料条码" prop="barCode">
            <el-input
              v-model="queryParams.barCode"
              placeholder="请输入物料条码"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery">
              <Icon icon="ep:search" class="mr-5px"/>
              搜索
            </el-button>
            <el-button @click="resetQuery">
              <Icon icon="ep:refresh" class="mr-5px"/>
              重置
            </el-button>
          </el-form-item>
        </div>

      </el-form>
    </ContentWrap>

    <!-- 列表 -->
    <ContentWrap>
      <el-table
          v-loading="loading"
          :data="list"
          class="inspection-table1"
          max-height="25vh"
          @selection-change="handleSelectionChange"
          :header-cell-style="{ borderBottom: '0.3vh solid rgba(37,249,254,1)' }"
          :cell-style="{ borderBottom: '0.3vh solid rgb(37,249,254,1)' }"
      >
        <el-table-column width="30" label="选择" type="selection" />
        <el-table-column label="物料编号" align="center" prop="materialNumber" />
        <el-table-column label="物料名称" align="center" prop="materialName" />
        <el-table-column label="物料条码" align="center" prop="barCode" />
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
      <el-button @click="submitForm" type="primary" :disabled="formLoading" style="background-color: #00C2C7;">确定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
  import { InspectionSheetApi } from '@/api/qms/inspectionsheet'

  /** 物料库存 列表 */
  defineOptions({name: 'MaterialStockForm'})

  const message = useMessage() // 消息弹窗
  const {t} = useI18n() // 国际化
  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const loading = ref(true) // 列表的加载中
  const list =  ref([]) // 列表的数据
  const total = ref(0) // 列表的总页数

  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    inspectionSheetSchemeId: undefined,
    barCode: undefined,
    materialNumber: undefined,
    warehouseCode: 'SH01',
  })
  const queryFormRef = ref() // 搜索的表单

  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await InspectionSheetApi.getInspectionSheetSchemeMaterialTaskPage(queryParams)
      list.value = data.list
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  /** 打开弹窗 */
  const open = async (id) =>
  {
    dialogVisible.value = true
    dialogTitle.value = '产品选择'
    selectionList.value = []
    queryParams.inspectionSheetSchemeId = id
    await getList();
  }
  defineExpose({open}) // 提供 open 方法，用于打开弹窗

  const submitForm = async () => {
    formLoading.value = true
    try {
      dialogVisible.value = false
      const param = {
        warehouseCode: 'SH01',
        ids: selectionList.value.map((item) => item.id)
      }
      await InspectionSheetApi.outBoundInspection(param)
      message.success('呼叫成功')
    } finally {
      formLoading.value = false
    }
  }

  /** 选中操作 */
  const selectionList = ref<[]>
  const handleSelectionChange = (rows) => {
    selectionList.value = rows
    console.log(selectionList.value )
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

</script>


<style lang="scss" scope>

.inspection-table1 {
  //表格背景透明
  --el-table-border-color: transparent;
  --el-table-border: none;
  --el-table-header-bg-color: transparent;
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-expanded-cell-bg-color: transparent;
  //表头颜色
  --el-table-header-text-color: #76f0ee;
  //文字颜色
  --el-table-text-color: #76f0ee;
  //鼠标停留在当前行高亮
  --el-table-row-hover-bg-color: rgb(118,240,238,0.4);
  //选中高亮
  --el-table-current-row-bg-color: rgb(118,240,238,0.4);

  .el-checkbox {
    --el-checkbox-checked-bg-color: #25A4B5;
  }
}

.inspection-call-dialog {
  .el-pagination {
    .el-pagination__total {
      color: #C6C3D9;
      font-weight: bold;
    }

    .el-pagination__jump {
      color: #C6C3D9;
      font-weight: bold;
    }
  }

  .el-pagination.is-background .el-pager li.is-active {
    background-color: #6BC1CA;
    color: var(--el-color-white);
  }

  .el-pagination .el-select {
    width: 128px;
    background-color: transparent;
  }

  .el-select__wrapper {
    border: 2px solid #8BEFFB;
    background-color: transparent !important;
    box-shadow: none !important;

    .el-select__selected-item {
      font-weight: bold;
      color: #C6C3D9;
    }
  }
}
</style>

<style lang="scss">
.inspection-call-dialog {
  --el-dialog-bg-color: transparent;
  background-image: url(@/assets/produceterminal/images/dialog.png);
  background-size: 100% 100%;

  .el-dialog__header {
    border-bottom: 3px solid #62EEEC;
  }

  .el-dialog__footer {
    border-top: none;
    padding-top: 0;
    padding-bottom: var(--el-dialog-padding-primary);
    text-align: right;
    padding-right: var(--el-dialog-padding-primary);
  }

  .el-card {
    border: 3px solid #00C2C7;
    background-color: transparent;
    .el-form-item__label {
      font-size: var(--el-form-label-font-size);
      color: #76f0ee;
    }
    .el-input__wrapper {
      background-color: transparent;
      border: 2px solid #00C2C7;
      box-shadow: none !important;
    }

    .el-input__inner {
      color: #C5C4E3;
      font-weight: bold;
      outline: none;
    }

    .el-button {
      background-color: transparent;
      border: 2px solid #8BEFFB;
      color: #C5C4E3;
    }
  }
}
</style>
