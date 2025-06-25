<template>
  <Dialog title="外协" v-model="dialogVisible" width="1250">
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" :row-key="getRowKeys" @selection-change="handleSelectionChange">
      <el-table-column width="30" label="选择" :selectable="selectable" :reserve-selection="true" type="selection"  />
      <el-table-column label="物料码" align="center" min-width="150" prop="materialCode" />
      <el-table-column label="工序码" align="center" min-width="100" prop="variableCode" />
      <el-table-column label="成品码" align="center" min-width="180" prop="productCode" />
      <el-table-column label="工序" align="center" min-width="180" prop="step" />
      <el-table-column label="物料状态" align="center" min-width="100" prop="materialStatus" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_MATERIAL_STATUS" :value="scope.row.materialStatus" />
        </template>
      </el-table-column>
      <!--<el-table-column label="操作" align="center" width="60" fixed="right">-->
        <!--<template #default="scope">-->
          <!--<el-button-->
            <!--link-->
            <!--type="primary"-->
            <!--@click="openForm(scope.row)"-->
          <!--&gt;-->
            <!--详情-->
          <!--</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
  </ContentWrap>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'
import { PlanApi } from '@/api/pms/plan'
import { RelationApi } from '@/api/pms/orderMaterialRelation'
import PurchaseDetailForm from './PurchaseDetailForm.vue'
import { DICT_TYPE } from '@/utils/dict'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const dialogVisible = ref(false)
const planItemValue = ref()
const selectRows = ref()
const formLoading = ref(false)
const params = {
  planItemId:undefined,
}

const emit = defineEmits(['success'])
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    params.planItemId = planItemValue.value.id;
    list.value = await RelationApi.getOrderMaterialRelationWith(params)
  } finally {
    loading.value = false
  }
}

const open = (row)=>{
  selectRows.value = []
  dialogVisible.value = true
  planItemValue.value = Object.assign({},row)
  getList()

}

const submitForm = async ()=>{
  formLoading.value = true
  const array = selectRows.value.map((row)=>{
    return row.materialCode
  })
  array.join(',')
  const materialCodeList =selectRows.value.map((row)=>{
    return row.id
  })
  try{
    const data = planItemValue.value;
    data.planItemId = planItemValue.value.id;
    data.id = null;
    data.materialCodeList = materialCodeList;
    data.materialCodeListStr = array.join(",");
    await PlanApi.creatStepOutsourcePurchsePlan(data);
    dialogVisible.value = false

  }finally {
    formLoading.value = false
  }


}

const handleSelectionChange = (rows)=>{
  selectRows.value = rows;
}

const getRowKeys = (row) => {
  return row.id
}

const selectable = (row)=>{
  return row.materialStatus===1;
}


defineExpose({open})
/** 初始化 **/
// onMounted(() => {
//   getList()
// })
</script>
