<template>
  <el-row :gutter="20">

    <el-col :span="4" :xs="24">
      <ContentWrap>
        <StandardTree @node-click="handleItemTypeClick"/>
      </ContentWrap>
    </el-col>

    <el-col :span="20" :xs="24">

      <el-tabs v-model="subTabsName">
        <el-tab-pane label="抽样数字码" name="samplingRule">
          <ContentWrap>
            <!-- 搜索工作栏 -->
            <el-form
              class="-mb-15px"
              :model="queryParams"
              ref="queryFormRef"
              :inline="true"
              label-width="100px"
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
              <el-form-item label="样本数字码" prop="samplingNo">
                <el-input
                  v-model="queryParams.sampleSizeCode"
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
                <el-button
                  type="primary"
                  plain
                  @click="openForm('create',undefined, standardId)"
                  v-hasPermi="['qms:sampling-rule:create']"
                >
                  <Icon icon="ep:plus" class="mr-5px"/>
                  新增
                </el-button>
                <el-button
                  type="success"
                  plain
                  @click="handleExport"
                  :loading="exportLoading"
                  v-hasPermi="['qms:sampling-rule:export']"
                >
                  <Icon icon="ep:download" class="mr-5px"/>
                  导出
                </el-button>


                <el-button
                  type="primary"
                  plain
                  @click="openInfoForm()"
                  v-hasPermi="['qms:sampling-rule:create']"
                  :disabled="standardId == ''"
                >
                  查看数字码表
                </el-button>
              </el-form-item>
            </el-form>
          </ContentWrap>

          <!-- 列表 -->
          <ContentWrap>
            <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">

              <el-table-column label="批量值" align="center" prop="minValue">
                <template #default="scope">
                  {{scope.row.minValue}} ~ {{scope.row.maxValue ==undefined ?'∞':scope.row.maxValue}}
                </template>
              </el-table-column>
              <!--<el-table-column label="批量上限值（N）" align="center" prop="maxValue" />-->
              <el-table-column label="检验水平类型" align="center" prop="inspectionLevelType">
                <template #default="scope">
                  <dict-tag :type="DICT_TYPE.QMS_INSPECTION_LEVEL_TYPE" :value="scope.row.inspectionLevelType"/>
                </template>
              </el-table-column>
              <el-table-column label="样本数字码" align="center" prop="sampleSizeCode"/>
              <el-table-column
                label="创建时间"
                align="center"
                prop="createTime"
                :formatter="dateFormatter"
                width="180px"
              />
              <el-table-column label="操作" align="center">
                <template #default="scope">
                  <el-button
                    link
                    type="primary"
                    @click="openForm('update', scope.row.id)"
                    v-hasPermi="['qms:sampling-rule:update']"
                  >
                    编辑
                  </el-button>
                  <el-button
                    link
                    type="danger"
                    @click="handleDelete(scope.row.id)"
                    v-hasPermi="['qms:sampling-rule:delete']"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <Pagination
              :total="total"
              v-model:page="queryParams.pageNo"
              v-model:limit="queryParams.pageSize"
              @pagination="getList"
            />
          </ContentWrap>

        </el-tab-pane>

        <el-tab-pane label="抽样标准方案" name="samplingRuleConfig">

          <SamplingRuleConfig  ref="samplingRuleConfigRef" :standerdId="standardId"/>
        </el-tab-pane>

      </el-tabs>


      <!-- 表单弹窗：添加/修改 -->
      <SamplingRuleForm ref="formRef" @success="getList"/>
      <SamplingRuleInfo ref="infoRef" @success="getList" :standerdId = "standardId"/>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
  import {dateFormatter} from '@/utils/formatTime'
  import download from '@/utils/download'
  import {SamplingRuleApi, SamplingRuleVO} from '@/api/qms/samplingrule'
  import SamplingRuleForm from './SamplingRuleForm.vue'
  import StandardTree from './StandardTree.vue'
  import SamplingRuleConfig from '../samplingruleconfig/index.vue'
  import SamplingRuleInfo from './components/SamplingRuleInfo.vue'
  import {getStrDictOptions, getIntDictOptions, DICT_TYPE} from '@/utils/dict'

  /** 抽样规则 列表 */
  defineOptions({name: 'SamplingRule'})

  const message = useMessage() // 消息弹窗
  const {t} = useI18n() // 国际化

  const loading = ref(true) // 列表的加载中
  const list = ref < SamplingRuleVO[] > ([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    createTime: [],
    samplingStandardId: undefined,
    sampleSizeCode: undefined,
    minValue: undefined,
    inspectionLevelType: undefined,
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中
  /** 子表单 */
  const subTabsName = ref('samplingRule')
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

  /** 添加/修改操作 */
  const formRef = ref()
  const openForm = (type: string, id
  ? : number, value ? : string
  ) =>
  {
    formRef.value.open(type, id, value)
  }

  /** 删除按钮操作 */
  const handleDelete = async (id: number) => {
    try {
      // 删除的二次确认
      await message.delConfirm()
      // 发起删除
      await SamplingRuleApi.deleteSamplingRule(id)
      message.success(t('common.delSuccess'))
      // 刷新列表
      await getList()
    } catch {
    }
  }

  /** 导出按钮操作 */
  const handleExport = async () => {
    try {
      // 导出的二次确认
      await message.exportConfirm()
      // 发起导出
      exportLoading.value = true
      const data = await SamplingRuleApi.exportSamplingRule(queryParams)
      download.excel(data, '抽样规则.xls')
    } catch {
    } finally {
      exportLoading.value = false
    }
  }

  /** 添加/修改操作 */
  const samplingRuleConfigRef = ref()
  const queryInfos = (value ? : string
  ) =>
  {
    samplingRuleConfigRef.value.queryInfos(value)
  }

  const  infoRef = ref()
  const openInfoForm = (
  ) =>
  {
    infoRef.value.open()
  }


  const standardId = ref('') //
  /** 处理分类被点击 */
  const handleItemTypeClick = async (row) => {
    queryParams.samplingStandardId = row.id
    standardId.value = row.id
    await getList()
await  queryInfos(row.id);
  }

  /** 初始化 **/
  onMounted(() => {
    getList()
  })
</script>
