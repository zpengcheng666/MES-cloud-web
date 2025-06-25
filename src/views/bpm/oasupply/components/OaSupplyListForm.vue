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
      <el-table-column label="序号" type="index" width="80" />
      <el-table-column label="名称" min-width="100">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.name`" :rules="formRules.name" class="mb-0px!">
            <el-input v-model="row.name" placeholder="请输入名称" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="规格型号" min-width="100">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.specification`" :rules="formRules.specification" class="mb-0px!">
            <el-input v-model="row.specification" placeholder="请输入规格型号" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="数量" min-width="130">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.amount`" :rules="formRules.amount" class="mb-0px!">
            <el-input-number v-model="row.amount" placeholder="请输入数量" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="单位" min-width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.unit`" :rules="formRules.unit" class="mb-0px!">
            <el-input v-model="row.unit" placeholder="请输入单位" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="库存" min-width="130">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.inventory`" :rules="formRules.inventory" class="mb-0px!">
            <el-input-number v-model="row.inventory" placeholder="请输入库存" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remark`" :rules="formRules.remark" class="mb-0px!">
            <el-input v-model="row.remark" placeholder="请输入备注" />
          </el-form-item>
        </template>
      </el-table-column>
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
    <el-button @click="handleAdd" round>+ 添加OA 物品领用表-物品清单</el-button>
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
          <el-form-item label="名称" prop="name" labelWidth="125px">
            <el-input v-model="formDataChild.name" placeholder="请输入名称" />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="规格型号" prop="specification" labelWidth="125px">
            <el-input v-model="formDataChild.specification" placeholder="请输入规格型号" />
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
          <el-form-item label="单位" prop="unit" labelWidth="125px">
            <el-input v-model="formDataChild.unit" placeholder="请输入单位" />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="库存" prop="inventory" labelWidth="125px">
            <el-input-number type="textarea" v-model="formDataChild.inventory" placeholder="库存" />
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
  import { OaSupplyApi } from '@/api/bpm/oasupply'

  const props = defineProps<{
    supplyId: undefined // 采购父表id（主表的关联字段）
  }>()
  const formLoading = ref(false) // 表单的加载中
  const formData = ref([])
  const formDataChild = ref([])
  const formRules = reactive({
    name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
    specification: [{ required: true, message: '规格型号不能为空', trigger: 'blur' }],
    amount: [{ required: true, message: '数量不能为空', trigger: 'blur' }]
  })
  const formRef = ref() // 表单 Ref
  const childFormRef = ref() // 表单 Ref
  const dialogVisible = ref(false);
  const currentIndex = ref(-1);

  /** 监听主表的关联字段的变化，加载对应的子表数据 */
  watch(
    () => props.supplyId,
    async (val) => {
      // 1. 重置表单
      formData.value = []
      // 2. val 非空，则加载数据
      if (!val) {
        return;
      }
      try {
        formLoading.value = true
        formData.value = await OaSupplyApi.getOaSupplyListListBySupplyId(val)
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
    //   name: undefined,
    //   specification: undefined,
    //   amount: undefined,
    //   unit: undefined,
    //   inventory: undefined,
    //   remark: undefined,
    //   supplyId: undefined
    // }
    // row.supplyId = props.supplyId
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

  /** 编辑按钮操作 */
  const handleUpdate = (index,row) => {
    const newrow = {...row};
    formDataChild.value = newrow;
    currentIndex.value = index;
    dialogVisible.value = true;
    // formData.value.push(newrow);
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

  defineExpose({ validate, getData })
</script>
