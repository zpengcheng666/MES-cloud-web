<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-21 10:29:56
 * @LastEditTime: 2024-08-09 17:31:01
 * @FilePath: /cimp-tms-web/src/views/store/newStore/selectToolDialog.vue
-->
<template>
  <el-dialog v-model="innerVisible" title="刀具基本信息" width="60%" >
    <ContentWrap>
      <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true">
        <el-form-item prop="toolBrandId">
          <el-select v-model="queryParams.toolBrandId" class="!w-210px" placeholder="请选择品牌">
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_BRAND)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="type">
          <el-select v-model="queryParams.type" class="!w-210px" placeholder="请选择类型">
            <el-option label="刀具" value="1" />
            <el-option label="刀柄" value="2" />
            <el-option label="配件" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item prop="toolCategoryId">
          <formTreeSelect ref="treeValue" @tree-value="setFormTreeValue" />
        </el-form-item>
        <el-form-item prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="刀具名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-210px"
          />
        </el-form-item>
        <el-form-item prop="spec">
          <el-input
            v-model="queryParams.spec"
            placeholder="刀具通用规格"
            clearable
            @keyup.enter="handleQuery"
            class="!w-210px"
          />
        </el-form-item>

        <el-form-item>
          <el-button @click="handleQuery"> <Icon icon="ep:search" />查询 </el-button>
          <el-button @click="resetQuery"> <Icon icon="ep:refresh" />重置 </el-button>
        </el-form-item>
      </el-form>

      <div  class="mt-20px">
        <div
          class="el-alert el-alert--success is-light"
          style="display: flex; justify-content: space-between"
        >
          <span style="display: flex; align-items: center">
            <Icon icon="ep:info-filled" style="margin-right: 10px" /> 已选择
            {{ multipleSelection.length }} 项
          </span>
          <el-button @click="toggleSelection()">清除</el-button>
        </div>

        <el-table
          ref="multipleTableRef"
          :data="list"
          style="width: 100%"
          class="mt-20px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="30" />

          <el-table-column label="刀具名称" prop="name" align="center" />
          <el-table-column label="刀具类码" prop="code" align="center" />
          <el-table-column label="类型" prop="type" align="center">
            <template #default="{ row }">
              <span>{{ row.type === 1 ? '刀具' : row.type === 2 ? '刀柄' : '配件' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="刀具分类" prop="toolCategoryValue" align="center" />
          <el-table-column label="刀具品牌" prop="toolBrandId" align="center">
            <template #default="{ row }">
              <dict-tag :type="DICT_TYPE.KNIFETOOL_BRAND" :value="row.toolBrandId" />
            </template>
          </el-table-column>
          <el-table-column label="通用规格" prop="spec" align="center" />
          <el-table-column label="刀具类型" prop="toolTypeId" align="center">
            <template #default="{ row }">
              <dict-tag
                v-if="row.type === 1"
                :type="DICT_TYPE.KNIFETOOL_CUTTER_TYPE"
                :value="row.toolTypeId"
              />
              <span v-else> </span>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
          class="mt-20px"
        />
      </div>
    </ContentWrap>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="innerVisible = false">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getBaseInfoList } from '@/api/knifetool/tool/info'
// import { getCategoryList } from '@/api/knifetool/category'
// import { handleTree } from '@/utils/tree'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { ElTable } from 'element-plus'

const innerVisible = ref(false)
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const loading = ref(true) // 列表的加载中

// const defaultProps = {
//   children: 'children',
//   label: 'name',
//   value: 'id',
//   isLeaf: 'leaf',
//   emitPath: false // 用于 cascader 组件：在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
// }
const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  pageNo: 1,
  pageSize: 5,
  name: '',
  type: '',
  code: '',
  spec: '',
  toolBrandId: '',
  toolCategoryId: ''
})

// 设置选中的刀具分类
const treeValue = ref()
const setFormTreeValue = (val) => {
  console.log(val)
  queryParams.toolCategoryId = val
}

// 打开弹窗
const open = async () => {
  multipleSelection.value = []
  innerVisible.value = true
  getList()
}
// 暴露 - 提供 open 方法，用于打开弹窗
defineExpose({ open })

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getBaseInfoList(queryParams)
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
  // 清空刀具分类的值
  treeValue.value.toolCategoryValue = ''
  handleQuery()
}

interface User {
  date: string
  name: string
  address: string
}
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<User[]>([])
const toggleSelection = (rows?: User[]) => {
  if (rows) {
    rows.forEach((row) => {
      // TODO: improvement typing when refactor table
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      multipleTableRef.value!.toggleRowSelection(row, undefined)
    })
  } else {
    multipleTableRef.value!.clearSelection()
  }
}
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
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
