<template>
  <ContentWrap>
    <el-descriptions :column="3" border>
      <el-descriptions-item label="工艺规程编号">
        {{ changeData.processCode }}
      </el-descriptions-item>
      <el-descriptions-item label="工艺规程版次">
        {{ changeData.processVersion }}
      </el-descriptions-item>
      <el-descriptions-item label="更改原因">
        <template #default>
          <dict-tag :type="DICT_TYPE.PDM_PROCESS_CHANGE_REASION" :value="changeData.changeReason" />
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="更改单号">
        {{ changeData.changeCode }}
      </el-descriptions-item>
      <el-descriptions-item label="零件图号">
        {{ changeData.partNumber }}
      </el-descriptions-item>
      <el-descriptions-item label="更改内容">
        {{ changeData.changeContent }}
      </el-descriptions-item>
      <el-descriptions-item label="加工状态">
        {{ changeData.processCondition }}
      </el-descriptions-item>
      <el-descriptions-item label="零件名称">
        {{ changeData.partName }}
      </el-descriptions-item>
      <el-descriptions-item label="在制品处理意见">
        {{ changeData.workingOpinions }}
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { ProcessPlanDetailApi } from '@/api/pdm/processPlanDetail'
import {DICT_TYPE} from "@/utils/dict";

defineOptions({ name: 'PDMProcessChange' })

const { query } = useRoute() // 查询参数

// 业务主键id(即id)
const props = defineProps({
  id: propTypes.number.def(undefined)
})
const changeData = ref<any>({}) // 更改单数据

const queryId = query.id as unknown as number // 从URL传递过来的Id

/** 获得数据 */
const getInfo = async () => {
  //获取chang表的数据
  changeData.value = await ProcessPlanDetailApi.getProcessChangeById(props.id || queryId)
}
/** 初始化 **/
onMounted(() => {
  getInfo()
})
</script>
