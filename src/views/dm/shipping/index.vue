<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="120px"
    >


      <el-form-item label="发货单" prop="no">
      <el-input
      v-model="queryParams.no"
      placeholder="请输入发货单"
      clearable
      @keyup.enter="handleQuery"
      class="!w-240px"
      />
      </el-form-item>

      <el-form-item label="合同号" prop="contractId">
        <!--<el-input-->
          <!--v-model="queryParams.contractId"-->
          <!--placeholder="请输入合同号"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->


        <el-select
          v-model="queryParams.contractId"
          clearable
          filterable
          placeholder="请选择合同"
          class="!w-240px"
        >
          <el-option
            v-for="item in contractList"
            :key="item.id"
            :label="item.number+'('+item.name+')'"
            :value="item.id"
          />
        </el-select>


      </el-form-item>

      <el-form-item label="合作方" prop="companyId">
        <!--<el-input-->
        <!--v-model="queryParams.contractId"-->
        <!--placeholder="请输入合同号"-->
        <!--clearable-->
        <!--@keyup.enter="handleQuery"-->
        <!--class="!w-240px"-->
        <!--/>-->


        <el-select
          v-model="queryParams.companyId"
          clearable
          filterable
          placeholder="请选择合作方"
          class="!w-240px"
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>


      </el-form-item>
      <!--<el-form-item label="发货人" prop="consigner">-->
        <!--<el-select-->
          <!--v-model="queryParams.consigner"-->
          <!--clearable-->
          <!--filterable-->
          <!--placeholder="请选择发货人员"-->
          <!--class="!w-240px"-->
        <!--&gt;-->
          <!--<el-option-->
            <!--v-for="item in userList"-->
            <!--:key="item.id"-->
            <!--:label="item.nickname +'('+item.deptName+')'"-->
            <!--:value="item.id+''"-->
          <!--/>-->
        <!--</el-select>-->

      <!--</el-form-item>-->
      <el-form-item label="发货日期" prop="consignerDate">
        <el-date-picker
          v-model="queryParams.consignerDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <!--<el-form-item label="承运方式" prop="deliveryMethod">-->
        <!--<el-select-->
          <!--v-model="queryParams.deliveryMethod"-->
          <!--placeholder="请选择承运方式"-->
          <!--clearable-->
          <!--class="!w-240px"-->
        <!--&gt;-->
          <!--<el-option-->
            <!--v-for="dict in getIntDictOptions(DICT_TYPE.TRANSPORT_WAY)"-->
            <!--:key="dict.value"-->
            <!--:label="dict.label"-->
            <!--:value="dict.value"-->
          <!--/>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="承运人" prop="deliveryBy">-->
        <!--<el-input-->
          <!--v-model="queryParams.deliveryBy"-->
          <!--placeholder="请输入承运人"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="承运单号" prop="deliveryNumber">-->
        <!--<el-input-->
          <!--v-model="queryParams.deliveryNumber"-->
          <!--placeholder="请输入承运单号"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="承运人电话" prop="deliveryContact">-->
        <!--<el-input-->
          <!--v-model="queryParams.deliveryContact"-->
          <!--placeholder="请输入承运人电话"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="收货人" prop="consignedBy">-->
        <!--<el-input-->
          <!--v-model="queryParams.consignedBy"-->
          <!--placeholder="请输入收货人"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="收货日期" prop="consignedDate">-->
        <!--<el-date-picker-->
          <!--v-model="queryParams.consignedDate"-->
          <!--value-format="YYYY-MM-DD HH:mm:ss"-->
          <!--type="daterange"-->
          <!--start-placeholder="开始日期"-->
          <!--end-placeholder="结束日期"-->
          <!--:default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
          <!--class="!w-240px"-->
        <!--/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="收货人联系方式" prop="consignedContact">-->
        <!--<el-input-->
          <!--v-model="queryParams.consignedContact"-->
          <!--placeholder="请输入收货人联系方式"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->
      <!--</el-form-item>-->

      <el-form-item label="状态" prop="shippingStatus">
        <el-select
          v-model="queryParams.shippingStatus"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SHIPPING_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

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
          @click="openForm('create')"
          v-hasPermi="['dm:shipping:create']"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['dm:shipping:export']"
        >
          <Icon icon="ep:download" class="mr-5px"/>
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="shippingDetail">
            <el-tab-pane label="销售发货明细" name="shippingDetail">
              <ShippingDetailList :shipping-id="scope.row.id"/>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column label="发货单号" align="center" prop="no" width="180"/>
      <el-table-column label="发货单名称" align="center" prop="name" width="180"/>

      <el-table-column label="项目名" align="center" prop="projectName" width="180"/>
      <el-table-column label="项目编号" align="center" prop="projectCode" width="180"/>

      <el-table-column label="合同号" align="center" prop="contractNo" width="180"/>
      <el-table-column label="合作方" align="center" prop="companyName" width="180"/>
      <el-table-column label="发货人" align="center" prop="consigner" width="180"/>
      <el-table-column
        label="发货日期"
        align="center"
        prop="consignerDate"
        :formatter="dateFormatter"
        width="180px"
      />

      <el-table-column label="审批状态" align="center" width="120" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DM_AUDIT_STATUS" :value="scope.row.status"/>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" width="160" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SHIPPING_STATUS" :value="scope.row.shippingStatus"/>
        </template>
      </el-table-column>
      <el-table-column
        label="创建日期"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="承运方式" align="center" prop="deliveryMethod" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.TRANSPORT_WAY" :value="scope.row.deliveryMethod"/>
        </template>
      </el-table-column>
      <!--<el-table-column label="承运人" align="center" prop="deliveryBy" width="180"/>-->
      <!--<el-table-column label="承运单号" align="center" prop="deliveryNumber" width="180"/>-->
      <!--<el-table-column label="承运人电话" align="center" prop="deliveryContact" width="180"/>-->
      <!--<el-table-column label="收货人" align="center" prop="consignedBy" width="180"/>-->

      <!--<el-table-column label="收货人联系方式" align="center" prop="consignedContact" width="180"/>-->
      <!--<el-table-column-->
        <!--label="创建日期"-->
        <!--align="center"-->
        <!--prop="createTime"-->
        <!--:formatter="dateFormatter"-->
        <!--width="180px"-->
      <!--/>-->
      <el-table-column label="操作" align="center" fixed="right" width="300">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 0 || scope.row.status === 3"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['dm:shipping:update']"
          >
            编辑
          </el-button>
          <!--  未提交过的可提交审核-->
          <el-button
            v-if="scope.row.status === 0"
            v-hasPermi="['dm:shipping:create']"
            link
            type="primary"
            @click="handleSubmit(scope.row)"
          >
            提交审核
          </el-button>

          <!--  审批不通过可修改重新提交审核-->
          <el-button
            v-if="scope.row.status === 3"
            v-hasPermi="['dm:shipping:create']"
            link
            type="warning"
            @click="handleSubmit(scope.row)"
          >
            重新提交审核
          </el-button>

          <!--  审批通过后库出库确认数量-->
          <!--<el-button-->
            <!--v-if="scope.row.shippingStatus === 2"-->
            <!--v-hasPermi="['dm:shipping:create']"-->
            <!--link-->
            <!--type="primary"-->
            <!--@click="openForm('update', scope.row.id,2)"-->
          <!--&gt;-->
            <!--出库-->
          <!--</el-button>-->



          <!--  只要没有出库都可作废-->
          <el-button
            v-if="scope.row.shippingStatus <3 || scope.row.shippingStatus  ===8"
            v-hasPermi="['dm:shipping:create']"
            link
            type="warning"
            @click="handleCancelDm(scope.row.id)"
          >
            作废
          </el-button>


          <!--&lt;!&ndash;  出库完成后  填写发货信息 确认发货数量&ndash;&gt;-->
          <!--<el-button-->
            <!--v-if="scope.row.shippingStatus === 2"-->
            <!--v-hasPermi="['dm:shipping:create']"-->
            <!--link-->
            <!--type="primary"-->
            <!--@click="openForm('update', scope.row.id,2)"-->
          <!--&gt;-->
            <!--出库确认-->
          <!--</el-button>-->


          <el-button
            v-if="scope.row.shippingStatus === 1"
            v-hasPermi="['dm:shipping:create']"
            link
            type="primary"
            @click="handleProcessDetail(scope.row)"
          >
            审批进度
          </el-button>


          <el-button
            v-if="scope.row.shippingStatus === 4"
            link
            type="primary"
            @click="openForm('update', scope.row.id,4)"
            v-hasPermi="['dm:shipping:update']"
          >
            发货确认
          </el-button>


          <el-button
            v-if="scope.row.status === 0 "
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['dm:shipping:delete']"
          >
            删除
          </el-button>



          <el-button
                  v-hasPermi="['dm:shipping:update']"
                  link
                  type="success"
                  @click="openDetail('detail', scope.row.id)"
          >
            详情
          </el-button>
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
  <ShippingForm ref="formRef" @success="getList"/>
  <ShippingInfo ref="detailRef" @success="getList"/>
