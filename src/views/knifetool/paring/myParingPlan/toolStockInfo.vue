<template>
<Dialog :title="title" v-model="visible" width="1280" >
      <ContentWrap>
        <!-- 搜索工作栏 -->
        <el-form
          class="-mb-15px"
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          label-width="68px"
        >
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
                  :data="toolStockList"
                  :stripe="true"
                  :show-overflow-tooltip="true"
                  highlight-current-row
                  @select="handleSelectionChange"
                  @row-click="handleSelectionChange">
          <el-table-column width="30" label="选择" type="selection" />
          <el-table-column label="物料编号" align="center" prop="materialNumber" />
          <el-table-column label="物料条码" align="center" prop="barCode" />
          <el-table-column label="库存数量" align="center" prop="totality" />
          <el-table-column label="所在托盘" align="center" prop="storageCode" />
          <el-table-column label="所在库位" align="center" prop="rootLocationCode" />
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
        <el-button @click="visible = false">取 消</el-button>
      </template>
    </Dialog>
</template>
<script setup lang="ts">
import { MaterialStockApi } from '@/api/wms/materialstock'

  const formLoading = ref(true) // 列表的加载中
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    createTime: [],
    materialNumber: undefined,
    materialName: undefined,
    materialTypeId: undefined,
    materialParentTypeId: undefined,
    materialSpecification: undefined,
    materialBrand: undefined,
    materialUnit: undefined,
    materialSourceId: undefined,
    materialTypeCode: undefined,
  })
  const queryFormRef = ref() // 搜索的表单

  const currentMaterialNumber = ref('') // 当前选中的物料编号

const props = defineProps({
    title:{
        type: String,
        default: '刀具库存信息'
    }
})

const visible = ref(false)
const toolStockList = ref([])


function handleClose() {
    visible.value = false
}
function open(materialNumber: string) {
    visible.value = true
    queryParams.materialNumber = materialNumber
    currentMaterialNumber.value = materialNumber
    getList()
}

const getList = async () => {
    formLoading.value = true
    try {
      const data = await MaterialStockApi.getMaterialStockByMaterialNumber(queryParams);
      toolStockList.value = data.list
      total.value = data.total
    } finally {
      formLoading.value = false
    }
}

defineExpose({ open })


  /**
   * 实现单选行
   */
  const selectionTool = ref('')
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
      selectionTool.value = selection[0]
    }
    // 点击行
    else {
      projectTableRef.value.clearSelection();
      projectTableRef.value.toggleRowSelection(selection);
      selectionTool.value = selection
    }
  }
  
  
  const emit = defineEmits(['getTool']) // 定义 success 事件，用于操作成功后的回调
  /** 确认 **/
  const submitForm = async () => {
    if(!selectionTool.value){
        ElMessage({
                type: 'error',
                message: `请选择一条记录`,
            })
            return
    }

    // if(selectionTool.materialNumber !== currentMaterialNumber.value){
    //     ElMessage({
    //             type: 'error',
    //             message: `所选刀具类型与装配指导不符，不能进行装配！`,
    //         })
    //         return
    // }

    if(selectionTool.value.totality == 1){
        selectionTool.value.takeQuantity = 1
        submitFormFuc();
        return
    }

    ElMessageBox.prompt('请输入取出库存数量', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern:/^[1-9]\d*$/,//大于零的正整数
      inputErrorMessage: '取出库存数量数值输入错误！',
      type: 'warning'
    }).then(({ value }) => {
        if(value > selectionTool.value.totality){
            ElMessage({
                type: 'error',
                message: `取出库存不能大于实际库存！`,
            })
            return
        }
        selectionTool.value.takeQuantity = value
        submitFormFuc();
    }).catch(() => {
      console.log('取消选择')
    })
  }

const submitFormFuc = async () => {
    formLoading.value = true
    try {
        visible.value = false
        console.log("111",selectionTool.value)
        // 发送操作成功的事件
        emit('getTool', selectionTool.value)
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