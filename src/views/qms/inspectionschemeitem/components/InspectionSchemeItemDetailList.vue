<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--<el-table-column label="主键" align="center" prop="id" />-->
      <el-table-column label="排序" align="center" prop="sortNumber" />
      <el-table-column label="检测项" align="center" prop="inspectionItemConfigName" />
       <el-table-column label="判断方式" align="center" prop="referenceType" >

         <template #default="scope">
           <dict-tag :type="DICT_TYPE.QMS_REFERENCE_TYPE" :value="scope.row.referenceType" />
         </template>
       </el-table-column>
      <el-table-column label="技术要求" align="center" prop="content" />
      <el-table-column label="上限值" align="center" prop="maxValue" />
      <el-table-column label="下限值" align="center" prop="minValue" />

      <el-table-column label="判断" align="center" prop="judgement" />

      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { InspectionSchemeItemApi } from '@/api/qms/inspectionschemeitem'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  inspectionSchemeItemId: undefined // 检测项目ID（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  inspectionSchemeItemId: undefined
})


/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await InspectionSchemeItemApi.getInspectionSchemeItemDetailListByInspectionSchemeItemId(props.inspectionSchemeItemId)
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}



/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
