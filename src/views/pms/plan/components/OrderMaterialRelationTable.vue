<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="物料码" align="center" min-width="150" prop="materialCode" />
      <el-table-column label="工序码" align="center" min-width="100" prop="variableCode" />
      <el-table-column label="成品码" align="center" min-width="180" prop="productCode" />
      <!--<el-table-column label="工序" align="center" min-width="180" prop="step" />-->
      <el-table-column label="工序" align="center" min-width="180" prop="stepName" />
      <el-table-column label="物料状态" align="center" min-width="100" prop="materialStatus" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_MATERIAL_STATUS" :value="scope.row.materialStatus" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100" fixed="right">
        <template #default="scope">
          <el-button
            v-if = "scope.row.planType ===1"
            link
            type="primary"
            :disabled = "scope.row.materialStatus!=4"
            @click="openForm(scope.row,1)"
          >
            外协入库
          </el-button>
          <el-button
            v-if = "scope.row.planType ===3||scope.row.planType ===2"
            link
            type="primary"
            :disabled = "scope.row.materialStatus !=4"
            @click="openForm(scope.row,2)"
          >
            外协完成
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
  import {inject} from 'vue'
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'
import { PlanApi } from '@/api/pms/plan'
import { RelationApi } from '@/api/pms/orderMaterialRelation'
import PurchaseDetailForm from './PurchaseDetailForm.vue'
import { DICT_TYPE } from '@/utils/dict'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

  const {openOutSourceCompleteForm} = inject('allmethods');

const props = defineProps<{
  projectPlanItemId: undefined, // 项目计划id（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

const params = {
  planItemId:undefined,
}

const emit = defineEmits(['openPurchaseDetailForm'])
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    params.planItemId = props.projectPlanItemId;
    list.value = await RelationApi.getOrderMaterialRelationWith(params)
    list.value.forEach((item)=>{
      if(item.step===-1){
        item.stepName = "已完成"
      }else {
        item.stepName = item.step;
      }
    })
  } finally {
    loading.value = false
  }
}

const openForm = (row,index)=>{
  //console.log(count.value,'123456')
  openOutSourceCompleteForm(row,index)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
