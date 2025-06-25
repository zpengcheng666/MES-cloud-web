<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" >
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="140px"
    >
      <el-form-item label="典型工艺路线名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入典型工艺路线名称" />
      </el-form-item>
      <el-form-item label="工序名称" prop="procedureName">
        <el-select
          v-model="formData.procedureName"
          filterable
          clearable
          class="!w-200px"
        >
          <el-option
            v-for="na in procedureList"
            :key="na.name"
            :label="na.name"
            :value="na.name"
          />
        </el-select>
      </el-form-item>
      <el-row style="margin-bottom:20px">
        <el-col :span="5">
          <el-form-item label="选择路线" />
        </el-col>
        <el-col :span="5">
          <el-table :data="dataProcessList" :border="1"
                    style="max-width: 150px;max-height :300px;cursor: pointer;overflow-y: auto" highlight-current-row
                    @row-click="dataRouteChange" @rowDblclick="addItem">
            <el-table-column prop="name" />
          </el-table>
        </el-col>
        <el-col :span="2">
          <div style="text-align: center">
            <el-button @click="addItem" style="width:30px;background-color:#409eff;color:#fff">&gt;&gt;</el-button>
          </div>
          <div style="text-align: center">
            <el-button @click="deleteItem" style="width:30px;background-color:#ff405d;color:#fff;">--</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <el-table :data="dataRouteListSecond" :border="1"
                    style="max-width: 200px;max-height :300px;cursor: pointer;overflow-y: auto">
            <el-table-column prop="name" />
            <el-table-column :width="60" align="center">
              <template #default="{ $index }">
                <el-button link type="danger" @click="handleDeleteRoute($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-form-item label="工艺路线" prop="processRouteName">
        <el-input v-model="formData.processRouteName" disabled />
      </el-form-item>
      <el-form-item label="典型工艺路线描述" prop="description">
        <el-input v-model="formData.description" placeholder="请输入典型工艺路线描述" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { ProcessRouteTypicalApi,ProcessRouteTypicalVO }  from '@/api/pdm/processRouteTypical'
import {ProcessPlanApi} from "@/api/pdm/processPlan";
import {onMounted} from "vue";
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
defineOptions({ name: 'ProcessRouteTypicalForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const procedureList = ref<any[]>([]); //获取工序名列表

const dataProcessList = ref([])
const dataRouteListSecond = ref<any[]>([])

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: '',
  name: '',
  procedureName: '',
  processRouteName: '',
  description: '',
  leftName: undefined,
})
const formRules = reactive({
  name: [{ required: true, message: '典型工艺路线名称不能为空', trigger: 'blur' }],
  procedureName: [{ required: true, message: '请选择工序名称', trigger: 'blur' }],
  processRouteName: [{ required: true, message: '请选择工艺路线', trigger: 'blur' }],
  description: [{ required: true, message: '典型工艺路线描述不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ProcessRouteTypicalApi.getProcessRouteTypical(id)
    } finally {
      formLoading.value = false
    }
  }
  await generateData()
}

/** 查询工序列表，只做获取name用 */
const getProcedureList = async () => {
  procedureList.value = await ProcessPlanApi.getProcessRouteList(null)
  // 暂过滤荧光线、热处理
  procedureList.value = procedureList.value.filter((item) => item.name === '荧光线' || item.name === '热处理')
};

const generateData = async () => {
  dataProcessList.value = [];
  dataRouteListSecond.value = [];
  for (const dict of getIntDictOptions(DICT_TYPE.PDM_PROCESS_ROUTE)) {
    dataProcessList.value.push({
      name: dict.label as string
    })
  }
  if(formData.value.processRouteName) {
    let routeSecondArr = formData.value.processRouteName.split("-")
    routeSecondArr.forEach((item) => {
      dataRouteListSecond.value.push({
        name: item
      })
    })
  }
}

/** 监听工艺路线选中事件 */
const dataRouteChange = async (val) => {
  formData.value.leftName = val.name;
}

const addItem = async () => {
  //工艺路线左→右
  dataProcessList.value.forEach((item) => {
    if (item.name === formData.value.leftName) {
      dataRouteListSecond.value.push(item)
    }
  })
  //工艺路线文本赋值
  const routeName = ref("")
  dataRouteListSecond.value.forEach(item => {
    routeName.value = routeName.value + item.name + "-"
  })
  if (routeName.value && routeName.value.lastIndexOf("-")) {
    routeName.value = routeName.value.substring(0, routeName.value.length - 1)
  }
  formData.value.processRouteName = routeName.value
}

const deleteItem = async () => {
  dataRouteListSecond.value = []
  formData.value.processRouteName = ''
}

/** 删除右侧加工路线 */
const handleDeleteRoute = async (index) => {
  dataRouteListSecond.value.splice(index, 1)
  //加工路线文本赋值
  const routeName = ref("")
  dataRouteListSecond.value.forEach(item => {
    routeName.value = routeName.value + item.name + "-"
  })
  if (routeName.value && routeName.value.lastIndexOf("-")) {
    routeName.value = routeName.value.substring(0, routeName.value.length - 1)
  }
  formData.value.processRouteName = routeName.value
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    name: '',
    procedureName: '',
    processRouteName: '',
    description: ''
  }
  formRef.value?.resetFields()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ProcessRouteTypicalVO
    if (formType.value === 'create') {
      await ProcessRouteTypicalApi.createProcessRouteTypical(data)
      message.success(t('common.createSuccess'))
    } else {
      await ProcessRouteTypicalApi.updateProcessRouteTypical(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}
onMounted(async () => {
  await getProcedureList();
});
</script>

<style scoped>

</style>
