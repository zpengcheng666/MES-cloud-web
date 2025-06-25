<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1200">
  <!--<ContentWrap>-->
    <!--&lt;!&ndash; 搜索工作栏 &ndash;&gt;-->
    <!--<el-form-->
      <!--class="-mb-15px"-->
      <!--:model="queryParams"-->
      <!--ref="queryFormRef"-->
      <!--:inline="true"-->
      <!--label-width="68px"-->
    <!--&gt;-->
      <!--<el-form-item label="项目id(本地关联时写入)" prop="orderId">-->
        <!--<el-input-->
          <!--v-model="queryParams.orderId"-->
          <!--placeholder="请输入项目id(本地关联时写入)"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="物料编码" prop="materialCode">-->
        <!--<el-input-->
          <!--v-model="queryParams.materialCode"-->
          <!--placeholder="请输入物料编码"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="变码，工序加工后，产生的新码" prop="variableCode">-->
        <!--<el-input-->
          <!--v-model="queryParams.variableCode"-->
          <!--placeholder="请输入变码，工序加工后，产生的新码"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="图号(成品工件)" prop="productCode">-->
        <!--<el-input-->
          <!--v-model="queryParams.productCode"-->
          <!--placeholder="请输入图号(成品工件)"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="项目id" prop="projectId">-->
        <!--<el-input-->
          <!--v-model="queryParams.projectId"-->
          <!--placeholder="请输入项目id"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="计划id" prop="planId">-->
        <!--<el-input-->
          <!--v-model="queryParams.planId"-->
          <!--placeholder="请输入计划id"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="子计划id" prop="planItemId">-->
        <!--<el-input-->
          <!--v-model="queryParams.planItemId"-->
          <!--placeholder="请输入子计划id"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="创建时间" prop="createTime">-->
        <!--<el-date-picker-->
          <!--v-model="queryParams.createTime"-->
          <!--value-format="YYYY-MM-DD HH:mm:ss"-->
          <!--type="daterange"-->
          <!--start-placeholder="开始日期"-->
          <!--end-placeholder="结束日期"-->
          <!--:default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
          <!--class="!w-240px"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
        <!--<el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>-->
        <!--<el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>-->
      <!--</el-form-item>-->
    <!--</el-form>-->
  <!--</ContentWrap>-->

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="relationList"
      :stripe="true"
      :show-overflow-tooltip="true"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
      ref="relationTableRef"
    >
      <!--<el-table-column label="订单id" align="center" prop="id" />-->
      <!--<el-table-column label="订单id(本地关联时写入)" align="center" prop="orderId" />-->
      <el-table-column width="30" label="选择" :selectable="selectable" :reserve-selection="true" type="selection"  />
      <el-table-column label="物料牌号" align="center" prop="materialCode" />
      <el-table-column label="工序码" align="center" prop="variableCode" />
      <el-table-column label="图号" align="center" prop="productCode" />
      <el-table-column label="物料状态" align="center" prop="materialStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_MATERIAL_STATUS" :value="scope.row.materialStatus" />
        </template>
      </el-table-column>
      <el-table-column label="工序" align="center" prop="step" />
      <!--<el-table-column label="可选" align="center" prop="selectStatus" >-->
        <!--<template #default="scope">-->
          <!--<div v-if="scope.row.selectStatus ===0">-->
            <!--可选择-->
          <!--</div>-->
          <!--<div v-if="scope.row.selectStatus ===1">-->
            <!--已分配-->
          <!--</div>-->
          <!--<div v-if="scope.row.selectStatus ===2">-->
            <!--未入库-->
          <!--</div>-->
          <!--&lt;!&ndash;{{scope.row.selectStatus ===1 && '已分配' || '可选择'}}&ndash;&gt;-->
        <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column label="项目id" align="center" prop="projectId" />-->
      <!--<el-table-column label="计划id" align="center" prop="planId" />-->
      <!--<el-table-column label="子计划id" align="center" prop="planItemId" />-->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <!--<el-table-column label="操作" align="center">-->
        <!--<template #default="scope">-->
          <!--<el-button-->
            <!--link-->
            <!--type="primary"-->
            <!--@click="openForm('update', scope.row.id)"-->
            <!--v-hasPermi="['pms:order-material-relation:update']"-->
          <!--&gt;-->
            <!--编辑-->
          <!--</el-button>-->
          <!--<el-button-->
            <!--link-->
            <!--type="danger"-->
            <!--@click="handleDelete(scope.row.id)"-->
            <!--v-hasPermi="['pms:order-material-relation:delete']"-->
          <!--&gt;-->
            <!--删除-->
          <!--</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->

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
      <el-button @click="submit" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { RelationApi } from '@/api/pms/orderMaterialRelation'
import { DICT_TYPE } from '@/utils/dict'


/** 订单物料关系表 列表 */
defineOptions({ name: 'MaterialCodeRelationTable' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const relationList = ref<any[]>([])

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('订单物料关系表') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const orderId = ref();
const selectionList = ref();
const relationTableRef = ref();
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  orderId: undefined,
  materialCode: undefined,
  variableCode: undefined,
  productCode: undefined,
  projectId: undefined,
  planId: undefined,
  planItemId: undefined,
  step: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const step = ref();

//订单id
const open =async (id,rows)=>{
  dialogVisible.value = true
  orderId.value = id;
  formLoading.value = true
  //step.value = tstep;
  console.log(rows)
  try {
    //通过订单id查关系
    // relationList.value = await RelationApi.getRelationListByOrderId(id);
    getList()
    nextTick(()=>{
      rows.forEach((row)=>{
        relationTableRef.value.toggleRowSelection(row,true)
      })
    })
  } finally {
    formLoading.value = false
  }

}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    queryParams.orderId = orderId.value;
    queryParams.materialStatus = 1;
    //queryParams.step = step.value;
    const data = await RelationApi.getOrderMaterialRelationPage(queryParams)
    relationList.value = data.list
    // relationList.value.forEach((item)=>{
    //   if(!item.materialCode){
    //     item.selectStatus = 2;
    //   }else {
    //     if(item.planItemId!=null&&item.planItemId!=undefined&&item.planItemId!=''){
    //       item.selectStatus = 1;
    //       console.log(1)
    //     }else {
    //       console.log(0)
    //       item.selectStatus = 0;
    //     }
    //   }
    //
    // })
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
// const handleQuery = () => {
//   queryParams.pageNo = 1
//   getList()
// }

/** 重置按钮操作 */
// const resetQuery = () => {
//   queryFormRef.value.resetFields()
//   handleQuery()
// }

/** 初始化 **/
// onMounted(() => {
//   getList()
// })

const selectable = (row,index)=>{
  return (!row.planItemId)&&(!!row.materialCode);
  // return row.materialStatus===1;
}

const getRowKeys = (row) => {
  return row.id
}

const handleSelectionChange = (rows) => {
  selectionList.value = rows
  console.log(selectionList.value)
}

const submit = ()=>{
  let myset = new Set();
  selectionList.value.forEach((val)=>{
    myset.add(val.step);
  })
  debugger
  console.log(myset)
  if (myset.size>1) {
    message.warning("不能选择不同工序的物料一起加工")
    return
  }

  formLoading.value = true
  dialogVisible.value = false
  try {
    // 发送操作成功的事件
    emit('success',selectionList.value)
    selectionList.value = [];
  } finally {
    formLoading.value = false
  }
}

defineExpose({open})
</script>
