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
        <el-form-item label="合同编号" prop="number">
          <el-input
            v-model="queryParams.number"
            placeholder="请输入合同编号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="合同名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入合同名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="合同方" prop="party">
          <el-input
            v-model="queryParams.party"
            placeholder="请输入合同方"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="签约时间" prop="signingDate">
          <el-date-picker
            v-model="queryParams.signingDate"
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
        </el-form-item>
      </el-form>
    </ContentWrap>
    <!-- 列表 -->
    <ContentWrap>
      <el-table v-loading="formLoading"
                ref="contractTableRef"
                :data="list"
                :stripe="true"
                :show-overflow-tooltip="true"
                highlight-current-row
                @select="handleSelectionChange"
                @row-click="handleSelectionChange">
        <el-table-column width="30" label="选择" type="selection" />
        <el-table-column label="合同编号" align="center" prop="number"  width="120px" />
        <el-table-column label="合同名称" align="center" prop="name"  width="120px" />
        <el-table-column label="合同方" align="center" prop="partyName" width="120px" />
        <el-table-column label="签约人" align="center" prop="contactName" width="120px" />
        <el-table-column label="签约时间" align="center" prop="signingDate" :formatter="dateFormatter2" width="120px"/>
        <el-table-column label="签约地点" align="center" prop="signingAddress" width="150px" />
        <el-table-column label="签约部门" align="center" prop="departmentName" width="120px" />
        <el-table-column label="我方签约人" align="center" prop="selfContactName" width="120px" />
        <el-table-column label="是否增值税" align="center" prop="vat" width="80px">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.VAT_TYPE" :value="scope.row.vat" />
          </template>
        </el-table-column>
        <el-table-column label="币种" align="center" prop="currency" width="100px">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.CURRENCY_TYPE" :value="scope.row.currency" />
          </template>
        </el-table-column>
        <el-table-column label="交货方式" align="center" prop="delivery" width="80px">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.PD_CONTRACT_DELIVERY" :value="scope.row.delivery" />
          </template>
        </el-table-column>
        <el-table-column label="合同状态" align="center" prop="status" width="100px" >
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.PD_CONTRACT_STATUS" :value="scope.row.contractStatus" />
          </template>
        </el-table-column>
        <el-table-column label="审批状态" align="center" prop="status" width="100px" >
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.CONTRACT_AUDIT_STATUS" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="采购员" align="center" prop="purchaserName" width="120px" />
        <el-table-column label="备注" align="center" prop="remark" width="150px" />
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
import { dateFormatter2 } from '@/utils/formatTime'
import {ContractApi, ContractStatusVO, ContractVO} from '@/api/ppm/contract'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** 购销合同 列表 */
defineOptions({ name: 'PPMContractChoose' })

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(true) // 列表的加载中
const list = ref<ContractVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  type: '1',
  number: undefined,
  name: undefined,
  party: undefined,
  contact: undefined,
  signingDate: [] as any,
  department: undefined,
  selfContact: undefined,
  // contractStatus: '1',
   status: '2',
})
const queryFormRef = ref() // 搜索的表单

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  dialogTitle.value = "合同选择"
  handleQuery();
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 查询列表 */
const getList = async () => {
  formLoading.value = true
  try {
    const data = await ContractApi.getContractPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    formLoading.value = false
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


const emit = defineEmits(['getContract']) // 定义 success 事件，用于操作成功后的回调
/** 确认 **/
const submitForm = async () => {
  formLoading.value = true
  try {
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('getContract', selectionContract.value)
  } finally {
    formLoading.value = false
  }
}

/**
 * 实现单选行
 */
const selectionContract = ref<ContractVO[]>()
const contractTableRef = ref() // 表格的 Ref
const handleSelectionChange = (selection) => {
  // 点击复选框
  if(selection instanceof Array){
    // 点击复选框传数组
    if (selection.length > 1) {
      //移除上一次选中行数据
      selection.shift();
    }
    //修改选中图标为未选中状态
    contractTableRef.value.clearSelection();
    //将当前选中行改为选中状态
    contractTableRef.value.toggleRowSelection(selection[0]);
    selectionContract.value = selection[0]
  }
  // 点击行
  else {
    contractTableRef.value.clearSelection();
    contractTableRef.value.toggleRowSelection(selection);
    selectionContract.value = selection
  }
}

</script>

<style lang="scss" scoped>
/**找到表头那一行，然后把里面的复选框隐藏掉**/
::v-deep .el-table__header-wrapper .el-table__header .el-checkbox {
  display: none;
}
</style>
