<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-17 17:24:24
 * @LastEditTime: 2024-07-09 17:00:48
 * @FilePath: /cimp-tms-web/src/views/toolDelivery/deliveryToolTask/scanCodeDelivery.vue
-->
<template>
  <Dialog v-model="dialogVisible" :max-height="600" :scroll="true" title="扫码配送" width="1200">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules" label-width="130px">
      <el-form-item label="配送方式" prop="deliveryMode">
        <el-select v-model="formData.deliveryMode" placeholder="请选择配送方式" @change="deliveryModeOnChange()"
          class="!w-250px">
          <el-option :value="0" label="自动配送" />
          <el-option :value="1" label="人工配送" />
        </el-select>
      </el-form-item>
      <el-form-item label="配送人员" prop="deliveryBy">
        <el-select v-model="formData.deliveryBy" placeholder="请选择配送人员" class="!w-250px" :disabled="disabledDeliveryBy">
          <el-option value="1" label="刘雨" />
          <el-option value="2" label="张檬" />
        </el-select>
      </el-form-item>
      <el-divider />
      <el-form-item label="刀柄rfid" prop="rfid">
        <el-input v-model="formData.rfid" class="!w-250px" placeholder="请扫描刀柄rfid" />
        <el-button type="primary" :icon="Search" class="ml-10px" @click="getTableDataByRfid()">
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="modelTableData" style="width: 100%" default-expand-all row-key="id" border class="mt-20px">
      <el-table-column label="物码" prop="code" align="center" />
      <el-table-column label="名称" prop="name" align="center" />
      <el-table-column label="通用规格" prop="spec" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button v-if="row.type === 2" type="danger" size="small" @click="deleteTableRecord(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submitForm(formRef)">确 定</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { ElNotification } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getParingAndPlanByRfid, saveDeliveryState } from '@/api/knifetool/toolDelivery/deliveryToolTask'

const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = reactive<{
  deliveryMode?: number
  deliveryBy?: number
  rfid: string
  workOrderCode: string
  id?: number
  deliveryQuantity: string
}>({
  deliveryMode: undefined,
  deliveryBy: undefined,
  rfid: '',
  workOrderCode: '',
  id: undefined,
  deliveryQuantity: ''
})
const formRules = reactive({
  deliveryMode: [{ required: true, message: '请选择配送方式', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

const modelTableData: any = ref([])

/** 打开弹窗 */
const open = async (row: any) => {
  console.log(row)
  dialogVisible.value = true
  try {
    detailLoading.value = true
    formData.workOrderCode = row.workOrderCode
    formData.id = row.id
    formData.deliveryQuantity = row.deliveryQuantity
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const disabledDeliveryBy = ref(false)
const deliveryModeOnChange = () => {
  console.log(formData)
  if (formData.deliveryMode === 0) {
    //自动配送
    formData.deliveryBy = undefined
    disabledDeliveryBy.value = true
  }
  if (formData.deliveryMode == 1) {
    disabledDeliveryBy.value = false
  }
}

const modelTableDataKey = ref(0)
const getTableDataByRfid = async () => {
  try {
    if (formData.rfid == null || formData.rfid == '') {
      ElNotification({
        title: '警告',
        message: '请先扫描刀柄rfid',
        type: 'warning'
      })
      return false
    }

    let data = await getParingAndPlanByRfid({ rfid: formData.rfid })
    console.log(data)

    if (data === null || data.toolParingDtoList === null) {
      ElNotification({
        title: '警告',
        message: '未查询到此刀组相关配刀数据',
        type: 'warning'
      })
      return false
    }

    if (formData.workOrderCode !== data.workOrderCode) {
      ElNotification({
        title: '警告',
        message: '此刀组与当前工单号不匹配',
        type: 'warning'
      })
      return false
    }

    let toolParingDtoList = data.toolParingDtoList

    for (let i = 0; i < toolParingDtoList.length; i++) {
      let toolList = toolParingDtoList[i]

      let tool: any = ref({})
      let children = reactive<object[]>([])

      if (Array.isArray(toolList)) {
        for (let n = 0; n < toolList.length; n++) {
          toolList[n].key = toolList[n].id //把配刀记录id存到key中，因为配刀记录id刀头刀柄会重复，前端有警告，ID不唯一
          modelTableDataKey.value = modelTableDataKey.value + 1
          toolList[n].id = modelTableDataKey.value
          if (toolList[n].type == 2) {
            //刀柄
            tool.value = toolList[n]
          }
          if (toolList[n].type == 1) {
            children.push(toolList[n])
            console.log(children)
          }
        }
      }
      for (let p = 0; p < modelTableData.value.length; p++) {
        if (modelTableData.value[p].code == tool.value.code) {
          ElNotification({
            title: '警告',
            message: '此刀组已经扫描过,无需重复扫描',
            type: 'warning'
          })
          return false
        }
      }

      tool.value.children = children
      modelTableData.value.push(tool.value)
      formData.rfid = ''
    }
  } catch {
    return false
  }
}

const deleteTableRecord = (row) => {
  modelTableData.value.splice(
    modelTableData.value.findIndex((e) => e.id === row.id),
    1
  )
}

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const valid = await formEl.validate()
  if (!valid) return

  if (formData.deliveryMode === 1 && formData.deliveryBy === undefined) {
    ElNotification({
      title: '警告',
      message: '请选择配送人员',
      type: 'warning'
    })
    return false
  }

  if (formData.deliveryQuantity !== modelTableData.value.length) {
    ElNotification({
      title: '警告',
      message: `此次配送刀组数量为 ${formData.deliveryQuantity} 组，扫描数量为 ${modelTableData.value.length} 组，数量需对应`,
      type: 'warning'
    })
    return false
  }

  let recordList: any = []
  for (let p = 0; p < modelTableData.value.length; p++) {
    let rec = {
      deliveryTaskId: formData.id,
      paringId: modelTableData.value[p].key
    }
    recordList.push(rec)
  }

  let data = {
    id: formData.id,
    deliveryMode: formData.deliveryMode,
    deliveryBy: formData.deliveryBy,
    recordList: recordList
  }

  try {
    console.log("扫码后提交的数据", data);
    let res = await saveDeliveryState(data)
    console.log(res)
    emit('success')
    dialogVisible.value = false
  } catch (error) {
    console.log(error)
    dialogVisible.value = false
    return
  }
}
</script>
