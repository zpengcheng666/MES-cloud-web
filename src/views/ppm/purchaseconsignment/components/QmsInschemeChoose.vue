<template>
    <Dialog :title="dialogTitle" v-model="dialogVisible" width="1280" >
        <!-- 列表 -->
        <ContentWrap>
            <el-table v-loading="formLoading"
                      ref="contractTableRef"
                      :data="list"
                      :stripe="true"
                      :show-overflow-tooltip="true"
                      highlight-current-row
                      @select="handleSelectionChange"
                      @row-click="handleSelectionChange">
                <el-table-column width="30" label="选择" type="selection" />


                <el-table-column label="方案名称" align="center" prop="schemeName"/>
                <el-table-column label="方案编号" align="center" prop="schemeNo"/>
                <el-table-column label="方案类型" align="center" prop="schemeType">
                    <template #default="scope">
                        <dict-tag :type="DICT_TYPE.QMS_SCHEME_TYPE" :value="scope.row.schemeType"/>
                    </template>
                </el-table-column>
                <!--<el-table-column label="物料类型ID" align="center" prop="materialConfigId" />-->

                <el-table-column label="物料编号" align="center" prop="materialNumber"/>
                <el-table-column label="物料类码" align="center" prop="materialCode"/>
                <el-table-column label="物料名称" align="center" prop="materialName"/>
                <el-table-column label="物料属性" align="center" prop="materialProperty">
                    <template #default="scope">
                        <dict-tag :type="DICT_TYPE.WMS_MATERIAL_TYPE_PROPERTIES" :value="scope.row.materialProperty"/>
                    </template>
                </el-table-column>
                <el-table-column label="物料类型" align="center" prop="materialType">
                    <template #default="scope">
                        <dict-tag :type="DICT_TYPE.WMS_MATERIAL_TYPE" :value="scope.row.materialType"/>
                    </template>
                </el-table-column>
                <el-table-column label="物料规格" align="center" prop="materialSpecification"/>
                <el-table-column label="物料品牌" align="center" prop="materialBrand"/>
                <el-table-column label="物料单位" align="center" prop="materialUnit"/>
                <el-table-column label="检验级别" align="center" prop="inspectionLevel"/>
                <el-table-column label="工艺" align="center" prop="technologyId"/>
                <el-table-column label="工序" align="center" prop="processId"/>
                <el-table-column label="抽样标准" align="center" prop="samplingStandardName"/>
                <el-table-column label="检验类型" align="center" prop="inspectionSheetType">
                    <template #default="scope">
                        <dict-tag :type="DICT_TYPE.QMS_INSPECTION_SHEET_TYPE" :value="scope.row.inspectionSheetType"/>
                    </template>
                </el-table-column>
                <el-table-column label="检验水平" align="center" prop="inspectionLevelType">
                    <template #default="scope">
                        <dict-tag :type="DICT_TYPE.QMS_INSPECTION_LEVEL_TYPE" :value="scope.row.inspectionLevelType"/>
                    </template>
                </el-table-column>
                <el-table-column label="抽样规则" align="center" prop="samplingRuleType">
                    <template #default="scope">
                        <dict-tag :type="DICT_TYPE.QMS_SAMPLING_RULE_TYPE" :value="scope.row.samplingRuleType"/>
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

        <template #footer>
            <el-button @click="submitForm" type="primary" :disabled="formLoading">确定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
        </template>
    </Dialog>
</template>


<script setup lang="ts">
    import { dateFormatter2 } from '@/utils/formatTime'
    import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
    import {InspectionSchemeApi, InspectionSchemeVO} from '@/api/qms/inspectionscheme'
    /** 购销合同 列表 */
    defineOptions({ name: 'QmsInschemeChoose' })

    const dialogVisible = ref(false) // 弹窗的是否展示
    const dialogTitle = ref('') // 弹窗的标题
    const formLoading = ref(true) // 列表的加载中
    const list = ref<ContractVO[]>([]) // 列表的数据
    const total = ref(0) // 列表的总页数
    const queryParams = reactive({
        pageNo: 1,
        pageSize: 10,
        schemeType: 1,
        materialConfigId: undefined,
        isEffective:1,
    })
    const queryFormRef = ref() // 搜索的表单

    const rowInfo = ref();

    /** 打开弹窗 */
    const open = async (row) => {
        dialogVisible.value = true
        dialogTitle.value = "质检方案选择"
        queryParams.materialConfigId = row.materialConfigId;
        rowInfo.value =row;
        handleQuery();
    }

    defineExpose({ open }) // 提供 open 方法，用于打开弹窗

    /** 查询列表 */
    const getList = async () => {
        formLoading.value = true
        try {
            const data = await InspectionSchemeApi.getInspectionSchemePage(queryParams)
            list.value = data.list
            total.value = data.total
        } finally {
            formLoading.value = false
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


    const emit = defineEmits(['getScheme']) // 定义 success 事件，用于操作成功后的回调
    /** 确认 **/
    const submitForm = async () => {
        formLoading.value = true
        try {
            dialogVisible.value = false
            // 发送操作成功的事件
            emit('getScheme', selectionContract.value,rowInfo.value)
        } finally {
            formLoading.value = false
        }
    }

    /**
     * 实现单选行
     */
    const selectionContract = ref<ContractVO[]>()
    const contractTableRef = ref() // 表格的 Ref
    const handleSelectionChange = (selection) => {
        // 点击复选框
        if(selection instanceof Array){
            // 点击复选框传数组
            if (selection.length > 1) {
                //移除上一次选中行数据
                selection.shift();
            }
            //修改选中图标为未选中状态
            contractTableRef.value.clearSelection();
            //将当前选中行改为选中状态
            contractTableRef.value.toggleRowSelection(selection[0]);
            selectionContract.value = selection[0]
        }
        // 点击行
        else {
            contractTableRef.value.clearSelection();
            contractTableRef.value.toggleRowSelection(selection);
            selectionContract.value = selection
        }
    }

</script>

<style lang="scss" scoped>
    /**找到表头那一行，然后把里面的复选框隐藏掉**/
    ::v-deep .el-table__header-wrapper .el-table__header .el-checkbox {
        display: none;
    }
</style>
