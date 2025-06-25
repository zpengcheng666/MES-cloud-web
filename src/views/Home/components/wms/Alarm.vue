<template>
    <el-table 
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        max-height="310">

            <el-table-column label="告警类型" align="center" prop="alarmType">
                <template #default="scope">
                    <dict-tag :type="DICT_TYPE.WMS_ALARM_TYPE" :value="scope.row.alarmType" />
                </template>
            </el-table-column>
            <el-table-column label="告警源" align="center" prop="alarmSource" />
            <el-table-column label="告警级别" align="center" prop="alarmLevel">
                <template #default="scope">
                    <dict-tag :type="DICT_TYPE.WMS_ALARM_LEVEL" :value="scope.row.alarmLevel" />
                </template>
            </el-table-column>
            <el-table-column label="告警编号" align="center" prop="alarmNum" />
            <el-table-column label="告警描述" align="center" prop="alarmDesc" />
    

        </el-table>
        <!-- 分页 -->
            <Pagination
            :total="total"
            v-model:page="queryParams.pageNo"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
            />
</template>
<script setup lang="ts">
import {ElTable} from "element-plus";
import { DICT_TYPE } from '@/utils/dict'
import { AlarmApi, AlarmVO } from '@/api/wms/alarm'
import { dateFormatter } from '@/utils/formatTime'

/** 异常 列表 */
defineOptions({ name: 'Alarm' })

const loading = ref(true) // 列表的加载中
const list = ref<AlarmVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  alarmType: undefined,
  alarmSource: undefined,
  alarmLevel: undefined,
  alarmNum: undefined,
  alarmDesc: undefined,
  alarmTime: [],
  alarmState: undefined,
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AlarmApi.getAlarmPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
    getList()
})

</script>