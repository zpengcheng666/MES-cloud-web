<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
    <el-table :data="formData" class="-mt-10px">
      <el-table-column label="序号" type="index" width="100" />
      <el-table-column label="品名规格" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.nameSpe`" :rules="formRules.nameSpe" class="mb-0px!">
            <el-input v-model="row.nameSpe" placeholder="请输入品名规格" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="用途" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.intention`" :rules="formRules.intention" class="mb-0px!">
            <el-input v-model="row.intention" placeholder="请输入用途" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="数量" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.amount`" :rules="formRules.amount" class="mb-0px!">
            <el-input-number v-model="row.amount" placeholder="请输入数量" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="需求时间" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.requireTime`" :rules="formRules.requireTime" class="mb-0px!">
            <el-date-picker
              v-model="row.requireTime"
              type="date"
              value-format="x"
              placeholder="选择需求时间"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remark`" :rules="formRules.remark" class="mb-0px!">
            <el-input type="textarea" v-model="row.remark" placeholder="请输入备注" />
          </el-form-item>
        </template>
      </el-table-column>
       <!--<el-table-column align="center" fixed="right" label="操作" width="60">-->
        <!--<template #default="{ $index }">-->
          <!--<el-button @click="handleDelete($index)" link>—</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" fixed="right" label="操作" width="150">
        <template #default="{ row,$index}">
          <el-button @click="handleUpdate($index,row)" type="primary" link>编辑</el-button>
          <el-button @click="handleCopy(row)" type="primary" link>复制</el-button>
          <el-button @click="handleDelete($index)" type="primary" link>移除</el-button>

        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ 添加OA 采购申请</el-button>
  </el-row>

  <Dialog title="新增" v-model="dialogVisible">
    <el-form
      ref="childFormRef"
      :model="formDataChild"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="品名规格" prop="nameSpe" labelWidth="125px">
            <el-input v-model="formDataChild.nameSpe" placeholder="请输入品名规格" />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="用途" prop="intention" labelWidth="125px">
            <el-input v-model="formDataChild.intention" placeholder="请输入用途" />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="数量" prop="amount" labelWidth="125px">
            <el-input-number v-model="formDataChild.amount" placeholder="请输入数量" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="需求时间" prop="requireTime" labelWidth="125px">
            <el-date-picker
              v-model="formDataChild.requireTime"
              type="date"
              value-format="x"
              placeholder="选择需求时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="备注" prop="remark" labelWidth="125px">
            <el-input type="textarea" v-model="formDataChild.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelChild">取消</el-button>
        <el-button type="primary" @click="submitChild">
          确定
        </el-button>
      </div>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { OaPurchaseApi } from '@/api/bpm/oapurchase'

const props = defineProps<{
  purchaseId: undefined // 采购父表id（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formDataChild = ref([])
const formRules = reactive({
  nameSpe: [{ required: true, message: '品名规格不能为空', trigger: 'blur' }],
  intention: [{ required: true, message: '用途不能为空', trigger: 'blur' }],
  amount: [{ required: true, message: '数量不能为空', trigger: 'blur' },{ type: 'number', message: '数量应为数字' }]
})
const formRef = ref() // 表单 Ref
const childFormRef = ref() // 表单 Ref
const dialogVisible = ref(false);
const currentIndex = ref(-1);

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.purchaseId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await OaPurchaseApi.getOaPurchaseListListByPurchaseId(val)
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

/** 新增按钮操作 */
const handleAdd = () => {
  // const row = {
  //   id: undefined,
  //   nameSpe: undefined,
  //   intention: undefined,
  //   amount: undefined,
  //   requireTime: undefined,
  //   remark: undefined,
  //   purchaseId: undefined
  // }
  // row.purchaseId = props.purchaseId
  // formData.value.push(row)
  formDataChild.value=[];
  dialogVisible.value = true
}

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}

/** 复制按钮操作 */
const handleCopy = (row) => {
  const newrow = {...row};
  formData.value.push(newrow);
}

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}

const cancelChild = ()=>{
  formDataChild.value = [];
  dialogVisible.value = false;
}
const submitChild = ()=>{
  console.log(formDataChild.value);
  let obj = Object.assign({},{...formDataChild.value},{supplyId:props.supplyId});
  if(currentIndex.value!=-1){
    formData.value.splice(currentIndex.value,1,obj)
  }else {
    formData.value.push(obj);
  }

  formDataChild.value = [];
  dialogVisible.value = false;

}

/** 编辑按钮操作 */
const handleUpdate = (index,row) => {
  const newrow = {...row};
  formDataChild.value = newrow;
  currentIndex.value = index;
  dialogVisible.value = true;
  // formData.value.push(newrow);
}

defineExpose({ validate, getData })
</script>
