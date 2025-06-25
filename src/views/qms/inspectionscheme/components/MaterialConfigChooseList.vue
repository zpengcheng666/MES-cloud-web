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
            <el-table-column label="物料名称" align="center" prop="materialName" width="100"/>
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
  import { DICT_TYPE, getIntDictOptions} from "@/utils/dict";
  import MaterialTypeTree from "@/views/mcc/materialconfig/components/MaterialTypeTree.vue";
  const { push } = useRouter() // 路由



  /** 物料类型 列表 */
  defineOptions({ name: 'MaterialConfigChooseList' })

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
  const exportLoading = ref(false) // 导出的加载中
  const warehouseAreaList = ref<any[]>([]) // 默认存放仓库列表
  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await MaterialConfigApi.getMaterialConfigPage(queryParams)
      list.value = data.list
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  /** 打开弹窗 */
  const open = async () => {
    dialogVisible.value = true
    dialogTitle.value = "物料类型选择"
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
  const selectionMaterialConfig= ref<MaterialConfigVO[]>()
  const materialTableRef = ref() // 表格的 Ref
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
      selectionMaterialConfig.value = selection[0]
    }
    // 点击行
    else {
      materialTableRef.value.clearSelection();
      materialTableRef.value.toggleRowSelection(selection);
      selectionMaterialConfig.value = selection
    }
  }

  const emit = defineEmits(['getMaterialConfig']) // 定义 success 事件，用于操作成功后的回调
  /** 确认 **/
  const submitForm = async () => {
    formLoading.value = true
    try {
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('getMaterialConfig', selectionMaterialConfig.value)
    } finally {
      formLoading.value = false
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
  ::v-deep .el-table__header-wrapper .el-table__header .el-checkbox {
    display: none;
  }
</style>
