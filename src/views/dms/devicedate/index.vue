<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="编号" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="选择编号"
          clearable
          @keyup.enter="handleQuery"
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
    <el-table v-loading="loading" :data="paginatedData" :stripe="true" :show-overflow-tooltip="true" >

      <el-table-column type="expand" align="center">
        <template #default="scope">
          <el-tabs model-value="Items">
            <el-tab-pane label="设备数据明细" name="Items">
              <Items :objs="scope.row.objs"/>
            </el-tab-pane>
          </el-tabs>
<!--          <el-tabs model-value="Detail">-->
<!--            <el-tab-pane label="设备数据明细" name="Detail">-->
<!--              <Detail :items="scope.row.detail"/>-->
<!--            </el-tab-pane>-->
<!--          </el-tabs>-->
        </template>
      </el-table-column>

      <el-table-column label= "编号" align="center" prop="id"/>
      <el-table-column label= "存储时间" align="center" prop="time" :formatter="dateFormatter"/>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="totalItems"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </ContentWrap>

</template>

<script setup lang="ts">
import {dateFormatter, formatDate} from '@/utils/formatTime'
// import download from '@/utils/download'
// import {RetraceApi, RetraceVO} from '@/api/qms/retrace'
import {DeviceDateApi, DeviceDateVO} from '@/api/dms/devicedate'
import Detail  from "@/views/dms/devicedate/detail.vue"
import Items  from "@/views/dms/devicedate/items.vue"
import {DICT_TYPE} from "@/utils/dict";


/** 设备数据 列表 */
defineOptions({name: 'DeviceDate'})
const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(false) // 列表的加载中
const list = ref < DeviceDateVO[] > ([]) // 列表的数据
const total = ref(0) // 列表的总页数

const queryParams: any = reactive({
  pageNo: 1,
  pageSize: 10,
  id: undefined,
  createTime: []
})

const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DeviceDateApi.getDeviceDatePage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}


// 实现前台控制分页
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = computed(() => list.value.length);
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return list.value.slice(start, end);
});
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
};
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
};


/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleCurrentChange(1)
  handleSizeChange(10)
  handleQuery()
}
//
/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
