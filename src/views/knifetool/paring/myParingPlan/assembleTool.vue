<template>
  <Dialog v-model="dialogVisible" destroy-on-close :fullscreen="true" title="配刀" width="80%">
        <el-descriptions direction="vertical" border :column="4" title="配刀">
          <el-descriptions-item label="最短加工时长（分钟）">{{
            rowData.minimumTime
          }}</el-descriptions-item>
          <el-descriptions-item label="需求数量">{{ rowData.paringNum }}</el-descriptions-item>
          <el-descriptions-item label="已配刀数量">{{ rowData.accomplish }}</el-descriptions-item>
          <el-descriptions-item label="剩余配刀数量">{{
            rowData.paringNum - rowData.accomplish
          }}</el-descriptions-item>
        </el-descriptions>

        <el-card :bodyStyle="{ padding: 0 }" shadow="never" class="mt-30px">
          <template #header>
            <strong>{{
             '刀具装配指导'
            }}</strong>
          </template>
          <el-table :data="matchTableData" class="mt-20px mb-20px"  row-key="key" border  default-expand-all>
            <el-table-column prop="hiltCode" label="刀具类码" align="center" />

            <el-table-column prop="code" label="物码" align="center" />
            <el-table-column prop="toolCategoryValue" label="刀具分类" align="center" />
            <el-table-column prop="toolRatedLife" label="刀具额定寿命" align="center" />
            <el-table-column prop="spec" label="通用规格" align="center" />
            <el-table-column prop="remainingNum" label="剩余寿命" align="center" />
            <el-table-column label="操作" align="center">
              <template #default="{ row }">
                <el-button  size="small" type="danger"
                 @click="selectTool(row.hiltCode)">选刀</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card :bodyStyle="{ padding: 0 }" shadow="never" class="mt-30px">
          <template #header>
            <strong style="float: left">{{
             '刀具装配列表'
            }}</strong>
            <div style="text-align: right">
              <el-button  size="small" @click="openToolVisible(0)">对刀</el-button>
              <el-button  size="small"
                @click="openDynamicVisible">动平衡</el-button>
              <!-- <el-button size="small" @click="openToolVisible(index)">对刀</el-button> -->
              <!-- <el-button size="small" @click="openDynamicVisible(index)">动平衡</el-button> -->
            </div>
          </template>
          <el-table :data="assembleTableData" class="mt-20px mb-20px"  row-key="key" border  default-expand-all>
            <el-table-column label="物料编号" align="center" prop="materialNumber" />
            <el-table-column label="物料条码" align="center" prop="barCode" />
            <el-table-column label="库存数量" align="center" prop="totality" />
            <el-table-column label="选择数量" align="center" prop="takeQuantity" />
            <el-table-column label="所在托盘" align="center" prop="storageCode" />
            <el-table-column label="所在库位" align="center" prop="rootLocationCode" />>
           
          </el-table>
          <template #footer>
            <div style="text-align: right">
              <el-button  type="primary" @click="submitParing">提交</el-button>
              <el-button @click="resetParing">关闭</el-button>
            </div>
          </template>
        </el-card>
  </Dialog>
  <SelectLocationDialog ref="selectLocationDialog" @selectPositionNode="selectPositionNode" />
  <dynamicForm ref="dynamicFormRef" />
  <toolForm ref="toolFormRef" />
  <toolStockInfo ref="toolStockInfoRef" @getTool="getTool" />
</template>
<script lang="ts" setup>
import {
  getGroupByCode,
  getParingAccomplishByPlanId,
  getToolDetail,
  getToolInformation,
  createToolParing,
  validateTrayCodeAndToolCode
} from '@/api/knifetool/paring/myParingPlan'
import { ElNotification } from 'element-plus'
import { getSimpleLocationList } from '@/api/knifetool/store/storeManage'
import dynamicForm from './dynamicForm.vue'
import toolForm from './toolForm.vue'
import toolStockInfo from './toolStockInfo.vue'
import SelectLocationDialog from "@/views/wms/dialog/SelectLocationDialog.vue";
import { MaterialStorageApi } from '@/api/wms/materialstorage'

const visibleButton = ref(false)
const dialogVisible = ref(false) // 弹窗的是否展示
const innerVisible = ref(false)
const form = ref({
  tmpGroupAddress: ''
})
const isShow = ref(false)
const titleAlert = ref()
const params = reactive({ groupCode: '', planId: '' })

