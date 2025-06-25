<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="material">
            <el-tab-pane label="所属物料状态" name="material">
              <OrderMaterialRelationTable :project-plan-item-id="scope.row.id"/>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column label="图号" align="center" min-width="150" prop="partNumber" />
      <el-table-column label="计划数量" align="center" min-width="100" prop="quantity" />
      <el-table-column label="工艺编程方案" align="center" min-width="180" prop="processSchemeName" />
      <el-table-column label="项目编号" align="center" min-width="180" prop="projectCode" />
      <el-table-column label="物料牌号" align="center" min-width="180" prop="materialNumber" />
      <el-table-column label="计划类型" align="center" min-width="100" prop="planType" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_PLAN_ITEM_TYPE" :value="scope.row.planType" />
        </template>
      </el-table-column>
      <el-table-column label="批次数量" align="center" min-width="100" prop="count" />
      <el-table-column label="操作" align="center" width="180" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm(scope.row)"
          >
            详情
          </el-button>
          <el-button
            link
            type="primary"
            @click="openRelation(scope.row)"
          >
            外协
          </el-button>
          <el-button
            :disabled="false"
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['pms:plan:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--<OrderMaterialRelationForm ref="orderMaterialRelationFormRef"/>-->
  </ContentWrap>

</template>
<script setup lang="ts">
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'
import { PlanApi } from '@/api/pms/plan'
import PurchaseDetailForm from './PurchaseDetailForm.vue'
import { DICT_TYPE } from '@/utils/dict'
import OrderMaterialRelationTable from './OrderMaterialRelationTable.vue'
import { ProcessPlanApi } from '@/api/pdm/processPlan'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  projectPlanId: undefined, // 项目计划id（主表的关联字段）
  projectCode:undefined
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const processSchemeList = ref<any[]>([])//工艺编程列表

const openForm = (row)=>{
  emit('openPurchaseDetailForm',row)

}
const openRelation = (row)=>{
  emit('openRelationForm',row)
}

const emit = defineEmits(['openPurchaseDetailForm','openRelationForm'])
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await PlanApi.getPlanItemListByProjectPlanId(props.projectPlanId)
    //处理工艺方案名字
    const params = {
      projectCode:props.projectCode,
      // partNumber:formData.value.partNumber,
    }
    processSchemeList.value = await ProcessPlanApi.getProjPartBomTreeListNew(params);
    list.value.forEach(item=>{
      processSchemeList.value.forEach(val=>{
        if(val.id===item.processScheme){
          item.processSchemeName = val.name;
        }
      })
    })
  } finally {
    loading.value = false
  }
}

const refresh = ()=>{
  getList();
}

const handleDelete = async (id)=>{
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await PlanApi.deletePlanItem(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 搜索按钮操作 */
// const handleQuery = () => {
//   queryParams.pageNo = 1
//   getList()
// }

/** 初始化 **/
onMounted(() => {
  getList()
})

defineExpose({refresh})
</script>
