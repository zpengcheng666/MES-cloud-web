<template>
  <el-form
    ref="formRef"
    :model="formData"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" >
      <el-table-column type="expand" align="center">
        <template #default="scope">
          <el-tabs model-value="DeviceCollectDetail">
            <el-tab-pane label="采集格式" name="DeviceCollectDetail">
              <DeviceCollectDetail  :type-code="scope.row.typeCode"/>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column label= "产品类型名称" align="center" prop="productTypeName"/>
      <el-table-column label= "产品类型详情" align="center" prop="productTypeText" />
      <el-table-column label="通信类型" align="center" prop="collectAttributesType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COLLECT_ATTRIBUTES_TYPE" :value="scope.row.collectAttributesType" />
        </template>
      </el-table-column>
      <el-table-column label= "采集周期(分钟)" align="center" prop="collectAttributesCycle" />
      <el-table-column label= "Topic" align="center" prop="topicId" min-width="120%" />
    </el-table>
  </el-form>
</template>

<script setup lang="ts">
import Items from "@/views/dc/devicedate/items.vue";
import {propTypes} from "@/utils/propTypes";
import { defineProps } from 'vue';
import DeviceCollectDetail from "@/views/dc/device/DeviceCollectDetail.vue";
import {ProductTypeApi, ProductTypeVO} from "@/api/dc/producttype";
import {DICT_TYPE} from "@/utils/dict";

const props = defineProps(['deviceId','commType'])

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProductTypeApi.queryProductByDeviceId(props.deviceId)
    list.value = data
  } finally {
    loading.value = false
  }
}

const formData = ref({
  id: undefined,
  collectTypeName: undefined,
  collectTypeText: undefined,
})

/** 设备采集类型列表*/
defineOptions({name: 'CollectType'})
const loading = ref(false) // 列表的加载中
const list = ref < ProductTypeVO[] > ([]) // 列表的数据
const formLoading = ref(false) // 表单加载中
const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const formRef = ref() // 表单 Ref

/** 初始化 **/
onMounted(() => {
  getList()
})

</script>