</template>

<script setup lang="ts">
  import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
  import {dateFormatter} from '@/utils/formatTime'
  import download from '@/utils/download'
  import {ShippingApi, ShippingVO} from '@/api/dm/shipping'
  import ShippingForm from './ShippingForm.vue'
  import ShippingInfo from './ShippingInfo.vue'
  import ShippingDetailList from './components/ShippingDetailList.vue'
  import {ContractApi} from '@/api/ppm/contract'
  import {CompanyApi} from '@/api/ppm/company'
  import * as UserApi from '@/api/system/user'
  /** 销售发货 列表 */
  defineOptions({name: 'Shipping'})

  const message = useMessage() // 消息弹窗
  const {t} = useI18n() // 国际化

  const loading = ref(true) // 列表的加载中
  const list = ref < ShippingVO[] > ([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    contractId: undefined,
    companyId:undefined,
    no:undefined,
    consigner: undefined,
    consignerDate: [],
    deliveryMethod: undefined,
    deliveryBy: undefined,
    deliveryNumber: undefined,
    deliveryContact: undefined,
    consignedBy: undefined,
    consignedDate: [],
    consignedContact: undefined,
    shippingStatus:undefined
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中
  const contractList = ref < ContractApi.ContractVO[] > ([]) //合同列表
  const companyList = ref < ContractApi.ContractVO[] > ([]) //公司列表
  const userList = ref < UserApi.UserVO[] > ([]) // 用户列表
  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await ShippingApi.getShippingPage(queryParams)
      list.value = data.list
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  const {push} = useRouter()
  /** 提交审核 **/
  const handleSubmit = async (row: ShippingVO) => {
    await message.confirm(`您确定提交【${row.no}】审核吗？`)
    await ShippingApi.submitShipping(row.id)
    message.success('提交审核成功！')
    await getList()
  }


  /** 查看审批 */
  const handleProcessDetail = (row: ShippingVO) => {
    push({name: 'BpmProcessInstanceDetail', query: {id: row.processInstanceId}})
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
  const openForm = (type: string, id
  ? : number, confirmStatus ? : number
  ) =>
  {
    formRef.value.open(type, id, confirmStatus)
  }


  /** 详情操作 */
  const detailRef = ref()
  const openDetail = (type: string, id
  ? : number
  ) =>
  {
    detailRef.value.open(type, id)
  }


  /** 删除按钮操作 */
  const handleDelete = async (id: number) => {
    try {
      // 删除的二次确认
      await message.delConfirm()
      // 发起删除
      await ShippingApi.deleteShipping(id)
      message.success(t('common.delSuccess'))
      // 刷新列表
      await getList()
    } catch {
    }
  }
   const getContractAndUser = async ()=>{
     // 加载合同列表
     contractList.value = await
       ContractApi.getContractListByType(2)
     // 加载用户列表
     userList.value = await
       UserApi.getSimpleUserList()


     companyList.value = await CompanyApi.getCompanyListByType("2,3")
   }


  /** 作废按钮操作 */
  const handleCancelDm = async (id: string) => {
    try {
      // 删除的二次确认
      await message.delConfirm()
      // 发起删除
      await ShippingApi.cancelShipping(id)
      message.success(t('common.delSuccess'))
      // 刷新列表
      await getList()
    } catch {
    }
  }




  /** 收货确认按钮操作 */
  const handleConfirm = async (id: number) => {
    try {
      await message.confirm(`收货确认？`)
      await ShippingApi.handleConfirm(id)
      message.success('确认成功！')
      // 刷新列表
      await getList()
    } catch {
    }
  }




  /** 导出按钮操作 */
  const handleExport = async () => {
    try {
      // 导出的二次确认
      await message.exportConfirm()
      // 发起导出
      exportLoading.value = true
      const data = await ShippingApi.exportShipping(queryParams)
      download.excel(data, '销售发货.xls')
    } catch {
    } finally {
      exportLoading.value = false
    }
  }

  /** 初始化 **/
  onMounted(() => {

    getList()
    getContractAndUser()

  })
</script>
