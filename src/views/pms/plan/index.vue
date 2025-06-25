<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="项目订单编号" prop="projectOrderId" label-width="98px">
        <el-input
          v-model="queryParams.projectOrderId"
          placeholder="请输入项目订单编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
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
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <!--<el-button-->
          <!--type="primary"-->
          <!--plain-->
          <!--@click="openForm('create')"-->
          <!--v-hasPermi="['pms:plan:create']"-->
        <!--&gt;-->
          <!--<Icon icon="ep:plus" class="mr-5px" /> 新增-->
        <!--</el-button>-->
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['pms:plan:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>

        <el-badge :value="messageCount" :max="99" :hidden="messageCount===0" style="margin-left: 10px">
          <el-button @click="openMessage" type="warning" plain><Icon icon="ep:chat-line-round" class="mr-5px" /> 通知</el-button>
        </el-badge>

        <el-button
          type="primary"
          plain
          @click="openHandlePlan"
          v-hasPermi="['pms:plan:update']"
          style="margin-left: 10px"
          v-if = "currentRow.length>0"
          >
          <Icon icon="ep:edit" class="mr-5px" /> 批量处理
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <!-- :show-overflow-tooltip="true" -->
    <el-table v-loading="loading" :data="list" :stripe="true" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" :selectable="selectable"/>
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="planItem">
            <el-tab-pane label="项目计划明细" name="planItem">
              <PlanItemList ref="planItemListRef" :project-plan-id="scope.row.planId" :project-code="scope.row.projectCode" @open-purchase-detail-form="openPurchaseDetailForm" @open-relation-form="openRelationForm"/>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <!--表格扩展-->
      <!--<el-table-column type="expand">-->
      <!--<template #default="props">-->

      <!--<el-descriptions :column="4" border>-->
      <!--<el-descriptions-item label="备注">-->
      <!--{{ props.row.projectCode }}-->
      <!--</el-descriptions-item>-->
      <!--<el-descriptions-item label="备注">-->
      <!--{{ props.row.processType }}-->
      <!--</el-descriptions-item>-->
      <!--<el-descriptions-item label="备注">-->
      <!--{{ props.row.processType }}-->
      <!--</el-descriptions-item>-->
      <!--<el-descriptions-item label="备注">-->
      <!--{{ props.row.processType }}-->
      <!--</el-descriptions-item>-->
      <!--</el-descriptions>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="项目计划id" align="center" prop="id" />-->
      <!--<el-table-column label="项目订单编号" align="center" prop="projectOrderId" />-->
      <el-table-column label="项目名" align="center" prop="projectName" />
      <el-table-column label="图号" align="center" prop="partNumber" />
      <el-table-column label="工件名称" align="center" prop="partName" />
      <el-table-column label="物料牌号" align="center" prop="materialNumber" />
      <el-table-column label="计划数量" align="center" prop="quantity" />
      <!--<el-table-column label="外协数量" align="center" prop="outSourceAmount" />-->
      <!--<el-table-column label="工序外协" align="center" prop="stepOutSourceAmount" />-->
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
      <el-table-column label="提醒" align="center" prop="remindInfo" />

      <el-table-column
        label="采购完成时间"
        align="center"
        prop="purchaseCompletionTime"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template #default="scope">
          <!-- :disabled="scope.row.processScheme" -->
          <el-button
            v-if = "scope.row.outsource === 0"
            v-show = "!!scope.row.planId"
            v-hasPermi="['pms:plan:query']"
            link
            type="primary"
            :disabled="scope.row.processScheme"
            @click="openSelectProcessScheme(scope.row)"
          >
            选择工艺
          </el-button>
          <!--:disabled="!scope.row.processScheme"  @click="openDistribution(scope.row)"-->
          <el-button
            v-show = "!!scope.row.planId"
            v-hasPermi="['pms:plan:query']"
            link
            type="primary"
            @click="distribution(scope.row)"
            :disabled="formLoading"
          >
            下单
          </el-button>
          <!-- (scope.row.processType==1)||(!scope.row.processScheme) -->
          <!-- !scope.row.processScheme) -->
          <el-button
            v-show = "!!scope.row.planId"
            v-hasPermi="['pms:plan:query']"
            link
            type="primary"
            @click="openPrepareMaterial(scope.row)"
          >
            备料
          </el-button>

          <!--<el-popconfirm-->
            <!--width="220"-->
            <!--:icon="InfoFilled"-->
            <!--icon-color="#626AEF" title="确定发起审批?"-->
            <!--@confirm = "handleCreate(scope.row.id)"-->
          <!--&gt;-->
            <!--<template #reference>-->
              <!--<el-button-->
                <!--:disabled="!!scope.row?.planStatus"-->
                <!--link-->
                <!--type="primary"-->
              <!--&gt;-->
                <!--审批-->
              <!--</el-button>-->
            <!--</template>-->
          <!--</el-popconfirm>-->
          <!--<el-button-->
            <!--v-show = "!!scope.row.planId"-->
            <!--v-hasPermi="['pms:plan:query']"-->
            <!--link-->
            <!--type="primary"-->
            <!--@click="handleDetail(scope.row)"-->
          <!--&gt;-->
            <!--详情-->
          <!--</el-button>-->
          <!--<el-button-->
            <!--:disabled="!scope.row?.status"-->
            <!--v-hasPermi="['pms:plan:query']"-->
            <!--link-->
            <!--type="primary"-->
            <!--@click="handleProcessDetail(scope.row)"-->
          <!--&gt;-->
            <!--进度-->
          <!--</el-button>-->
          <el-button
            :disabled="(scope.row?.status!=2)"
            link
            type="primary"
            @click="openForm(scope.row)"
            v-hasPermi="['pms:plan:update']"
          >
            编辑
          </el-button>
          <!--<el-button-->
            <!--v-show = "!!scope.row.planId"-->
            <!--:disabled="!!scope.row?.status"-->
            <!--link-->
            <!--type="danger"-->
            <!--@click="handleDelete(scope.row.planId)"-->
            <!--v-hasPermi="['pms:plan:delete']"-->
          <!--&gt;-->
            <!--删除-->
          <!--</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <PlanForm ref="formRef" @success="getList" />
  <PurchaseDetailForm ref="purchaseDetailFormRef"/>
  <Message ref="messageFormRef"/>
  <!-- 任务分配,子计划创建表 -->
  <DistributionPlanForm ref="distributionPlanFormRef" @success="getList"/>
  <OutsourceForm ref="outsourceFormRef" @success="getList"/>
  <!-- 物料准备表单 -->
  <PrepareMaterialForm ref="prepareMaterialFormRef" @success="getList"/>
  <PrepareOutsourceForm ref="prepareOutsourceFormRef" @success="getList"/>
  <!-- 选择工艺方案 -->
  <SelectProcessSchemeForm ref="processSchemeFormRef" @success="getList"/>
  <!-- 工序外协 -->
  <OrderMaterialRelationForm ref="orderMaterialRelationFormRef" />
  <!-- 外协完成 -->
  <OutsourceCompleteForm ref="outsourceCompleteFormRef" @success="refreshPlanItemList"/>
  <!-- 处理多个计划 -->
  <HandleMultipleForm ref="handleMultipleFormRef"/>