const rowData = ref<any>({})
const data = ref<Tree[]>([]) // 树形结构
const tooltipData = ref<any>({})
let flogData = ref<any>([])
let matchTableData = ref<any>([])
const assembleTableData = ref<any>([])

/** 打开弹窗 */
const open = async (row: any) => {
  console.log(row)
  resetForm()
  dialogVisible.value = true
  rowData.value = row

  params.groupCode = row.toolGroupCode
  params.planId = row.id

  getTooltipData()
  getTree()
}
// 这在处理子组件时特别有用，允许父组件访问子组件的特定属性或方法
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const toolStockInfoRef = ref()
const selectTool = (materialNumber: string) => {
  toolStockInfoRef.value.open(materialNumber)
}

const getTool = (data: any) => {
  assembleTableData.value.push(data)
}


// 打开储位选择弹框
const selectLocationDialog = ref()
const openLocationDialog = () => {
  selectLocationDialog.value.open()
}

const position = reactive({
  id: undefined,
  type: undefined,// 2 储位 3 库位
  name: undefined,
})

// NULL全部  1 库位 2 储位
provide('treeType', 2)
const selectPositionNode = (node: any) => {
  const { id, type } = node
  getPostion(id,type)
}

const getPostion = async(id: number,type: number) => {
    const data = await MaterialStorageApi.getMaterialStorage(id)
    if(!data){message.error('请选择根节点！！！'); return}
    position.id = id
    position.type = 2
    position.name = data.storageName

    submitWarehouseLocation()
}

/** 获得仓库树 */
const getTree = async () => {
  const res = await getSimpleLocationList({ type: 1 })
  changeTreeData([res])
  data.value = res.children
  // 重新组合数据
  dealTreeData(data.value, null, '')
  const newArr = [...data.value]

  console.log(newArr)
}

const changeTreeData = (arr: any[]) => {
  arr.map((item: { childrens: any[]; children?: any[] }) => {
    const { children, childrens } = item
    item.children = childrens || children
    if (item.children) {
      changeTreeData(item.children)
    }
  })
}

/**
 * 重新组合树数据(根据需要来重组树结构中的属性字段)
 * @param {Array} arr 树形数组
 * @param {Object} parent 父级节点
 * @param {String} fullName 完整名称
 */
const dealTreeData = function (arr, parent, fullName) {
  // 便利树形数据
  arr.forEach((node) => {
    // 判断是否存在父级节点，拼接完整名称
    if (parent) {
      // 存在父级，将当前节点名称拼接到完整名称中
      node.fullName = fullName + '->' + node['name']
    } else {
      // 不存在父级，以当前节点名称作为根名称
      node.fullName = node['name']
    }

    // 获取节点子元素
    const children = node['children']
    if (children && children.length) {
      dealTreeData(children, node, node.fullName)
    }
  })
}

const selectNode = (node) => {
  console.log(node)
  form.value.tmpGroupAddress = node
  titleAlert.value = '您当前选择的库位为【' + node + '】'
  isShow.value = true
}

const closeDialog = () => {
  form.value.tmpGroupAddress = ''
  titleAlert.value = ''
  isShow.value = false
}

// 获取初始显示数据
const getTooltipData = async () => {
  const res = await getGroupByCode(params)
  console.log("222",res)
  // const { accessories, tool } = res

  // rightToolList.value = [
  //   {
  //     type: 2,
  //     code: res.hiltCode,
  //     name: res.hiltName,
  //     spec: res.hiltSpec,
  //     storeLocation: res.location,
  //   },
  //   ...tool, ...accessories]

  // console.log(rightToolList)

  tooltipData.value = res
  // tooltipData.value.equName = rowData.value.equName

  console.log("222",tooltipData.value)

  // // 构造右侧刀具列表数据
  let ParingAccomplish = await getParingAccomplishByPlanId({ toolParingPlanId: rowData.value.id })
  // 已配数量
  rowData.value.accomplish = ParingAccomplish

  // 根据剩余数量生成 盒码组（刀柄+刀具）
    let arr = [
      {
        id: '',
        quantity: '',
        boxCode: '',
        code: '',
        toolCategoryValue: '',
        spec: '',
        remainingNum: '',
        hiltCode: tooltipData.value.hiltCode, // 刀具类码
        type: 2 //标记是刀柄
      }
    ]
    for (let i = 0; i < tooltipData.value.tool.length; i++) {
      arr.push({
        id: '',
        quantity: '',
        boxCode: '',
        code: '',
        toolCategoryValue: '',
        spec: '',
        remainingNum: '',
        hiltCode: tooltipData.value.tool[i].code, // 刀具类码
        type: 1 //标记是刀具
      })
    }
    for (let i = 0; i < tooltipData.value.accessories.length; i++) {
      arr.push({
        id: '',
        quantity: '',
        boxCode: '',
        code: '',
        toolCategoryValue: '',
        spec: '',
        remainingNum: '',
        hiltCode: tooltipData.value.accessories[i].code, // 刀具类码
        type: 3 //标记是配件
      })
    }
    matchTableData.value = arr
}

