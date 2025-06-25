<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="任务编码" align="center" prop="batchRecordNumber"/>
      <el-table-column label="资源条码" align="center" prop="barCode"/>
      <el-table-column label="资源批次" align="center" prop="batchNumber"/>
      <el-table-column label="资源类型" align="center" prop="resourceType" width="120">
        <template #default="scope">
          <DictTag :type="'wms_material_type'" :value="scope.row.resourceType" />
        </template>
      </el-table-column>
      <el-table-column label="资源类码" align="center" prop="materialNumber"/>
      <el-table-column label="数量" align="center" prop="totality" width="100" />
      <el-table-column label="需求单元" align="center" prop="unitNumber"/>
      <el-table-column label="需求设备" align="center" prop="deviceNumber"/>

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            v-show="scope"
          >
            修改
          </el-button>
          <el-button
            link
            type="danger"
          >
            撤销
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>

<script lang="ts" setup>
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import {inject, onMounted, ref} from "vue";
import {BatchOrderDemandApi} from "@/api/mcs/batchorderdemand";

const props = defineProps<{
  demandId: undefined // 访客申请id（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const sharedInfo = inject("sharedInfo");
const message = useMessage() // 消息弹窗

const getList = async () => {
  loading.value = true
  try {
    list.value = await BatchOrderDemandApi.listByDemandId(props.demandId)
  } finally {
    loading.value = false
  }
}
sharedInfo.demandRecordReload = getList;

onMounted(() => {
  getList()
})

</script>

<style scoped>

</style>
