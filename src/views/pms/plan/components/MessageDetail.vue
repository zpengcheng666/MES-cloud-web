<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="600">
    <ContentWrap>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="接收人">
          {{ detailData.userId }}
        </el-descriptions-item>
        <el-descriptions-item label="发送人">
          {{ detailData.templateNickname }}
        </el-descriptions-item>
        <el-descriptions-item label="发送人">
          {{ detailData.templateContent }}
        </el-descriptions-item>
        <el-descriptions-item label="已读">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="detailData.readStatus" />
        </el-descriptions-item>
        <el-descriptions-item label="阅读时间">
          {{ formatDate(detailData.readTime, 'YYYY-MM-DD HH:mm:ss') }}
        </el-descriptions-item>
      </el-descriptions>
    </ContentWrap>

  </Dialog>


</template>

<script setup lang="ts">
import { dateFormatter,formatDate } from '@/utils/formatTime'
import { NotifyMessageApi, NotifyMessageVO } from '@/api/pms/notifymessage'
import { getIntDictOptions, getStrDictOptions,getBoolDictOptions, DICT_TYPE } from '@/utils/dict'

const dialogTitle = ref('详情')
/** 简易版,项目计划提醒用 列表 */
defineOptions({ name: 'NotifyMessage' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const detailData = ref()

const dialogVisible = ref(false)

/** 打开弹窗 */
const open = async (row) => {
  detailData.value = row;
  dialogVisible.value = true

}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
