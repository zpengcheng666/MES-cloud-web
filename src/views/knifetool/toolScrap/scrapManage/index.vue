<!--
 * @Author: hyj
 * @Description: 报废管理
 * @Date: 2024-06-17 16:04:35
 * @LastEditTime: 2024-08-06 14:25:26
 * @FilePath: /cimp-tms-web/src/views/toolScrap/scrapManage/index.vue
-->
<template>
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item prop="toolCategoryId">
        <formTreeSelect ref="treeValue" @tree-value="setFormTreeValue" />
      </el-form-item>

      <el-form-item prop="spec">
        <el-input v-model="queryParams.spec" placeholder="通用规格" class="!w-240px" />
      </el-form-item>

      <el-form-item prop="boxCode">
        <el-input v-model="queryParams.boxCode" placeholder="刀盒码" class="!w-240px" />
      </el-form-item>

      <el-form-item prop="scarpTypeId">
        <el-select v-model="queryParams.scarpTypeId" placeholder="请选择报废类型" class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.TOOL_SCRAP_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"> <Icon icon="ep:search" />查询 </el-button>
        <el-button @click="resetQuery"> <Icon icon="ep:refresh" />重置 </el-button>
        <el-button plain type="primary" @click="openForm('create')">
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <ContentWrap>
    <el-table :data="list" style="width: 100%">
      <template v-for="column in columns" :key="column.dataIndex">
        <el-table-column
          :prop="column.dataIndex"
          :label="column.title"
          align="center"
          v-if="column.dataIndex === 'createTime'"
        >
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="column.dataIndex === 'scarpTypeId'"
          :prop="column.dataIndex"
          :label="column.title"
          align="center"
        >
          <template #default="{ row }">
            <dict-tag :type="DICT_TYPE.TOOL_SCRAP_TYPE" :value="row.scarpTypeId" />
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="column.dataIndex === 'approveStatus'"
          :prop="column.dataIndex"
          :label="column.title"
          align="center"
        >
          <template #default="{ row }">
            <dict-tag :type="DICT_TYPE.APPROVE_STATUS" :value="row.approveStatus" />
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :prop="column.dataIndex"
          :label="column.title"
          :align="column.align"
          :width="column.width"
        />
      </template>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button
            v-if="row.approveStatus == 1"
            link
            type="primary"
            @click="handleUndo(row)"
            v-hasPermi="['']"
          >
            撤回
          </el-button>
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

  <createForm ref="createRef" @success="getList" />

  <el-dialog v-model="dialogVisible" title="Tips" width="500" :before-close="handleUndo">
    <span>This is a message</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { getScrapList, updateStatus } from '@/api/knifetool/toolScrap/scrapManage'
import formTreeSelect from '@/components/store/formTreeSelect.vue'
import createForm from './createForm.vue'
import { formatDate } from '@/utils/formatTime'
import { ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'

const loading = ref(true) // 列表的加载中
const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive<{
  toolCategoryId?: number
  spec: string
  boxCode: string
  scarpTypeId?: number
  pageNo: number
  pageSize: number
}>({
  toolCategoryId: undefined,
  spec: '',
  boxCode: '',
  scarpTypeId: undefined,
  pageNo: 1,
  pageSize: 10
})

const columns = [
  { title: '刀具物码', dataIndex: 'objectCode', align: 'center' },
  { title: '刀盒码', dataIndex: 'boxCode', align: 'center' },
  { title: '通用规格', dataIndex: 'spec', align: 'center' },
  { title: '刀具分类', dataIndex: 'toolCategoryValue', align: 'center' },
  {
    title: '刀具品牌',
    dataIndex: 'toolBrandId',
    align: 'center'
  },
  {
    title: '报废类型',
    dataIndex: 'scarpTypeId',
    align: 'center'
  },
  {
    dataIndex: 'approveStatus',
    title: '审核状态',
    width: '100px',
    align: 'center'
  },
  { title: '登记时间', dataIndex: 'createTime', align: 'center' },
  { title: '登记人', dataIndex: 'creator', align: 'center' }
]

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getScrapList(queryParams)
    console.log(data)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

// 设置选中的刀具分类
const treeValue = ref()
const setFormTreeValue = (val) => {
  console.log(val)
  queryParams.toolCategoryId = val
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  // 清空刀具分类的值
  treeValue.value.toolCategoryValue = undefined
  handleQuery()
}

/** 添加/修改操作 */
const createRef = ref()
const openForm = (type: string, id?: number) => {
  createRef.value.open(type, id)
}

// 撤销
const dialogVisible = ref(false)
const handleUndo = (row) => {
  ElMessageBox.confirm('是否确认撤销该记录？?')
    .then(async () => {
      const data = await updateStatus({
        id: row.id,
        approveStatus: 3
      })

      if (data) {
        ElMessage({
          message: '撤销成功',
          type: 'success'
        })
      } else {
        ElMessage({
          message: data.msg,
          type: 'error'
        })
      }
      getList()
    })
    .catch(() => {
      // catch error
    })
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped></style>
