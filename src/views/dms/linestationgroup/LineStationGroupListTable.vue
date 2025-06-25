<template>
  <ContentWrap>
    <el-input
      v-model="searchInput"
      @input="updateShowList"
      placeholder="请输入产线编号"
      clearable
    />
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="showList"
      :border="true"
      :show-overflow-tooltip="true"
      ref="tableRef"
      @row-click="handleRowClick"
      @select="handleSelect"
      @select-all="handleSelectAll"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="产线编号" align="center" prop="code" />
      <el-table-column label="产线名称" align="center" prop="name" />
    </el-table>
  </ContentWrap>
</template>

<script setup lang="ts">
import { LineStationGroupApi, LineStationGroupVO } from '@/api/dms/linestationgroup'

/** 设备类型 列表 */
defineOptions({ name: 'LineStationGroupListTable' })

const loading = ref(true) // 列表的加载中
const list = ref<LineStationGroupVO[]>([]) // 列表的数据
const showList = ref<any[]>([{ id: 0, code: 'NULL', name: '空设备' }]) // 显示的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await LineStationGroupApi.getLineStationGroupList()
    updateShowList()
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

/**************搜索功能***************/
const searchInput = ref('')

function updateShowList() {
  showList.value = list.value.filter((data) => {
    if (searchInput.value.trim() == '') return true
    if (data.code.includes(searchInput.value)) {
      return true
    }
    return false
  })
  showList.value.unshift({ id: 0, code: 'NULL', name: '空设备' })
}

/*************单选功能**************/

const tableRef = ref()

function handleRowClick(row: any) {
  if (changeLock == false) {
    selectClick(row)
  }
}

function handleSelect(rows, row) {
  if (changeLock == false) {
    selectClick(row)
  }
}

function handleSelectAll() {
  if (changeLock == false) {
    selectClick(nowSelect.value)
  }
}

const emit = defineEmits(['select'])

const nowSelect = ref<any>(undefined)
let changeLock = false

async function selectClick(row) {
  changeLock = true
  await tableRef.value.clearSelection()

  if (row?.id != nowSelect.value?.id) {
    await tableRef.value.toggleRowSelection(row)
    nowSelect.value = row
  } else {
    nowSelect.value = undefined
  }
  emit('select', nowSelect.value)
  changeLock = false
}
</script>
