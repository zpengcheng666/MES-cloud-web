<template>
    <ContentWrap>
        <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="90px">
            <div>
                <!-- 搜索工作栏 -->
<!--                <el-form-item label="产品" prop="rootProductId">-->
<!--                    <el-select v-model="queryParams.rootProductId" placeholder="请选择产品" clearable class="!w-240px">-->
<!--                        <el-option v-for="product in productList" :key="product.id" :label="product.productNumber"-->
<!--                            :value="product.productNumber" />-->
<!--                    </el-select>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="项目" prop="projectCode">-->
<!--                  <el-select v-model="queryParams.projectCode" placeholder="请选择项目" clearable class="!w-240px">-->
<!--                    <el-option v-for="project in projectList" :key="project.code" :label="project.name"-->
<!--                               :value="project.code" />-->
<!--                  </el-select>-->
<!--                </el-form-item>-->
                <el-form-item label="厂家" prop="companyId">
                  <el-select v-model="queryParams.companyId" placeholder="请选择厂家" clearable class="!w-240px">
                    <el-option v-for="company in companyList" :key="company.id" :label="company.name" :value="company.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="数据包编号" prop="receiveCode">
                    <el-input v-model="queryParams.receiveCode" placeholder="请输入数据包编号" clearable
                        @keyup.enter="handleQuery" class="!w-240px" />
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter="handleQuery"
                        class="!w-240px" />
                </el-form-item>
            </div>
            <el-form-item>
                <el-button @click="handleQuery">
                    <Icon icon="ep:search" class="mr-5px" /> 搜索
                </el-button>
                <el-button @click="resetQuery">
                    <Icon icon="ep:refresh" class="mr-5px" /> 重置
                </el-button>
                <el-button :loading="exportLoading" plain type="success"
                           @click="handleExport">
                  <Icon class="mr-5px" icon="ep:download" />
                  导出
                </el-button>
            </el-form-item>
        </el-form>
    </ContentWrap>

    <!-- 列表 -->
    <ContentWrap>
        <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
            <el-table-column label="序号" width="100" type="index" align="center" />
<!--            <el-table-column label="产品" align="center" prop="productNumber" />-->
<!--            <el-table-column label="项目" align="center" prop="projectCode" />-->
            <el-table-column label="厂家" align="center" prop="companyName" />
            <el-table-column label="数据包编号" align="center" prop="receiveCode" />
            <el-table-column label="数据包名称" align="center" prop="name" />
            <el-table-column label="数据包大小" align="center" prop="size" />
            <el-table-column label="零件数量" align="center" prop="partCount" />
            <el-table-column label="处理时间" align="center" prop="createTime">
                <template #default="scope">
                    {{ formatDate(scope.row.createTime) }}-{{ formatDate(scope.row.updateTime) }}
                </template>
            </el-table-column>
            <el-table-column label="耗时" align="center" prop="useTime" />
            <el-table-column label="处理结果" align="center" prop="status" />
            <el-table-column label="创建者" align="center" prop="creator" />
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <el-button link type="primary" @click="openForm('update', scope.row.id)"
                        v-hasPermi="['pdm:receive-info:update']">
                        编辑
                    </el-button>
                    <el-button link type="danger" @click="handleDelete(scope.row.id)"
                        v-hasPermi="['pdm:receive-info:delete']">
                        删除
                    </el-button>
                    <el-link
                      :underline="false"
                      style="font-size: 12px; vertical-align: baseline"
                      type="primary"
                      @click="downloadData(scope.row.vaultUrl)"
                    >
                      下载
                    </el-link>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
            @pagination="getList" />
    </ContentWrap>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/formatTime'
import download from '@/utils/download'
import { DataStatisticsApi, DataStatisticsVO } from '@/api/pdm/dataStatistics'
import * as ProductApi from '@/api/pdm/product'
import { CompanyApi } from '@/api/ppm/company'

/** 设计数据包接收记录 列表 */
defineOptions({ name: 'dataStatistics' })
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const exportLoading = ref(false) // 导出的加载中
const list = ref<DataStatisticsVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const productList = ref<any[]>([]) // 产品列表
const projectList = ref<any[]>([]) // 项目列表
const companyList = ref<any[]>([]) // 厂家列表
const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    name: undefined,
    size: undefined,
    type: undefined,
    md5: undefined,
    vaultUrl: undefined,
    receiveCode: undefined,
    status: undefined,
    productNumber: undefined,
    projectCode: undefined,
    projectName: undefined,
    structureId: undefined,
    //下拉列表
    rootProductId: undefined,
    companyId: undefined,
    //耗时
    useTime: undefined,
    //零件数量
    partCount: undefined,
    createTime: [],
})
const productParams = reactive({
  status: 0,
  productType: 0
})
const queryFormRef = ref() // 搜索的表单
/** 查询列表 */
const getList = async () => {
    loading.value = true
    try {
        const data = await DataStatisticsApi.getDataStatisticsPage(queryParams)
        list.value = data.list
        total.value = data.total
        // productList.value = await ProductApi.getProductList(productParams)
        //加载项目列表
        // projectList.value = await ProductApi.getProjectList()
        //加载厂家列表
        companyList.value = await CompanyApi.getCompanyListByType("2,3")
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
const openForm = (type: string, id?: number) => {
    formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
    try {
        // 删除的二次确认
        await message.delConfirm()
        // 发起删除
        await DataStatisticsApi.deleteDataStatistics(id)
        message.success(t('common.delSuccess'))
        // 刷新列表
        await getList()
    } catch { }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await DataStatisticsApi.exportDataStatistics(queryParams)
    download.excel(data, '数据包列表.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
    getList()
})

/** 下载数据包 */
const downloadData = async (vaultUrl: string) => {
  window.open(vaultUrl, '_blank');
}
</script>
