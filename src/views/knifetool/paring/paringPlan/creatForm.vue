<template>
  <Dialog width="80%"  v-model="dialogVisible" :title="dialogTitle" :fullscreen="true">
    <selectKnifeGroupDialog ref="knifeGroupRef" @success="selectknifeGroupInfo" />

    <equipmentAssemblyDetails ref="detailRef" />

    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules">
      <el-row :gutter="20">
        <!-- <el-col :span="4">
          <el-form-item label="工单号" prop="workOrderCode">
            <el-input
              placeholder="工单号"
              v-model="formData.workOrderCode"
              @blur="queryWorkOrderCode()"
              :disabled="flog"
            />
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="最短加工时长(分钟)" prop="minimumTime">
            <el-input placeholder="最短加工时长(分钟)" v-model="formData.minimumTime" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="最晚配送时间" prop="paringDeadline">
            <el-date-picker v-model="formData.paringDeadline" type="datetime" placeholder="最晚装配时间"
              value-format="YYYY-MM-DD hh:mm:ss" :disabled="flog" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="工位" prop="stationName">
            <el-input v-model="formData.stationName" placeholder="工位名称" :disabled="flog" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="待持有者" prop="useName">
            <el-input v-model="formData.useName" placeholder="待持有者" :disabled="flog" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-card shadow="never">
        <span>加工零件适配的设备／产线：</span>
        <el-select v-model="selectValue" class="!w-250px" @change="onSelectChange" placeholder="选择设备/产线"
          :disabled="flog">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PARTS_ADAPTATION_PRODUCTION_LINE)" :key="dict.value"
            :label="dict.label" :value="{ value: dict.value, label: dict.label }" />
        </el-select>

        <el-form-item prop="equipmentGroup">
          <el-table :data="formData.equipmentGroup" class="mt-20px mb-20px" row-key="key" border default-expand-all>
            <el-table-column prop="equName" label="设备名称" align="center" />
            <el-table-column prop="paringNum" label="需求数量" align="center">
              <template #default="{ row }">
                <el-input v-if="row.paringNum !== '查询已装配数量'" placeholder="装配数量" v-model="row.paringNum" type="number" />
                <el-button v-if="row.paringNum === '查询已装配数量'" type="primary" link @click="openDetail(row)">
                  {{ row.paringNum }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template #default="{ row }">
                <el-button size="small" @click="openKnifeGroupDialog(row)"
                  v-if="row.paringNum === '查询已装配数量' && !flog">选择刀组</el-button>
                <el-button size="small" type="danger" @click="handleDelete(row)" v-if="!flog">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-card>
    </el-form>

    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import {
  checkWorkOrderCode,
  getEquParingByEquCode,
  createToolParingPlan,
  getPlanListByWork,
  updateToolParingPlan
} from '@/api/knifetool/paring/paringPlan'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { ElNotification } from 'element-plus'
import selectKnifeGroupDialog from './selectKnifeGroupDialog.vue'
import viewDetails from './viewDetails.vue'
import equipmentAssemblyDetails from './equipmentAssemblyDetails.vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题

const formRef = ref() // 表单 Ref
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

interface tableAddItem {
  key: number
  equipmentCode: number
  equName: string
  paringNum?: number | string
  action: string
  children?: any
}
const formData = ref<{
  // workOrderCode: string //工单编码
  minimumTime: string //最短加工时长
  paringDeadline: string //最晚装夹日期
  paringTaskState?: number //装夹状态
  equipmentGroup: tableAddItem[] //选择的刀组数据
  productionLineName: string
  stationName: string
  useName: string
}>({
  // workOrderCode: '', //工单编码
  minimumTime: '', //最短加工时长
  paringDeadline: '', //最晚装夹日期
  paringTaskState: 0, //装夹状态
  equipmentGroup: [], //选择的刀组数据
  productionLineName: '',
  stationName: '',
  useName: ''
})

const formRules = reactive({
  // workOrderCode: [
  //   {
  //     required: true,
  //     message: '工单号必须输入!',
  //     trigger: 'blur'
  //   }
  // ],
  minimumTime: [
    {
      required: true,
      message: '最短加工时长必须输入!',
      trigger: 'blur'
    }
  ],
  paringDeadline: [
    {
      required: true,
      message: '最晚配送时间必须输入!',
      trigger: 'blur'
    }
  ],
  equipmentGroup: [{ required: true, message: '请添加设备数据！', trigger: 'change' }]
})

const flog = ref(false)

/** 打开弹窗 */
const open = async (type: string, row?: any) => {
  console.log(row)
  resetForm()

  if (type === 'create') {
    dialogTitle.value = '新增'
  } else {
    dialogTitle.value = '修改'
    flog.value = true
    try {
      const data = await getPlanListByWork({ workOrderCode: row.workOrderCode })
      console.log(data)
      selectValue.value = data.productionLineName
      formData.value = data
    } finally {
      formLoading.value = false
    }
  }
  formType.value = type
  dialogVisible.value = true
}
// 这在处理子组件时特别有用，允许父组件访问子组件的特定属性或方法
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 查询工单号是否存在
// const queryWorkOrderCode = async () => {
//   const data = await checkWorkOrderCode({ workCode: formData.value.workOrderCode })
//   if (data > 0) {
//     ElNotification({
//       title: '错误',
//       message: '工单号已经存在！',
//       type: 'error'
//     })
//     formData.value.workOrderCode = ''
//   }
//   console.log(data)
// }

// 刀具信息组件
const currentNode = ref() //当前操作对象
const knifeGroupRef = ref()
const openKnifeGroupDialog = (row) => {
  console.log(row)
  currentNode.value = row
  knifeGroupRef.value.open()
}

// 选择设备
const selectValue = ref()
const onSelectChange = (value) => {
  console.log(value)

  var isHas = formData.value.equipmentGroup.filter((item) => item.equName === value.label)
  if (isHas.length > 0) {
    ElNotification({
      title: '错误',
      message: '设备已经存在！',
      type: 'error'
    })
    return
  }
  formData.value.equipmentGroup.push({
    key: value.value,
    equipmentCode: value.value,
    equName: value.label,
    paringNum: '查询已装配数量',
    action: '',
    children: []
  })
  formData.value.productionLineName = value.label
}

//查询已装夹数量
/** 详情操作 */
const detailRef = ref()
const openDetail = (data: any, title?: string) => {
  detailRef.value.open(data, title)
}

// 选中的刀组数据
const selectknifeGroupInfo = (val) => {
  console.log(val)

  const data = val.selection.map((item) => {
    return {
      key: Date.now(),
      parentKey: currentNode.value.key,
      equName: item.groupCode,
      paringNum: '',
      action: ''
    }
  })

  const keys = formData.value.equipmentGroup.map((i) => i.key)
  const index = keys.indexOf(currentNode.value.key)
  console.log(index)

  let suc = 0 //标记是否有添加成功的记录
  let flog = 0 //标记刀组是否是重复添加
  if (formData.value.equipmentGroup[index].children.length < 1) {
    formData.value.equipmentGroup[index].children = data
  } else {
    data.map((dI) => {
      const same = formData.value.equipmentGroup[index].children.filter(
        (i) => i.equName === dI.equName
      )
      console.log(same)
      if (same.length > 0) {
        flog++
      } else {
        suc++
        formData.value.equipmentGroup[index].children.push(dI)
      }
    })
    if (flog > 0) {
      ElNotification({
        title: '错误',
        message: `发现 ${flog} 条重复添加的刀组`,
        type: 'error'
      })
    }
  }
}

/** 删除按钮操作 */
const handleDelete = async (row) => {
  console.log(row)
  const keys = formData.value.equipmentGroup.map((i) => i.key)

  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    if (row.parentKey) {
      const pI = keys.indexOf(row.parentKey)
      const cKeys = formData.value.equipmentGroup[pI].children.map((c) => c.key)
      const cI = cKeys.indexOf(row.key)
      formData.value.equipmentGroup[pI].children.splice(cI, 1)
    } else {
      const index = keys.indexOf(row.key)
      formData.value.equipmentGroup.splice(index, 1)
    }
    message.success(t('common.delSuccess'))
    // 刷新列表
  } catch { }
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  let table = formData.value.equipmentGroup
  for (let i = 0; i < table.length; i++) {
    if (table[i].children === null || table[i].children.length === 0) {
      ElNotification({
        title: '错误',
        message: `设备下必须添加刀组！`,
        type: 'error'
      })
      return
    }
    for (let k = 0; k < table[i].children.length; k++) {
      if (table[i].children[k].paringNum == '') {
        ElNotification({
          title: '错误',
          message: `请检查装配需求数量！`,
          type: 'error'
        })
        return
      }
    }
  }

  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return

  // 提交请求
  formLoading.value = true
  try {
    console.log(formData.value)
    const res = await createToolParingPlan(formData.value)
    console.log(res)
    if (formType.value === 'create') {
      // const res = await createToolParingPlan(formData.value)
      // console.log(res)
      message.success(t('common.createSuccess'))
    } else {
      // const res = await updateToolParingPlan(formData.value)
      // console.log(res)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    workOrderCode: '', //工单编码
    minimumTime: '', //最短加工时长
    paringDeadline: '', //最晚装夹日期
    paringTaskState: 0, //装夹状态
    equipmentGroup: [], //选择的刀组数据
    productionLineName: '',
    stationName: '',
    useName: ''
  }
  flog.value = false
  selectValue.value = ''
  formData.value.equipmentGroup = []
  formRef.value?.resetFields()
}
</script>
