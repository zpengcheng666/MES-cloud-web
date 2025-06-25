<template>
  <ContentWrap >

    <el-row>
      <el-col :offset="20" :span="4">
        <el-button style="margin-top: 12px" type="primary" @click="back" ><Icon icon="ep:back" />返回订单</el-button>
      </el-col>
    </el-row>


      <el-row >
        <el-col :span="24">
          <el-table v-loading="loading" :data="orderList" :stripe="true" :show-overflow-tooltip="true">
            <!--<el-table-column label="项目编码" align="center" prop="projectCode" />-->
            <!--<el-table-column label="项目id" align="center" prop="projectId" />-->
            <el-table-column label="物料牌号" align="center" prop="material" />
            <el-table-column label="物料编号" align="center" prop="materialNumber" min-width="120px">
              <template #default="{ row }">
                <!--<div v-if="row.processType===1">-->
                  <!--{{row.materialNumber}}-->
                <!--</div>-->
                <div v-if="row.processType===1">
                  <el-select v-model="row.materialNumber" placeholder="请选择产品编号(id)" @change="updateMaterialNumber(row)" clearable>
                    <el-option
                      v-for="item in materialList"
                      :key="item.id"
                      :label="item.materialNumber"
                      :value="item.materialNumber"
                    />
                  </el-select>
                </div>

              </template>
            </el-table-column>
            <!--<el-table-column label="物料牌号" align="center" prop="materialNumber" />-->
            <el-table-column label="图号" align="center" prop="partNumber" />
            <el-table-column label="工件名称" align="center" prop="partName" />
            <el-table-column label="数量" align="center" prop="quantity" />
            <el-table-column label="带料加工" align="center" prop="processType">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.PMS_PROCESS_TYPE" :value="scope.row.processType" />
              </template>
            </el-table-column>
            <el-table-column label="订单状态" align="center" prop="orderStatus">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.PMS_ORDER_STATUS" :value="scope.row.orderStatus" />
              </template>
            </el-table-column>
            <el-table-column label="订单类型" align="center" prop="orderType">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.PMS_ORDER_TYPE" :value="scope.row.orderType" />
              </template>
            </el-table-column>
            <el-table-column label="项目名称" align="center" min-width="100px" prop="projectName" />
            <el-table-column
              label="原料交付时间"
              align="center"
              prop="materialDeliveryTime"
              :formatter="dateFormatter2"
              width="120px"
            />
            <el-table-column
              label="成品交付时间"
              align="center"
              prop="fproDeliveryTime"
              :formatter="dateFormatter2"
              width="120px"
            />

            <el-table-column label="毛坯状态" align="center" prop="materialStatus">
              <template #default="scope">
                <div v-if="scope.row.materialStatus === 1">
                  <el-button type="success" disabled >已存在</el-button>
                </div>
                <div v-else>
                  <el-button type="primary" :disabled="scope.row.orderType===1" @click="openMaterialConfigForm(scope.row.materialNumber)">不存在</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="产品状态" align="center" prop="productStatus">
              <template #default="scope">
                <div v-if="scope.row.productStatus === 1">
                  <el-button type="success" disabled>已存在</el-button>
                </div>
                <div v-else>
                  <el-button type="primary" @click="openMaterialConfigForm(scope.row.partNumber)">不存在</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="160px">
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  @click="openSelectProject(scope.row)"
                  v-hasPermi="['pms:order:update']"
                >
                  绑定项目
                </el-button>
                <el-button
                  v-if="scope.row.orderType===1"
                  link
                  type="danger"
                  @click="handleDelete(scope.row.id)"
                  v-hasPermi="['pms:order:update']"
                  :disabled="!!scope.row.projectId"
                >
                  删除订单
                </el-button>
                <!--<el-button-->
                  <!--link-->
                  <!--type="primary"-->
                  <!--:disabled="scope.row.needsAssessment !=0"-->
                  <!--@click="openOutResourceForm(scope.row.id)"-->
                <!--&gt;-->
                  <!--外协决定-->
                <!--</el-button>-->
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>


    <!--<el-row>-->
      <!--<el-col :offset="20" :span="4">-->
        <!--<el-button style="margin-top: 20px" type="primary" @click="submit" :disabled="formLoading">完 成</el-button>-->
      <!--</el-col>-->
    <!--</el-row>-->

  </ContentWrap>
  <HandleMaterialConfigForm ref="handleMaterialConfigFormRef" @success="getList" />
  <ProjectForm ref="projectFormRef" @success="getProject"/>
  <SelectProject ref="selectProjectRef"/>
  <OutSourceForm ref="outSourceFormRef" />
