 <template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="订单编号" prop="orderNumber">
        <el-col :span="20">
          <el-input disabled v-model="formData.orderNumber" placeholder="请输入订单编号" />
        </el-col>
        <el-col :span="3" :push="1">
          <el-button @click="generatorCode" type="primary" :disabled="formLoading">生 码</el-button>
        </el-col>

      </el-form-item>
      <el-form-item label="项目号" prop="projectNumber">
        <el-select :disabled="isEdit" v-model="formData.projectNumber" filterable @change="getPartList" placeholder="请选择项目">
          <el-option
            v-for="project in projectList"
            :key="project.projectCode"
            :label="project.projectCode"
            :value="project.projectCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="零件图号" prop="partNumber">
        <el-select :disabled="isEdit" v-model="formData.partNumber" filterable @change="getTechnologyList" clearable >
          <el-option
            v-for="part in partList"
            :key="part.partNumber"
            :label="part.partNumber"
            :value="part.partNumber"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工艺规程" prop="technologyId">
        <el-select :disabled="isEdit" v-model="formData.technologyId" filterable clearable >
          <el-option
            v-for="technology in technologyList"
            :key="technology.processVersionId"
            :label="technology.name"
            :value="technology.processVersionId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单类型" prop="orderType">
        <el-select :disabled="isEdit" v-model="formData.orderType" placeholder="请选择订单类型">
          <el-option
            v-for="dict in getIntDictOptions('mcs_order_type')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-input type="number" v-model="formData.priority" placeholder="请输入优先级" />
      </el-form-item>
      <el-form-item label="数量" prop="count">
        <el-input :readonly="isEdit" type="number" v-model="formData.count" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="管理方式" prop="isBatch">
        <el-select :disabled="isEdit" v-model="formData.isBatch" placeholder="请选择管理方式">
          <el-option key="0" :value="false" label="单件"/>
          <el-option key="1" :value="true" label="批量"/>
        </el-select>
      </el-form-item>
      <el-form-item label="接收时间" prop="receptionTime">
        <el-date-picker
          v-model="formData.receptionTime"
          type="date"
          value-format="x"
          placeholder="选择接收时间"
        />
      </el-form-item>
      <el-form-item label="交付时间" prop="deliveryTime">
        <el-date-picker
          v-model="formData.deliveryTime"
          type="date"
          value-format="x"
          placeholder="选择交付时间"
        />
      </el-form-item>
      <el-form-item label="负责人" prop="responsiblePerson">
        <el-select v-model="formData.responsiblePerson" filterable placeholder="请选择负责人">
          <el-option
            v-for="user in userList"
            :key="user.id"
            :label="user.nickname"
            :value="user.id + ''"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="!isEdit" label="物料来源" prop="bindMaterials">
        <el-radio-group v-model="formData.bindMaterials">
          <el-radio :label="true">客户</el-radio>
          <el-radio :label="false">采购</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-else label="物料来源" prop="bindMaterials">
        <el-radio-group readonly :model-value="!!formData.materialCode">
          <el-radio :label="true" >客户</el-radio>
          <el-radio :label="false">采购</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="formData.bindMaterials || (isEdit && formData.materialCode)" label="物料编号" prop="materialCode">
        <el-input readonly @click="openMaterialCodeEdit(formData.materialCode)" v-model="formData.materialCode" placeholder="请输入物料编号" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
    <MaterialCodeEditView ref="materialCodeEdit" @success="(val)=>{formData.materialCode = val}" />
  </Dialog>
</template>
<script setup lang="ts">
import { OrderFormApi, OrderFormVO } from '@/api/mcs/orderform'
import { getIntDictOptions } from '@/utils/dict'
import * as UserApi from "@/api/system/user";
import MaterialCodeEditView from './components/MaterialCodeEditView.vue'
import {ProcessPlanApi} from "@/api/pdm/processPlan";
import {EncodingRuleApi} from "@/api/mcc/encodingrule";

