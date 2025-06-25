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
      <el-table-column label="编码位类型" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.type`" :rules="formRules.type" class="mb-0px!">
            <el-select v-model="row.type" placeholder="请选择类型"    @change="getChange(row,$index)">
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.MCC_ENCODING_TYPE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"

                />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="物料类别" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.materialTypeId`" :rules="formRules.materialTypeId" class="mb-0px!" >


            <el-select
                    v-model="row.materialTypeId"
                    clearable
                    filterable
                    placeholder="请选择类别"
                    class="!w-1/1"
                    :disabled="true"
            >
              <el-option
                      v-for="item in materialTypeValue"
                      :key="item.id"
                      :label="item.name +'('+item.code+')'"
                      :value="item.id+''"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>

       <el-table-column label="排序" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.sort`" :rules="formRules.sort" class="mb-0px!">
            <el-input-number v-model="row.sort" placeholder="排序" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="位数" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.bitNumber`" :rules="formRules.bitNumber" class="mb-0px!">
            <el-input-number v-model="row.bitNumber" placeholder="请输入位数" @change="getNumber"/>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.name`" :rules="formRules.name" class="mb-0px!">
            <el-input v-model="row.name" placeholder="请输入名称" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="默认值" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.defalutValue`" :rules="formRules.defalutValue" class="mb-0px!">
            <el-input v-model="row.defalutValue" placeholder="请输入默认值" :disabled="row.ruleType !=1 || row.type ==2" @input="getDefault(row,$index)"/>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="规则" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.ruleType`" :rules="formRules.ruleType" class="mb-0px!">
            <el-select v-model="row.ruleType" placeholder="生成规则" @change="getType(row,$index)">
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.MCC_RULE_TYPE)"
                  :key="dict.value"
                  :label="dict.label "
                  :value="dict.value"
                />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="编码属性" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.encodingAttribute`" :rules="formRules.encodingAttribute" class="mb-0px!">

            <el-select
                    v-model="row.encodingAttribute"
                    clearable
                    filterable
                    placeholder="请选择类别"
                    class="!w-1/1"
            >
              <el-option
                      v-for="item in encodingAttributesList"
                      :key="item.code"
                      :label="item.code +'('+item.name+')'"
                      :value="item.code+''"
              />
            </el-select>

            <!--<el-select v-model="row.encodingAttribute" placeholder="请选择编码属性">-->
                <!--<el-option-->
                  <!--v-for="dict in getStrDictOptions(DICT_TYPE.MCC_ENCODING_ATTRIBUTE )"-->
                  <!--:key="dict.value"-->
                  <!--:label="dict.label+'('+dict.value+')'"-->
                  <!--:value="dict.value"-->
                <!--/>-->
            <!--</el-select>-->
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="来源规则" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.sourceRuleId`" :rules="formRules.sourceRuleId" class="mb-0px!">



            <el-select
                    v-model="row.sourceRuleId"
                    clearable
                    filterable
                    placeholder="请选择来源规则"
                    class="!w-1/1"
                    :disabled="row.type !=4"
                    @change="getChooseRuleId(row,$index)"
            >
              <el-option
                      v-for="item in encodingRuleList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id+''"
              />
            </el-select>

            <!--<el-input v-model="row.sourceRuleId" placeholder="请输入来源规则"  />-->
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ 添加编码规则配置详情</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { getIntDictOptions, getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { EncodingRuleApi } from '@/api/mcc/encodingrule'
const props = defineProps<{
  encodingRuleId: undefined, // 编码规则表ID（主表的关联字段）
    classCode: undefined, // 分类码
    materialTypeValue: undefined ,// 物料类别集合
    materialTypeId: undefined, // 物料类别ID
    encodingRuleList: undefined, // 规则（主表的关联字段）
    encodingAttributesList: undefined, // 自定义属性
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  type: [{ required: true, message: '编码位类型不能为空', trigger: 'change' }],
  encodingRuleId: [{ required: true, message: '编码规则表ID不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
  bitNumber: [{ required: true, message: '位数不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '描述名不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

const message = useMessage() // 消息弹窗


/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.encodingRuleId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await EncodingRuleApi.getEncodingRuleDetailListByEncodingRuleId(val)
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

watch(
    () => props.classCode,
    async (val) => {
        // 2. val 非空，则加载数据
        if (!val) {
            return;
        }
        try {
            formLoading.value = true

            if (formData.value.length>0){
                formData.value.forEach((item, index) => {
                   if (item.type==2) {
                       item.defalutValue=val
                       item.batchNumber=val.length
                   }
                })
                getNumber()
            }

        } finally {
            formLoading.value = false
        }
    },
    { immediate: true }
)



const emit = defineEmits(['getBitNumber']) // 定义 success 事件，用于操作成功后的回调

/** 新增按钮操作 */
const handleAdd = () => {

    if (!props.classCode){
        message.error("请先选择分类")
        return;
    }else if (props.classCode =='MAT'){

        if (!props.materialTypeId) {
            message.error("请先选择物料类别")
            return;

        }
    }

    let sort = 1;

    if (formData.value.length>0){

        sort = sort + formData.value[formData.value.length-1].sort
    }

  const row = {
    id: undefined,
    type: undefined,
    encodingRuleId: undefined,
    sort: sort,
    bitNumber: undefined,
    name: undefined,
    defalutValue: undefined,
    ruleType: undefined,
    encodingAttribute: undefined,
    sourceRuleId: undefined,
  }
  row.encodingRuleId = props.encodingRuleId
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)

    getNumber()
}


const getChange =  (row,index)=>{

    if (row.type == 2){//编码分类     默认值为选中的分类编号   规则 ：固定  位数：分类的位数
        formData.value.forEach((item, i) => {
            if (i==index){
                item.defalutValue=props.classCode
                item.bitNumber=props.classCode.length
                item.materialTypeId =undefined
                item.sourceRuleId =undefined
                item.ruleType =1
            }
        })
    }else if (row.type ==3) { //类别    默认为规则所有类别   位数：树结构总数
        const info=  props.materialTypeValue.find((item) => item.id == props.materialTypeId)
        debugger
        formData.value.forEach((item, i) => {
            if (i==index){
                item.materialTypeId =props.materialTypeId
                item.sourceRuleId =undefined
                item.defalutValue =undefined
                item.bitNumber= info.bitNumber*5
                item.ruleType =5
            }
        })
    }else{
        formData.value.forEach((item, i) => {
            if (i==index){
                item.materialTypeId =undefined
                item.sourceRuleId =undefined
                item.defalutValue =undefined
                item.bitNumber=0
                item.ruleType =1
            }
        })
    }
    getNumber()

}

const getType =(row,index)=>{
    const info=  props.materialTypeValue.find((item) => item.id == props.materialTypeId)
    formData.value.forEach((item, i) => {
        if (i==index){
            if (row.ruleType == 4){
                item.bitNumber= info.bitNumber
            } else if (row.ruleType ==5) {
                item.bitNumber= info.bitNumber*(info.levelLimit +1)
            }
        }
    })

    getNumber()
}

//监听默认值变化
const  getDefault=(row,index)=>{

    formData.value.forEach((item, i) => {
        if (i==index){
            item.bitNumber= item.defalutValue.length
            item.ruleType =1
        }
    })

    getNumber()
}

//获取总位数
const  getNumber = ()=>{

    let  number = 0;
    formData.value.forEach((item, index) => {
        if (item.bitNumber){
            number = item. bitNumber + number
        }

    })

    emit('getBitNumber', number)

}


//获取来源
const getChooseRuleId=(row,index)=>{
    const info=  props.encodingRuleList.find((item) => item.id == row.sourceRuleId)
    formData.value.forEach((item, i) => {
        if (i==index){
            item.bitNumber=info.totalBitNumber
        }
    })

    getNumber()
}

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}


defineExpose({ validate, getData })
</script>