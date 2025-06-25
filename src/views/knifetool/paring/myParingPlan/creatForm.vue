<template>
  <Dialog v-model="dialogVisible" :fullscreen="true" title="配刀" width="80%">
    <el-row :gutter="20">
      <el-col :span="12">
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

        <el-card v-for="(item, index) in rowData.lack" :key="index" :bodyStyle="{ padding: 0 }" shadow="never"
          class="mt-30px">
          <template #header>
            <strong style="float: left">{{
              index === 0 ? '请先扫描刀柄码后，再进行其他部件的绑定。' : ''
            }}</strong>
            <div style="text-align: right">
              <el-button :disabled="flogData[index].flog" size="small" @click="openToolVisible(index)">对刀</el-button>
              <el-button :disabled="flogData[index].flog" size="small"
                @click="openDynamicVisible(index)">动平衡</el-button>
              <!-- <el-button size="small" @click="openToolVisible(index)">对刀</el-button> -->
              <!-- <el-button size="small" @click="openDynamicVisible(index)">动平衡</el-button> -->
            </div>
          </template>
          <el-table :data="matchTableData[index]" class="mt-20px mb-20px" row-key="key" border default-expand-all>
            <el-table-column prop="boxCode" label="RFID/盒码" align="center" width="240px">
              <template #default="{ row }">
                <el-input v-model="row.rfid" v-if="row.type === 2" @blur="getToolDataByRfid(index, row)"
                  placeholder="请输入刀柄RFID..." style="width: 90%" />
                <el-input v-model="row.boxCode" v-if="row.type === 1" @blur="getToolData(index, row)"
                  placeholder="请输入刀具盒码..." style="width: 90%" />
                <el-input v-model="row.boxCode" v-if="row.type === 3" @blur="getToolData(index, row)"
                  placeholder="请输入配件盒码..." style="width: 90%" />
              </template>
            </el-table-column>
            <el-table-column prop="hiltCode" label="刀具类码" align="center">
              <!-- <template #default="{ row }">
                <el-input placeholder="装配数量" v-model="row.quantity" type="number" />
              </template> -->
            </el-table-column>
            <el-table-column prop="quantity" label="需要数量" align="center">
              <template #default="{ row }">
                <el-input placeholder="装配数量" v-model="row.quantity" type="number" />
              </template>
            </el-table-column>
            <!-- <el-table-column prop="code" label="物码" align="center" /> -->
            <el-table-column prop="toolCategoryValue" label="刀具分类" align="center" />
            <el-table-column prop="toolRatedLife" label="刀具额定寿命" align="center" />
            <el-table-column prop="spec" label="通用规格" align="center" />
            <!-- <el-table-column prop="remainingNum" label="剩余寿命" align="center" /> -->
            <el-table-column label="操作" align="center">
              <template #default="{ row }">
                <el-button :disabled="!flogData[index].flog" size="small" type="danger"
                  @click="resetRow(index, row)">重置</el-button>
              </template>
            </el-table-column>
          </el-table>
          <template #footer>
            <div style="text-align: right">
              <el-button :disabled="!flogData[index].flog" type="primary" @click="submitParing(index)">提交</el-button>
              <el-button :disabled="!flogData[index].flog" @click="resetParing(index)">重置</el-button>
            </div>
          </template>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-descriptions title="刀组信息" border :column="2">
          <el-descriptions-item label="刀组编码">{{ tooltipData.groupCode }}</el-descriptions-item>
          <el-descriptions-item label="刀具直径">
            {{ tooltipData.toolDiameter }}
          </el-descriptions-item>
          <el-descriptions-item label="刀具R角">{{ tooltipData.toolBottomr }}</el-descriptions-item>
          <el-descriptions-item label="刀组总长">{{
            tooltipData.toolClassTotal
          }}</el-descriptions-item>
          <el-descriptions-item label="刀具悬长">{{
            tooltipData.toolHangLength
          }}</el-descriptions-item>

          <el-descriptions-item label="总长上限（mm）">
            {{ tooltipData.totalUpLimit }}
          </el-descriptions-item>

          <el-descriptions-item label="总长下限（mm）">
            {{ tooltipData.totalDownLimit }}
          </el-descriptions-item>
          <el-descriptions-item label="直径上限（mm）">
            {{ tooltipData.diameterUpLimit }}
          </el-descriptions-item>
          <el-descriptions-item label="直径下限（mm）">
            {{ tooltipData.diameterDownLimit }}
          </el-descriptions-item>
        </el-descriptions>
        <h3 class="mt-30px">刀具信息</h3>
        <toolStockInfo />
        <!-- <el-table :data="rightToolList" style="width: 100%" border :header-cell-style="{ background: '#f5f7fa' }">
          <el-table-column prop="type" label="类型" align="center">
            <template #default="scope">
              <span v-if="scope.row.type == '1'">刀具</span>
              <span v-if="scope.row.type == '2'">刀柄</span>
              <span v-if="scope.row.type == '3'">配件</span>
            </template>
          </el-table-column>

          <el-table-column prop="location" label="刀位" align="center">
            <template #header="scope">
              <span>
                刀位
                <el-tooltip :aa="scope" class="item" effect="dark" content="刀盘上的位置" placement="top-start">
                  <el-icon style="margin-left: -2px; ">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </span>
            </template>
            <template #default="scope">
              <span v-show="scope.row.type == '1'">{{ scope.row.location }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="类码" align="center" />
          <el-table-column prop="name" label="名称" align="center" />
          <el-table-column prop="spec" label="通用规格" align="center" />
          <el-table-column prop="storeLocation" label="推荐库房位置" align="center" />
        </el-table> -->
      </el-col>
    </el-row>
  </Dialog>
  <Dialog v-model="innerVisible" title="库位确认" width="500px" @close="closeDialog">
    <el-form :model="form">
      <el-form-item prop="tmpGroupAddress">
        <!-- <el-input v-model="form.tmpGroupAddress" placeholder="刀组存放库位" /> -->
        <el-alert v-if="isShow" :title="titleAlert" type="success" :closable="false" show-icon class="!mb-20px" />

        <el-tree-select v-model="form.tmpGroupAddress" filterable :data="data"
          :props="{ value: 'fullName', label: 'name', disabled: 'isfull' }" :render-after-expand="false"
          @change="selectNode" placeholder="请选择刀组存放库位" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="innerVisible = false">取消</el-button>
        <el-button type="primary" @click="submitWarehouseLocation"> 确认 </el-button>
      </div>
    </template>
  </Dialog>
  <dynamicForm ref="dynamicFormRef" />
  <toolForm ref="toolFormRef" />
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
import { QuestionFilled } from '@element-plus/icons-vue'
import dynamicForm from './dynamicForm.vue'
import toolForm from './toolForm.vue'
import toolStockInfo from './toolStockInfo.vue'

const visibleButton = ref(false)
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
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
const rightToolList = ref<any>([]) // 列表的数
let flogData = ref<any>([])
let matchTableData = ref<any>([])

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
  console.log(res)
  const { accessories, tool } = res

  rightToolList.value = [
    {
      type: 2,
      code: res.hiltCode,
      name: res.hiltName,
      spec: res.hiltSpec,
      storeLocation: res.location,
    },
    ...tool, ...accessories]

  console.log(rightToolList)

  tooltipData.value = res
  tooltipData.value.equName = rowData.value.equName

  console.log(tooltipData.value)

  // 构造右侧刀具列表数据


  let ParingAccomplish = await getParingAccomplishByPlanId({ toolParingPlanId: rowData.value.id })

  rowData.value.accomplish = ParingAccomplish
  let paringNum = rowData.value.paringNum - ParingAccomplish
  rowData.value.lack = paringNum

  // 根据剩余数量生成 盒码组（刀柄+刀具）
  for (let index = 0; index < paringNum; index++) {
    console.log()
    flogData.value.push({ id: index, flog: true })
    let arr = [
      {
        _id: index,
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
        _id: index + 999 + i,
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
        _id: index + 9999 + i,
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
    matchTableData.value.push(arr)
  }
  console.log(matchTableData)
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
const resetParing = (index) => {
  const dataSource = [...matchTableData.value[index]]
  console.log(dataSource)
  dataSource.map((item) => {
    item.id = ''
    item.quantity = ''
    item.rfid = ''
    item.boxCode = ''
    item.code = ''
    item.toolCategoryValue = ''
    item.spec = ''
    item.remainingNum = ''
    item.name = ''
  })
}

// 提交刀具
const tmpIndex = ref<any>(null)
let sum = 0;
const submitParing = async (index) => {

  tmpIndex.value = index
  const toolParingData = [...matchTableData.value[index]]
  let numBoxCode = 0
  let numQuantity = 0
  toolParingData.map((item, index) => {
    console.log(item.rfid)
    console.log(item.boxCode)

    sum += item.toolRatedLife

    if (index === 0) {
      console.log(1)
      if (item.rfid === undefined || item.rfid === '') {
        numBoxCode++
      }
    } else {
      if (item.boxCode === undefined || item.boxCode === '') {
        numBoxCode++
      }
    }

    // if (item.boxCode === null || item.boxCode === '') {
    //   numBoxCode++
    // }

    if (item.quantity === null || item.quantity === '') {
      numQuantity++
    }
  })
  if (numBoxCode > 0) {
    ElNotification({ title: '错误', message: '请检查录入刀具数量！', type: 'error' })
    return
  }
  if (numQuantity > 0) {
    ElNotification({ title: '错误', message: '请检查配刀数量！', type: 'error' })
    return
  }

  innerVisible.value = true
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitWarehouseLocation = async () => {
  console.log(matchTableData.value[tmpIndex.value])
  const toolParingData = [...matchTableData.value[tmpIndex.value]]

  rowData.value.toolParingData = toolParingData
  rowData.value.tmpAddress = form.value.tmpGroupAddress



  console.log(rowData.value)
  let res = await createToolParing(rowData.value)
  console.log(res)
  if (res.id) {
    ElNotification({ title: '成功', message: '操作成功', type: 'success' })
    emit('success')
    toolParingData.map((item) => {
      item.paringId = res.id
    })

    flogData.value.forEach((element) => {
      if (element.id === tmpIndex.value) {
        element.flog = false
        return
      }
    })

    innerVisible.value = false
    isShow.value = false
  }
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

//   console.log(sum)
//   let ratedLife = 0;
//   toolParingData.map(async (item) => {
//     console.log(item)
//     if (item.toolRatedLife) ratedLife += item.toolRatedLife
//     if (item.type === 2) {
//       toolFormRef.value.open({
//         paringId: item.paringId,
//         code: item.code,
//         groupCode: tooltipData.value.groupCode,
//         toolRatedLife: ratedLife
//       })
//       return
//     }
//   })

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