</template>

<script setup lang="ts">
  import {provide} from 'vue'
  import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'
  import download from '@/utils/download'
  import { PlanApi, PlanVO } from '@/api/pms/plan'
  import PlanForm from './PlanForm.vue'
  import PlanItemList from './components/PlanItemList.vue'
  import PurchaseDetailForm from './components/PurchaseDetailForm.vue'
  import Message from './components/Message.vue'
  import { useTagsViewStore } from '@/store/modules/tagsView'
  import { NotifyMessageApi, NotifyMessageVO } from '@/api/pms/notifymessage'
  import DistributionPlanForm from './components/DistributionPlanForm.vue'
  import OutsourceForm from './components/OutsourceForm.vue'
  import PrepareMaterialForm from './components/PrepareMaterialForm.vue'
  import PrepareOutsourceForm from './components/PrepareOutsourceForm.vue'
  import SelectProcessSchemeForm from './components/SelectProcessSchemeForm.vue'
  import { DICT_TYPE } from '@/utils/dict'
  import OrderMaterialRelationForm from './components/OrderMaterialRelationForm.vue'
  import OutsourceCompleteForm from './components/OutsourceCompleteForm.vue'
  import HandleMultipleForm from './HandleMultipleForm.vue'

  /** 项目计划 列表 */
  defineOptions({ name: 'PmsPlan' })

  const message = useMessage() // 消息弹窗
  const { t } = useI18n() // 国际化
  const { delView } = useTagsViewStore() // 视图操作
  const { push, currentRoute } = useRouter() // 路由

  const loading = ref(true) // 列表的加载中
  const formLoading = ref(false)
  const list = ref<PlanVO[]>([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    projectOrderId: undefined,
    remark: undefined,
    status: undefined,
    processInstanceId: undefined,
    createTime: [],
  })
  const queryFormRef = ref() // 搜索的表单
  const purchaseDetailFormRef = ref()//物料采购计划,选择工艺
  const messageFormRef = ref()//物料采购计划,选择工艺
  const distributionPlanFormRef = ref();
  const outsourceFormRef = ref();
  const prepareMaterialFormRef = ref();
  const prepareOutsourceFormRef = ref();
  const processSchemeFormRef = ref();
  const exportLoading = ref(false) // 导出的加载中
  const messageCount = ref(0)
  const orderMaterialRelationFormRef = ref();
  const outsourceCompleteFormRef = ref();
  const handleMultipleFormRef = ref();
  //项目计划明细
  const planItemListRef = ref();
  const currentRow = ref<any[]>([])

  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      //const data = await PlanApi.getPlanPage(queryParams)
      const data = await PlanApi.getPPOPage(queryParams)
      list.value = data.list
      total.value = data.total
      //查询未读取的总数
      const notifyMessageList = await NotifyMessageApi.selectListByEntity({readStatus:false})
      messageCount.value = notifyMessageList?.length;
    } finally {
      loading.value = false
    }
  }

  //刷新子计划
  const refreshPlanItemList = ()=>{
    planItemListRef.value.refresh();
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

  /** 添加/修改操作 */
  const formRef = ref()
  const openForm = (row) => {
    formRef.value.open(row)
  }

  const openPurchaseDetailForm = (row)=>{
    purchaseDetailFormRef.value.open(row)
  }

  //打开子计划外协窗口
  const openRelationForm = (row)=>{
    orderMaterialRelationFormRef.value.open(row)
  }
  //打开子计划外协完成窗口
  const openOutSourceCompleteForm = (row)=>{
    //index为1,外协入库,index为2外协完成
    let index = 1;
    if(row.planType === 1){
      //工序外协,这个查码即可
      index = 1;
    }else {
      //整单外协
      index = 2;
    }
    outsourceCompleteFormRef.value.open(row,index)
  }

  provide('allmethods',{openOutSourceCompleteForm})

  const openMessage = ()=>{
    messageFormRef.value.open()
  }

  /** 删除按钮操作 */
  const handleDelete = async (id: number) => {
    try {
      // 删除的二次确认
      await message.delConfirm()
      // 发起删除
      await PlanApi.deletePlan(id)
      message.success(t('common.delSuccess'))
      // 刷新列表
      await getList()
    } catch {}
  }

  /** 导出按钮操作 */
  const handleExport = async () => {
    try {
      // 导出的二次确认
      await message.exportConfirm()
      // 发起导出
      exportLoading.value = true
      const data = await PlanApi.exportPlan(queryParams)
      download.excel(data, '项目计划.xls')
    } catch {
    } finally {
      exportLoading.value = false
    }
  }

  /** 发起审批 */
  const handleCreate =async (id) => {
    // delView(unref(currentRoute))
    // push({ name: 'PMSPlanCreate',
    //   query: {
    //     id,
    //   }})
    const row = await PlanApi.createPlanBpm2({id})
    if(row===id){
      message.success('成功发起流程')
    }
    getList()


  }
  /** 审批进度 */
  const handleProcessDetail = (row) => {
    push({
      name: 'BpmProcessInstanceDetail',
      query: {
        id: row.processInstanceId
      }
    })
  }
  /** 详情操作 */
  const handleDetail =async (row) => {
    push({
      name: 'PMSPlanDetail',
      query: {
        id: row.planId
      }
    })
  }
  /** 详情操作 */
  // const handleDetail2 =async (row) => {
  //   const currow = row;
  //   console.log(currow)
  //   const params = {
  //     projectCode:currow.projectCode,
  //     partNumber:'C01341057-111',
  //     viewSelf:false
  //   }
  //   const data = await PlanApi.getProjPartBomPlanList(params)
  //   console.log(data)
  // }
  const confirm = ()=>{
    console.log("正在发起")
  }

  const openDistribution = (row)=>{
    if(row.outsource ===1){
      outsourceFormRef.value.open(row)
    }else {
      distributionPlanFormRef.value.open(row)
    }

  }
  const distribution = async (row)=>{
    const data = Object.assign({},row,{id:null},{projectId:row.id},{projectPlanId:row.planId})
    console.log(data)
    try{
      await message.confirm("确认下单")
      formLoading.value = true
      await PlanApi.createPlanItem(data)
      message.success('下单成功')

    }finally {
      formLoading.value = false
    }

  }

  const openPrepareMaterial = (row)=>{
    if(row.outsource ===1){
      prepareOutsourceFormRef.value.open(row)
    }else {
      prepareMaterialFormRef.value.open(row)
    }
  }

  const openSelectProcessScheme = (row)=>{
    processSchemeFormRef.value.open(row)
  }

  const handleSelectionChange =(row)=>{
    currentRow.value = row;
  }
  const openHandlePlan = ()=>{
    handleMultipleFormRef.value.open(currentRow.value)
  }
  const selectable = (item)=>{
    return item.planId!=null;
  }
  /** 初始化 **/
  onMounted(() => {
    getList()
  })
</script>
