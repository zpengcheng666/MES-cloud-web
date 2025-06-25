<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1280">
    <el-row :gutter="20">
      <el-col :span="14">
        <ContentWrap>
          <el-button @click="autoDistribution" type="primary" :disabled="formLoading">自动选料</el-button>
          <el-table
            :height="300"
            v-loading="loading"
            :data="planList"
            :stripe="true"
            highlight-current-row
            :show-overflow-tooltip="true"
            ref="handleTableRef"
            @row-click = "clickRow"
          >
            <el-table-column label="项目名" align="center" prop="projectName" />
            <el-table-column label="图号" align="center" prop="partNumber" />
            <el-table-column label="所需物料" align="center" prop="materialNumber" />
            <el-table-column label="物料比" align="center" prop="groupSise" />
            <el-table-column label="所需物料" align="center" prop="require" />
            <!--<el-table-column label="总计需求" align="center" prop="totalRequire" />-->
            <el-table-column label="物料库存" align="center" prop="inventory" />
            <!--<el-table-column label="采购数量" align="center" prop="purchaseAmount" />-->
            <el-table-column label="是否带料" align="center" prop="processType" >
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.PMS_PROCESS_TYPE" :value="scope.row.processType" />
              </template>
            </el-table-column>
            <el-table-column label="整单外协" align="center" prop="outsource" >
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.PMS_ORDER_OUTSOURCE" :value="scope.row.outsource" />
              </template>
            </el-table-column>

            <!--<el-table-column label="物料状态" align="center" prop="materialStatus">-->
            <!--<template #default="scope">-->
            <!--<dict-tag :type="DICT_TYPE.PMS_MATERIAL_STATUS" :value="scope.row.materialStatus" />-->
            <!--</template>-->
            <!--</el-table-column>-->
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
        </ContentWrap>

      </el-col>
      <!--<el-col :span="14">-->
          <!--<el-transfer :titles = "transferTitle" :props="{key: 'id',label: 'barCode',}" v-model="tableRow" :data="transferList" />-->
      <!--</el-col>-->
      <el-col :span="5">
        <ContentWrap title="可选物码">
          <el-table
            :height="275"
            v-loading="loading"
            :data="transferList"
            @row-click = "clickLeft"
          >
            <el-table-column label="物料条码" align="center" prop="barCode" />

          </el-table>
        </ContentWrap>
      </el-col>
      <el-col :span="5" >
        <ContentWrap title="已选物码">
          <el-table
            :height="275"
            v-loading="loading"
            :data="tableRow"
            @row-click = "clickRight"
          >
            <el-table-column label="物料条码" align="center" prop="barCode" />

          </el-table>
        </ContentWrap>
      </el-col>
    </el-row>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { PlanApi, PlanVO } from '@/api/pms/plan'
import { OrderApi } from '@/api/pms/order'
import PlanItemForm from './components/PlanItemForm.vue'
import { ContractApi } from '@/api/ppm/contract'
import ProjectForm from './components/ProjectForm.vue';
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { ProcessPlanApi } from '@/api/pdm/processPlan'

