<template>

    <el-row :gutter="20">

        <el-col :span="4" :xs="24">
            <ContentWrap>
                <MaterialTypeTree @node-click="handleItemTypeClick"/>
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
                        <el-button
                                type="primary"
                                plain
                                @click="openForm('create')"
                                v-hasPermi="['mcc:material-config:create']"
                        >
                            <Icon icon="ep:plus" class="mr-5px"/>
                            新增
                        </el-button>
                        <el-button
                                type="success"
                                plain
                                @click="handleExport"
                                :loading="exportLoading"
                                v-hasPermi="['mcc:material-config:export']"
                        >
                            <Icon icon="ep:download" class="mr-5px"/>
                            导出
                        </el-button>
                    </el-form-item>
                </el-form>
            </ContentWrap>

            <!-- 列表 -->
            <ContentWrap>
                <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">


                    <el-table-column label="物料编号" align="center" prop="materialNumber" width="180" />
                    <el-table-column label="物料名称" align="center" prop="materialName"/>
                    <el-table-column label="当前类别" align="center" prop="materialTypeName"/>
                    <el-table-column label="类码" align="center" prop="materialTypeCode"/>
                    <el-table-column label="主类别" align="center" prop="materialParentTypeName"/>
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
                    <el-table-column label="操作" align="center">
                        <template #default="scope">
                            <el-button
                                    link
                                    type="primary"
                                    @click="openForm('update', scope.row.id)"
                                    v-hasPermi="['mcc:material-config:update']"
                            >
                                编辑
                            </el-button>
                            <el-button
                                    link
                                    type="danger"
                                    @click="handleDelete(scope.row.id)"
                                    v-hasPermi="['mcc:material-config:delete']"
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

            <!-- 表单弹窗：添加/修改 -->
            <MCCMaterialConfigForm ref="formRef" @success="getList"/>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
    import {dateFormatter} from '@/utils/formatTime'
    import download from '@/utils/download'
    import {MaterialConfigApi, MaterialConfigVO} from '@/api/mcc/materialconfig'
    import MCCMaterialConfigForm from './MCCMaterialConfigForm.vue'
    import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
    import MaterialTypeTree from './components/MaterialTypeTree.vue'
    /** 物料类型 列表 */
    defineOptions({name: 'MCCMaterialConfig'})

    const message = useMessage() // 消息弹窗
    const {t} = useI18n() // 国际化

    const loading = ref(true) // 列表的加载中
    const list = ref < MaterialConfigVO[] > ([]) // 列表的数据
    const total = ref(0) // 列表的总页数
    const queryParams = reactive({
        pageNo: 1,
        pageSize: 10,
        createTime: [],
        materialNumber: undefined,
        materialName: undefined,
        materialTypeId: undefined,
        materialParentTypeId: undefined,
        materialSpecification: undefined,
        materialBrand: undefined,
        materialUnit: undefined,
        materialSourceId: undefined,
        materialTypeCode: undefined,
    })
    const queryFormRef = ref() // 搜索的表单
    const exportLoading = ref(false) // 导出的加载中

    /** 查询列表 */
    const getList = async () => {
        loading.value = true
        try {
            const data = await MaterialConfigApi.getMaterialConfigPage(queryParams)
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
    ? : number
    ) =>
    {
        formRef.value.open(type, id)
    }

    /** 删除按钮操作 */
    const handleDelete = async (id: number) => {
        try {
            // 删除的二次确认
            await message.delConfirm()
            // 发起删除
            await MaterialConfigApi.deleteMaterialConfig(id)
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
            const data = await MaterialConfigApi.exportMaterialConfig(queryParams)
            download.excel(data, '物料类型.xls')
        } catch {
        } finally {
            exportLoading.value = false
        }
    }

    /** 处理分类被点击 */
    const handleItemTypeClick = async (row) => {
        debugger
        if (row.id=='0'){
            queryParams.materialTypeId = undefined
        } else {
            queryParams.materialTypeId = row.id
        }

        await getList()
    }

    /** 初始化 **/
    onMounted(() => {
        getList()
    })
</script>
