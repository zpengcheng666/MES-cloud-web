<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--<el-table-column label="ID" align="center" prop="id" />-->
      <!--<el-table-column-->
        <!--label="创建时间"-->
        <!--align="center"-->
        <!--prop="createTime"-->
        <!--:formatter="dateFormatter"-->
        <!--width="180px"-->
      <!--/>-->
      <el-table-column label="编码位类型" align="center" prop="type">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.MCC_ENCODING_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
       <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="位数" align="center" prop="bitNumber" />
      <el-table-column label="描述名" align="center" prop="name" />
      <el-table-column label="默认值" align="center" prop="defalutValue" />
      <el-table-column label="生成规则" align="center" prop="ruleType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.MCC_RULE_TYPE" :value="scope.row.ruleType" />
        </template>
      </el-table-column>
      <el-table-column label="编码属性" align="center" prop="encodingAttribute">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.MCC_ENCODING_ATTRIBUTE " :value="scope.row.encodingAttribute" />
        </template>
      </el-table-column>
      <el-table-column label="来源规则" align="center" prop="sourceRuleId" />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { EncodingRuleApi } from '@/api/mcc/encodingrule'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  encodingRuleId: undefined // 编码规则表ID（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await EncodingRuleApi.getEncodingRuleDetailListByEncodingRuleId(props.encodingRuleId)
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