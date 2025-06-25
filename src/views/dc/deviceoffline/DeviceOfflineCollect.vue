<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">

    <ContentWrap>
      <!-- 搜索工作栏 -->
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        :rules="formRules"
        label-width="100px"
      >

        <el-form-item label="产品类型" prop="topicId" >
          <el-select-v2
            v-model="queryParams.topicId"
            :options="productTypeList"
            filterable
            clearable
            placeholder="选择产品类型"
            class="!w-240px"
          />
        </el-form-item>

        <el-form-item label="存储时间" prop="createTime">
          <el-date-picker
            v-model="queryParams.createTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            class="!w-240px"
          />
        </el-form-item>

        <el-form-item>
          <el-button @click="handleQuery">
            <Icon icon="ep:search" class="mr-5px"/>
            查询
          </el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px"/>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 列表 -->
    <ContentWrap>
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" >

        <el-table-column type="expand" align="center">
          <template #default="scope">
            <el-tabs model-value="OfflineCollectDetail">
              <el-tab-pane label="采集数据明细" name="OfflineCollectDetail">
                <OfflineCollectDetail :items-value="scope.row.items"/>
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-table-column>

        <el-table-column label="设备" align="center" prop="deviceId" >
          <template #default="scope">
            {{ getLedgerName(scope.row.deviceId) }}
          </template>
        </el-table-column>

        <el-table-column label="产品类型" align="center" prop="productTypeName" />

        <el-table-column label="通信Id" align="center" prop="topicId" />

<!--        <el-table-column label="通信类型" align="center" prop="commType">-->
<!--          <template #default="scope">-->
<!--            <dict-tag :type="DICT_TYPE.DC_COMM_TYPE" :value="scope.row.commType" />-->
<!--          </template>-->
<!--        </el-table-column>-->

        <el-table-column label= "存储时间" align="center" prop="time" :formatter="dateFormatter"/>
      </el-table>

      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </ContentWrap>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {  DICT_TYPE , getIntDictOptions} from '@/utils/dict'
import { ProductTypeApi, ProductTypeVO } from '@/api/dc/producttype'
import {dateFormatter} from "@/utils/formatTime";
import OfflineCollectDetail from "@/views/dc/deviceoffline/detail/OfflineCollectDetail.vue";
import {OfflineCollectApi, OfflineCollectVO} from "@/api/dc/deviceofflinecollect";

/** 设备 表单 */
defineOptions({ name: 'OfflineCollectForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const loading = ref(false) // 列表的加载中

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('采集日志') // 弹窗的标题
const list = ref < OfflineCollectVO[] > ([]) // 列表的数据
const total = ref(0) // 列表的总页数

const queryParams: any = reactive({
  pageNo: 1,
  pageSize: 10,
  id: undefined,
  topicId: undefined,
  createTime: []
})

const formRules = reactive({
  topicId: [{ required: true, message: '设备不能为空', trigger: 'blur' }],
})

const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OfflineCollectApi.getOfflineCollectPage(queryParams)
    list.value = data.list
    total.value = await OfflineCollectApi.queryOfflineCollectCount(queryParams)
  } finally {
    loading.value = false
  }
}

let deviceId = ref()

/** 子表的表单 */
const subTabsName = ref('deviceCollectDetail')

/** 打开弹窗 */
const open = async (id?: number) => {
  reset()
  total.value = 0
  list.value = null
  deviceId.value = id
  dialogVisible.value = true
  console.log(deviceId.value)
  // 修改时，设置数据
  await getProductList()
  await getLedgerList()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/***************************查询设备下产品***************************/
const productTypeList = ref<any[]>([])
const getProductList = async () => {
  const data = await ProductTypeApi.getProductListByDeviceId(deviceId.value)
  productTypeList.value = []
  for (let v of data) {
    productTypeList.value.push({
      value: v.topicId,
      label: v.productTypeName,
      key: v.topicId,
      ...v
    })
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  if(queryParams.topicId == null){
    message.error('请选择产品类型后搜索')
    return
  }
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  reset()
  total.value = 0
  list.value = null
  // handleCurrentChange(1)
  // handleSizeChange(10)

}

/***************************关联设备***************************/
import { LedgerApi } from '@/api/dms/ledger'
const ledgerList = ref<any[]>([])
const getLedgerList = async () => {
  const data = await LedgerApi.getLedgerList()
  ledgerList.value = []
  for (let v of data) {
    ledgerList.value.push({
      value: v.id,
      label: v.code + ' - ' + v.name,
      key: v.id,
      ...v
    })
  }
}

const getLedgerName = (id: string): string => {
  let str = ''
  for (let v of ledgerList.value) {
    if (v.id == id) {
      str = v.code + ' - ' + v.name
    }
  }
  return str
}

function reset() {
  // 重置数据：
    queryParams.pageNo = 1
    queryParams.pageSize = 10
    queryParams.id = undefined
    queryParams.topicId = undefined
    queryParams.createTime = []
}

</script>
