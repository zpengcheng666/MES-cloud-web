<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1250" >
    <ContentWrap>
      <!-- 搜索工作栏 -->
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="项目编码" prop="projectCode">
          <el-input
            v-model="queryParams.projectCode"
            placeholder="请输入项目编码"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="queryParams.projectName"
            placeholder="请输入项目名称"
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
      <!--@current-change="handleCurrentChange"-->
      <el-table v-loading="loading"
                ref="productTableRef"
                :data="list"
                :stripe="true"
                :show-overflow-tooltip="true"
                highlight-current-row
                @select="handleSelectionChange"
                >
        <el-table-column width="30" label="选择" :selectable="selectable" type="selection" />
        <el-table-column label="项目编码" align="center" prop="projectCode" />
        <el-table-column label="项目名称" align="center" prop="projectName" />
        <el-table-column label="项目类型" align="center" prop="projectType">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.PMS_PROJECT_TYPE" :value="scope.row.projectType" />
          </template>
        </el-table-column>
        <!--<el-table-column label="项目合同" align="center" prop="projectContract" />-->
        <el-table-column label="项目预算(万元)" align="center" prop="budget" />
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
        :page-sizes="[5, 10, 20, 50, 100]"
      />
    </ContentWrap>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="loading">确定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
  import { ApprovalApi, ApprovalVO } from '@/api/pms/pmsapproval'
  import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

  const props = defineProps({
    projectStatus: {
      type: String,
      default: () => undefined
    },
    // orderList: {
    //   type: Array,
    //   default: () => []
    // }
  })

  const dialogTitle = ref('选择项目') // 弹窗的标题
  const dialogVisible = ref(false)
  const loading = ref(true) // 列表的加载中
  const list = ref<any[]>([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  //选中的数据
  const currentRow = ref()
  //当前数据索引
  const currentIndex = ref(-1)
  const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 5,
    projectCode: undefined,
    projectName: undefined,
    projectStatus: undefined,
  })

  const open = (index)=>{
    // currentIndex.value = index;
    console.log('open')
    dialogVisible.value = true;
    getList()
  }

  const getList = async ()=>{
    loading.value = true

    try {
      queryParams.projectStatus = props.projectStatus;
      const data = await ApprovalApi.getApprovalPage(queryParams)
      list.value = data.list
      total.value = data.total
    } finally {
      loading.value = false
    }
  }



  const handleQuery = ()=>{
    queryParams.pageNo = 1
    getList()
  }
  const resetQuery = ()=>{
    queryParams.projectCode = undefined;
    queryParams.projectName = undefined;
    handleQuery()
  }
  /**
   * 实现单选行
   */
  const productTableRef = ref() // 表格的 Ref
  const handleCurrentChange = (row)=>{
    currentRow.value = {...toRaw(row)}
  }
  const handleSelectionChange = (selection) => {
    // 点击复选框
    if(selection instanceof Array){
      // 点击复选框传数组
      if (selection.length > 1) {
        //移除上一次选中行数据
        selection.shift();
      }
      //修改选中图标为未选中状态
      productTableRef.value.clearSelection();
      //将当前选中行改为选中状态
      productTableRef.value.toggleRowSelection(selection[0]);
      currentRow.value = selection[0]
      productTableRef.value.setCurrentRow(selection[0])
    }
    // 点击行
    else {
      productTableRef.value.clearSelection();
      productTableRef.value.toggleRowSelection(selection);
      currentRow.value = selection
    }
  }

  const submitForm = ()=>{
    // console.log(productCurrentRow.value);
    // emit('getPartNumber',productCurrentRow.value,currentIndex.value);
    //
    // currentIndex.value = -1;
    emit('success',currentRow.value);
    dialogVisible.value = false
  }

  const selectable = (row,index)=>{
    return !row.planList.length>0;
  }


  defineExpose({open})
</script>

<style lang="scss" scoped>
  /**找到表头那一行，然后把里面的复选框隐藏掉**/
  ::v-deep .el-table__header-wrapper .el-table__header .el-checkbox {
    display: none;
  }
</style>
