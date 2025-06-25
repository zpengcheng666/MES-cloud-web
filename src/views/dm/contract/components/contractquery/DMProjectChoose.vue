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
        <el-form-item label="项目编号" prop="projectCode">
          <el-input
            v-model="queryParams.projectCode"
            placeholder="请输入项目编号"
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
                ref="projectTableRef"
                :data="list"
                :stripe="true"
                :show-overflow-tooltip="true"
                highlight-current-row
                @select="handleSelectionChange"
                @row-click="handleSelectionChange">
        <el-table-column width="30" label="选择" type="selection" />
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
import {DMContractApi, DMContractVO} from '@/api/dm/contract'
import { ApprovalApi, ApprovalVO } from '@/api/pms/pmsapproval'
/** 购销合同 列表 */
defineOptions({ name: 'DMProjectChoose' })

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(true) // 列表的加载中
const list = ref<ContractVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  type: '2',
  number: undefined,
  name: undefined,
  party: undefined,
  contact: undefined,
  signingDate: [] as any,
  department: undefined,
  selfContact: undefined,
  // contractStatus: '1',
  // status: '2',
})
const queryFormRef = ref() // 搜索的表单

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  dialogTitle.value = "项目选择"
  handleQuery();
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 查询列表 */
const getList = async () => {
  formLoading.value = true
  try {
    const data = await ApprovalApi.getApprovalPage(queryParams)
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


const emit = defineEmits(['getProject']) // 定义 success 事件，用于操作成功后的回调
/** 确认 **/
const submitForm = async () => {
  formLoading.value = true
  try {
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('getProject', selectionProject.value)
  } finally {
    formLoading.value = false
  }
}

/**
 * 实现单选行
 */
const selectionProject = ref<ContractVO[]>()
const projectTableRef = ref() // 表格的 Ref
const handleSelectionChange = (selection) => {
  // 点击复选框
  if(selection instanceof Array){
    // 点击复选框传数组
    if (selection.length > 1) {
      //移除上一次选中行数据
      selection.shift();
    }
    //修改选中图标为未选中状态
    projectTableRef.value.clearSelection();
    //将当前选中行改为选中状态
    projectTableRef.value.toggleRowSelection(selection[0]);
    selectionProject.value = selection[0]
  }
  // 点击行
  else {
    projectTableRef.value.clearSelection();
    projectTableRef.value.toggleRowSelection(selection);
    selectionProject.value = selection
  }
}

</script>

<style lang="scss" scoped>
/**找到表头那一行，然后把里面的复选框隐藏掉**/
::v-deep .el-table__header-wrapper .el-table__header .el-checkbox {
  display: none;
}
</style>
