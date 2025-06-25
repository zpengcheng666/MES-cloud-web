<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-07-02 16:22:18
 * @LastEditTime: 2024-07-31 17:47:11
 * @FilePath: /cimp-tms-web/src/views/storeCheck/task/checkForm.vue
-->
<template>
  <Dialog v-model="dialogVisible" :fullscreen="true" :title="dialogTitle">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <WarehouseTree :storeInfo="{ treeId: formData.storeMenutreeId, planId: formData.id }"
          @handle-select="treeSelectValue" />
      </el-col>
      <el-col :span="20" :xs="24">
        <ContentWrap>
          <div v-if="show === -1">请在左侧选择菜单</div>

          <div v-if="show === 0">当前库位为空，暂未使用</div>

          <div v-if="show === 3">该库位 <strong>{{ currentNode.name }}</strong> 已盘点
          </div>

          <div v-if="show === 1">
            <el-row :gutter="10" v-for="(item, i) in locationList" :key="i">
              <el-col v-for="(c, ci) in item" :key="ci" :xs="4" :sm="3" :md="3" :lg="3" :xl="3">
                <div class="l-box">
                  <el-badge :value="c.recordCount || 0" :max="1000" class="item">
                    <el-button>{{
                      c.checkFlag === 0 || c.checkFlag === null
                        ? '待盘点'
                        : c.checkFlag === 2
                          ? '不做盘点'
                          : '已盘'
                    }}</el-button>
                  </el-badge>
                  <div class="statistic-title"> {{ c.name }}</div>
                </div>
              </el-col>
            </el-row>
            <el-button :disabled="currentSubmitState === 1" :type="currentSubmitState === 1 ? 'success' : 'primary'"
              @click="submitPlan" :icon="Check" size="large" class="ml-100px mt-30px mb-30px">
              {{ currentSubmitState === 1 ? '提交成功' : '提交盘点结果' }}
            </el-button>
          </div>

          <div class="locationItem" v-if="show === 2">
            <el-form :inline="true" :model="queryParams">
              <el-form-item>
                <el-button style="width: 240px">当前库位: {{ currentNode.name }}</el-button>
              </el-form-item>
              <el-form-item prop="tempCode">
                <el-input v-model="queryParams.tmpCode" placeholder="扫码输入后，请提交验证" clearable style="width: 300px" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" @click="addCheckCode()" style="width: 240px">提交验证</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="FolderChecked" @click="submitCheckItem()">保存该库位盘点信息</el-button>
              </el-form-item>
            </el-form>
            <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" default-expand-all>
              <el-table-column type="expand">
                <template #default="props">
                  <el-row :gutter="20">
                    <el-col style="text-align: center" :span="4" v-for="a in props.row.detailCode?.split(';')" :key="a">
                      <span style="color: #f56c6c">{{ a }}</span>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>

              <template v-for="column in columns" :key="column.dataIndex">
                <el-table-column v-if="column.dataIndex === 'realResult'" :prop="column.dataIndex" :label="column.title"
                  align="center">
                  <template #default="{ row }">
                    {{ row.realCounts - row.recordCounts }}
                  </template>
                </el-table-column>
                <el-table-column v-else :prop="column.dataIndex" :label="column.title" align="center" />
              </template>
            </el-table>
          </div>
        </ContentWrap>
      </el-col>
    </el-row>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import {
  getInfoByCode,
  createCheckPlanItem,
  submitCheckPlan,
  getSubmitFlag
} from '@/api/knifetool/storeCheck/task'
import { Search, FolderChecked, Check } from '@element-plus/icons-vue'
import WarehouseTree from './WarehouseTree.vue'
import { ElNotification } from 'element-plus'

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formData = ref<{
  storeMenutreeId?: number
  id?: number
  chargeUserId?: number
  chargeUserName: string
  planName: string
}>({
  storeMenutreeId: undefined,
  id: undefined,
  chargeUserId: undefined,
  chargeUserName: '',
  planName: ''
})
const queryParams = reactive({
  tmpCode: ''
})

// -1 - 初始状态， 0 - 库位为空， 1 - 显示货架， 2 - 显示库位
const show = ref(-1)

/** 打开弹窗 */
const open = async (row?: any) => {
  show.value = -1
  dialogVisible.value = true
  dialogTitle.value = '开始盘点'
  formData.value = row
  currentSubmitState.value = 0
}
// 这在处理子组件时特别有用，允许父组件访问子组件的特定属性或方法
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const locationList = ref<any>([])
const tableData = ref<any>([])
const currentNode = ref<any>(null)

