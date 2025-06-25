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
      <!--<el-table-column label="产品编号" min-width="180" prop="materialId"/>-->
      <el-table-column label="图号" min-width="200">
        <template #default="{ row,$index }">
        <el-form-item :prop="`${$index}.partNumber`" :rules="formRules.partNumber" class="mb-0px!">
          <el-select v-model="row.partNumber" placeholder="请选择产品" @change="changePartNumber(row)">
            <el-option
              v-for="item in cpMaterialList"
              :key="item.id"
              :label="item.materialNumber"
              :value="item.materialNumber"
            />
          </el-select>
        </el-form-item>
      </template>
      </el-table-column>
      <el-table-column label="工件名称" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.partName`" :rules="formRules.partName" class="mb-0px!">
            <el-input v-model="row.partName" placeholder="请输入工件名称" disabled/>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="加工状态" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.processCondition`" :rules="formRules.processCondition" class="mb-0px!">
            <el-input v-model="row.processCondition" placeholder="请输入加工状态"/>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="数量" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.quantity`" :rules="formRules.quantity" class="mb-0px!">
            <el-input-number v-model="row.quantity" placeholder="请输入数量" />
          </el-form-item>
        </template>
      </el-table-column>
      <!--<el-table-column label="订单编码" min-width="150">-->
        <!--<template #default="{ row, $index }">-->
        <!--<el-form-item :prop="`${$index}.orderCode`" :rules="formRules.orderCode" class="mb-0px!">-->
          <!--<el-input v-model="row.orderCode" placeholder="请输入订单编码(用于指挥生产的订单编码)" />-->
        <!--</el-form-item>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="带料加工" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.processType`" :rules="formRules.processType" class="mb-0px!">
            <el-select v-model="row.processType" placeholder="请选择带料加工">
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.PMS_PROCESS_TYPE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="整单外协" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.outsource`" :rules="formRules.outsource" class="mb-0px!">
            <el-select v-model="row.outsource" placeholder="请选择带料加工">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ORDER_OUTSOURCE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="物料" min-width="160">
        <template #default="{ row,$index }">
          <el-form-item :prop="`${$index}.materialNumber`" :rules="formRules.materialNumber" class="mb-0px!">
            <el-select v-model="row.materialNumber" placeholder="请选择物料" :disabled="!row.outsource">
              <el-option
                v-for="item in mpMaterialList"
                :key="item.id"
                :label="item.materialNumber"
                :value="item.materialNumber"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="原料交付时间" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.materialDeliveryTime`" :rules="formRules.materialDeliveryTime" class="mb-0px!">
            <el-date-picker
              v-model="row.materialDeliveryTime"
              type="date"
              value-format="x"
              placeholder="选择原料交付时间"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="成品交付时间" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.fproDeliveryTime`" :rules="formRules.fproDeliveryTime" class="mb-0px!">
            <el-date-picker
              v-model="row.fproDeliveryTime"
              type="date"
              value-format="x"
              placeholder="选择成品交付时间"
            />
          </el-form-item>
        </template>
      </el-table-column>
       <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link>—</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ 添加项目订单表子</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { OrderApi } from '@/api/pms/order'
import { ApprovalApi } from '@/api/pms/pmsapproval'
import { MaterialConfigApi } from '@/api/wms/materialconfig'

const props = defineProps<{
  projectId: undefined // 项目订单id（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const checkPartNumber = async (rule,value,callback)=>{
  let number = 0;
  formData.value.forEach((item)=>{
    if(item.partNumber === value){
      number++;
    }
  })
  if(number>1){
    callback(new Error('不能选择重复图号'))
  }else {
    callback()
  }
}
const formRules = reactive({
  partNumber: [{ required: true, message: '图号不能为空', trigger: 'blur' },{validator: checkPartNumber,trigger: 'blur'}],
  quantity: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
  processType: [{ required: true, message: '带料加工不能为空', trigger: 'blur' }],
  processCondition: [{ required: true, message: '加工状态不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

const material = ref();
const cpMaterialList = ref([]);
const mpMaterialList = ref([]);
/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.projectId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      const data = []
      const project = await ApprovalApi.getApproval(val);
      const orderList = project.orderList;
      orderList.forEach((item)=>{
        data.push(...item.orderItemList)
      })

      formData.value = data;
      // formData.value = await OrderApi.getOrderListByProjectOrderId(val)
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: undefined,
    materialId: undefined,
    quantity: undefined,
    processType: undefined,
    materialDeliveryTime: undefined,
    fproDeliveryTime: undefined,
    projectOrderId: undefined,
  }
  row.projectOrderId = props.projectOrderId
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}

/** 设置表单值 */
const setData = (data) => {
  formData.value = data;
}
/**
 * 获取材料属性
 * @param row
 */
const getMaterial = async (row)=>{
  material.value =await MaterialConfigApi.getMaterialConfig(row.materialId);
}

const getMaterialList = async ()=>{
  //materialList.value =  await MaterialConfigApi.getMaterialConfigList();
  //cpMaterialList.value = await OrderApi.getMaterialByTypeCode('CP');
  const gzcalue = await OrderApi.getMaterialByTypeCode('GZ');
  cpMaterialList.value = await OrderApi.getMaterialByTypeCode('CP');
  cpMaterialList.value.push(...gzcalue);
  mpMaterialList.value = await OrderApi.getMaterialByTypeCode('MP');
}
const changePartNumber = (row)=>{
  if(row){
    cpMaterialList.value.forEach((item)=>{
      if(row.partNumber === item.materialNumber){
        row.partName = item.materialName;
      }
    })
  }
}
onMounted(()=>{
  getMaterialList();
})

defineExpose({ getData,setData,getMaterialList,validate })
</script>
