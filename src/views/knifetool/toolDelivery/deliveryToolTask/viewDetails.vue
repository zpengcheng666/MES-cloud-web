<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-17 17:24:24
 * @LastEditTime: 2024-07-10 09:18:36
 * @FilePath: /cimp-tms-web/src/views/toolDelivery/deliveryToolTask/viewDetails.vue
-->
<template>
  <Dialog
    v-model="dialogVisible"
    :max-height="600"
    :scroll="true"
    title="配送刀具信息"
    width="1000"
  >
    <el-table :data="list" style="width: 100%" default-expand-all row-key="id" border>
      <template v-for="column in columns" :key="column.dataIndex">
        <el-table-column :prop="column.dataIndex" :label="column.title" align="center" />
      </template>
    </el-table>
  </Dialog>
</template>
<script lang="ts" setup>
import { getParingAndPlanByDeliveryId } from '@/api/knifetool/toolDelivery/deliveryToolTask'
import { ElNotification } from 'element-plus'

const detailObj: any = ref({})
const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中

const list = ref<any>([]) // 列表的数

const formData = ref({
  id: ''
})

const columns = [
  {
    title: '物码',
    dataIndex: 'code'
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '通用规格',
    dataIndex: 'spec'
  }
]

const modelTableDataKey = ref(0)
/** 查询列表 */
const getList = async () => {
  detailLoading.value = true
  try {
    const data = await getParingAndPlanByDeliveryId(formData.value)
    console.log(data)
    if (data === null || data.toolParingDtoList == null) {
      ElNotification({
        title: '警告',
        message: '未查询到相关配送数据',
        type: 'warning'
      })
    } else {
      dialogVisible.value = true
      let toolParingDtoList = data.toolParingDtoList
      for (let i = 0; i < toolParingDtoList.length; i++) {
        let toolList = toolParingDtoList[i]
        let tool: any = ref({})
        let children = reactive<object[]>([])
        if (Array.isArray(toolList)) {
          for (let n = 0; n < toolList.length; n++) {
            modelTableDataKey.value = modelTableDataKey.value + 1
            toolList[n].id = modelTableDataKey.value //前端有警告，ID不唯一,重新赋值
            if (toolList[n].type == 2) {
              //刀柄
              tool = toolList[n]
            }
            if (toolList[n].type == 1) {
              children.push(toolList[n])
            }
          }
        }
        tool.children = children
        list.value.push(tool)
      }
    }
  } finally {
    detailLoading.value = false
  }
}

/** 打开弹窗 */
const open = async (row: any) => {
  console.log(row)
  list.value = []
  try {
    detailLoading.value = true
    detailObj.value = row
    formData.value.id = row.id
    getList()
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
