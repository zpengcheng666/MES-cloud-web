<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-21 10:29:56
 * @LastEditTime: 2024-08-13 10:19:51
 * @FilePath: /cimp-tms-web/src/views/store/newStore/selectTrayDialog.vue
-->
<template>
  <Dialog v-model="innerVisible" title="刀具基本信息" width="80%">
    <ContentWrap>
      <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true">
        <!-- <el-form-item prop="trayNumber">
          <el-input
            v-model="queryParams.trayNumber"
            placeholder="请输入托盘名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item> -->
        <el-form-item prop="trayTypeId">
          <el-select v-model="queryParams.trayTypeId" filterable placeholder="请选择托盘类型" style="width: 240px">
            <el-option v-for="item in typeSelect" :key="item.id" :label="item.trayTypeName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="trayStatus">
          <el-select v-model="queryParams.trayStatus" placeholder="请选择托盘状态" clearable class="!w-240px">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_STATUS_TYPE)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="createTime">
          <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
            start-placeholder="开始日期" end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-240px" />
        </el-form-item>

        <el-form-item>
          <el-button @click="handleQuery">
            <Icon icon="ep:search" />查询
          </el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" />重置
          </el-button>
        </el-form-item>
      </el-form>

      <div   class="mt-20px">
        <div class="el-alert el-alert--success is-light" style="display: flex; justify-content: space-between">
          <span style="display: flex; align-items: center">
            <Icon icon="ep:info-filled" style="margin-right: 10px" /> 已选择
            {{ multipleSelection.length }} 项
          </span>
          <el-button @click="toggleSelection()">清除</el-button>
        </div>

        <el-table ref="multipleTableRef" :data="list" style="width: 100%" class="mt-20px" highlight-current-row
          @selection-change="handleSelectionChange" header-cell-class-name="all-disabled">
          <el-table-column type="selection" width="30" :selectable="selectable" />
          <el-table-column label="托盘名称" align="center" prop="trayName" />
          <el-table-column label="托盘库内位置" align="center" prop="trayLocationName" />
          <el-table-column label="托盘类型" align="center" prop="trayTypeName" />
          <el-table-column label="托盘状态" align="center" prop="trayStatus">
            <template #default="{ row }">
              <dict-tag :type="DICT_TYPE.KNIFETOOL_STATUS_TYPE" :value="row.trayStatus" />
            </template>
          </el-table-column>
          <el-table-column label="托盘现有的刀具数量" align="center" prop="trayNowNum" />
          <el-table-column label="托盘最大存放数量" align="center" prop="trayMaxNum" />
          <el-table-column label="创建人" align="center" prop="creator" />
          <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180px" />
        </el-table>
        <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
          @pagination="getList" class="mt-20px" />
      </div>
    </ContentWrap>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="innerVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import * as ToolTrayApi from '@/api/knifetool/toolDelivery/tray'
import * as ToolTrayTypeApi from '@/api/knifetool/toolDelivery/trayType'

import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { ElTable } from 'element-plus'

const innerVisible = ref(false)
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const loading = ref(true) // 列表的加载中

const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  trayNumber: undefined,
  trayLocation: undefined,
  trayTypeId: undefined,
  trayTypeName: undefined,
  trayStatus: undefined,
  createId: undefined,
  createTime: undefined,
  updateId: undefined,
  informationCode: undefined
})

const selectable = (row) => {
  return row.trayNowNum !== row.trayMaxNum && row.trayStatus !== 0
}

const typeSelect = ref<any>([])
/** 查询托盘类型列表 */
const getTypeList = async () => {
  loading.value = true
  try {
    typeSelect.value = await ToolTrayTypeApi.getToolTrayTypeList()
    console.log(typeSelect.value)
  } finally {
    loading.value = false
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ToolTrayApi.getToolTrayPage(queryParams)
    console.log(data)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

// 打开弹窗
const open = async (code) => {
  multipleSelection.value = []
  innerVisible.value = true
  console.log(code)
  queryParams.informationCode = code
  getList()
  getTypeList()
}
// 暴露 - 提供 open 方法，用于打开弹窗
defineExpose({ open })

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

interface User {
  id: number,
  trayName: string
  trayTypeName: string
  trayTypeId?: number
  trayNumber: string
  trayNowNum?: number
  trayMaxNum?: number
  trayInOutNum?: number
}
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<User[]>([])
const toggleSelection = (rows?: User[]) => {
  console.log(rows)

  if (rows) {
    rows.forEach((row) => {
      // TODO: improvement typing when refactor table
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      multipleTableRef.value!.toggleRowSelection(row, undefined)
    })
  } else {
    console.log(multipleTableRef.value!)
    multipleTableRef.value!.clearSelection()
  }
}
// 单选
const handleSelectionChange = (val) => {
  if (val.length > 1) {
    val.forEach((row, i) => {
      console.log(row, i)
      if (i !== val.length - 1) {
        // TODO: improvement typing when refactor table
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        multipleTableRef.value!.toggleRowSelection(row, undefined)
      }
    })
  } else {
    multipleSelection.value = val
  }
}

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!multipleSelection.value.length) return
  try {
    innerVisible.value = false

    // 发送选中的对象的事件
    emit('success', { selection: multipleSelection.value })
  } finally {
    formLoading.value = false
  }
}
</script>

<style scoped></style>
<style lang="scss" scoped>
::v-deep .all-disabled .el-checkbox__input .el-checkbox__inner {
  display: none;
}
</style>
