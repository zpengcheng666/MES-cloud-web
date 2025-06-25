<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <ContentWrap>
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">

        <el-table-column label="批量值" align="center" prop="minValue" width="300">
          <template #default="scope">
            {{scope.row.minValue}} ~ {{scope.row.maxValue ==undefined ?'∞':scope.row.maxValue}}
          </template>
        </el-table-column>
        <el-table-column label="特殊检测水平" align="center" prop="inspectionLevelType">
          <el-table-column label="S-1" align="center" prop="sampleSizeCode1"/>
          <el-table-column label="S-2" align="center" prop="sampleSizeCode2"/>
          <el-table-column label="S-3" align="center" prop="sampleSizeCode3"/>
          <el-table-column label="S-4" align="center" prop="sampleSizeCode4"/>
        </el-table-column>


        <el-table-column label="一般检测水平" align="center" prop="inspectionLevelType">
          <el-table-column label="Ⅰ" align="center" prop="sampleSizeCode5"/>
          <el-table-column label="Ⅱ" align="center" prop="sampleSizeCode6"/>
          <el-table-column label="Ⅲ" align="center" prop="sampleSizeCode7"/>
        </el-table-column>
      </el-table>
    </ContentWrap>
  </Dialog>
</template>

<script setup lang="ts">
  import {dateFormatter} from '@/utils/formatTime'
  import download from '@/utils/download'
  import {SamplingRuleApi, SamplingRuleVO} from '@/api/qms/samplingrule'
  import {getStrDictOptions, getIntDictOptions, DICT_TYPE} from '@/utils/dict'

  /** 抽样规则 列表 */
  defineOptions({name: 'SamplingRuleInfo'})
  const props = defineProps < {
    standerdId: undefined // 抽样标准
  } > ()
  const message = useMessage() // 消息弹窗
  const {t} = useI18n() // 国际化
  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const loading = ref(true) // 列表的加载中
  const list = ref < SamplingRuleVO[] > ([]) // 列表的数据

  /** 打开弹窗 */
  const open = async () => {

    dialogVisible.value = true
    dialogTitle.value = '抽样数字码表'
    list.value = [];
    loading.value = true
    try {
      list.value = await SamplingRuleApi.getSamplingRuleInfo(props.standerdId)
    } finally {
      loading.value = false
    }

  }
  defineExpose({open}) // 提供 open 方法，用于打开弹窗

</script>
