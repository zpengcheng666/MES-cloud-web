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
        <el-form-item label="日历名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入日历名称"
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
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" ref="tableRef" @select="handleSelectionChange">
        <!--<el-table-column label="id" align="center" prop="id" />-->
        <el-table-column width="30" label="选择" type="selection" />
        <el-table-column label="日历名称" align="center" prop="name" :min-width="100"/>
        <el-table-column
          label="开始日期"
          align="center"
          prop="startDate"
          :formatter="dateFormatter2"
          min-width="120px"
        />
        <el-table-column
          label="结束日期"
          align="center"
          prop="endDate"
          :formatter="dateFormatter2"
          min-width="120px"
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
      <el-button @click="submitForm" type="primary" :disabled="loading">确定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
  import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
  import { BasicCalendarApi, BasicCalendarVO } from '@/api/pms/calendar'
  import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'

  const props = defineProps({
    projectStatus: {
      type: String,
      default: () => undefined
    }
  })

  const dialogTitle = ref('选择基础日历') // 弹窗的标题
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
      const data = await BasicCalendarApi.getBasicCalendarPage(queryParams)
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
  const tableRef = ref() // 表格的 Ref
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
      tableRef.value.clearSelection();
      //将当前选中行改为选中状态
      tableRef.value.toggleRowSelection(selection[0]);
      currentRow.value = selection[0]
      tableRef.value.setCurrentRow(selection[0])
    }
    // 点击行
    else {
      tableRef.value.clearSelection();
      tableRef.value.toggleRowSelection(selection);
      currentRow.value = selection
    }
  }

  const submitForm = ()=>{
    emit('success',currentRow.value);
    dialogVisible.value = false
  }
  defineExpose({open})
</script>

<style lang="scss" scoped>
  /**找到表头那一行，然后把里面的复选框隐藏掉**/
  ::v-deep .el-table__header-wrapper .el-table__header .el-checkbox {
    display: none;
  }
</style>