/** 生产订单 表单 */
defineOptions({ name: 'OrderFormForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  orderNumber: undefined,
  partNumber: undefined,
  orderType: undefined,
  procesStatus: undefined,
  priority: undefined,
  count: undefined,
  receptionTime: undefined,
  deliveryTime: undefined,
  responsiblePerson: undefined,
  materialCode: undefined,
  aidMill: undefined,
  bindMaterials: false,
})
const formRules = reactive({
  orderNumber: [{ required: true, message: '订单编号不能为空', trigger: 'blur' }],
  count: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
  receptionTime: [{ required: true, message: '接收时间不能为空', trigger: 'blur' }],
  deliveryTime: [{ required: true, message: '交付时间不能为空', trigger: 'blur' }],
  priority: [{ required: true, message: '优先级不能为空', trigger: 'blur' }],
  orderType: [{ required: true, message: '订单类型不能为空', trigger: 'blur' }],
  responsiblePerson: [{ required: true, message: '负责人不能为空', trigger: 'blur' }],
  materialCode: [{ required: true, message: '物料编号不能为空', trigger: 'blur' }],
  isBatch: [{ required: true, message: '管理方式不能为空', trigger: 'blur' }],
  technologyId: [{ required: true, message: '物料管理方式不能为空', trigger: 'blur' }],
  partNumber: [{ required: true, message: '零件图号不能为空', trigger: 'blur' }],
  projectNumber: [{ required: true, message: '项目号不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const isEdit = ref(false);
const userList = ref([]);
const projectList = ref<any[]>([]);
const partList = ref<any[]>([]);
const technologyList = ref<any[]>([]);

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  isEdit.value = false
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    isEdit.value = true
    try {
      formData.value = await OrderFormApi.getOrderForm(id)
    } finally {
      formLoading.value = false
    }
  }
  await getProjectList();
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as OrderFormVO
    if (formType.value === 'create') {
      await OrderFormApi.createOrderForm(data)
      message.success(t('common.createSuccess'))
    } else {
      await OrderFormApi.updateOrderForm(data)
      message.success(t('common.updateSuccess'))
    }
    const update={code:data.orderNumber,status:2}
    EncodingRuleApi.updateCode(update)
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const getUserList = async () => {
  userList.value = await UserApi.getSimpleUserList()
}

const getProjectList = async () => {
  projectList.value = await OrderFormApi.getProjectList();
}

const getPartList = async () => {
  formData.value.partNumber = null;
  formData.value.technologyId = null;
  const projectId = projectList.value.find(item => item.projectCode == formData.value.projectNumber).id
  partList.value = await OrderFormApi.getPartListByProcessPlanDetailId(projectId);
}

/*const getTechnologyList = async (val) => {
  formData.value.technologyId = null;
  const params = {
    projectCode: formData.value.projectNumber,
    partVersionId: formData.value.partVersionId
  }
  const part = partList.value.find(item => item.partVersionId == val);
  if (part) formData.value.partNumber = part.partNumber
  const tree = await OrderFormApi.getProcessPlanDetail(params);
  const partE = tree.find(item => item.partVersionId == part.partVersionId && item.parentId == "0")
  technologyList.value = tree.filter(item => item.parentId == partE.id)
}*/

const getTechnologyList = async (val) => {
  formData.value.technologyId = null;
  const params = {
    projectCode: formData.value.projectNumber,
    partNumber: formData.value.partNumber
  }
  const list = await ProcessPlanApi.getProjPartBomTreeListNew(params);
  technologyList.value = list.filter((item)=>{
    return item.type ===2;
  })
}

const materialCodeEdit = ref();
const openMaterialCodeEdit = (val) => {
  if (isEdit.value) return
  if (val) {
    materialCodeEdit.value.open(val.split(","));
  } else {
    materialCodeEdit.value.open();
  }
}

const generatorCode = async () => {
  const data = {
    classificationCode: 'OR',
    encodingRuleType:1,
  }
  const result = await EncodingRuleApi.createCode(data);
  formData.value.orderNumber = result;
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    orderNumber: undefined,
    projectNumber: undefined,
    orderType: undefined,
    procesStatus: undefined,
    technologyId: undefined,
    partNumber: undefined,
    priority: undefined,
    count: undefined,
    receptionTime: undefined,
    deliveryTime: undefined,
    responsiblePerson: undefined,
    materialCode: undefined,
    aidMill: undefined,
    bindMaterials: false,
  }
  formRef.value?.resetFields()
}

onMounted(()=>{
  getUserList()
})
</script>
