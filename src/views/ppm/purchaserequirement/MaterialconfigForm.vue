<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1280" >
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <ContentWrap>
          <MaterialTypeTree @node-click="handleItemTypeClick"/>
        </ContentWrap>
      </el-col>
      <el-col :span="20" :xs="24">
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
            <el-form-item label="物料名称" prop="materialName">
              <el-input
                v-model="queryParams.materialName"
                placeholder="请输入物料名称"
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
          <el-table
            v-loading="formLoading"
            ref="configTableRef"
            :data="list"
            :stripe="true"
            :show-overflow-tooltip="true"
            highlight-current-row
            @select="handleSelectionChange"
            @row-click="handleSelectionChange"
          >
            <el-table-column width="30" label="选择" type="selection" />
            <el-table-column label="物料编号" align="center" prop="materialNumber"/>
            <el-table-column label="物料名称" align="center" prop="materialName"/>
            <el-table-column label="当前类别" align="center" prop="materialTypeName"/>
            <el-table-column label="类码" align="center" prop="materialTypeCode"/>
            <el-table-column label="主类别" align="center" prop="materialParentTypeName"/>
            <el-table-column label="主类别类码" align="center" prop="materialParentTypeCode"/>
            <el-table-column label="物料规格" align="center" prop="materialSpecification"/>
            <el-table-column label="物料品牌" align="center" prop="materialBrand"/>
            <el-table-column label="物料单位" align="center" prop="materialUnit"/>
            <el-table-column label="物料管理模式" align="center" prop="materialManage">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.WMS_MATERIALTYPE_MATERIALMODE" :value="scope.row.materialManage"/>
              </template>
            </el-table-column>
            <el-table-column label="来源物料" align="center" prop="materialNumberSource"/>
          </el-table>
          <!-- 分页 -->
          <Pagination
            :total="total"
            v-model:page="queryParams.pageNo"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
          />
        </ContentWrap>
      </el-col>
    </el-row>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {MaterialConfigApi, MaterialConfigVO} from '@/api/mcc/materialconfig'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import MaterialTypeTree from "@/views/mcc/materialconfig/components/MaterialTypeTree.vue";
/** 检验方案 列表 */
defineOptions({ name: 'MCCMaterialConfig' })

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
/** 选中行操作 */
const currentRow = ref({}) // 选中行

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  dialogTitle.value = "物料类型选择"
  currentRow.value = {}
  handleQuery();
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 查询列表 */
const getList = async () => {
  formLoading.value = true
  try {
    const data = await MaterialConfigApi.getMaterialConfigPage(queryParams)
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

const emit = defineEmits(['getMaterialConfig']) // 定义 success 事件，用于操作成功后的回调
/** 提交审核 **/
const submitForm = async () => {
  formLoading.value = true
  try {
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('getMaterialConfig', currentRow.value)
  } finally {
    formLoading.value = false
  }
}

/**
 * 实现单选行
 */
// const selectionConfig = ref<MaterialConfigVO[]>()
const configTableRef = ref() // 表格的 Ref
const handleSelectionChange = (selection) => {
  // 点击复选框
  if(selection instanceof Array){
    // 点击复选框传数组
    if (selection.length > 1) {
      //移除上一次选中行数据
      selection.shift();
    }
    //修改选中图标为未选中状态
    configTableRef.value.clearSelection();
    //将当前选中行改为选中状态
    configTableRef.value.toggleRowSelection(selection[0]);
    currentRow.value = selection[0]
    configTableRef.value.setCurrentRow(selection[0])
  }
  // 点击行
  else {
    configTableRef.value.clearSelection();
    configTableRef.value.toggleRowSelection(selection);
    currentRow.value = selection
  }
}

/** 处理分类被点击 */
const handleItemTypeClick = async (row) => {
  debugger
  if (row.id=='0'){
    queryParams.materialTypeId = undefined
  } else {
    queryParams.materialTypeId = row.id
  }

  await getList()
}


</script>

<style lang="scss" scoped>
/**找到表头那一行，然后把里面的复选框隐藏掉**/
:deep(.el-table__header-wrapper .el-table__header .el-checkbox) {
  display: none;
}
</style>