// RFID填写后获取数据
const getToolDataByRfid = async (index, record) => {
  // 1、输入内容不得为空
  if (record.rfid === null || record.rfid.trim() === '') return

  // 2、判断多组中是否已经存在该RFID
  let i = 0
  matchTableData.value.map((ele) => {
    const same = ele.filter((item) => item.rfid === record.rfid)
    if (same.length > 0) {
      i += 1
    }
  })
  if (i !== 1) {
    ElNotification({ title: '警告', message: '同一RFID不可重复使用', type: 'warning' })
    record.boxCode = null
    return
  }
  // 3、判断当前组中是否有重复盒码
  const same = matchTableData.value[index].filter((item) => item.rfid === record.rfid)
  if (same.length > 1) {
    ElNotification({ title: '错误', message: '不能重复录入刀柄rfid！', type: 'error' })
    matchTableData.value[index].forEach((element) => {
      console.log(element)
      if (element._id === record._id) {
        element.id = ''
        element.rfid = ''
        element.quantity = ''
        element.code = ''
        element.toolCategoryValue = ''
        element.spec = ''
        element.remainingNum = ''
      }
    })
  }

  //4、根据 RFID 查询刀具明细
  let result = await getToolDetail({ rfid: record.rfid })
  if (result === null) {
    ElNotification({ title: '错误', message: '未查询到刀具信息！', type: 'error' })
    console.log(matchTableData.value[index])
    matchTableData.value[index].forEach((element) => {
      if (element._id === record._id) {
        element.id = ''
        element.rfid = ''
        element.quantity = ''
        element.code = ''
        element.toolCategoryValue = ''
        element.spec = ''
        element.remainingNum = ''
      }
    })
    return
  } else if (result != null && (result.currentStatus === 7 || result.currentStatus === 8)) {
    ElNotification({ title: '错误', message: '该rfid已进入报废流程,无法使用！', type: 'error' })
    matchTableData.value[index].forEach((element) => {
      if (element._id === record._id) {
        element.id = ''
        element.rfid = ''
        element.quantity = ''
        element.code = ''
        element.toolCategoryValue = ''
        element.spec = ''
        element.remainingNum = ''
      }
    })
    return
  }

  console.log(result)

  matchTableData.value[index].forEach((element) => {
    if (element._id === record._id) {
      if (element.hiltCode !== result.toolInformationCode) {
        console.log(element.hiltCode, result.toolInformationCode)
        ElNotification({ title: '错误', message: '所选数据类码与刀柄类码不匹配！', type: 'error' })
        matchTableData.value[index].forEach((element) => {
          if (element._id === record._id) {
            element.id = ''
            element.rfid = ''
            element.quantity = ''
            element.code = ''
            element.toolCategoryValue = ''
            element.spec = ''
            element.remainingNum = ''
            element.name = ''
          }
        })
        return
      }
      console.log(element)
      element.id = result.id
      element.quantity = 1
      element.code = result.objectCode
      element.toolCategoryValue = result.toolCategoryValue
      element.spec = result.spec
      element.remainingNum = result.remainingNum
      element.name = result.name
    }
  })
}

