<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="产品类型名称" align="center" prop="productTypeName" />
      <el-table-column label="产品类型介绍" align="center" prop="productTypeText"/>
      <el-table-column label="在线状态" align="center" prop="onlineStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DC_ONLINE_STATUS" :value="scope.row.onlineStatus" />
        </template>
      </el-table-column>
      <el-table-column label="标准值状态" align="center" prop="normStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DC_NORM_STATUS" :value="scope.row.normStatus" />
        </template>
      </el-table-column>
      <el-table-column label="采集方式" align="center" prop="collectAttributesType" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COLLECT_ATTRIBUTES_TYPE" :value="scope.row.collectAttributesType" />
        </template>
      </el-table-column>
      <el-table-column label="采集周期(分钟)" align="center" prop="collectAttributesCycle" />

      <el-table-column label="异常日志" align="center">
        <template #default="scope">

          <el-button
            link
            type="warning"
            @click="openOnlineError(scope.row.topicId)">
            在线异常
          </el-button>

          <el-button
            link
            type="warning"
            @click="openNormError(scope.row.topicId)">
            标准值异常
          </el-button>

        </template>
      </el-table-column>

    </el-table>
  </ContentWrap>

  <!-- 在线异常日志弹窗 -->
  <OlineStatusDetail
    ref="olineRef"
    @success="getList"
    :append-to-body="true"
    :modal-append-to-body="false"
  />

  <!-- 标准值异常日志弹窗 -->
  <NormStatusDetail
    ref="normRef"
    @success="getList"
    :append-to-body="true"
    :modal-append-to-body="false"
  />

</template>

<script setup lang="ts">
import {DICT_TYPE} from "@/utils/dict";
import OlineStatusDetail from "@/views/dc/deviceoffline/detail/OlineStatusDetail.vue";
import NormStatusDetail from "@/views/dc/deviceoffline/detail/NormStatusDetail.vue";

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  productList: undefined // 设备产品数据
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = props.productList
  } finally {
    loading.value = false
  }
}

/** 在线异常详情 **/
const olineRef = ref()
const openOnlineError = (topicId: string) => {
  olineRef.value.open(topicId)
}

/** 标准值异常详情 **/
const normRef = ref()
const openNormError = (topicId: string) => {
  normRef.value.open(topicId)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
