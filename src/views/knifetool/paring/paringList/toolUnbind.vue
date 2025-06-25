<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-17 17:24:24
 * @LastEditTime: 2024-07-12 17:07:25
 * @FilePath: /cimp-tms-web/src/views/paring/paringList/toolUnbind.vue
-->
<template>
  <Dialog v-model="dialogVisible" :max-height="600" :scroll="true" title="装配解绑" width="1200">
    <selectTrayDialog ref="trayDialogRef" @success="selectTrayInfo" />
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules">
      <el-form-item prop="trayList">
        <el-table :data="formData.trayList" style="width: 100%; margin-top: 20px" height="500">
          <template v-for="column in columns" :key="column.dataIndex">
            <el-table-column :prop="column.dataIndex" :label="column.title" align="center"
              v-if="column.dataIndex === 'createTime'">
              <template #default="{ row }">
                {{ formatDate(row.createTime) }}
              </template>
            </el-table-column>
            <el-table-column :prop="column.dataIndex" :label="column.title" align="center"
              v-else-if="column.dataIndex === 'type'">
              <template #default="{ row }">
                <span v-if="row.type === 1">刀柄</span>
                <span v-if="row.type === 2">刀具</span>
                <span v-if="row.type === 3">配件</span>
              </template>
            </el-table-column>
            <el-table-column :prop="column.dataIndex" :label="column.title" align="center"
              v-else-if="column.dataIndex === 'state'">
              <template #default="{ row }">
                <span v-if="row.state === 0">解绑</span>
                <span v-if="row.state === 1">绑定</span>
              </template>
            </el-table-column>
            <el-table-column v-else :prop="column.dataIndex" :label="column.title" align="center" />
          </template>
          <el-table-column label="选择托盘" align="center" fixed="right" width="200px">
            <!-- <template #default="{ row }"> -->
            <!-- <el-button size="small" type="danger" @click="openBoxCode(row)"
            v-if="row.type === 1 && row.state === 1">解绑</el-button> -->
            <!-- </template> -->
            <template #default="{ row, $index }">
              <el-form-item style="margin: 18px 0" :prop="'trayList.' + $index + '.trayName'" :rules="[
                {
                  required: true,
                  message: '请选择托盘',
                  trigger: 'change',
                  whitespace: false
                }
              ]">
                <el-input v-model="row.trayName" readonly>
                  <template #append>
                    <el-button :icon="Search" @click="openTrayInfoDialog(row, $index)" />
                  </template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>

      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="danger" @click="submitForm()">解 绑</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { unbindSubmit, getPartsByParingId } from '@/api/knifetool/paring/paringList'
import { formatDate } from '@/utils/formatTime'
import { ElNotification } from 'element-plus'
import selectTrayDialog from '../../store/newStore/selectTrayDialog.vue'
import { Search } from '@element-plus/icons-vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中

const unbindVisible = ref(false)
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: '', //配件表id
  paringId: '',
  code: '', //配件物码
  boxCode: '', //解绑盒码
  rfid: '', //解绑盒码
  trayList: [{}]
})
const formRules = reactive({
  rfid: [
    {
      required: true,
      message: '刀柄RFID必须输入!',
      trigger: 'blur'
    }
  ],
  trayList: [{ required: true, message: '未选择托盘信息!', trigger: 'change' }]
})

// form 验证
// const formTable = reactive({
//   childrens: [{ required: true, message: '未选择刀具信息!', trigger: 'change' }]
// })

const trayList = ref([]) // 列表的数
const columns = [
  //数据列表
  { title: 'RFID', dataIndex: 'code' },
  { title: '刀具类码', dataIndex: 'hiltCode' },
  { title: '刀具名称', dataIndex: 'hiltName' },
  { title: '刀具分类名称', dataIndex: 'hiltTypeValue' },
  { title: '所属类型', dataIndex: 'type' },
  { title: '刀具状态', dataIndex: 'state' },
  { title: '数量', dataIndex: 'quantity' },
  { title: '装配时间', dataIndex: 'createTime' },
  { title: '装配人员', dataIndex: 'creator' }
]

const getList = async () => {
  try {
    let data = await getPartsByParingId({ paringId: currentRow.value.id })
    console.log(data)
    formData.value.trayList = data
  } finally {
    detailLoading.value = false
  }
}

/** 打开弹窗 */
const currentRow = ref()
const open = async (row: any) => {
  console.log(row)
  currentRow.value = row
  getList()
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// const openBoxCode = async (row) => {
//   console.log(row)

//   formData.value.id = row.id
//   formData.value.paringId = row.paringId
//   formData.value.code = row.code
//   formData.value.boxCode = row.code
//   formData.value.rfid = row.code
//   // //根据装夹记录id查询配件列表
//   unbindVisible.value = true
// }
// 打开 选择托盘信息
let currentIndex = ref(0)
const trayDialogRef = ref()
const openTrayInfoDialog = (row, index) => {
  currentIndex.value = index
  trayDialogRef.value.open(row.code)
}

// 选中的托盘信息
const selectTrayInfo = (json: any) => {
  console.log(json)
  // const trayList = formData.value.list
  const currentItem = formData.value.trayList[currentIndex.value];

  console.log(currentItem)

  json.selection.forEach((item) => {
    console.log(formData.value.trayList)

    formData.value.trayList[currentIndex.value] = {
      ...item,
      ...currentItem
    }
  })

  console.log(formData.value);
}

/** 提交表单 */
const formRef = ref()
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const row = formData.value.trayList[0];

  // const openBoxCode = async (row) => {
  //   console.log(row)

  formData.value.id = row.id
  formData.value.paringId = row.paringId
  formData.value.code = row.code
  formData.value.boxCode = row.code
  formData.value.rfid = row.code
  //   // //根据装夹记录id查询配件列表
  unbindVisible.value = true
  // }


  console.log(formData.value)
  console.log(111)
  // 提交请求
  formLoading.value = true
  try {
    console.log(formData.value)
    const res = await unbindSubmit(formData.value)
    console.log(res)
    if (res === -1) {
      ElNotification({
        title: '错误',
        message: '刀具明细中未找到此刀柄RFID!',
        type: 'error'
      })
    } else {
      message.success(t('common.updateSuccess'))
      dialogVisible.value = false
      getList()
      emit('success')
    }
  } finally {
    formLoading.value = false
  }
}
</script>