// 盒码填写后获取数据
const getToolData = async (index, record) => {

  // 1、输入内容不得为空
  if (record.boxCode === null || record.boxCode.trim() === '') return

  const isNext = await validateTrayCodeAndToolCode({
    boxCode: record.boxCode,
    informationCode: record.hiltCode || record.code,
    informationType: record.type
  })
  console.log(isNext)

  if (isNext === 0) {
    ElNotification({ title: '警告', message: '未找到当前托盘码', type: 'warning' })
    matchTableData.value[index].forEach((element) => {
      if (element._id === record._id) {
        element.id = ''
        element.boxCode = ''
        element.quantity = ''
        element.code = ''
        element.toolCategoryValue = ''
        element.spec = ''
        element.remainingNum = ''
        element.name = ''
        element.toolRatedLife = ''
      }
    })
    return
  }

  // 2、判断多组中是否已经存在该盒码
  // let i = 0
  // matchTableData.value.map((ele) => {
  //   const same = ele.filter((item) => item.boxCode === record.boxCode)
  //   if (same.length > 0) {
  //     i += 1
  //   }
  // })
  // if (i !== 1) {
  //   ElNotification({ title: '警告', message: '同一物码不可重复使用', type: 'warning' })
  //   record.boxCode = null
  //   return
  // }

  // 3、判断当前组中是否有重复盒码
  // const same = matchTableData.value[index].filter((item) => item.boxCode === record.boxCode)
  // if (same.length > 1) {
  //   ElNotification({ title: '错误', message: '不能重复录入刀盒码！', type: 'error' })
  //   matchTableData.value[index].forEach((element) => {
  //     if (element._id === record._id) {
  //       element.id = ''
  //       element.boxCode = ''
  //       element.quantity = ''
  //       element.code = ''
  //       element.toolCategoryValue = ''
  //       element.spec = ''
  //       element.remainingNum = ''
  //     }
  //   })
  // }

  //4、根据 boxCode 查询刀具明细
  let result = await getToolInformation({ toolCode: record.hiltCode || record.code, type: record.type })

  if (result === null) {
    ElNotification({ title: '错误', message: '未查询到刀具信息！', type: 'error' })
    matchTableData.value[index].forEach((element) => {
      if (element._id === record._id) {
        element.id = ''
        element.boxCode = ''
        element.quantity = ''
        element.code = ''
        element.toolCategoryValue = ''
        element.spec = ''
        element.remainingNum = ''
        element.name = ''
        element.toolRatedLife = ''
      }
    })
    return
  } else if (result != null && (result.currentStatus === 7 || result.currentStatus === 8)) {
    ElNotification({ title: '错误', message: '该物码已进入报废流程,无法使用！', type: 'error' })
    matchTableData.value[index].forEach((element) => {
      if (element._id === record._id) {
        element.id = ''
        element.boxCode = ''
        element.quantity = ''
        element.code = ''
        element.toolCategoryValue = ''
        element.spec = ''
        element.remainingNum = ''
        element.name = ''
        element.toolRatedLife = ''
      }
    })
    return
  }
  console.log(result)

  matchTableData.value[index].forEach((element) => {
    if (element._id === record._id) {
      if (element.hiltCode !== result.code) {
        console.log(element.hiltCode, result.code)
        if (result.toolDataType === 2) {
          ElNotification({ title: '错误', message: '所选数据类码与刀柄类码不匹配！', type: 'error' })
          matchTableData.value[index].forEach((element) => {
            if (element._id === record._id) {
              element.id = ''
              element.boxCode = ''
              element.quantity = ''
              element.code = ''
              element.toolCategoryValue = ''
              element.spec = ''
              element.remainingNum = ''
              element.name = ''
              element.toolRatedLife = ''
            }
          })
        } else if (result.toolDataType === 1) {
          ElNotification({ title: '错误', message: '所选数据类码与刀具类码不匹配！', type: 'error' })
          matchTableData.value[index].forEach((element) => {
            if (element._id === record._id) {
              element.id = ''
              element.boxCode = ''
              element.quantity = ''
              element.code = ''
              element.toolCategoryValue = ''
              element.spec = ''
              element.remainingNum = ''
              element.name = ''
              element.toolRatedLife = ''
            }
          })
        } else if (result.toolDataType === 3) {
          ElNotification({ title: '错误', message: '所选数据类码与配件类码不匹配！', type: 'error' })
          matchTableData.value[index].forEach((element) => {
            if (element._id === record._id) {
              element.id = ''
              element.boxCode = ''
              element.quantity = ''
              element.code = ''
              element.toolCategoryValue = ''
              element.spec = ''
              element.remainingNum = ''
              element.name = ''
              element.toolRatedLife = ''
            }
          })
        }
        return
      }
      console.log(element)
      element.id = result.id
      element.quantity = 1
      element.code = result.objectCode
      element.toolCategoryValue = result.toolCategoryValue
      element.spec = result.spec
      element.remainingNum = result.remainingNum
      element.name = result.name
      element.toolRatedLife = result.toolRatedLife
    }
  })

  // // 4、判断当前组中是否有重复盒码
  // const same = matchTableData.value[index].filter((item) => item.boxCode === record.boxCode)
  // if (same.length > 1) {
  //   ElNotification({ title: '错误', message: '不能重复录入刀盒码！', type: 'error' })
  //   matchTableData.value[index].forEach((element) => {
  //     if (element._id === record._id) {
  //       element.id = ''
  //       element.boxCode = ''
  //       element.quantity = ''
  //       element.code = ''
  //       element.toolCategoryValue = ''
  //       element.spec = ''
  //       element.remainingNum = ''
  //     }
  //   })
  // } else {
  //   matchTableData.value[index].forEach((element) => {
  //     if (element._id === record._id) {
  //       element.id = result.id
  //       element.quantity = 1
  //       element.code = result.objectCode
  //       element.toolCategoryValue = result.toolCategoryValue
  //       element.spec = result.spec
  //       element.remainingNum = result.remainingNum
  //     }
  //   })
  // }
}

