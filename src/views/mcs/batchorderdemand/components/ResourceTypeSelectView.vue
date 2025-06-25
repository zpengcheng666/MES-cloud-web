<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1700">
    <ContentWrap>
      <!-- 搜索工作栏 -->
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="创建时间" prop="createTime">
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
        <el-form-item label="物料编号" prop="materialNumber">
          <el-input
            v-model="queryParams.materialNumber"
            placeholder="请输入物料编号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="物料名称" prop="materialName">
          <el-input
            v-model="queryParams.materialName"
            placeholder="请输入物料名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery">
            <Icon icon="ep:search" class="mr-5px"/>
            搜索
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
      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        ref="tableRef"
        :show-overflow-tooltip="true"
        @current-change="(row)=>selectionRow = row"
        highlight-current-row>
        <el-table-column label="物料编号" min-width="100" align="center" prop="materialNumber"/>
        <el-table-column label="物料名称" align="center" prop="materialName"/>
        <el-table-column label="当前类别" align="center" prop="materialTypeName"/>
        <el-table-column label="类码" align="center" prop="materialTypeCode"/>
        <el-table-column label="主类别类码" align="center" prop="materialParentTypeCode"/>
        <el-table-column label="物料规格" align="center" prop="materialSpecification"/>
        <el-table-column label="物料品牌" align="center" prop="materialBrand"/>
        <el-table-column label="物料单位" align="center" prop="materialUnit"/>
        <el-table-column label="物料管理模式" align="center" prop="materialManage">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.WMS_MATERIALTYPE_MATERIALMODE"
                      :value="scope.row.materialManage"/>
          </template>
        </el-table-column>
        <el-table-column label="来源物料" align="center" prop="materialNumberSource"/>

        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
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
      <el-button @click="submitSelect" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import {DICT_TYPE} from "@/utils/dict";
import { dateFormatter } from '@/utils/formatTime'
import {MaterialConfigApi, MaterialConfigVO} from "@/api/mcc/materialconfig";

defineOptions({ name: 'ResourceTypeSelectView' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const queryFormRef = ref() // 搜索的表单
const loading = ref(true) // 列表的加载中
const list = ref < MaterialConfigVO[] > ([]) // 列表的数据
const total = ref(0) // 列表的总页数
const emit = defineEmits(['success'])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  materialNumber: undefined,
  materialName: undefined,
  materialParentTypeId: undefined,
})

let resourceType;
const open = async (type: number) => {
  dialogVisible.value = true
  dialogTitle.value = '物料类型'
  // 修改时，设置数据
  resourceType = type;
  getList();
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    queryParams.materialParentTypeId = resourceType;
    const data = await MaterialConfigApi.getMaterialConfigPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const selectionRow = ref<any>();
const submitSelect = () => {
  emit('success', selectionRow.value);
  dialogVisible.value = false
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
}/** 重置表单 */
const resetView = () => {
    queryFormRef.value = {
      pageNo: 1,
      pageSize: 10,
      createTime: [],
      materialNumber: undefined,
      materialName: undefined,
      materialParentTypeId: undefined,
    }
  }
</script>
