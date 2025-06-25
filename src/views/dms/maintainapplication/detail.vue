<template>
  <ContentWrap>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="设备编码">
        {{ detailData.code }}
      </el-descriptions-item>
      <el-descriptions-item label="设备名称">
        {{ detailData.name }}
      </el-descriptions-item>
      <el-descriptions-item label="生产单元名称">
        {{ localeProcessingUnit.unitName }}
      </el-descriptions-item>
      <el-descriptions-item label="关键设备">
        <dict-tag type="dms_key_equipment" :value="detailData.important" />
      </el-descriptions-item>
      <el-descriptions-item label="维修类型">
        <dict-tag type="dms_maintain_type1" :value="detailData.type" />
      </el-descriptions-item>

      <el-descriptions-item label="故障信息描述">
        {{ detailData.describe1 }}
      </el-descriptions-item>
      <el-descriptions-item label="期望修复时间(小时)">
        {{ detailData.duration }}
      </el-descriptions-item>
      <el-descriptions-item label="申请状态">
        <dict-tag type="dms_maintain_status" :value="detailData.status" />
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>
</template>
<script setup lang="ts">
import { MaintainApplicationApi } from '@/api/dms/maintainapplication'

defineOptions({ name: 'MaintainApplicationDetail' })

const { query } = useRoute() // 查询参数
const queryId = query.id

const props = defineProps(['id'])

const detailLoading = ref(false) // 表单的加载中
const detailData = ref<any>({}) // 详情数据

/** 获得数据 */
const getInfo = async () => {
  detailLoading.value = true
  try {
    detailData.value = await MaintainApplicationApi.getMaintainApplication(props.id || queryId)
    await setShowData()
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open: getInfo }) // 提供 open 方法，用于打开弹窗

/** 初始化 **/
onMounted(() => {
  getInfo()
})

/*********************设置显示信息*******************/

import { LedgerApi } from '@/api/dms/ledger'
import { DeviceTypeApi } from '@/api/dms/devicetype'
import { ProcessingUnitApi } from '@/api/dms/processingunit'

const localeDevice = ref<any>({})
const localeDeviceType = ref<any>({
  specification: ''
})
const localeProcessingUnit = ref<any>({
  unitName: ''
})

const deviceType = ref()

async function setShowData() {
  localeDevice.value = LedgerApi.getLedger(detailData.value.device)

  if (!isBlank(deviceType.value)) {
    localeDeviceType.value = await DeviceTypeApi.getDeviceType(deviceType.value)
  }

  if (!isBlank(detailData.value.processingUnitNumber)) {
    localeProcessingUnit.value = await ProcessingUnitApi.getProcessingUnit(
      detailData.value.processingUnitNumber as any
    )
  }
}

/*****************************************工具类************************/
function isBlank(v: any): boolean {
  if (v == undefined || v == null || (typeof v?.trim == 'function' && v.trim() == '')) {
    return true
  }
  return false
}
</script>
