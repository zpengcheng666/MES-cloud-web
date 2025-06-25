<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <ContentWrap>

      <el-tabs v-model="subTabsName">
        <el-tab-pane label="正常检查" name="normalCheck">
          <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
            <el-table-column label="样本数字码" align="center" prop="code" width="120"/>
            <template v-for="(col,index) in headList" :key="index">
              <el-table-column :prop="col.prop" :label="col.label" align="center">
                <el-table-column label="Ac" align="center" :prop="col.prop+'Ac'"/>
                <el-table-column label="Re" align="center" :prop="col.prop+'Re'"/>
              </el-table-column>
            </template>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="加严检查" name="normalCheck1">

          <el-table v-loading="loading" :data="list1" :stripe="true" :show-overflow-tooltip="true">
            <el-table-column label="样本数字码" align="center" prop="code" width="120"/>
            <template v-for="(col,index) in headList1" :key="index">
              <el-table-column :prop="col.prop" :label="col.label" align="center">
                <el-table-column label="Ac" align="center" :prop="col.prop+'Ac'"/>
                <el-table-column label="Re" align="center" :prop="col.prop+'Re'"/>
              </el-table-column>
            </template>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="放宽检查" name="normalCheck2">
          <el-table v-loading="loading" :data="list2" :stripe="true" :show-overflow-tooltip="true">
            <el-table-column label="样本数字码" align="center" prop="code" width="120"/>
            <template v-for="(col,index) in headList2" :key="index">
              <el-table-column :prop="col.prop" :label="col.label" align="center">
                <el-table-column label="Ac" align="center" :prop="col.prop+'Ac'"/>
                <el-table-column label="Re" align="center" :prop="col.prop+'Re'"/>
              </el-table-column>
            </template>
          </el-table>
        </el-tab-pane>

      </el-tabs>
    </ContentWrap>
  </Dialog>
</template>

<script setup lang="ts">
  import {dateFormatter} from '@/utils/formatTime'
  import download from '@/utils/download'
  import {SamplingRuleConfigApi, SamplingRuleConfigVO} from '@/api/qms/samplingruleconfig'
  import {getStrDictOptions, getIntDictOptions, DICT_TYPE} from '@/utils/dict'

  /** 抽样规则 列表 */
  defineOptions({name: 'SamplingRuleConfigInfo'})
  const props = defineProps < {
    standerdId: undefined // 抽样标准
  } > ()
  const message = useMessage() // 消息弹窗
  const {t} = useI18n() // 国际化
  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const loading = ref(true) // 列表的加载中
  const list = ref([]) // 列表的数据
  const headList = ref([])

  const list1 = ref([]) // 列表的数据
  const headList1 = ref([])

  const list2 = ref([]) // 列表的数据
  const headList2 = ref([])

  /** 子表单 */
  const subTabsName = ref('normalCheck')
  /** 打开弹窗 */
  const open = async () => {

    dialogVisible.value = true
    dialogTitle.value = '抽样主方案表'
    list.value = [];
    headList.value = [];
    list1.value = [];
    headList1.value = [];
    list2.value = [];
    headList2.value = [];
    loading.value = true
    try {
      const data = await SamplingRuleConfigApi.getSamplingRuleConfigInfo(props.standerdId)

      headList.value = data.normalInfos.headList
      list.value = data.normalInfos.dataList

      headList1.value = data.normalInfos1.headList
      list1.value = data.normalInfos1.dataList

      headList2.value = data.normalInfos2.headList
      list2.value = data.normalInfos2.dataList
      debugger
    } finally {
      loading.value = false
    }

  }
  defineExpose({open}) // 提供 open 方法，用于打开弹窗

</script>
