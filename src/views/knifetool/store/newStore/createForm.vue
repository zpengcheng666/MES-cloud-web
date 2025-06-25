<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-21 09:31:35
 * @LastEditTime: 2024-08-13 16:00:24
 * @FilePath: /cimp-tms-web/src/views/store/newStore/createForm.vue
-->
<template>
  <Dialog v-model="dialogVisible" :fullscreen="true" title="入库信息">
    <selectTrayDialog ref="trayDialogRef" @success="selectTrayInfo" />
    <selectToolDialog ref="toolInfoForm" @success="selectToolInfo" />
    <selectPositionDialog ref="positionForm" @success="selectPositionInfo" title="重新选择库位" />
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="对接人员" prop="handover">
            <el-input v-model="formData.handover" placeholder="请输入对接人员..." clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="采购批次" prop="purchaseBatch">
            <el-input v-model="formData.purchaseBatch" placeholder="请输入采购批次..." clearable class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :span="6"><el-button type="primary" @click="openToolInfoDialog"> 选择刀具信息</el-button></el-col>
      </el-row>
      <el-form-item prop="childrens">
        <el-table :data="formData.childrens" :default-expand-all="isExpand" style="width: 100%">
          <el-table-column type="expand">
            <template #default="props">
              <el-form-item prop="`childrens{props.$index}.trayList`" class="mt-30px">
                <el-table :data="props.row.trayList">
                  <el-table-column label="托盘名称" prop="trayName" align="center">
                    <template #default="{ row, $index }">
                      <el-form-item style="margin: 18px 0"
                        :prop="'childrens.' + props.$index + '.trayList.' + $index + '.trayName'" :rules="[
                          {
                            required: true,
                            message: '请选择托盘',
                            trigger: 'change',
                            whitespace: false
                          }
                        ]">
                        <el-input v-model="row.trayName" readonly>
                          <template #append>
                            <el-button :icon="Search"
                              @click="openTrayInfoDialog(props.row.code, props.$index, $index)" />
                          </template>
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="托盘类型" prop="trayTypeName" align="center" />
                  <el-table-column label="托盘码" prop="trayNumber" align="center" />
                  <el-table-column label="托盘现有的刀具数量" prop="trayNowNum" align="center" />
                  <el-table-column label="托盘最大存放数量" prop="trayMaxNum" align="center" />
                  <el-table-column label="新增刀具数量" prop="trayInOutNum" align="center">
                    <template #default="{ row, $index }">
                      <el-form-item style="margin: 18px 0" :prop="'childrens.' + props.$index + '.trayList.' + $index + '.trayInOutNum'
                        " :rules="[
                          { required: true, message: '新增刀具数量不得为空', trigger: 'blur' },
                          { validator: validatorAddNum, trigger: 'blur' }
                        ]">
                        <el-input type="number" v-model.number="row.trayInOutNum" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template #default="scope">
                      <el-popover :visible="scope.row.visible !== undefined" placement="top" :width="160">
                        <p>确定要删除此条数据吗？</p>
                        <div style="text-align: right; margin: 0">
                          <el-button size="small" @click="scope.row.visible = undefined">取消</el-button>
                          <el-button size="small" type="primary" @click="handleDeleteTray(props.$index, scope.$index)">
                            确定
                          </el-button>
                        </div>
                        <template #reference>
                          <el-button type="danger" size="small" @click="scope.row.visible = true"
                            v-if="props.row.trayList.length > 1">
                            删除
                          </el-button>
                        </template>
                      </el-popover>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>

              <el-row justify="end" style="margin: 30px 0 20px">
                <el-col :span="2">
                  <el-form-item>
                    <el-button type="success" @click="addTray(props.$index)">添加托盘</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="toolInformationName" label="刀具名称" align="center" />
          <el-table-column prop="toolInformationType" label="刀具类型" align="center">
            <template #default="{ row }">
              <span>{{
                row.toolInformationType === 1
                  ? '刀具'
                  : row.toolInformationType === 2
                    ? '刀柄'
                    : '配件'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="toolBrandId" label="刀具品牌" align="center">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.KNIFETOOL_BRAND" :value="scope.row.toolBrandId" />
            </template>
          </el-table-column>
          <el-table-column prop="toolCategoryValue" label="刀具分类" align="center" />
          <el-table-column prop="price" label="单价（元）" align="center">
            <template #default="scope">
              <el-form-item style="margin: 18px 0" :prop="'childrens.' + scope.$index + '.price'" :rules="[
                {
                  required: true,
                  message: '请输入正确单价!',
                  trigger: 'change',
                  pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                  whitespace: false
                }
              ]">
                <el-input v-model.number="scope.row.price" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="location" label="选择仓位" align="center">
            <template #default="scope">
              <el-input v-model="scope.row.location" disabled class="locator">
                <template #append>
                  <el-button :icon="Search" @click="openPositionDialog(scope.$index)" />
                </template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="isFull" label="是否满仓" align="center">
            <template #default="scope">
              <el-switch v-model="scope.row.isFull" inline-prompt active-text="是" inactive-text="否" />
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="刀具数量" align="center">
            <template #default="scope">
              <el-input v-model.number="scope.row.amount" disabled readonly />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-popover :visible="scope.row.visible !== undefined" placement="top" :width="160">
                <p>确定要删除此条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="small" @click="scope.row.visible = undefined">取消</el-button>
                  <el-button size="small" type="primary" @click="handleDelete(scope.$index, scope.row)">
                    确定
                  </el-button>
                </div>
                <template #reference>
                  <el-button type="danger" size="small" @click="scope.row.visible = true">
                    删除
                  </el-button>
                </template>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm(formRef)">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import selectTrayDialog from './selectTrayDialog.vue'
import selectToolDialog from './selectToolDialog.vue'
import selectPositionDialog from '@/components/store/selectPositionDialog.vue'
import { DICT_TYPE } from '@/utils/dict'
import { Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { createNewGoods } from '@/api/knifetool/store/newStore'
import { ElNotification } from 'element-plus'

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

const formRef = ref<FormInstance>()
const formData = ref<{
  childrens: ChildrenItem[]
  handover: string
  purchaseBatch: string
}>({
  childrens: [],
  handover: '',
  purchaseBatch: ''
})

interface TrayItem {
  id?: number
  trayName: string
  trayTypeName: string
  trayTypeId?: number
  trayNumber: string
  trayNowNum?: number
  trayMaxNum?: number
  trayInOutNum: number
}

interface ChildrenItem {
  informationId?: number
  toolInformationName: String
  toolInformationType?: number
  toolBrandId?: number
  toolCategoryValue: string
  spec: string
  code: string
  price?: number
  storeLocationId?: number
  location: string
  isFull: boolean
  amount?: number
  rule: string
  trayList: TrayItem[]
}
const isExpand = ref(true)

// form 验证
const formRules = reactive({
  handover: [{ required: true, message: '对接人员必须填写!', trigger: 'blur' }],
  purchaseBatch: [{ required: true, message: '采购批次必须填写!', trigger: 'blur' }],
  childrens: [{ required: true, message: '未选择刀具信息!', trigger: 'change' }]
})

const numSum = () => {
  const list = formData.value.childrens[currentCIndex.value].trayList
  return list.reduce((accumulator, currentValue) => {
    console.log(currentValue)
    const trayInOutNum = currentValue.trayName !== '' ? currentValue.trayInOutNum : 0
    return accumulator + trayInOutNum
  }, 0)
}

const currentCIndex = ref()
const currentTIndex = ref()
const validatorAddNum = (_rule, value, callback) => {
  const position = _rule.field.split('.')
  currentCIndex.value = position[1]
  currentTIndex.value = position[3]

  const nowNum =
    formData.value.childrens[currentCIndex.value]?.trayList[currentTIndex.value]?.trayNowNum
  const maxNum =
    formData.value.childrens[currentCIndex.value]?.trayList[currentTIndex.value]?.trayMaxNum

  if (value < 1) {
    callback(new Error('增加数量不得少于1！'))
  } else {
    if (nowNum !== undefined && maxNum !== undefined) {
      console.log(nowNum, value, maxNum)
      if (nowNum + value > maxNum) {
        formData.value.childrens[currentCIndex.value].amount = numSum() - value
        callback(new Error('当前数量大于托盘最大存放数量！'))
      } else {
        // 通过验证后，统计刀具数量
        formData.value.childrens[currentCIndex.value].amount = numSum()
        callback()
      }
    } else {
      callback()
    }
  }
}

// 显示当前弹窗
const open = async () => {
  resetForm()
  dialogVisible.value = true
}
// 向外暴露open方法，方便父组件调用，用于打开弹窗
defineExpose({ open })

// 打开 选择刀具信息
const toolInfoForm = ref()
const openToolInfoDialog = () => {
  toolInfoForm.value.open()
}

// 选中的刀具信息
const selectToolInfo = (json: any) => {
  console.log(json)
  json.selection.map((item) => {
    const { id, name, toolBrandId, toolCategoryValue, spec, type, code } = item
    const obj = formData.value.childrens.find((c) => c.informationId === id)
    if (obj === undefined)
      formData.value.childrens.push({
        informationId: id,
        toolInformationName: name,
        toolInformationType: type,
        toolBrandId,
        toolCategoryValue,
        spec,
        code,
        price: undefined,
        storeLocationId: undefined,
        location: '',
        isFull: false,
        amount: undefined,
        rule: '',
        trayList: [
          {
            id: undefined,
            trayName: '',
            trayTypeName: '',
            trayTypeId: undefined,
            trayNumber: '',
            trayNowNum: undefined,
            trayMaxNum: undefined,
            trayInOutNum: 1
          }
        ]
      })
  })
}

// 打开 选择托盘信息

const trayDialogRef = ref()
const openTrayInfoDialog = (code, pIndex: number, index: number) => {
  // 存储当前托盘的位置
  currentCIndex.value = pIndex
  currentTIndex.value = index

  trayDialogRef.value.open(code)
}

// 选中的托盘信息
const selectTrayInfo = (json: any) => {
  const trayList = formData.value.childrens[currentCIndex.value].trayList

  json.selection.forEach((item) => {
    if (trayList.find((ele) => ele.id === item.id) === undefined) {
      formData.value.childrens[currentCIndex.value].trayList[currentTIndex.value] = {
        ...item,
        trayInOutNum: 1
      }
      formData.value.childrens[currentCIndex.value].amount = numSum()
    } else {
      ElNotification({
        title: '错误',
        message: '当前托盘已存在，请重新选择！',
        type: 'error'
      })
    }
  })
}

// 选中的货位
const positionForm = ref()
const currentIndex = ref()
const openPositionDialog = (index: number) => {
  currentIndex.value = index
  positionForm.value.open()
}
// 选中的仓位信息
const selectPositionInfo = (json: any) => {
  formData.value.childrens[currentIndex.value].location = `${json.layerNum}-${json.locationNum}`
  formData.value.childrens[currentIndex.value].storeLocationId = json.id
  console.log(formData)
  console.log(json)
}

// 删除选中数据
const handleDelete = (index: number, row: any) => {
  console.log(index, row)
  formData.value.childrens.splice(index, 1)
}

const handleDeleteTray = (pI: number, i: number) => {
  formData.value.childrens[pI].trayList.splice(i, 1)
  formData.value.childrens[pI].amount = numSum()
}

// 添加托盘
const addTray = (i: number) => {
  formData.value.childrens[i].trayList.push({
    id: undefined,
    trayName: '',
    trayTypeName: '',
    trayTypeId: undefined,
    trayNumber: '',
    trayNowNum: undefined,
    trayMaxNum: undefined,
    trayInOutNum: 1
  })
}

// 提交表单
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const valid = await formEl.validate()
  if (!valid) return
  try {
    console.log(formData)
    await createNewGoods(formData.value)
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

// 重置表单内容
const resetForm = () => {
  formData.value = {
    childrens: [],
    handover: '',
    purchaseBatch: ''
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

const treeType = reactive<any>({
  type: 1
})
// 向后代组件提供数据, 只要是后代都能接收
provide('treeType', treeType)
</script>
<style>
.locator .el-input__inner {
  background: #f0f0f0 !important;
  /* 修改背景色 */
}
</style>