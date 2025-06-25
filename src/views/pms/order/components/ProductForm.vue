<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="960" >
    <ContentWrap>
      <!-- 搜索工作栏 -->
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="图号" prop="partNumber">
          <el-input
            v-model="queryParams.partNumber"
            placeholder="请输入图号"
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
                ref="productTableRef"
                :data="list"
                :stripe="true"
                :show-overflow-tooltip="true"
                highlight-current-row
                @current-change="handleCurrentChange">
        <!--<el-table-column width="30" label="选择" type="selection" :reserve-selection="true"/>-->
        <!--<el-table-column label="版本号" align="center" prop="partVersionId"  min-width="300px" />-->
        <el-table-column label="图号" align="center" prop="partNumber"  min-width="150px" />
        <el-table-column label="零件名称" align="center" prop="partName"  min-width="150px" />
        <el-table-column label="数模版次" align="center" prop="partVersion"  min-width="120px" />
        <el-table-column label="产品名称" align="center" prop="productNumber"  min-width="150px" />
        <el-table-column label="评估者" align="center" prop="reviewer"  min-width="120px" />
        <el-table-column label="是否通过" align="center" min-width="120px">
          <template #default="scope">
            <span v-if="scope.row.isPass == '0'">通过</span>
            <span v-if="scope.row.isPass == '1'">不通过</span>
            <span v-if="scope.row.isPass == '' && scope.row.isPass != '0'">无</span>
          </template>
        </el-table-column>
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
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">

  const dialogTitle = ref('选择产品') // 弹窗的标题
  const dialogVisible = ref(false)
  const productList = inject('productList')
  const list = ref<any[]>([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const productCurrentRow = ref()
  //当前数据索引
  const currentIndex = ref(-1)
  // const props = defineProps({
  //   productList:{
  //     type: Array ,
  //     default: () => []
  //   },
  // })
  const emit = defineEmits(['getPartNumber']) // 定义 success 事件，用于操作成功后的回调
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 5,
    partNumber:''
  })

  const open = (index)=>{
    currentIndex.value = index;
    console.log('open')
    dialogVisible.value = true;
    getList()
  }

  const getList = ()=>{
    list.value = productList?.value.slice((queryParams.pageNo-1)*queryParams.pageSize,(queryParams.pageNo-1)*queryParams.pageSize+queryParams.pageSize);
    total.value = productList?.value.length
  }



  const handleQuery = ()=>{
    queryParams.pageNo = 1
    getList()
  }
  const resetQuery = ()=>{
    queryParams.partNumber = undefined;
    handleQuery()
  }
  /**
   * 实现单选行
   */
  const productTableRef = ref() // 表格的 Ref
  const handleCurrentChange = (row)=>{
    productCurrentRow.value = {...toRaw(row)}
  }

  const submitForm = ()=>{
    console.log(productCurrentRow.value);
    emit('getPartNumber',productCurrentRow.value,currentIndex.value);

    currentIndex.value = -1;
    dialogVisible.value = false
  }


  defineExpose({open})
</script>

<style scoped>

</style>
