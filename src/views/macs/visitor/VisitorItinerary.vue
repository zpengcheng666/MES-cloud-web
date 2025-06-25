<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-checkbox-group v-model="actionShowMenu" @change="reload" style="margin-left: 38px;">
<!--      <el-checkbox label="0">校验</el-checkbox>-->
      <el-checkbox label="1">进入</el-checkbox>
      <el-checkbox label="2">离开</el-checkbox>
    </el-checkbox-group>
    <el-timeline class="timelineClass">
      <el-timeline-item
          v-for="(item, index) in data"
          :key="index"
          type="primary"
          :color="statusColor[item.action]"
          size="large"
          :hide-timestamp="true"
          :timestamp="item.createTime"
      >
        {{item.createTime}} {{actionCode[item.action]}} {{item.regionName}}
      </el-timeline-item>
    </el-timeline>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { VisitorApi, VisitorVO } from '@/api/macs/visitor'

/** 申请角色 表单 */
defineOptions({ name: 'VisitorForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('访客行程') // 弹窗的标题
const statusColor = ['#ababab','#0b87bd','#0bbd87']
const actionCode = ['门禁校验','进入','离开']
const actionShowMenu = ref(['1','2']);
const data = ref([]);
/** 打开弹窗 */
let visitorId = '';
const open = async (id) => {
  dialogVisible.value = true;
  visitorId = id;
  await reload();
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const reload = async () => {
  data.value = await VisitorApi.getAccessRecords({visitorId, 'actions': actionShowMenu.value});
}

</script>
<style lang="scss">
.timelineClass{
  max-width: 600px;
  max-height: 600px;
  overflow: auto
}
.timelineClass::-webkit-scrollbar{
  display: none;
}
</style>
