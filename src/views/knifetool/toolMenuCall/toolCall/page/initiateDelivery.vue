<!--
 * @Author: hyj
 * @Description: 发起配送
 * @Date: 2024-07-24 09:29:49
 * @LastEditTime: 2024-07-25 11:07:45
 * @FilePath: /cimp-tms-web/src/views/toolMenuCall/toolCall/page/initiateDelivery.vue
-->
<template>
  <ContentWrap>
    <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item prop="workOrderCode">
        <el-input
          v-model="queryParams.workOrderCode"
          placeholder="工单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"> <Icon icon="ep:search" />查询 </el-button>
        <el-button @click="resetQuery"> <Icon icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <ContentWrap>
    <el-table :data="list" style="width: 100%">
      <el-table-column label="工单号" align="center" prop="workOrderCode" />
      <el-table-column label="最晚配送日期" align="center" prop="paringDeadline">
        <template #default="{ row }">
          {{ formatDate(row.paringDeadline) }}
        </template>
      </el-table-column>
      />
      <el-table-column label="刀组编码" align="center" prop="toolGroupCode" />
      <el-table-column label="计划需求数量" align="center" prop="paringNum" />
      <el-table-column label="实际需求数量" align="center" prop="actualQuantity">
        <template #default="{ row }">
          <el-input
            type="number"
            v-if="row.paringPlanUrgent !== 0"
            style="margin: -5px 0; width: 100%"
            :min="recordQuantity"
            v-model="row.actualQuantity"
          />
          <template v-else>
            {{ row.actualQuantity }}
          </template>
        </template>
      </el-table-column>
      />
      <el-table-column label="已完成配刀数量" align="center" prop="matchingQuantity" />
      <el-table-column label="已呼叫刀具数量" align="center" prop="callsQuantity" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <span v-if="row.paringPlanUrgent !== 0">
            <el-popconfirm
              title="确认发送紧急呼叫？"
              @confirm="() => onUrgentCallToolSave(row)"
              @cancel="onUrgentCallToolClose(row)"
            >
              <template #reference>
                <el-button link type="primary" :icon="Check" />
              </template>
            </el-popconfirm>
            <el-button
              link
              type="primary"
              :icon="Close"
              @click="() => onUrgentCallToolClose(row)"
            />
          </span>
          <span v-else>
            <el-button
              link
              type="primary"
              :disabled="tableDisabled"
              v-if="row.matchingQuantity > row.callsQuantity"
              @click="() => openForm(row)"
            >
              呼叫刀具
            </el-button>
            <el-button
              link
              type="primary"
              :disabled="tableDisabled"
              @click="() => onUrgentCallToolTable(row)"
            >
              紧急呼叫
            </el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
  <callToolForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getDeliverylist, urgentCallTool } from '@/api/knifetool/toolMenuCall/toolCall'
import { Check, Close } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/formatTime'
import callToolForm from './callToolForm.vue'
import { ElNotification } from 'element-plus'

const loading = ref(true) // 列表的加载中
const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({ workOrderCode: '', pageNo: 1, pageSize: 10 })

const tableDisabled = ref(false)

const getList = async () => {
  loading.value = true
  try {
    const data = await getDeliverylist(queryParams)
    console.log(data)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, row?: any) => {
  formRef.value.open(type, row)
}

const recordQuantity = ref(0)
const onUrgentCallToolTable = (row) => {
  row.paringPlanUrgent = 1
  tableDisabled.value = true
  recordQuantity.value = row.actualQuantity
}

/**
 * 发起配送中紧急呼叫回调
 */

// const afterUrgentCallToolOrg = (res) => {
//   console.log(res)
//   // this.modalCallLoading = false
//   // if (res.data.code === 0) {
//   //   //成功
//   //   this.getUTableData() //紧急呼叫
//   //   this.getPTableData() //发起配送
//   //   this.$notification.success({
//   //     message: '成功!',
//   //     description: '紧急呼叫成功！'
//   //   })
//   // } else {
//   //   this.$notification.error({
//   //     message: '失败!',
//   //     description: res.data.msg
//   //   })
//   // }
// }

/**
 * 保存发起配送中紧急呼叫行内编辑
 */
const emit = defineEmits(['initList']) // 定义 success 事件，用于操作成功后的回调
const urgentCallVisible = ref(false)
const onUrgentCallToolSave = async (row) => {
  console.log(row)
  let postForm = {
    id: row.id,
    workNo: row.workOrderCode,
    groupCode: row.toolGroupCode,
    planQuantity: row.paringNum,
    actualQuantity: row.actualQuantity,
    lackQuantity: row.actualQuantity - recordQuantity.value,
    miniProcessingTime: row.minimumTime,
    latestDeliveryTime: row.paringDeadline,
    shippingAddress: row.equipmentName
  }

  console.log(postForm)

  try {
    const res = await urgentCallTool(postForm)
    console.log(res)
    getList()
    emit('initList')
    ElNotification({
      title: '成功!',
      message: '紧急呼叫成功！',
      type: 'success'
    })
  } catch {}

  row.paringPlanUrgent = 0
  urgentCallVisible.value = false
  tableDisabled.value = false
}

/**
 * 取消发起配送中紧急呼叫行内编辑
 */
const onUrgentCallToolClose = (row) => {
  urgentCallVisible.value = false
  row.paringPlanUrgent = 0
  tableDisabled.value = false
  row.actualQuantity = recordQuantity.value
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped></style>