</template>

<script setup lang="ts">/** 项目订单 列表 */

  import ApprovalCreateForm from '../pmsapproval/ApprovalCreateForm.vue'
  import HandleMaterialConfigForm from './HandleMaterialConfigForm.vue'
  import { OrderApi, OrderVO } from '@/api/pms/order'
  import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'
  import { DICT_TYPE,getIntDictOptions } from '@/utils/dict'
  import { useTagsViewStore } from '@/store/modules/tagsView'
  import ProjectForm from './components/ProjectForm.vue'
  import SelectProject from './components/SelectProject.vue'
  import OutSourceForm from './components/OrderOutSourceForm.vue'

  defineOptions({ name: 'HandleOrder' })

  const {query} = useRoute() // 查询参数
  const { push, currentRoute } = useRouter() // 路由
  const { delView } = useTagsViewStore() // 视图操作
  const message = useMessage() // 消息弹窗
  //订单
  const sellOrder = ref();
  const materialList = ref()


const active = ref(1)
const orderList = ref<any[]>([]);
const handleMaterialConfigFormRef = ref();
const approvalCreateFormRef = ref();
const projectFormRef = ref()
const selectProjectRef = ref();
const outSourceFormRef = ref()
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const next = () => {
    //状态为1的时候看看毛坯和产品的状态
    if(active.value===1){
      //因为实际上只有一条数据,用0判断就行
      console.log(orderList.value[0]);
      if(orderList.value[0].productStatus!=1){
        message.warning("请先添加不存在的产品类型")
        return
      }
      if(orderList.value[0].orderType===0&&orderList.value[0].materialStatus!=1){
        message.warning("请先添加不存在的产品或毛坯")
        return
      }
    }
    active.value++;
    if (active.value > 2){
      active.value = 1
    }

    console.log(active.value)
  }
  const last = ()=>{
    active.value--;
  }

  const submit = async ()=>{
    formLoading.value = true
    //验证外协决定,不评审就要判断选外协决定
    if(orderList.value[0].needsAssessment===0){
      if(orderList.value[0].outsource===null||orderList.value[0].outsource===undefined){
        message.warning("未决定整单外协")
      }
    }
    try{
      await OrderApi.updateOrder(orderList.value[0])
    }finally {
      formLoading.value = false
    }
    //approvalCreateFormRef.value.submit();
  }
const back = ()=>{
  active.value=1;
  // 关闭当前 Tab
  delView(unref(currentRoute))
  push({name:'PmsOrder'},)
}

const openMaterialConfigForm = (materialNumber) => {
  handleMaterialConfigFormRef.value.open(materialNumber,query.id)
}

  const formData = ref({
    id: undefined,
    projectCode: undefined,
    projectId: undefined,
    materialNumber: undefined,
    partNumber: undefined,
    quantity: undefined,
    processType: undefined,
    orderStatus: undefined,
    materialDeliveryTime: undefined,
    fproDeliveryTime: undefined,
  })

const mccQueryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  materialNumber: undefined,
})

const updateMaterialNumber = async (row)=>{
 await OrderApi.updateOutOrder(row);
  getList(query.id);
    // console.log(row);
}

const getList = async (id)=>{
  orderList.value = await OrderApi.getOrderById(id)
  console.log(orderList.value[0]);
  sellOrder.value = orderList.value[0];
  materialList.value = await OrderApi.getMaterialByTypeCode("MP");
}

const openProjectForm = ()=>{
  projectFormRef.value.open()
}
const openSelectProject = (row)=>{
  selectProjectRef.value.open(row)
}
const openOutResourceForm = (id)=>{
  outSourceFormRef.value.open(id)
}
const getProject = (row)=>{
  console.log(row)
  orderList.value[0].projectName = row.projectName;
  orderList.value[0].projectId = row.id;
  orderList.value[0].projectName = row.projectCode;
  orderList.value[0].needsAssessment = row.needsAssessment;
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await OrderApi.deleteOrder(id)
    message.success(t('common.delSuccess'))
    // 关闭当前 Tab
    delView(unref(currentRoute))
    push({name:'PmsOrder'})
  } catch {}
  // 关闭当前 Tab
  delView(unref(currentRoute))
  push({name:'PmsOrder'})

}

  onMounted(async ()=>{
    getList(query.id);
  })
</script>

<style scoped>

</style>
