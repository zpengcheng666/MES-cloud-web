<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1200">

    <!-- 列表 -->
    <ContentWrap>
      <el-table v-loading="loading" ref="materialConfigTableRef" :data="list" :stripe="true"
                :show-overflow-tooltip="true"
                @select-all="handleSelectionChange"
                @select="handleSelectionChange"
                :selectable="checkSelectable"
      >

        <el-table-column width="30" label="选择" type="selection" :selectable="checkSelectable"/>
        <el-table-column label="物料名称" align="center" prop="materialName"/>
        <el-table-column label="物料条码" align="center" prop="barCode"/>
        <el-table-column label="物料编号" align="center" prop="materialNumber"/>
        <!--<el-table-column label="收货单" align="center" prop="no"/>-->

        <!--<el-table-column label="收货单名" align="center" prop="name"/>-->
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
      <el-button @click="submitForm" type="primary" :disabled="formLoading">签收</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
    import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
    import {dateFormatter} from '@/utils/formatTime'
    import { ConsignmentInfoApi, ConsignmentInfoVO } from '@/api/ppm/consignmentinfo'
    const {push} = useRouter() // 路由

    /** 物料库存 列表 */
    defineOptions({name: 'ConsignmentDetailChoose'})

    const message = useMessage() // 消息弹窗
    const {t} = useI18n() // 国际化
    const dialogVisible = ref(false) // 弹窗的是否展示
    const dialogTitle = ref('') // 弹窗的标题
    const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
    const loading = ref(true) // 列表的加载中
    const list = ref < MaterialStockVO[] > ([]) // 列表的数据
    const total = ref(0) // 列表的总页数
    const check = ref();
    const formType = ref('') // 表单的类型：create - 新增；update - 修改

    const formData = ref({
        id: undefined,
        consignmentId: undefined,
        contractId: undefined,
        orderId: undefined,
        materialId: undefined,
        consignedAmount: undefined,
        signedAmount: undefined,
        signedBy: undefined,
        signedTime: undefined,
        projectId: undefined,
        projectOrderId: undefined,
        projectPlanId: undefined,
        projectPlanItemId: undefined,
        consignmentStatus: undefined,
        consignmentType: undefined,
        ids:[]
    })
    const props = defineProps < {
        material: undefined, //  当前选中行
        orderInfo: undefined
    } > ()

    const queryParams = reactive({
        pageNo: 1,
        pageSize: 10,
        createTime: [],
        infoId: undefined,
    })

    const infoId = ref()
    const queryFormRef = ref() // 搜索的表单
    // const materialTypeList = ref() //物料类型
    // const warehouseLocationList = ref() //库位
    // const materialStorageList = ref() //储位
    /** 查询列表 */
    const getList = async () => {
        loading.value = true
        try {

            const data = await ConsignmentInfoApi.getConsignmentDetailPage(queryParams)
            list.value = data.list
            total.value = data.total

            // materialTypeList.value = await MaterialConfigApi.getMaterialConfigList()
            // warehouseLocationList.value = await WarehouseLocationApi.getWarehouseLocationList()
            // materialStorageList.value = await MaterialStorageApi.getMaterialStorageList()
        } finally {
            loading.value = false
        }
    }

    //复选框 启用禁用
    const checkSelectable = (row) => {
        return true
    }


    /** 打开弹窗 */
    const open = async (type: string, id
        ? : string
    ) =>
    {
        dialogVisible.value = true
        dialogTitle.value = '物料选择'
        formType.value = ''
        formInfo.value = undefined
        check.value=[];
        formData.value.ids=[];
        // 修改时，设置数据
        if (id) {
            formLoading.value = true
            try {
                queryParams.infoId = id
                infoId.value = id;
                formData.value.id = id;
            } finally {
                formLoading.value = false
            }
        }

        getList();
    }
    defineExpose({open}) // 提供 open 方法，用于打开弹窗


    const formValue = ref()
    const formInfo = reactive({

        materialNumber: undefined,
        materialUnit: undefined,
        quantity: undefined,
        finishQuantity: undefined,
        materialId: undefined,
        orderId: undefined,
    })


    const materialConfigTableRef = ref();

    const handleSelectionChange = (selection) => {

        // 点击复选框
        if (selection instanceof Array) {

            check.value = selection

        }

    }


    const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
    const submitForm = async () => {

        formLoading.value = true
        try {
            dialogVisible.value = false
            check.value.forEach((item, index) => {
                 formData.value.ids.push(item.id)
            })
            const data = formData.value as unknown as ConsignmentInfoVO
            await ConsignmentInfoApi.signMaterial(data)

            // 发送操作成功的事件
            emit('success')
        } finally {
            formLoading.value = false
        }
    }


    /** 搜索按钮操作 */
    const handleQuery = () => {

        if (queryParams.materialConfigId == undefined) {
            message.error(t('请先选择物料类型'))
            return;
        }
        queryParams.pageNo = 1
        getList()
    }

    /** 重置按钮操作 */
    const resetQuery = () => {
        queryFormRef.value.resetFields()
        handleQuery()
    }


    const showSearch = ref(true)

    function search() {
        if (showSearch.value) {
            showSearch.value = false
        } else {
            showSearch.value = true
        }

    }

</script>

<style lang="scss" scoped>

</style>
