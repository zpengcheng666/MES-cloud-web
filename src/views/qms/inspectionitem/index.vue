<template>

  <el-row :gutter="20">
    <el-col :span="4" :xs="24">
      <ContentWrap>
        <ItemTypeTree @node-click="handleItemTypeClick"/>
      </ContentWrap>
    </el-col>

    <el-col :span="20" :xs="24">
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
          <el-form-item label="项目名称" prop="itemName">
            <el-input
              v-model="queryParams.itemName"
              placeholder="请输入检测项目名称"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item label="项目编号" prop="itemNo">
            <el-input
              v-model="queryParams.itemNo"
              placeholder="请输入检测项目编号"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item label="检测方式" prop="inspectionType">
            <el-select
              v-model="queryParams.inspectionType"
              placeholder="请选择检测方式"
              clearable
              class="!w-240px"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="检测工具" prop="materialConfigId">
            <el-select
              v-model="queryParams.materialConfigId"
              placeholder="请选择检测工具"
              clearable
              class="!w-240px"
            >
              <el-option
                v-for="dict in toolList"
                :key="dict.materialConfigId"
                :label="dict.materialConfigName"
                :value="dict.materialConfigId"
              />
            </el-select>
          </el-form-item>
          <!--<el-form-item label="检测项目分类ID" prop="itemTypeId">-->
          <!--<el-input-->
          <!--v-model="queryParams.itemTypeId"-->
          <!--placeholder="请输入检测项目分类ID"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
          <!--/>-->
          <!--</el-form-item>-->
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
              @click="openForm('create',undefined,itemTypeId)"
              v-hasPermi="['qms:inspection-item:create']"
            >
              <Icon icon="ep:plus" class="mr-5px"/>
              新增
            </el-button>
            <el-button
              type="success"
              plain
              @click="handleExport"
              :loading="exportLoading"
              v-hasPermi="['qms:inspection-item:export']"
            >
              <Icon icon="ep:download" class="mr-5px"/>
              导出
            </el-button>
          </el-form-item>
        </el-form>
      </ContentWrap>

      <!-- 列表 -->
      <ContentWrap>
        <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true"
                  highlight-current-row
                  @row-click="handleCurrentChange"
                  reserve-selection
        >
          <!--<el-table-column label="主键" align="center" prop="id"/>-->

          <el-table-column label="检测项目名称" align="center" prop="itemName"/>
          <el-table-column label="检测项目编号" align="center" prop="itemNo"/>
          <el-table-column label="检测项目描述" align="center" prop="desc"/>
          <el-table-column label="检测方式" align="center" prop="inspectionType">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.QMS_INSPECTION_TYPE" :value="scope.row.inspectionType"/>
            </template>
          </el-table-column>
          <el-table-column label="检测工具 " align="center" prop="inspectionToolName"/>
          <el-table-column label="检测项目分类" align="center" prop="itemTypeName"/>
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            :formatter="dateFormatter"
            width="180px"
          />
          <el-table-column label="操作" align="center"  fixed="right" width="300">
            <template #default="scope">
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['qms:inspection-item:update']"
              >
                编辑
              </el-button>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['qms:inspection-item:delete']"
              >
                删除
              </el-button>


              <!--<el-button-->
                <!--link-->
                <!--type="primary"-->
                <!--@click="handleCurrentChange(scope.row)"-->
                <!--v-hasPermi="['qms:inspection-item:update']"-->
              <!--&gt;-->
                <!--查看检测项-->
              <!--</el-button>-->
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

      <!-- 表单弹窗：添加/修改 -->
      <InspectionItemForm ref="formRef" @success="getList"/>
      <!-- 子表的列表 -->
      <!--<ContentWrap v-show="currentRow.id">-->
        <!--<el-tabs model-value="inspectionItemDetail">-->
          <!--&lt;!&ndash;<el-tab-pane label="检测项目详情" name="inspectionItemDetail">&ndash;&gt;-->

          <!--<el-row :gutter="20">-->

            <!--<el-col :span="4">-->
              <!--<el-form-item label="检测项目:" prop="itemName">-->
                <!--<el-tag type="primary">{{currentRow.itemName}}</el-tag>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
          <!--</el-row>-->


          <!--&lt;!&ndash;<InspectionItemDetailList :inspection-item-id="currentRow.id"/>&ndash;&gt;-->
          <!--&lt;!&ndash;</el-tab-pane>&ndash;&gt;-->
        <!--</el-tabs>-->
      <!--</ContentWrap>-->
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
  import {dateFormatter} from '@/utils/formatTime'
  import download from '@/utils/download'
  import {InspectionItemApi, InspectionItemVO} from '@/api/qms/inspectionitem'
  import InspectionItemForm from './InspectionItemForm.vue'
  import ItemTypeTree from './ItemTypeTree.vue'
  import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
  import {InspectionToolApi, InspectionToolVO} from "@/api/qms/inspectiontool";

  // import InspectionItemDetailList from './components/InspectionItemDetailList.vue'

  /** 检测项目 列表 */
  defineOptions({name: 'InspectionItem'})

  const message = useMessage() // 消息弹窗
  const {t} = useI18n() // 国际化

  const loading = ref(true) // 列表的加载中
  const list = ref < InspectionItemVO[] > ([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const itemTypeId = ref() // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    createTime: [],
    itemName: undefined,
    itemNo: undefined,
    desc: undefined,
    inspectionType: undefined,
    materialConfigId: undefined,
    itemTypeId: undefined,
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中
  /** 选中行操作 */
  const currentRow = ref({}) // 选中行
  const handleCurrentChange = (row) => {
    currentRow.value = row
  }

  // 检测工具集合
  const toolList = ref <InspectionToolVO[] > ([]) //工具列表

  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    currentRow.value = {}
    try {
      const data = await InspectionItemApi.getInspectionItemPage(queryParams)
      list.value = data.list
      total.value = data.total
      // 获取检测工具集合
      toolList.value= await  InspectionToolApi.getInspectionToolList()
    } finally {
      loading.value = false
    }
  }

  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.pageNo = 1
    getList()
  }
  /** 处理分类被点击 */
  const handleItemTypeClick = async (row) => {
    queryParams.itemTypeId = row.id
    itemTypeId.value = row.id
    await getList()
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
      await InspectionItemApi.deleteInspectionItem(id)
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
      const data = await InspectionItemApi.exportInspectionItem(queryParams)
      download.excel(data, '检测项目.xls')
    } catch {
    } finally {
      exportLoading.value = false
    }
  }

  /** 初始化 **/
  onMounted(() => {
    getList()
  })
</script>
