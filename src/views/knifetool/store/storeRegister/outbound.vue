<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-17 17:24:24
 * @LastEditTime: 2024-07-31 14:05:12
 * @FilePath: /cimp-tms-web/src/views/store/storeRegister/outbound.vue
-->
<template>
  <Dialog
    v-model="dialogVisible"
    :max-height="600"
    :scroll="true"
    :title="dialogTitle"
    :fullscreen="true"
  >
    <selectPositionDialog
      ref="positionForm"
      @success="selectPositionInfo"
      title="选择库位"
      :isclick="true"
    />
    <oldOutBound ref="oldOutRef" @handle-amount="handleOldAddAmount" />
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
      :rules="formRules"
    >
      <el-form-item label="货位" prop="location">
        <el-input
          v-model="queryParams.location"
          placeholder="请选择货位"
          readonly
          @keyup.enter="handleQuery"
        >
          <template #append>
            <el-button :icon="Search" @click="openPositionDialog()" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="刀具" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择新刀/旧刀" style="width: 240px">
          <el-option label="新刀" value="1" />
          <el-option label="旧刀" value="0" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery(queryFormRef)"> <Icon icon="ep:search" />查询 </el-button>
        <el-button @click="resetQuery(queryFormRef)"> <Icon icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>

    <!-- style="height: calc(100% - 80px)" -->
    <el-card shadow="never" class="mt-20px">
      <el-alert
        title="请填写以下项目后，在进行出库动作"
        type="warning"
        :closable="false"
        show-icon
      />

      <el-form
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        :rules="formRules"
        class="mt-20px"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="领用人" prop="handover">
              <formRecipientSelect
                ref="handoverRef"
                placeholder="请选择领用人"
                @handle-select="
                  (val) => {
                    setFormSelectValue(val, 'handover')
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用途" prop="useful">
              <el-select v-model="formData.useful" placeholder="请选择用途" style="width: 240px">
                <el-option label="个人" value="1" />
                <el-option label="生产" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工单号" prop="planeNumber">
              <formWorkerOrderSelect
                ref="workOrderRef"
                @handle-select="
                  (val) => {
                    setFormSelectValue(val, 'planeNumber')
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据编号" prop="receiptNumber">
              <el-input readonly disabled v-model="formData.receiptNumber" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="tableData">
          <section
            style="width: 100%"
            class="mt-20px"
            v-for="(item, i) in formData.tableData"
            :key="i"
          >
            <el-divider content-position="left">{{ item.locationTitle }}</el-divider>

            <el-table :data="item.data" style="width: 100%" class="mt-20px">
              <template v-for="column in columns" :key="column.dataIndex">
                <el-table-column
                  v-if="column.dataIndex === 'amount'"
                  :prop="column.dataIndex"
                  :label="column.title"
                  align="center"
                >
                  <!-- :rules="[
                        {
                          message: '请输入正确内容!',
                          trigger: 'change',
                          pattern: new RegExp(/^[1-9]\d*$/, 'g')
                        },
                        {
                          message: '出库数量大于可用数量!',
                          trigger: 'change',
                          whitespace: false,
                          validator: validateAmount,
                          min: 1
                        }
                      ]" -->
                  <template #default="scope">
                    <el-form-item
                      :prop="'tableData.' + i + '.data.' + scope.$index + '.amount'"
                      :rules="validatorAmount(scope.row)"
                      style="margin: 18px 0"
                    >
                      <el-input
                        v-model="scope.row.amount"
                        :disabled="scope.row.type === 0"
                        :readonly="scope.row.type === 0"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  v-else-if="column.dataIndex === 'type'"
                  :prop="column.dataIndex"
                  :label="column.title"
                  align="center"
                >
                  <template #default="scope">
                    {{ scope.row.type === 1 ? '新刀' : '旧刀' }}
                  </template>
                </el-table-column>

                <el-table-column
                  v-else
                  :prop="column.dataIndex"
                  :label="column.title"
                  align="center"
                />
              </template>
              <el-table-column label="操作" align="center">
                <template #default="scope">
                  <el-button
                    v-if="scope.row.type === 0"
                    type="danger"
                    size="small"
                    @click="handleOut(scope.row, i, scope.$index)"
                  >
                    扫码出库
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </section>
        </el-form-item>
      </el-form>
    </el-card>

    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm(formRef)"
        >确 定</el-button
      >
      <el-button @click="resetForm()">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { getStoreByLocationAndType, outGoodSubmit } from '@/api/knifetool/store/storeRegister'
import type { FormInstance } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import formRecipientSelect from '@/components/store/formRecipientSelect.vue'
import formWorkerOrderSelect from '@/components/store/formWorkerOrderSelect.vue'
import selectPositionDialog from '@/components/store/selectPositionDialog.vue'
import { ElNotification } from 'element-plus'
import oldOutBound from './oldOutBound.vue'

const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中
const dialogTitle = ref('出库')

const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  location: '',
  storeLocationId: '',
  type: ''
})

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formRef = ref<FormInstance>()
interface ChildrenItem {
  informationId: number
  categoryId: number
  storeLocationId: number
  code: string
  toolCategoryValue: string
  name: string
  spec: string
  storeCount: number
  storeUse: number
  amount?: number
  type: number
  outType: number
}
interface tableDataItem {
  storeLocationId: number
  locationTitle: string
  type: Array<number>
  data: ChildrenItem[]
}

