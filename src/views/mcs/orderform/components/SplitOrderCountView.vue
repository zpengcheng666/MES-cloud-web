 <template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1050">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="150px"
      v-loading="formLoading"
      :inline="true"
    >
      <el-form-item v-if="formData.orderNumber" label="订单编号" prop="orderNumber">
        <el-input readonly v-model="formData.orderNumber" class="!w-240px"/>
      </el-form-item>
      <el-form-item v-if="formData.batchNumber" label="批次编号" prop="batchNumber">
        <el-input readonly v-model="formData.batchNumber" class="!w-240px"/>
      </el-form-item>
      <el-form-item label="总量" prop="count">
        <el-input readonly v-model="formData.count" class="!w-240px"/>
      </el-form-item>
      <el-form-item label="未开始" prop="count">
        <el-input readonly v-model="newDetailCount" class="!w-240px"/>
      </el-form-item>
      <el-form-item label="正在加工" prop="count">
        <el-input readonly v-model="runDetailCount" class="!w-240px"/>
      </el-form-item>
      <el-form-item label="已完成" prop="count">
        <el-input readonly v-model="completeDetailCount" class="!w-240px"/>
      </el-form-item>
      <ContentWrap>
        <el-table stripe :show-header="false" :data="formData.batch">
          <el-table-column>
            <template #default="scope">
              <el-form-item prop="batchNumber">
                {{scope.$index+1}}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="260">
            <template #default="scope">
              <el-form-item label-width="40" label="编号" prop="batchNumber">
                <el-input v-model="scope.row.batchNumber"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="300">
            <template #default="scope">
              <el-form-item label-width="70" label="起始工序" prop="batchNumber">
                <el-select style="width: 160px" v-model="scope.row.beginProcessId">
                  <el-option
                    v-for="procedure in procedureList"
                    :key="procedure.id"
                    :label="procedure.procedureNum + '-' + procedure.procedureName"
                    :value="procedure.id"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="170">
            <template #default="scope">
              <el-form-item label-width="40" label="数量" prop="count">
                <el-input readonly type="number" v-model="scope.row.count"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="130">
            <template #default="scope">
              <el-form-item class="!w-240px" prop="count">
                <el-button link type="primary" @click="handleDelete(scope.$index)">删除</el-button>
                <el-button @click="openSelectView(scope.$index)" link type="primary">指定</el-button>
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
    <BatchDetailSelectView ref="detailSelectRef"/>
  </Dialog>
</template>
<script setup lang="ts">
import {BatchOrderApi} from "@/api/mcs/batchorder";
import {inject, provide} from "vue";
import {BatchRecordApi} from "@/api/mcs/batchRecord";
import BatchDetailSelectView from './BatchDetailSelectView.vue'
import {OrderFormApi} from "@/api/mcs/orderform";
import {OrderDetailApi} from "@/api/mcs/orderdetail";

/** 生产订单 表单 */
defineOptions({ name: 'SplitOrderCountView' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const selectOrderInfo = inject("selectOrderInfo")

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: undefined,
  batchNumber: undefined,
  orderNumber: undefined,
  beginProcessId: undefined,
  count: undefined,
  batch: []
})
const formRules = reactive({})
const formRef = ref() // 表单 Ref
const batchDetailList = ref([]) // 表单 Ref
const procedureList = ref([]) // 表单 Ref
const newDetailCount = ref(0) // 表单 Ref
const runDetailCount = ref(0) // 表单 Ref
const completeDetailCount = ref(0) // 表单 Ref

/** 打开弹窗 */
const open = async (row: any) => {
  dialogVisible.value = true
  resetForm()
  formData.value.id = row.id;
  formData.value.orderNumber = selectOrderInfo.orderNumber;
  formData.value.batchNumber = selectOrderInfo.batchNumber;
  formData.value.count = row.count;
  formData.value.beginProcessId = row.processId;
  //下发 进行中
  if (row.status == 1 || row.status == 2) {
    batchDetailList.value = await BatchRecordApi.getDetailList(row.id);
    for (let batchDetail of batchDetailList.value) {
      if (batchDetail.status == 0 || batchDetail.status == 5) newDetailCount.value++;
      else if (batchDetail.status == 1) runDetailCount.value++;
      else if (batchDetail.status == 3) completeDetailCount.value++;
    }
  } else {
    batchDetailList.value = await OrderDetailApi.getOrderDetailList(row.id);
    newDetailCount.value = batchDetailList.value.length;
  }
  procedureList.value = await BatchRecordApi.getBeforeProcessList(row.id)
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

let rowIndex = 1;
const handleAdd = () => {
  let pre = formData.value.batchNumber;
  const row: any = {
    batchNumber: pre + "_C" + rowIndex++,
    beginProcessId: formData.value.beginProcessId,
    count: 0,
    detailList: []
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
  // 提交请求
  formLoading.value = true
  try {
    const data = {
      batchRecordId: formData.value.id,
      batchList: formData.value.batch
    }
    await BatchOrderApi.splitOrderCount(data)
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
    id: undefined,
    batchNumber: undefined,
    orderNumber: undefined,
    count: undefined,
    batch: []
  }
  batchDetailList.value = [];
  newDetailCount.value = 0;
  runDetailCount.value = 0;
  completeDetailCount.value = 0;
  rowIndex = 1;
  formRef.value?.resetFields()
}
</script>
