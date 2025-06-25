<template>

  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1280">
    <ContentWrap>
      <!-- 搜索工作栏 -->
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="100px"
      >
        <el-form-item label="样本数字码" prop="samplingNo">
          <el-input
            v-model="queryParams.samplingNo"
            placeholder="请输入样本数字码"
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
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true"     ref="samplingRuleRef"
                highlight-current-row
                @select="handleSelectionChange"
                @row-click="handleSelectionChange"

      >
        <el-table-column width="30" label="选择" type="selection" />
        <el-table-column label="样本数字码" align="center" prop="samplingNo"/>
        <el-table-column label="抽取数量（百分比）" align="center" prop="samplingNumber"/>
        <el-table-column label="最大不合格数（百分比）" align="center" prop="maxUnqualifiedQuantity"/>
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
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
  import {dateFormatter} from '@/utils/formatTime'
  import download from '@/utils/download'
  import {SamplingRuleApi, SamplingRuleVO} from '@/api/qms/samplingrule'

  /** 抽样规则 列表 */
  defineOptions({name: 'SamplingRuleChoose'})

  const message = useMessage() // 消息弹窗
  const {t} = useI18n() // 国际化

  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const loading = ref(true) // 列表的加载中
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const list = ref < SamplingRuleVO[] > ([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    createTime: [],
    samplingStandardId: undefined,
    samplingNo: undefined,
    samplingNumber: undefined,
    maxUnqualifiedQuantity: undefined,
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中

  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      const data = await SamplingRuleApi.getSamplingRulePage(queryParams)
      list.value = data.list
      total.value = data.total
    } finally {
      loading.value = false
    }
  }


  /** 打开弹窗 */
  const open = async () => {
    dialogVisible.value = true
    dialogTitle.value = "抽样规则选择"
    handleQuery();
  }
  defineExpose({open}) // 提供 open 方法，用于打开弹窗



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




  /**
   * 实现单选行
   */
  const selectionSamplingRule= ref<SamplingRuleVO[]>()
  const samplingRuleRef = ref() // 表格的 Ref
  const handleSelectionChange = (selection) => {
    // 点击复选框
    if(selection instanceof Array){
      // 点击复选框传数组
      if (selection.length > 1) {
        //移除上一次选中行数据
        selection.shift();
      }
      //修改选中图标为未选中状态
      samplingRuleRef.value.clearSelection();
      //将当前选中行改为选中状态
      samplingRuleRef.value.toggleRowSelection(selection[0]);
      selectionSamplingRule.value = selection[0]
    }
    // 点击行
    else {
      samplingRuleRef.value.clearSelection();
      samplingRuleRef.value.toggleRowSelection(selection);
      selectionSamplingRule.value = selection
    }
  }





  const emit = defineEmits(['getSamplingRule']) // 定义 success 事件，用于操作成功后的回调
  /** 确认 **/
  const submitForm = async () => {
    formLoading.value = true
    try {
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('getSamplingRule', selectionSamplingRule.value)
    } finally {
      formLoading.value = false
    }
  }


  const standardId = ref() // 列表的总页数

  /** 初始化 **/
  onMounted(() => {
    getList()
  })
</script>
<style lang="scss" scoped>
  /**找到表头那一行，然后把里面的复选框隐藏掉**/
  ::v-deep .el-table__header-wrapper .el-table__header .el-checkbox {
    display: none;
  }
</style>
