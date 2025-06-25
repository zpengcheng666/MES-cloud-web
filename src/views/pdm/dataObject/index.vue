<template>
    <ContentWrap>
        <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="90px">
            <!-- 搜索工作栏 -->
            <el-form-item label="产品图号" prop="rootProductId">
                <el-select v-model="queryParams.rootproductId" clearable class="!w-240px" @change="secondclick">
                    <el-option v-for="product in productList" :key="product.id" :label="product.productNumber"
                        :value="product.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="客户化标识" prop="customizedIndex">
                <el-select v-model="queryParams.customizedIndex" clearable class="!w-240px" @change="search">
                    <el-option v-for="custom in customList" :key="custom.id" :label="custom.customizedIndex"
                        :value="custom.customizedIndex" />
                </el-select>
            </el-form-item>
        </el-form>
    </ContentWrap>
    <!-- 列表 -->
    <ContentWrap>
        <el-divider class="custom-divider">数据对象</el-divider>
        <el-button type="primary" @click="openForm('create')" plain>
            <Icon icon="ep:plus" class="mr-5px" />
            新增属性域
        </el-button>
        <el-button type="success" v-show="!buttonxy" @click="openUpdateForm('update')" plain>编辑属性域</el-button>
        <el-button type="warning" v-show="!buttonxy" @click="openCreateForm()" plain>实例化属性域</el-button>
        <el-button type="danger" v-show="!buttonxy" @click="handleDelete()" plain>删除属性域</el-button>

        <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
            <el-table-column align="center" type="index" label="序号" width="100" />
            <el-table-column label="标准数据对象" align="center" prop="stdDataObject" />
            <el-table-column label="客户化数据对象" align="center" prop="customizedDataObject" />
            <el-table-column label="客户化数据对象说明" align="center" prop="description" />
            <el-table-column label="实例化状态" align="center">
                <template #default="scope">
                    {{ scope.row.status == '1' ? '已实例化' : '未实例化' }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="left" width="300">
                <template #default="scope">
                    <el-button type="primary" @click="openEdit('update', scope.row.id)">
                        编辑 </el-button>
                    <el-button type="success" @click="openAny(scope.row.id)">查看详细</el-button>
                    <el-button type="success" v-show=!buttonxy @click="openCustom(scope.row.id)">属性域定制</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
            @pagination="getList" />
    </ContentWrap>

    <!-- 表单弹窗：添加 -->
    <DataObjectForm ref="formRef" @success="secondclick" />

    <!-- 表单弹窗：修改 -->
    <UpdateDataObjectForm ref="updateFormRef" @success="secondclick()" />

    <!-- 表单弹窗：右侧编辑 -->
    <EditDataObjectForm ref="editFormRef" @success="getList" />

    <!-- 弹窗：查看详细 -->
    <DataObjectAnyForm ref="editAnyForm" @success="getList" />

    <!--  弹窗：属性域定制-->
    <AttributeDomainForm ref="editDomainForm" @success="getList" />
    <!-- 页面刷新 -->
    <router-view v-if="isRouter" />
</template>

<script setup lang="ts">

import { DataObjectApi, DataObjectVO } from '@/api/pdm/dataObject'
import DataObjectForm from './DataObjectForm.vue'
import UpdateDataObjectForm from './UpdateDataObjectForm.vue'
import EditDataObjectForm from './EditDataObjectForm.vue';
import DataObjectAnyForm from './DataObjectAnyForm.vue';
import AttributeDomainForm from './AttributeDomainForm.vue';
import * as ProductApi from '@/api/pdm/product';
import { nextTick, provide, ref } from "vue";
import { watch, onMounted } from 'vue';

const isRouter = ref(true);
const reload = () => {
    isRouter.value = false;
    nextTick(() => {
        isRouter.value = true;
    });
};
provide("reload", reload);

/** 产品数据对象 列表 */
defineOptions({ name: 'DataObject' })
const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const buttonxy = ref(true) //按钮的显隐
const list = ref<DataObjectVO[]>([]) // 列表的数据
const productList = ref<any[]>([]) // 产品列表
const customList = ref<any[]>([]) // 客户化标识列表
const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    id: undefined,
    rootproductId: undefined,
    stdDataObject: undefined,
    customizedDataObject: undefined,
    customizedIndex: undefined,
    customizedType: undefined,
    tableName: undefined,
    description: undefined,
    status: undefined,
    intrinsicAttrs: undefined,
    customizedAttrs: undefined,
    serialNumber: undefined,
    createTime: [],
    list: undefined,
})


const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const queryFormRef = ref() // 搜索的表单
const dataObject = ref(true)//按钮的显隐

const productParams = reactive({
  status: 0,
  productType: 0
})

/** 查询列表 */
const getList = async () => {
    loading.value = true
    try {
        productList.value = await ProductApi.getProductList(productParams)
        const data = await DataObjectApi.getDataObjectPage(queryParams)
        list.value = data.list
        total.value = data.total
    } finally {
        loading.value = false
    }
}

watch(() => queryParams.rootproductId, (newVal) => {
    // 当第一个下拉框的值变化时，调用 secondclick 方法
    secondclick(newVal);
    return {
        queryParams,
        productList,
        customList,
        secondclick,
        search
    };
});
//下拉列表级联
const secondclick = async () => {
    customList.value = await DataObjectApi.getCustomizedIndicesByRootProductId(queryParams.rootproductId)
}


//根据客户化关系下拉得到列表
const search = async () => {
    dataObject.value = true;
    // queryParams.customizedIndex = row;
    const data = await DataObjectApi.getDataObjectPage(queryParams)
    //因为多封装了一层 所以要把list中的值从data中取出
    list.value = data.list
    //状态
    let status = list.value[0].status;

    if (status == '1') {
        buttonxy.value = true
    } else {
        buttonxy.value = false

    }
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
    formRef.value.open(type, id)
}

const updateFormRef = ref()
const openUpdateForm = (type: string, id?: number) => {
    updateFormRef.value.open(type, id, queryParams.rootproductId, queryParams.customizedIndex)
}

/** 右侧编辑操作 */
const editFormRef = ref()
const openEdit = (type: string, id?: number) => {
    editFormRef.value.open(type, id, queryParams.rootproductId)
}

/** 查看详细按钮操作 */
const editAnyForm = ref()
const openAny = (id?: number) => {
    editAnyForm.value.open(id)
}

/** 属性域定制按钮*/
const editDomainForm = ref()
const openCustom = (id?: number) => {
    editDomainForm.value.open(id)
}

//实例化按钮操作
const openCreateForm = async () => {
    try {
        await message.dataOjectConfirm()
        await DataObjectApi.createIndex(queryParams)
        message.success(t('common.success'))
        await getList()
        await search()
    } catch { }
}

/** 删除按钮操作 */
const handleDelete = async () => {
    try {
        await message.delConfirm()
        // 发起删除
        await DataObjectApi.deleteDataObject(queryParams)
        //提示删除成功
        message.success(t('common.delSuccess'))
        // 刷新列表
        await getList()
        await secondclick()
    } catch { }
}

/** 初始化 **/
onMounted(() => {
    getList()
})
</script>
<style>
/* 添加自定义CSS样式 */
.custom-divider .el-divider__text {
    font-size: 20px;
    /* 调整文本大小 */
}
</style>
