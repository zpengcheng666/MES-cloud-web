<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1200">

    <!-- 列表 -->
    <ContentWrap>
      <el-table v-loading="loading" ref="materialConfigTableRef" :data="orderInfo" :stripe="true"
                :show-overflow-tooltip="true"
                @select-all="handleSelectionChange"
                @select="handleSelectionChange"
                :selectable="checkSelectable"
      >
        <!--      <el-table-column label="ID" align="center" prop="id" />-->

        <!--<el-table-column align="center" width="55" label="选择">-->

        <!--&lt;!&ndash; 可以手动的修改label的值，从而控制选择哪一项 &ndash;&gt;-->
        <!--<el-radio class="radio" v-model="templateSelection" :label="scope.row.id"-->
        <!--&gt;&nbsp;</el-radio-->
        <!--&gt;-->
        <!---->
        <!--</el-table-column>-->
        <el-table-column width="30" label="选择" type="selection" :selectable="checkSelectable"/>
        <el-table-column label="物料名称" align="center" prop="materialName"/>
        <el-table-column label="物料条码" align="center" prop="barCode"/>
        <el-table-column label="物料编号" align="center" prop="materialNumber"/>
        <el-table-column label="收货单" align="center" prop="no"/>

        <el-table-column label="收货单名" align="center" prop="name"/>

        <!--<el-table-column label="绑定物料" align="center" prop="stockBarcode" />-->
        <!--<el-table-column label="绑定储位" align="center" prop="storageCode" />-->
        <!--<el-table-column label="绑定库位" align="center" prop="locationCode" />-->
        <!--<el-table-column label="绑定类型" align="center" prop="bindType">-->
        <!--<template #default="scope">-->
        <!--<dict-tag :type="DICT_TYPE.WMS_BIND_TYPE" :value="scope.row.bindType" />-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="总库存" align="center" prop="totality"/>-->
        <!--<el-table-column label="锁定库存" align="center" prop="locked"/>-->
        <!--<el-table-column label="可用库存" align="center" prop="available"/>-->
        <!--&lt;!&ndash;      <el-table-column label="容器满载比例" align="center" prop="byOccupancyRatio" />&ndash;&gt;-->
        <!--<el-table-column label="占用比例" align="center" prop="occupancyRatio"/>-->
        <!--<el-table-column-->
          <!--label="创建时间"-->
          <!--align="center"-->
          <!--prop="createTime"-->
          <!--:formatter="dateFormatter"-->
          <!--width="180px"-->
        <!--/>-->
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
  import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
  import {dateFormatter} from '@/utils/formatTime'
  import {MaterialStockApi, MaterialStockVO} from '@/api/wms/materialstock'

  import {MaterialConfigApi} from "@/api/wms/materialconfig";
  import {WarehouseLocationApi} from "@/api/wms/warehouselocation";
  import {MaterialStorageApi} from "@/api/wms/materialstorage";

  const {push} = useRouter() // 路由

  /** 物料库存 列表 */
  defineOptions({name: 'ConsignmentDetailMaterialStock'})

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

  const props = defineProps < {
    material: undefined, //  当前选中行
    orderInfo: undefined
  } > ()

  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    createTime: [],
    materialConfigId: undefined,
    barCode: undefined,
    batchNumber: undefined,
    materialId: undefined,
    storageId: undefined,
    locationId: undefined,
    bindType: undefined,
      warehouseAreaTypes:[1]
  })
  const queryFormRef = ref() // 搜索的表单
  // const materialTypeList = ref() //物料类型
  // const warehouseLocationList = ref() //库位
  // const materialStorageList = ref() //储位
  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      // const data = await MaterialStockApi.getMaterialStockPage(queryParams)
      // list.value = data.list
      // total.value = data.total

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
    // if (formInfo.orderId == undefined || row.available ==0) {
    //   return false
    // } else {
    //     return true
    // }

  }


  /** 打开弹窗 */
  const open = async (type: string, id
    ? : string, confirmStatus ? : number
  ) =>
  {
    dialogVisible.value = true
    dialogTitle.value = '产品选择'
    formType.value = ''
    formInfo.value = undefined
    // 修改时，设置数据
    if (id) {
      formLoading.value = true
      try {
        queryParams.materialConfigId = id

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
  /** 处理产品变更 */
  const onChangeOrder = (orderId) => {
    const order = props.orderInfo.find((item) => item.materialId === orderId)
    if (order) {
      formInfo.materialNumber = order.materialNumber
      formInfo.materialUnit = order.materialUnit
      formInfo.quantity = order.quantity
      formInfo.finishQuantity = order.finishQuantity
      formInfo.materialId = order.materialId
      formInfo.orderId = order.id
      formInfo.materialName = order.materialName
      formInfo.remainingQuantity = order.remainingQuantity

      handleQuery();
    } else {
      formInfo.materialNumber = undefined
      formInfo.materialUnit = undefined
      formInfo.quantity = undefined
      formInfo.finishQuantity = undefined
      formInfo.materialId = undefined
      formInfo.orderId = undefined
      formInfo.materialName = undefined
      formInfo.remainingQuantity = undefined

      getList();
    }
  }


  const materialConfigTableRef = ref();

  const handleSelectionChange = (selection) => {

    // 点击复选框
    if (selection instanceof Array) {
      // 点击复选框传数组
      // if (selection.length > 1) {
      //   //移除上一次选中行数据
      //   selection.shift();
      // }
      //修改选中图标为未选中状态
      // materialConfigTableRef.value.clearSelection();
      // //将当前选中行改为选中状态
      // materialConfigTableRef.value.toggleRowSelection(selection[0]);
       check.value = selection

      // check.value.forEach((item, index) => {
      //   item.materialNumber = formInfo.materialNumber
      //   item.materialUnit = formInfo.materialUnit
      //   item.quantity = formInfo.quantity
      //   item.finishQuantity = formInfo.finishQuantity
      //   item.materialId = formInfo.materialId
      //   item.orderId = formInfo.orderId
      //   item.materialName = formInfo.materialName
      // })

    }
    // 点击行
    // else {
    //   materialConfigTableRef.value.clearSelection();
    //   materialConfigTableRef.value.toggleRowSelection(selection);
    //   check.value = selection
    // }
  }


  const emit = defineEmits(['getStock']) // 定义 success 事件，用于操作成功后的回调
  const submitForm = async () => {

    formLoading.value = true
    try {
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('getStock', check.value, props.material)
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

  // /** 初始化 **/
  // onMounted(() => {
  //   getList()
  // })
</script>

<style lang="scss" scoped>

</style>