const currentSubmitState = ref(1)
const treeSelectValue = async (res: any) => {
  console.log(res)

  // 获取当前货架的盘点状态
  const data = await getSubmitFlag({ id: formData.value.id, goodsId: res.currentNode.id })
  currentSubmitState.value = data
  console.log(data)

  locationList.value = []
  tableData.value = []
  currentNode.value = undefined
  if (res.currentNode.classification === 3) {
    locationList.value = res.data
    show.value = 1
    currentNode.value = res.currentNode
  } else {
    console.log(res.data)
    // 1 - 已盘点， 0||null - 未盘点
    if (res.data[0]?.itemFlag === 1) {
      show.value = 3
    } else {
      show.value = res.data.length > 0 ? 2 : 0
    }
    tableData.value = res.data
    currentNode.value = res.currentNode
  }
}

const columns = [
  { title: '刀具类码', dataIndex: 'toolCode', align: 'center' },
  { title: '刀具名称', dataIndex: 'toolName', align: 'center' },
  { title: '刀具规格', dataIndex: 'toolSpec', align: 'center' },
  {
    title: '账面数量',
    dataIndex: 'recordCounts',
    align: 'center'
  },
  { title: '实际数量', dataIndex: 'realCounts', align: 'center' },
  {
    title: '盈亏数量',
    align: 'center',
    dataIndex: 'realResult'
  }
]

const addCheckCode = async () => {
  //扫码提交验证   红色（类码不一致，或code;数量大于记录（record)数量） 绿色（类码一致，并且code;数量小于等于记录（record）数量）
  console.log(queryParams, currentNode.value)

  try {
    let res = await getInfoByCode({ code: queryParams.tmpCode, locationId: currentNode.value.id })

    console.log(res)

    const codes = tableData.value.map((item) => item.toolCode)
    const index = codes.indexOf(res.code)
    let detailCode = tableData.value[index].detailCode

    console.log(index)

    if (index !== -1) {
      tableData.value[index].detailCode = detailCode === null ? '' : detailCode

      if (tableData.value[index].detailCode.indexOf(queryParams.tmpCode) !== -1) {
        ElNotification({
          title: '警告',
          message: `该 ${queryParams.tmpCode} 物码已经扫过，请重新输入`,
          type: 'warning'
        })
        return
      }

      tableData.value[index].detailCode = tableData.value[index].detailCode.concat(
        queryParams.tmpCode,
        ';'
      )
      tableData.value[index].realCounts++
    }
  } catch {
    queryParams.tmpCode = ''
  }
}
const submitCheckItem = async () => {
  console.log(tableData.value)

  let res = await createCheckPlanItem(tableData.value)
  console.log(res)
  if (res) {
    ElNotification({
      title: '信息',
      message: `该 ${currentNode.value.name} 货位盘点信息保存成功，待所有货位保存后，请提交计划`,
      type: 'success'
    })
    show.value = 3
  }
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitPlan = async () => {
  console.log(formData.value)

  const param = {
    chargeUserId: formData.value.chargeUserId,
    planName: formData.value.planName,
    storeMenutreeId: formData.value.storeMenutreeId,
    id: formData.value.id,
    goodsId: currentNode.value.id
  }

  const allList = locationList.value.reduce(
    (accumulator: any, currentValue: any) => accumulator.concat(currentValue),
    []
  )

  const flagLength = allList.filter(
    (item) => item.checkFlag === 0 || item.checkFlag === null
  ).length

  if (flagLength > 0) {
    ElNotification({
      title: '信息',
      message: `存在未盘点货位，请确认后重新提交`,
      type: 'error'
    })
  } else {
    try {
      console.log(param)
      const res = await submitCheckPlan(param)
      currentSubmitState.value = 1
      console.log(res)
      emit('success')
    } catch { }
  }
}

// 父组件充当中间件，将选中树节点传给子级
const treeSelectNode = reactive<any>({
  name: '',
  id: '',
  classification: null
})
provide('treeSelectNode', treeSelectNode)
</script>
<style scoped lang="scss">
.l-box {
  background: #e6e8eb;
  margin: 10px 0;
  padding: 20px 0;
  text-align: center;
  cursor: pointer;

  .statistic-title {
    font-size: 16px;
    font-weight: bold;
    margin-top: 20px;
  }
}
</style>