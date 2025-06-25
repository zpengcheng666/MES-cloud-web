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
        <el-form-item label="采购类型" prop="type">
          <el-select
                  v-model="queryParams.type"
                  placeholder="请选择采购类型"
                  clearable
                  class="!w-240px"
          >
            <el-option
                    v-for="dict in getIntDictOptions(DICT_TYPE.PPM_REQUIREMENT_TYPE)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请部门" prop="applicationDepartment">
          <el-tree-select
                  v-model="queryParams.applicationDepartment"
                  filterable
                  class="!w-240px"
                  :data="deptList"
                  :props="defaultProps"
                  check-strictly
                  node-key="id"
                  placeholder="请选择申请部门"
          />
        </el-form-item>
        <el-form-item label="申请人" prop="applicant">
          <el-select
                  v-model="queryParams.applicant"
                  filterable
                  class="!w-240px"
                  placeholder="请选择申请人"
          >
            <el-option
                    v-for="item in userOptions"
                    :key="item.id"
                    :label="item.nickname"
                    :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期" prop="applicationDate">
          <el-date-picker
                  v-model="queryParams.applicationDate"
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
      <el-table v-loading="loading"
                ref="contractTableRef"
                :data="list"
                :stripe="true"
                :show-overflow-tooltip="true"
                @select="handleSelectionChange"
                max-height="45vh">
        <el-table-column width="30" label="选择" type="selection" />
        <el-table-column label="源单类型" align="center" prop="sourceType" >
          <template #default="{ row }">
            <dict-tag :type="DICT_TYPE.PPM_REQUIREMENT_SOURCE_TYPE" :value="row.sourceType" />
          </template>
        </el-table-column>

        <el-table-column label="源单类型" align="center" prop="planType" >
          <template #default="{ row }">
            <dict-tag :type="DICT_TYPE.PD_CONTRACT_TYPE_FOR" :value="row.planType" />
          </template>
        </el-table-column>
        <el-table-column label="需求物料" align="center" prop="requiredMaterialName" />
        <el-table-column label="物料编号" align="center" prop="materialCode" />
        <el-table-column label="需求数量" align="center" prop="requiredQuantity" />
        <el-table-column label="需求时间" :formatter="dateFormatter2" align="center" prop="requiredDate" />
        <el-table-column label="预算单价" align="center" prop="estimatedPrice" />
        <el-table-column label="供应商" align="center" prop="supplier" />

        <el-table-column label="采购类型" align="center" prop="type" >
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.PPM_REQUIREMENT_TYPE" :value="scope.row.type" />
          </template>
        </el-table-column>
        <el-table-column label="申请人" align="center" prop="applicant" />
        <el-table-column label="申请部门" align="center" prop="applicationDepartment" />
        <el-table-column
                label="申请日期"
                align="center"
                prop="applicationDate"
                :formatter="dateFormatter2"
                width="180px"
        />
        <el-table-column label="申请理由" align="center" prop="applicationReason" />
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
    import { dateFormatter2 } from '@/utils/formatTime'
    import {ContractApi, ContractVO} from '@/api/ppm/contract'
    import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
    import {defaultProps} from "@/utils/tree";
    import {PurchaseRequirementApi} from "@/api/ppm/purchaserequirement";
    import {ElTable} from "element-plus";
    import RequirementDetailList from "./RequirementDetailList.vue";


    /** 购销合同 列表 */
    defineOptions({ name: 'RequirementDetailChoose' })

    const dialogVisible = ref(false) // 弹窗的是否展示
    const dialogTitle = ref('') // 弹窗的标题
    const loading = ref(true) // 列表的加载中
    const list = ref<ContractVO[]>([]) // 列表的数据
    const total = ref(0) // 列表的总页数
    const selectedRequirement = ref({})
    const queryParams = reactive({
        pageNo: 1,
        pageSize: 10,
        type: undefined,
        applicant: undefined,
        applicationDepartment: undefined,
        applicationDate: [],
        applicationReason: undefined,
        isValid: 1,
        status: 2
    })
    const queryFormRef = ref() // 搜索的表单


    const curRow = ref({})
    /** 打开弹窗 */
    const open = async (row : any) => {
        curRow.value = row
        dialogVisible.value = true
        dialogTitle.value = "采购申请选择"
        expandRowKeys.value = []
        handleQuery();
    }

    defineExpose({ open }) // 提供 open 方法，用于打开弹窗

    /** 查询列表 */
    const getList = async () => {
        loading.value = true
        try {
            const data = await PurchaseRequirementApi.getPurchaseRequirementDetailPage(queryParams)
            list.value = data.list
            total.value = data.total
        } finally {
            loading.value = false
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

  const  contractTableRef = ref()
    const handleSelectionChange = (selection) => {
        if (selection.length > 1) {
            //移除上一次选中行数据
            selection.shift();
        }
        //修改选中图标为未选中状态
        contractTableRef.value.clearSelection();
        //将当前选中行改为选中状态
        contractTableRef.value.toggleRowSelection(selection[0]);
        selectedRequirement.value = selection[0]
        // contractTableRef.value.setCurrentRow(selection[0])
     //   emit('getRequirement', selection[0])
    }



    /** 提交审核 **/
    const submitForm = async () => {
        loading.value = true
        debugger
        try {
            dialogVisible.value = false
            curRow.value.requirementDetailId = selectedRequirement.value.id
            curRow.value.requirementDetailNumber = selectedRequirement.value.number
            curRow.value.projectId = selectedRequirement.value.projectId
            curRow.value.orderId = selectedRequirement.value.orderId
            curRow.value.projectPlanId = selectedRequirement.value.projectPlanId
            curRow.value.quantity = selectedRequirement.value.requiredQuantity
            curRow.value.projectPlanItemId = selectedRequirement.value.projectPlanItemId
            curRow.value.planType = selectedRequirement.value.planType
            curRow.value.materialId = selectedRequirement.value.requiredMaterial
            curRow.value.productList = curRow.value.productList.filter((item) => item.id === selectedRequirement.value.requiredMaterial)
            curRow.value.productList
            if (curRow.value.productList){
                curRow.value.price = curRow.value.productList[0].initPrice
                curRow.value.initTax = curRow.value.productList[0].initTax
                // curRow.value.taxRate = curRow.value.productList[0].initTax
                curRow.value.materialUnit = curRow.value.productList[0].materialUnit
            }

            if(selectedRequirement.value.requiredMaterial != curRow.value.materialId){
                curRow.value.materialId = undefined,
                    curRow.value.quantity =  undefined,
                    curRow.value.price =  undefined,
                    curRow.value.taxRate =  undefined,
                    curRow.value.taxPrice = undefined,
                    curRow.value.leadDate =  undefined
            }
        } finally {
            loading.value = false
        }
    }

    const expandRowKeys = ref<number[]>()
    const expandChange =(row, expandedRows)=> {
        if (expandedRows.length) {
            expandRowKeys.value = []
            if (row) {
                expandRowKeys.value.push(row.id)
            }
        } else {
            expandRowKeys.value = []
        }
    }

</script>

<style lang="scss" scoped>
  /**找到表头那一行，然后把里面的复选框隐藏掉**/
  ::v-deep .el-table__header-wrapper .el-table__header .el-checkbox {
    display: none;
  }
</style>
