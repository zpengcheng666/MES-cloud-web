 <template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="150px"
      v-loading="formLoading"
      :inline="true"
    >
      <el-form-item v-if="formData.partBatchNumber" label="编号" prop="batchNumber">
        <el-input readonly v-model="formData.partBatchNumber" class="!w-240px"/>
      </el-form-item>
      <el-form-item label="总量" prop="count">
        <el-input readonly v-model="formData.count" class="!w-240px"/>
      </el-form-item>
      <ContentWrap>
        <el-table stripe :show-header="false" :data="formData.batch">
          <el-table-column  width="72">
            <template #default="scope">
              <el-form-item>
                {{scope.$index+1}}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="260">
            <template #default="scope">
              <el-form-item label-width="40" label="编号" prop="partBatchNumber">
                <el-input v-model="scope.row.partBatchNumber"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="200">
            <template #default="scope">
              <el-form-item label-width="40" label="数量" prop="count">
                <el-input type="number" v-model="scope.row.count"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="130">
            <template #default="scope">
              <el-form-item class="!w-240px" prop="count">
                <el-button link type="primary" @click="handleDelete(scope.$index)">删除</el-button>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </ContentWrap>
    </el-form>
    <el-row justify="center" class="mt-3">
      <el-button @click="handleAdd" round>+ 添加拆单</el-button>
    </el-row>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {BatchDetailApi} from "@/api/mcs/batchdetail";
import { provide } from "vue";

/** 生产订单 表单 */
defineOptions({ name: 'SplitDetailCountView' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  detailId: undefined,
  partBatchNumber: undefined,
  count: undefined,
  batch: []
})
const formRules = reactive({})
const formRef = ref() // 表单 Ref
const batchDetailList = ref([]) // 表单 Ref

/** 打开弹窗 */
const open = async (row: any) => {
  dialogVisible.value = true
  resetForm()
  formData.value.detailId = row.id;
  formData.value.partBatchNumber = row.partBatchNumber;
  formData.value.count = row.count;
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

let rowIndex = 1;
const handleAdd = () => {
  let pre = formData.value.partBatchNumber;
  const row: any = {
    partBatchNumber: pre + "_" + rowIndex++,
    beginProcessId: formData.value.beginProcessId,
    count: 1,
  }
  formData.value.batch.push(row)
}

const handleDelete = (index) => {
  formData.value.batch.splice(index, 1);
}

const detailSelectRef = ref();
const openSelectView = (index) => {
  detailSelectRef.value.open(index)
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  await message.confirm("拆分操作不可撤销!", "拆分确认")
  // 校验表单
  if (!formData.value.batch && formData.value.batch.length == 0) {
    message.warning("请新建拆单");
    return;
  }
  let total = 0;
  for (let batch of formData.value.batch) {
    let count = Number.parseInt(batch.count);
    if (count == 0) {
      message.warning("无效拆单,数量0");
      return;
    }
    total += count;
  }
  if (total > formData.value.count) {
    message.warning("数量异常,总量"+formData.value.count+",当前"+total);
    return;
  }
  if (total == formData.value.count) {
    message.warning("请至少保留一条原数据,总量"+formData.value.count+",当前"+total);
    return;
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = {
      batchDetailId: formData.value.detailId,
      batchList: formData.value.batch
    }
    await BatchDetailApi.splitDetailCount(data)
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

provide("formData", formData);
provide("batchDetailList", batchDetailList);

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    detailId: undefined,
    partBatchNumber: undefined,
    count: undefined,
    batch: []
  }
  formRef.value?.resetFields()
}
</script>
