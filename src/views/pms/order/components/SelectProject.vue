<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="600" @close="closeDialog">
    <ContentWrap>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        v-loading="formLoading"
      >
        <el-form-item label="项目" prop="projectId">
          <el-select v-model="formData.projectId" placeholder="请选择项目" @change="chooseProject" clearable>
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.projectName+'('+item.projectCode+')'"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目编码" prop="projectCode">
          <el-input v-model="formData.projectCode" placeholder="请输入项目编码" disabled/>
        </el-form-item>
        <el-form-item label="是否需要评估" prop="needsAssessment">
          <el-select v-model="formData.needsAssessment" placeholder="请选择是否需要评估" disabled>
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_TYPE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目图号" prop="partNumber">
          <el-input v-model="formData.partNumber" placeholder="请输入图号" disabled/>
        </el-form-item>
        <el-form-item label="带料加工" prop="processType">
          <el-select v-model="formData.processType" placeholder="请选择带料加工" disabled>
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.PMS_PROCESS_TYPE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="整单外协" prop="outsource">
          <el-select v-model="formData.outsource" placeholder="请选择是否整单外协">
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ORDER_OUTSOURCE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物料牌号" prop="materialNumber" v-if="formData.processType===1&&formData.outsource===1">
          <el-select v-model="formData.materialNumber" placeholder="请选择物料" :disabled="ordertype">
            <el-option
              v-for="item in mpList"
              :key="item.id"
              :label="item.materialNumber"
              :value="item.materialNumber"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </ContentWrap>
    <el-table :data ="orderList">
      <el-table-column label="图号" align="center" prop="partNumber" />
      <el-table-column label="工件名称" align="center" prop="partName" />
      <el-table-column label="数量" align="center" prop="quantity" />
    </el-table>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="loading">确定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
  import { ApprovalApi, ApprovalVO } from '@/api/pms/pmsapproval'
  import { OrderApi, OrderVO } from '@/api/pms/order'
  import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
  import { useTagsViewStore } from '@/store/modules/tagsView'

  const { push, currentRoute } = useRouter() // 路由
  const { delView } = useTagsViewStore() // 视图操作

  const props = defineProps({
    projectStatus: {
      type: String,
      default: () => undefined
    },
    // orderList: {
    //   type: Array,
    //   default: () => []
    // }
  })

  const formData = ref({
    id: undefined,
    projectId: undefined,
    projectCode: undefined,
  })

  const formRef = ref()
  const projectList = ref<any[]>([])
  const orderList = ref<any[]>([])
  const dialogTitle = ref('选择项目') // 弹窗的标题
  const dialogVisible = ref(false)
  const loading = ref(true) // 列表的加载中
  const list = ref<any[]>([]) // 列表的数据
  const mpList = ref<any[]>([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const message = useMessage() // 消息弹窗
  //选中的数据
  const currentRow = ref()
  //当前数据索引
  const currentIndex = ref(-1)
  const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 5,
    projectCode: undefined,
    projectName: undefined,
    projectStatus: undefined,
  })

  const open = (row)=>{
    formData.value.id = row.id;
    formData.value.processType = row.processType;
    formData.value.partNumber = row.partNumber;
    dialogVisible.value = true;
    getList()
  }

  const getList = async ()=>{
    loading.value = true
    try {
      // projectList.value = await ApprovalApi.getByStatusList([]);
      projectList.value = await ApprovalApi.getByProjectStatusList([0]);
      mpList.value = await OrderApi.getMaterialByTypeCode("MP");
    } finally {
      loading.value = false
    }
  }

  /**
   * 实现单选行
   */
  const productTableRef = ref() // 表格的 Ref
  const handleCurrentChange = (row)=>{
    currentRow.value = {...toRaw(row)}
  }
  const checkPartNumberExist =async (rule,value,callback)=>{
    orderList.value.forEach((item=>{
      if(item.partNumber ===formData.value.partNumber){
        callback(new Error('图号已存在,请选择新项目'))
      }
    }))
    callback()
  }
  const formRules = reactive({
    projectId: [{ required: true, message: '项目id不能为空', trigger: 'blur' }],
    materialNumber: [{ required: true, message: '物料编号不能为空', trigger: 'blur' }],
    partNumber: [{ required: true, message: '图号不能为空', trigger: 'blur' },{validator: checkPartNumberExist,trigger: 'blur'}],
  })

  const submitForm = async ()=>{
    //不需要评审，就得先决定外协
    if(formData.value.needsAssessment ===0){
      if(formData.value.outsource === undefined){
        message.warning("请决定整单外协")
        return
      }
    }

    const data = formData.value as unknown as OrderVO
    try{
      loading.value = true;
      // 校验表单
      await formRef.value.validate()
      OrderApi.updateOrder(data)
    }finally {
      loading.value = false;
    }

    // 关闭当前 Tab
    delView(unref(currentRoute))
    push({name:'PmsOrder'})
    dialogVisible.value = false
  }

  const chooseProject = async (row)=>{
    if(row!=undefined){
      orderList.value =await OrderApi.getOrderByProjectId(row);
      projectList.value.forEach((item)=>{
        if(item.id===row){
          formData.value.projectCode = item.projectCode;
          formData.value.needsAssessment = item.needsAssessment;
          formData.value.projectName = item.projectName;
        }
      })
    }else {
      formData.value.projectCode = undefined;
      formData.value.needsAssessment = undefined;
      formData.value.projectName = undefined;
      orderList.value = [];
    }
  }

  const closeDialog = ()=>{
    resetForm();
  }
  /** 重置表单 */
  const resetForm = () => {
    formData.value = {
      id: undefined,
      projectId: undefined,
      projectCode: undefined,
      projectName: undefined,
      partNumber:undefined,
      needsAssessment:undefined,
      processType:undefined,
      outsource: undefined,
      materialNumber: undefined,
    }
    formRef.value?.resetFields()
  }


  defineExpose({open})
</script>

<style scoped>

</style>
