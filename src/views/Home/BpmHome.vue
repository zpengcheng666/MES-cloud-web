<template>
  <!--<el-row class="mt-8px" :gutter="8" justify="space-between">-->
    <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24" class="mb-8px" v-hasPermi="['bpm:process-instance:query']">
      <el-card shadow="never" style="height: 400px">
        <template #header>
          <div class="h-3 flex justify-between">
            <span>{{ t('workplace.approval') }}</span>
            <el-link type="primary" :underline="false" @click="moreApproval">{{ t('action.more') }}</el-link>
          </div>
        </template>
        <el-skeleton :loading="loading" animated>
          <div>
            <el-row :gutter="20">
              <el-col
                :lg="6"
                :sm="12"
                :xs="24"
                v-for="definition in processDefinitionList"
                :key="definition.id"
              >
                <el-card
                  shadow="hover"
                  class="mb-20px cursor-pointer"
                  @click="handleSelect(definition)"
                >
                  <template #default>
                    <div class="flex">
                      <el-image :src="definition.icon" class="w-32px h-32px" />
                      <el-text class="!ml-10px" size="large">{{ definition.name }}</el-text>
                    </div>
                  </template>
                </el-card>
              </el-col>
            </el-row>
          </div>
          <el-divider />
        </el-skeleton>
      </el-card>
    </el-col>
    <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24" class="mb-8px" v-hasPermi="['bpm:process-instance:query']">
      <el-card shadow="never" style="height: 400px">
        <template #header>
          <div class="h-3 flex justify-between">
            <span>{{ t('workplace.toDo') }}</span>
            <el-link type="primary" :underline="false" @click="moreToDO">{{ t('action.more') }}</el-link>
          </div>
        </template>
        <el-skeleton :loading="loading" animated>
          <div class="flex items-center">
            <el-table v-loading="loading" :data="bpmTODOList" max-height="310">
              <el-table-column align="center" label="流程" prop="processInstance.name" width="180" />
              <el-table-column
                align="center"
                label="发起人"
                prop="processInstance.startUser.nickname"
                width="100"
              />
              <el-table-column
                :formatter="dateFormatter"
                align="center"
                label="发起时间"
                prop="createTime"
                width="180"
              />
              <el-table-column align="center" label="当前任务" prop="name" width="180" />
              <el-table-column
                :formatter="dateFormatter"
                align="center"
                label="任务时间"
                prop="createTime"
                width="180"
              />
              <el-table-column align="center" label="操作" fixed="right" width="80">
                <template #default="scope">
                  <el-button link type="primary" @click="handleAudit(scope.row)">办理</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-divider />
        </el-skeleton>
      </el-card>
    </el-col>
  <!--</el-row>-->
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { getCommonUse } from '@/api/bpm/definition'
import { ApprovalApi } from '@/api/pms/pmsapproval'
import { PlanApi } from '@/api/pms/plan'
import { MaterialPurchaseApi } from '@/api/pms/materialPurchasePlan'
import * as TaskApi from '@/api/bpm/task'
import SelectProcessSchemeForm from '@/views/pms/plan/components/SelectProcessSchemeForm.vue'

/** bpm常用审批,临时页面 */
// defineOptions({ name: 'Temp' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由

const loading = ref(true) // 列表的加载中

/***************常用审批*****************/
//常用流程列表
const processDefinitionList = ref<any[]>([])
/** 查询列表 */
const getBpmList = async () => {
  loading.value = true
  try {
    const data = await getCommonUse();
    processDefinitionList.value = data;
  } finally {
    loading.value = false
  }
}
const handleSelect = (row)=>{
  console.log(row);
  const data = Object.assign({},row)
  let jsonStr = JSON.stringify(data)
  push({
    name:"BpmProcessInstanceCreate",
    query:{
      selectDefinition:jsonStr
    }
  })
}
const moreApproval = ()=>{
  push({name: 'BpmProcessInstanceCreate'})
}

/********************************/

/********************待办任务*******************/
const todoQueryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: '',
  createTime: []
})
const bpmTODOList = ref<any[]>([]);
const bpmTODOTotal = ref<any[]>([]);
const getToDOList =async ()=>{
  const data = await TaskApi.getTaskTodoPage(todoQueryParams)
  bpmTODOList.value = data.list
  bpmTODOTotal.value = data.total
}

const handleAudit = (row)=>{
  push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.processInstance.id
    }
  })
}

const moreToDO = ()=>{
  push({name: 'BpmTodoTask'})
}
/*********************************************/

/** 初始化 **/
onMounted(() => {
  getBpmList()
  getToDOList()
})
</script>