// 重置
const resetRow = (index, row) => {
  console.log(index, row)
  const dataSource = [...matchTableData.value[index]]
  dataSource.map((item) => {
    console.log(item)
    if (item._id === row._id) {
      item.id = ''
      item.quantity = ''
      item.rfid = ''
      item.boxCode = ''
      item.code = ''
      item.toolCategoryValue = ''
      item.spec = ''
      item.remainingNum = ''
      item.name = ''
    }
  })
  console.log(matchTableData.value[index])
}

// 重置全部
const resetParing = () => {
  rowData.value = []
  assembleTableData.value = []
  dialogVisible.value = false
}

// 提交刀具
const tmpIndex = ref<any>(null)
const submitParing = async () => {
  matchTableData.value.forEach((item, index) => {
    let i
    for (i = 0; i < assembleTableData.value.length; i++) {
      if(assembleTableData.value[i].materialNumber === item.materialNumber){
        break
      }
    }
    // if(i === assembleTableData.value.length){
    //   ElMessage({
    //             type: 'error',
    //             message: `存在未装配的刀具部件，请严格按照装配指导进行装配！`,
    //         })
    //         return
    // }
    // 选择储位
    openLocationDialog()
  })
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitWarehouseLocation = async () => {
  rowData.value.toolParingData = matchTableData.value
  rowData.value.toolParingData.forEach((item) => {
    assembleTableData.value.forEach((ele) => {
      if(ele.materialNumber === item.hiltCode){
        item.code = ele.barCode
        item.quantity = ele.takeQuantity
      }
    })
  })

  rowData.value.tmpAddress = position.name

  console.log(rowData.value)
  let res = await createToolParing(rowData.value)
  console.log(res)
  resetParing()
}

/** 重置表单 */
const resetForm = () => {
  params.groupCode = ''
  params.planId = ''

  rowData.value = {}
  tooltipData.value = {}
  matchTableData.value = []

  visibleButton.value = false
}

// 对刀

const toolFormRef = ref()
const openToolVisible = (index) => {
  const toolParingData = [...matchTableData.value[index]]

  const total = toolParingData.filter(item => item.toolRatedLife).reduce((acc, val) => val.toolRatedLife && acc + val.toolRatedLife, 0);
  const currentItem = toolParingData.find(item => item.type === 2)

  toolFormRef.value.open({
    paringId: currentItem.paringId,
    code: currentItem.code,
    groupCode: tooltipData.value.groupCode,
    toolRatedLife: total
  })
}

//打开动平衡窗口
const dynamicFormRef = ref()
const openDynamicVisible = (index) => {
  //配刀数据
  const toolParingData = [...matchTableData.value[index]]
  toolParingData.map(async (item) => {
    if (item.type === 2) {
      dynamicFormRef.value.open({ paringId: item.paringId, code: item.code })
      return
    }
  })
}
</script>