/** 项目计划 表单 */
defineOptions({ name: 'PlanForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const loading = ref(false)
const planList = ref()
const formData = ref({
  id: undefined,
  projectOrderId: undefined,
  remark: undefined,
  status: undefined,
  processInstanceId: undefined,
})
const formRules = reactive({
})
//const formRef = ref() // 表单 Ref
const handleTableRef = ref() // 表单 Ref

//项目订单
const projectOrderList = ref([])

/** 子表的表单 */
const subTabsName = ref('planItem')
const planItemFormRef = ref()
//工艺方案
const processSchemeList = ref<any[]>([])

const updateDisabled = ref(true)
const tableRow = ref<any>([])
const transferList = ref<any>([])
const stockMap = ref()
const transferTitle = ref(['可选物码','已选物码'])
const currentRow = ref()

/** 打开弹窗 */
const open = async (row) => {
  dialogTitle.value = "批量处理"
  dialogVisible.value = true
  //formLoading.value = true
  loading.value = true;
  console.log(row)
  // const handle = await PlanApi.batchSelect(row)
  // planList.value = handle.planHandleList;
  // handleStock(handle.stockList)
  // planList.value.forEach((item)=>{
  //   item.materialCodeList = []
  // })
  //dialogVisible.value = true
  //dialogTitle.value = "批量处理"
  resetForm()
  try {
    const handle = await PlanApi.batchSelect(row)
    planList.value = handle.planHandleList;
    handleStock(handle.stockList)
    planList.value.forEach((item)=>{
      item.materialCodeList = []
    })
  } finally {
    loading.value = false;
    //formLoading.value = false
  }
}

const handleStock = (stockList)=>{
  let map = new Map();
  stockList.forEach((item)=>{
    item.key = item.id;
    if(map.has(item.materialNumber)){
      map.get(item.materialNumber).push(item)
    }else {
      let array = [];
      array.push(item)
      map.set(item.materialNumber,array)
    }
  })
  stockMap.value = map;
  console.log(stockMap.value)
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  //await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = planList.value
    //await PlanApi.batchPurchaseAndOrder(data)
    await PlanApi.batchPurchase(data)
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
    dialogVisible.value = false
  }
}
/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    projectOrderId: undefined,
    remark: undefined,
    status: undefined,
    processInstanceId: undefined,
    partNumber: undefined,
    partName: undefined,
    projectName: undefined,
    projectCode: undefined,

  }
  tableRow.value = []
  transferList.value = []
  processSchemeList.value = [];
  //formRef.value?.resetFields()
}

const clickRow = (row)=>{
  currentRow.value = row;
  tableRow.value = row.materialCodeList
  console.log(stockMap.value);
  console.log(typeof stockMap.value);
  if(row.materialNumber!=null){
    transferList.value = stockMap.value.get(row.materialNumber);
  }else {
    transferList.value = []
  }
  console.log(row)
}
const clickLeft = (row)=>{

  //这里先判断一下数量,多余需求就不让选了
    if(tableRow.value.length==currentRow.value.require) {
      message.warning("已备齐物料，无需再选")
      return
    }

  const index = stockMap.value.get(row.materialNumber).indexOf(row);
  stockMap.value.get(row.materialNumber).splice(index,1);
  transferList.value = stockMap.value.get(row.materialNumber);
  tableRow.value.push(row)
  currentRow.value.purchaseAmount = currentRow.value.require - tableRow.value.length;
  console.log(row)
}
const clickRight = (row)=>{

  const index = tableRow.value.indexOf(row);
  tableRow.value.splice(index,1);

  stockMap.value.get(row.materialNumber).push(row)
  transferList.value = stockMap.value.get(row.materialNumber);
  console.log(row)
  currentRow.value.purchaseAmount = currentRow.value.require - tableRow.value.length;
}

const autoDistribution = ()=>{
  for (let i = 0; i < planList.value.length; i++) {
    //整单外协不带料
    if(planList.value[i].outsource ===1&&planList.value[i].processType ===2){
      continue;
    }
    if(planList.value[i].materialNumber === null){
      continue;
    }
    //如果有这类物料
    if(stockMap.value.has(planList.value[i].materialNumber)){
      //判断这类的物料数大于0，并且需求数量大于已选数量
      while (stockMap.value.get(planList.value[i].materialNumber).length>0&&planList.value[i].materialCodeList.length<planList.value[i].require) {
        const row = stockMap.value.get(planList.value[i].materialNumber).shift()
        planList.value[i].materialCodeList.push(row);
      }
    }
    planList.value[i].purchaseAmount = planList.value[i].require - planList.value[i].materialCodeList.length;

  }
}

//获取工艺方案
// const getProcessScheme =async ()=>{
//   const params = {
//     projectCode:formData.value.projectCode,
//     partNumber:formData.value.partNumber,
//   }
//   //整个项目的工艺方案,用新接口
//   const list = await ProcessPlanApi.getProjPartBomTreeListNew(params);
//   processSchemeList.value = list.filter((item)=>{
//     return item.type ===2;
//   })
// }
</script>

<style scoped>

  /* 调整整个el-transfer的宽度和高度 */
  /deep/ .el-transfer .el-transfer-panel {
    width: 300px; /* 设置左右面板的宽度 */
  }
</style>