const formData = ref<{
  tableData: tableDataItem[]
  handover: string
  useful: string
  planeNumber: string
  receiptNumber: string
}>({
  tableData: [],
  handover: '',
  useful: '',
  planeNumber: '',
  receiptNumber: ''
})

// form 验证
const formRules = reactive({
  location: [{ required: true, message: '货位必须选择!', trigger: 'change' }],
  type: [{ required: true, message: '新刀/旧刀必须选择!', trigger: 'change' }],
  handover: [{ required: true, message: '领用人必须选择!', trigger: 'change' }],
  useful: [{ required: true, message: '出库用途必须选择!', trigger: 'change' }],
  tableData: [{ required: true, message: '刀具信息不能为空!!', trigger: 'change' }]
})

const columns = [
  { title: '刀具类码', dataIndex: 'code', ellipsis: true, align: 'center' },
  { title: '刀具分类', dataIndex: 'toolCategoryValue', ellipsis: true, align: 'center' },
  { title: '刀具名称', dataIndex: 'name', ellipsis: true, align: 'center' },
  { title: '通用规格', dataIndex: 'spec', ellipsis: true, align: 'center' },
  {
    title: '新刀／旧刀',
    dataIndex: 'type',
    ellipsis: true,
    align: 'center'
  },
  { title: '库存数量', dataIndex: 'storeCount', ellipsis: true, align: 'center' },
  // { title: '预约数量', dataIndex: 'column7', ellipsis: true, align: 'center' },
  { title: '可用数量', dataIndex: 'storeUse', ellipsis: true, align: 'center' },
  {
    title: '本次出库数量',
    dataIndex: 'amount',
    ellipsis: true,
    align: 'center'
  }
]

/** 打开弹窗 */
const open = async () => {
  const date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1

  // 清除查询内容
  resetQuery(queryFormRef.value)
  // 清除form
  resetForm()

  dialogVisible.value = true
  formData.value.receiptNumber = 'C' + year + month + date.getTime()
}
defineExpose({ open })

// 选中的货位
const positionForm = ref()
const openPositionDialog = () => {
  positionForm.value.open()
}

// 选中的仓位信息
const selectPositionInfo = (json: any) => {
  queryParams.location = `${json.layerNum}-${json.locationNum}`
  queryParams.storeLocationId = json.id
}

const setFormSelectValue = (val: string, prop: string) => {
  formData.value[prop] = val
}

