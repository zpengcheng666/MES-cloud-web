<template>
  <Dialog title="台账/人员对应" v-model="dialogVisible" align-center width="60vw">
    <el-container>
      <el-aside width="60%">
        <ContentWrap>
          <el-select-v2
            v-model="role"
            :options="roleList"
            @change="handleRoleChange"
            placeholder="选择用户所属角色"
          />
        </ContentWrap>

        <!-- 列表 -->
        <ContentWrap>
          <el-table
            v-loading="loading"
            :data="list"
            :stripe="true"
            :show-overflow-tooltip="true"
            ref="tableRef"
            height="400px"
            @select-all="handleSelectAll"
            @select="handleSelect"
          >
            <el-table-column type="selection" />
            <el-table-column label="名称" align="center" prop="nickname" />
            <el-table-column label="电话" align="center" prop="mobile" />
          </el-table>
        </ContentWrap>
      </el-aside>
      <el-main class="elMain">
        <ContentWrap>
          <el-table
            v-loading="loading2"
            :data="list2"
            :stripe="true"
            :show-overflow-tooltip="true"
            height="490px"
          >
            <el-table-column label="名称" align="center" prop="nickname" />
            <el-table-column label="删除操作" align="center">
              <template #default="scope">
                <el-button link type="primary" @click="handleDelete(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </ContentWrap>
      </el-main>
    </el-container>

    <el-button @click="submitForm" type="primary">确 定</el-button>
    <el-button @click="dialogVisible = false">取 消</el-button>
  </Dialog>
</template>

<script setup lang="ts">
import { LedgerApi, LedgerVO } from '@/api/dms/ledger'
import { getSimpleRoleList } from '@/api/system/role'

/** 设备类型 列表 */
defineOptions({ name: 'LedgerToUser' })

const props = defineProps(['userList'])

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

/**************************全局*********************/

let selectData: any[] = [] //已选择
const role = ref() //当前角色

let ledgerid //台账ID
const roleList = ref<any[]>([]) //角色列表

/***************选择列表*****************/
const loading2 = ref(true) // 列表的加载中
const list2 = ref<any[]>([]) // 列表的数据

function getTable2() {
  loading2.value = true
  list2.value = props.userList
    .map((v) => {
      if (selectData.includes('' + v.id)) {
        return v
      }
      return undefined
    })
    .filter((v) => {
      if (v == undefined) return false
      return true
    })
  loading2.value = false
}

/*******************选择逻辑*******************/

const tableRef = ref()

async function handleSelect(selection, row) {
  if (selectData.includes('' + row.id)) {
    selectData = selectData.filter((v) => {
      if (v == '' + row.id) return false
      return true
    })
  } else selectData.push('' + row.id)

  await setSelect()
  getTable2()
}

async function handleSelectAll(selection) {
  if (selection.length == 0) {
    list.value.forEach((v) => {
      if (selectData.includes('' + v.id)) {
        selectData = selectData.filter((v2) => {
          if (v2 == '' + v.id) return false
          return true
        })
      }
    })
  } else {
    selection.forEach((v) => {
      if (!selectData.includes('' + v.id)) {
        selectData.push('' + v.id)
      }
    })
  }
  await setSelect()
  getTable2()
}

async function handleDelete(id) {
  selectData = selectData.filter((v) => v != '' + id)
  await setSelect()
  getTable2()
}

async function handleRoleChange() {
  await getList()
}

/*******************表格相关********************/

const loading = ref(true) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    if (role.value == undefined) list.value = await LedgerApi.getUsersByRole(0)
    else list.value = await LedgerApi.getUsersByRole(role.value)
    list.value = list.value.filter((v) => v.status == 0)
    await setSelect()
  } finally {
    loading.value = false
  }
}

/** 设置表格选择 */
async function setSelect() {
  let rowData = list.value.filter((v) => {
    return selectData.includes('' + v.id)
  })

  await tableRef.value.clearSelection()
  rowData.forEach((v) => {
    tableRef.value.toggleRowSelection(v, true)
  })
}

/*****************开启弹窗初始化与提交****************/

const dialogVisible = ref(false) // 弹窗的是否展示

/** 打开弹窗 */
const open = async (id) => {
  if (id == undefined || id == null) return
  dialogVisible.value = true

  ledgerid = id
  role.value = undefined
  roleList.value = await getSimpleRoleList()
  roleList.value = roleList.value.map((v) => {
    return { value: v.id, label: v.name + ' - ' + v.remark }
  })
  await getLedgerToUserList()

  await getList()

  getTable2()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 获取对应数据
async function getLedgerToUserList() {
  let getData = await LedgerApi.getLedgerToUserList(ledgerid, undefined)
  selectData = []
  getData.forEach((v) => {
    selectData.push(v.user)
  })
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  dialogVisible.value = true

  await LedgerApi.deleteLedgerToUser({ ledger: ledgerid })

  let insertData: any[] = []
  selectData.forEach((v) => {
    insertData.push({
      ledger: ledgerid,
      user: v
    })
  })

  await LedgerApi.createLedgerToUser(insertData)

  dialogVisible.value = false
  emit('success')
}
</script>
<style scoped>
.elMain {
  padding-top: 0px;
}
</style>
