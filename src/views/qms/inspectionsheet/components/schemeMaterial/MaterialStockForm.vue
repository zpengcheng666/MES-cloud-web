<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1200">

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
          <el-form-item label="物料条码" prop="barCode">
            <el-input
              v-model="queryParams.barCode"
              placeholder="请输入物料条码"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item label="批次号" prop="batchNumber">
            <el-input
              v-model="queryParams.batchNumber"
              placeholder="请输入物料批次号"
              clearable
              @keyup.enter="handleQuery"
              class="!w-250px"
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
          ref="materialTableRef"
          :data="list"
          :stripe="true"
          :show-overflow-tooltip="true"
          highlight-current-row
          @select="handleSelectionChange"
          @row-click="handleSelectionChange"
      >
        <el-table-column width="30" label="选择" type="selection" />
        <el-table-column label="物料编号" align="center" prop="materialNumber" width="180"/>
        <el-table-column label="物料条码" align="center" prop="barCode" width="180"/>
        <el-table-column label="物料批次号" align="center" prop="batchNumber" width="180"/>
        <el-table-column label="总库存" align="center" prop="totality"/>
        <el-table-column label="锁定库存" align="center" prop="locked"/>
        <el-table-column label="可用库存" align="center" prop="available"/>
        <el-table-column label="占用比例" align="center" prop="occupancyRatio"/>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
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
  import {dateFormatter} from '@/utils/formatTime'
  import {MaterialStockApi, MaterialStockVO} from '@/api/wms/materialstock'

  /** 物料库存 列表 */
  defineOptions({name: 'MaterialStockForm'})

  const message = useMessage() // 消息弹窗
  const {t} = useI18n() // 国际化
  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const loading = ref(true) // 列表的加载中
  const list = ref < MaterialStockVO[] > ([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const check = ref();
  const formType = ref('') // 表单的类型：create - 新增；update - 修改

  const props = defineProps < {
    material: undefined, //  当前选中行
  } > ()

  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    createTime: [],
    materialConfigId: undefined,
    barCode: undefined,
    batchNumber: undefined,
    materialId: undefined,
    storageId: undefined,
    locationId: undefined,
    bindType: undefined,
  })
  const queryFormRef = ref() // 搜索的表单

  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await MaterialStockApi.getMaterialStockPage(queryParams)
      list.value = data.list
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  /** 打开弹窗 */
  const open = async (materialConfigId, barCode) =>
  {
    dialogVisible.value = true
    dialogTitle.value = '产品选择'
    formType.value = ''
    queryParams.materialConfigId = materialConfigId
    queryParams.barCode = barCode
    getList();
  }
  defineExpose({open}) // 提供 open 方法，用于打开弹窗

  const selectionMaterial = ref<MaterialStockVO[]>()
  const materialTableRef = ref();
  const handleSelectionChange = (selection) => {
      // 点击复选框
      if(selection instanceof Array){
        // 点击复选框传数组
        if (selection.length > 1) {
          //移除上一次选中行数据
          selection.shift();
        }
        //修改选中图标为未选中状态
        materialTableRef.value.clearSelection();
        //将当前选中行改为选中状态
        materialTableRef.value.toggleRowSelection(selection[0]);
        selectionMaterial.value = selection[0]
        materialTableRef.value.setCurrentRow(selection[0])
      }
      // 点击行
      else {
        materialTableRef.value.clearSelection();
        materialTableRef.value.toggleRowSelection(selection);
        selectionMaterial.value = selection
      }
  }


  const emit = defineEmits(['getMaterial'])
  const submitForm = async () => {
    formLoading.value = true
    try {
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('getMaterial', selectionMaterial.value)
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

</script>

<style lang="scss" scoped>
:deep(.el-table__header-wrapper .el-table__header .el-checkbox) {
  display: none;
}
</style>
