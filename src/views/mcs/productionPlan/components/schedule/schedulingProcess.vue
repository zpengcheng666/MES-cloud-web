<template>
  <ContentWrap>
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="list"
      :stripe="true"
      row-key="id"
      :show-overflow-tooltip="true"
    >
      <el-table-column label="工序序号" align="center" prop="procedureNum" />
      <el-table-column label="工序名称" align="center" prop="procedureName" />
      <el-table-column label="产线/设备类型" align="center" prop="deviceTypeName" >
        <template #default="{row}">
          {{getTypeName(row.resourceList)}}
        </template>
      </el-table-column>
      <el-table-column label="外委" align="center" prop="isOut" >
        <template #default="scope">
          <el-tag type="primary">{{scope.row.isOut?'是':'否'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="加工工时" align="center" prop="processingTime" />
      <el-table-column label="工作说明" align="center" prop="description" />
      <el-table-column label="指定设备编码" align="center" prop="deviceNameList" >
        <template #default="scope">
          {{getName(scope.row.id)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" >
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="selectDeviceOpen(scope.row)"
          >
            指定设备
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>

<script lang="ts" setup>
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import {inject, onMounted, ref} from 'vue';
import {OrderFormApi} from "@/api/mcs/orderform";

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const sharedInfo = inject("sharedInfo");
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const props = defineProps<{
  orderId: undefined // 访客申请id（主表的关联字段）
}>()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await OrderFormApi.getProcessByOrderId(props.orderId);
  } finally {
    loading.value = false
  }
}
sharedInfo.processReload = getList();

const selectDeviceOpen = (row: any) => {
  sharedInfo.deviceSelectOpen(props.orderId, row.id)
}

const getTypeName = (list: any[]) => {
  let name = '';
  for (let item of list) {
    if (name != '') {
      name += ','
    }
    name += item.name
  }
  return name
}

const getName = (id: string) => {
  let name;
  if (sharedInfo.planSelectDevice?.[props.orderId]?.[id]) {
    for (let item of sharedInfo.planSelectDevice[props.orderId][id]) {
      if (name) {
        name = name + "," + item.name
      } else {
        name = item.name;
      }
    }
  }
  return name;
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style scoped>

</style>