/** 查询列表 */
const getList = async () => {
  detailLoading.value = true
  try {
    const data = await getStoreByLocationAndType(queryParams)
    console.log(data)

    if (data.length === 0) {
      ElNotification({
        title: '警告',
        message: '此库位未摆放任何物品!',
        type: 'warning'
      })
      return
    }

    const d = data.map((item: ChildrenItem) => {
      console.log(item)
      return {
        ...item,
        detailCode: '',
        outType: item.type ? 3 : 4 // 新刀为3 新刀出库 旧刀为4 归还出库
      }
    })

    const ids = formData.value.tableData.map((item) => item.storeLocationId)
    const currentIndex = ids.indexOf(data[0].storeLocationId)

    if (currentIndex >= 0) {
      const currentType = formData.value.tableData[currentIndex].type.find(
        (item) => item === data[0].type
      )
      // 当前id已经存在tableData中
      if (currentType !== undefined) {
        // 该类型已经存在
        ElNotification({
          title: '警告',
          message: '该数据已经存在或此库位未摆放任何物品!',
          type: 'warning'
        })
      } else {
        // 不存在该类型可添加
        formData.value.tableData[currentIndex].type.push(data[0].type)
        formData.value.tableData[currentIndex].data =
          formData.value.tableData[currentIndex].data.concat(d)
      }
    } else {
      // 不存在tableData中,可添加
      formData.value.tableData.push({
        storeLocationId: data[0].storeLocationId,
        locationTitle: data[0].locationTitle,
        type: [data[0].type],
        data: d
      })
    }
    console.log(formData.value)
  } finally {
    detailLoading.value = false
  }
}

// 新刀 - 验证出库数量
const validatorAmount = (row: any) => {
  return [
    { message: '请输入正确内容!', trigger: 'change', pattern: new RegExp(/^[1-9]\d*$/, 'g') },
    {
      trigger: 'change',
      whitespace: false,
      validator: (_rule, value, callback) => {
        console.log(_rule, value, row)

        if (value > row.storeUse) {
          callback(new Error('出库数量大于可用数量!'))
        } else {
          callback()
        }
      }
    }
  ]
}

// 扫码出库
const currentSelectOldT = ref()
const currentSelectOldD = ref()
const oldOutRef = ref()
const handleOut = (row: any, tI: number, dI: number) => {
  console.log(tI, dI)
  currentSelectOldT.value = tI
  currentSelectOldD.value = dI
  oldOutRef.value.open(row)
}

// 扫码出库添加数量
const handleOldAddAmount = (val: number) => {
  console.log('添加', val)
  formData.value.tableData[currentSelectOldT.value].data[currentSelectOldD.value].amount = val
}

/** 搜索按钮操作 */
const handleQuery = async (formEl: FormInstance | undefined) => {
  console.log(formEl)

  if (!formEl) return
  const valid = await formEl.validate()
  if (!valid) return
  getList()
}

/** 重置按钮操作 */
const resetQuery = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  positionForm.value.resetList()
}

// 修改提交数据
const changeData = (DATA: any) => {
  const arr = []
  const allList = DATA.reduce(
    (accumulator: any, currentValue: any) => accumulator.concat(currentValue.data),
    arr
  )
  return allList.filter((item) => item.amount)
}

// 提交表单
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const valid = await formEl.validate()
  if (!valid) return
  try {
    const { handover, useful, planeNumber, receiptNumber, tableData } = formData.value
    const data = changeData(tableData)

    console.log({ handover, useful, planeNumber, receiptNumber, tableData: data })

    const res = await outGoodSubmit({
      handover,
      useful,
      planeNumber,
      receiptNumber,
      tableData: data
    })
    console.log(res)
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

// 重置
const workOrderRef = ref()
const handoverRef = ref()
const resetForm = () => {
  dialogVisible.value = false

  // 清空组件下的值
  workOrderRef.value?.setValueUndefined()
  handoverRef.value?.setValueUndefined()
  // 清除表单内容
  formData.value = {
    tableData: [],
    handover: '',
    useful: '',
    planeNumber: '',
    receiptNumber: ''
  }
  formRef.value?.resetFields()
}

// 父组件充当中间件，将选中树节点传给子级
const treeSelectNode = reactive<any>({
  name: '',
  id: '',
  classification: null
})
provide('treeSelectNode', treeSelectNode)
</script>
