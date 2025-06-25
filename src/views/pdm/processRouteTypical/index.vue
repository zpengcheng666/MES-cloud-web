<template>
  <!-- 前端分为上下两层 第一个ContentWrap是第一层 也是页面上面部分 -->
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px" label-width="130px">
      <el-form-item label="典型工艺路线名称" prop="name">
        <el-input v-model="queryParams.name" class="!w-240px" clearable placeholder="请输入典型工艺路线名称"
                  @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" >
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
        <el-button v-hasPermi="['pdm:processRouteTypical:create']" plain type="primary" @click="openForm('create')">
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="典型工艺路线名称" prop="name" width="220" />
      <el-table-column align="center" label="工序名称" prop="procedureName" width="150" />
      <el-table-column align="center" label="工艺路线" prop="processRouteName" />
      <el-table-column align="center" label="典型工艺路线描述" prop="description" />
      <el-table-column :width="300" align="center" label="操作">
        <template #default="scope">
          <el-button v-hasPermi="['pdm:processRouteTypical:update']" link type="primary" @click="openForm('update', scope.row.id)">
            编辑
          </el-button>
          <el-button v-hasPermi="['pdm:processRouteTypical:delete']" link type="danger" @click="handleDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total"
                @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ProcessRouteTypicalForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import {ProcessRouteTypicalApi, ProcessRouteTypicalVO} from '@/api/pdm/processRouteTypical'
import ProcessRouteTypicalForm from '@/views/pdm/processRouteTypical/processRouteTypicalForm.vue';

defineOptions({ name: 'PdmProcessRouteTypical' })
const message=useMessage()//弹窗
const {t} =useI18n()//国际化

const loading = ref(true)//列表加载
const total=ref(0)//列表总页数
const list = ref<ProcessRouteTypicalVO[]>([]) // 列表的数据
const queryParams = reactive({
  pageNo:1,
  pageSize:10,
  name:'',
  description:''
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

//查看工艺路线列表
const getList = async () => {
  loading.value=true
  try{
    const data=await ProcessRouteTypicalApi.getProcessRouteTypicalPage(queryParams)
    list.value=data.list
    total.value=data.total
  }finally {
    loading.value=false
  }
}
/**搜索按钮操作**/
const handleQuery=()=>{
  queryParams.pageNo=1
  getList()
}
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ProcessRouteTypicalApi.deleteProcessRouteTypical(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}

/** 初始化 **/
onMounted(async () => {
  getList()
})
</script>
