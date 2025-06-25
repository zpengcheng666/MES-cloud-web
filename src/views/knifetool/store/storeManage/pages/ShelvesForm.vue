<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules" label-width="130px">
      <el-form-item v-if="formType !== 'create'" label="货架编号" prop="code">
        <el-input v-model="formData.code" readonly disabled />
      </el-form-item>
      <el-form-item label="货架名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入货架名称" />
      </el-form-item>
      <el-form-item label="货架规格" prop="specifications">
        <el-input v-model="formData.specifications" placeholder="请输入货架规格" />
      </el-form-item>
      <el-form-item v-for="(layer, index) in formData.goods" :key="layer.layerNum" :label="'第' + (index + 1) + '层'"
        :prop="'goods.' + index + '.locationNum'" :rules="{
          required: true,
          message: '该字段必须填写,且范围在0-999',
          trigger: 'blur'
        }">
        <el-row :gutter="20" style="width: 100%">
          <el-col :span="20">
            <el-input v-model="layer.locationNum" />
          </el-col>
          <el-col :span="4">
            <el-button @click.prevent="removeLayer(layer)"> 删除 </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button @click="addLayer" :icon="Plus">添加</el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as warehouseApi from '@/api/knifetool/store/storeManage'
import { Plus } from '@element-plus/icons-vue'

const treeSelectNode = inject('treeSelectNode') as any
watch(
  () => treeSelectNode.id,
  (val) => {
    val &&
      val.length &&
      nextTick(() => {
        console.log(treeSelectNode)
      })
  },
  { immediate: true }
)


const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: '',
  type: undefined,
  code: '',
  specifications: '',
  classification: 3,
  parentId: undefined,
  goods: [{ layerNum: 1, locationNum: '' }]
})

const formRules = reactive({
  name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
  specifications: [{ required: true, message: '请输入货架规格', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

const resetGoods = (arr: Array<any>) => {
  const x = arr[arr.length - 1].name.split('-')[0]
  let goods: Array<any> = []

  for (let i = 1; i <= x; i++) {
    let max: number = 0
    arr.map((item) => {
      const line = item.name.split('-')[0]
      let value: number = item.name.split('-')[1]
      if (line == i && value > max) {
        max = value
      }
    })
    goods.push({ layerNum: i, locationNum: max })
  }
  return goods
}




/** 打开弹窗 */
const open = async (type: string, row?: any) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (row) {
    console.log(row)
    formLoading.value = true
    try {
      const data = await warehouseApi.getStoreRackGoods(row.id)
      const goods = resetGoods(data)
      console.log(data)

      formData.value = {
        ...JSON.parse(JSON.stringify(row)),
        goods
      }
    } finally {
      formLoading.value = false
    }
  }
}
// 这在处理子组件时特别有用，允许父组件访问子组件的特定属性或方法
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

interface LayerItem {
  layerNum: number
  locationNum: string
}

// 删除货层
const removeLayer = (item: LayerItem) => {
  const index = formData.value.goods.indexOf(item)
  if (index !== -1) {
    formData.value.goods.splice(index, 1)
  }
}

const addLayer = () => {
  formData.value.goods.push({
    layerNum: formData.value.goods.length + 1,
    locationNum: ''
  })
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    // 确认goods中数据的顺序
    formData.value.goods = formData.value.goods.map((item, index) => {
      return { ...item, layerNum: index + 1 }
    })

    const data = formData.value as warehouseApi.Demo02ContactVO
    data.parentId = treeSelectNode.id
    data.type = treeSelectNode.type
    console.log(data)

    if (formType.value === 'create') {
      await warehouseApi.createStoreRack(data)
      message.success(t('common.createSuccess'))
    } else {
      await warehouseApi.updateStoreRack(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: '',
    type: undefined,
    code: '',
    specifications: '',
    classification: 3,
    parentId: undefined,
    goods: [{ layerNum: 1, locationNum: '' }]
  }
  formRef.value?.resetFields()
}
</script>
