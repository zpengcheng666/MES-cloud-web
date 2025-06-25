<template>

  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1280" >
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
      <el-form-item label="项目名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入检测项目名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="项目编号" prop="itemNo">
        <el-input
          v-model="queryParams.itemNo"
          placeholder="请输入检测项目编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="检测方式" prop="inspectionType">
        <el-select
          v-model="queryParams.inspectionType"
          placeholder="请选择检测方式"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!--<el-form-item label="检测项目分类ID" prop="itemTypeId">-->
      <!--<el-input-->
      <!--v-model="queryParams.itemTypeId"-->
      <!--placeholder="请输入检测项目分类ID"-->
      <!--clearable-->
      <!--@keyup.enter="handleQuery"-->
      <!--class="!w-240px"-->
      <!--/>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px"/>
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px"/>
          重置
        </el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create',undefined,itemTypeId)"
          v-hasPermi="['qms:inspection-item:create']"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true"
              ref="itemTableRef"
              highlight-current-row
              @select="handleSelectionChange"
              @row-click="handleSelectionChange"
    >
      <!--<el-table-column label="主键" align="center" prop="id"/>-->
      <el-table-column width="30" label="选择" type="selection"/>
      <el-table-column label="检测项目名称" align="center" prop="itemName"/>
      <el-table-column label="检测项目编号" align="center" prop="itemNo"/>
      <el-table-column label="检测项目描述" align="center" prop="desc"/>
      <el-table-column label="检测方式" align="center" prop="inspectionType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_INSPECTION_TYPE" :value="scope.row.inspectionType" v-if="scope.row.inspectionType" />
        </template>
      </el-table-column>
      <el-table-column label="检测工具 " align="center" prop="inspectionTool">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_INSPECTION_TOOL" :value="scope.row.inspectionTool" v-if="scope.row.inspectionTool" />
        </template>
      </el-table-column>
      <el-table-column label="检测项目分类" align="center" prop="itemTypeName"/>
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
  import download from '@/utils/download'
  import {InspectionItemApi, InspectionItemVO} from '@/api/qms/inspectionitem'

  import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

  /** 检测项目 列表 */
  defineOptions({name: 'InspectionItemChoose'})

  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const message = useMessage() // 消息弹窗
  const {t} = useI18n() // 国际化
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const loading = ref(true) // 列表的加载中
  const list = ref < InspectionItemVO[] > ([]) // 列表的数据
  const total = ref(0) // 列表的总页数

  const props = defineProps < {
    itemInfo: undefined, //  当前选中行
  } > ()
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    createTime: [],
    itemName: undefined,
    itemNo: undefined,
    desc: undefined,
    inspectionType: undefined,
    inspectionTool: undefined,
    itemTypeId: undefined,
  })
  const row=ref({})
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中
  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await InspectionItemApi.getInspectionItemPage(queryParams)
      list.value = data.list
      total.value = data.total
    } finally {
      loading.value = false
    }
  }
  /** 打开弹窗 */
  const open = async (type, row) => {
    dialogVisible.value = true
    dialogTitle.value = "检测项目选择"
    // row.value = row
    handleQuery();
  }
  defineExpose({open}) // 提供 open 方法，用于打开弹窗



  /**
   * 实现单选行
   */
  const selectionInspectionItem = ref < InspectionItemVO[] > ()
  const itemTableRef = ref() // 表格的 Ref
  const handleSelectionChange = (selection) => {
    // 点击复选框
    if (selection instanceof Array) {
      // 点击复选框传数组
      if (selection.length > 1) {
        //移除上一次选中行数据
        selection.shift();
      }
      //修改选中图标为未选中状态
      itemTableRef.value.clearSelection();
      //将当前选中行改为选中状态
      itemTableRef.value.toggleRowSelection(selection[0]);
      selectionInspectionItem.value = selection[0]
    }
    // 点击行
    else {
      itemTableRef.value.clearSelection();
      itemTableRef.value.toggleRowSelection(selection);
      selectionInspectionItem.value = selection
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


  const emit = defineEmits(['getInspectionItem']) // 定义 success 事件，用于操作成功后的回调
  /** 确认 **/
  const submitForm = async () => {
    formLoading.value = true
    try {
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('getInspectionItem', selectionInspectionItem.value,props.itemInfo)
    } finally {
      formLoading.value = false
    }
  }

  /** 初始化 **/
  onMounted(() => {
    getList()
  })
</script>
