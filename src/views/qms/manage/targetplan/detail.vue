<template>
  <el-tabs>
    <el-tab-pane label="申请信息">
      <el-form
        ref="formRef"
        :model="formData"
        label-width="100px"
        v-loading="formLoading"
      >
        <el-form-item label="附件" prop="fileUrl">
          <UploadFile :is-show-tip="false" v-model="formData.fileUrl" :formType="'detail'"/>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import {useTagsViewStore} from "@/store/modules/tagsView";
import { ManagementDatabaseApi } from '@/api/qms/managementdatabase'

defineOptions({ name: 'BpmManagementSystemDetail' })
const route = useRoute()
const props = defineProps<{ id?: number }>()
const message = useMessage() // 消息弹窗
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const areaList = ref([]) // 地区列表

const formData = ref({
  id: undefined,
  treeId: undefined,
  type: undefined,
  fileUrl: undefined,
  remark: undefined,
  status: undefined,
  processInstanceId: undefined,
})

const formRef = ref() // 表单 Ref

/** 关闭 */
const { delView } = useTagsViewStore() // 视图操作
const { currentRoute } = useRouter() // 路由
const close = () => {
  delView(unref(currentRoute))
}

/** 初始化 */
onMounted(async () => {
  const id = props.id || route.params.id
  if (!id) {
    message.warning('参数错误，合同不能为空！')
    close()
    return
  }
  formData.value = await ManagementDatabaseApi.getManagementDatabase(id)
})
</script>

<style lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
