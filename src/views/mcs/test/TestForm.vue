<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <Form ref="formRef" :schema="formSchemaT.formSchema"/>
    <template #footer>
      <el-button @click="submitForm" type="primary">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {CrudSchema} from "@/hooks/web/useCrudSchemas";
import request from "@/config/axios";
import {FormSchema} from "@/types/form";
import {dateFormatter} from "@/utils/formatTime";
import {DistributionApplicationApi} from "@/api/mcs/distributionapplication";

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formRef = ref() // 表单 Ref
const formSchemaT = ref<FormSchema[]>()
let dialogFormName = '' // 表单 Ref
let dialogSubmitName = '' // 表单 Ref
let dataT = {} // 表单 Ref

/** 打开弹窗 */
const open = async (title: string, formName: string, submitName: string, data: any) => {
  dialogVisible.value = true;
  dialogTitle.value = title;
  dialogFormName = formName;
  formSchemaT.value = useCrudSchemas(allSchemas[dialogFormName]).allSchemas;
  dialogSubmitName = submitName;
  dataT = data;
}

const doFun = async (submitName: string, data: any) => {
  await message.confirm("执行操作", "执行确认")
  const msg = await ReceiptRecordApi[submitName](data)
  message.success(msg);
}
defineExpose({ open, doFun }) // 提供: open 方法，用于打开弹窗, doFun 方法，用于执行方法

/** 提交表单 */
const submitForm = async () => {
  formRef.value.setValues(dataT)
  const data = formRef.value.formModel
  const msg = await ReceiptRecordApi[dialogSubmitName](data)
  message.success(msg);
  dialogVisible.value = false
}

const allSchemas: any = {
  batchRecordStart: reactive<CrudSchema[]>(
    [
      {
        label: '批次编码id',
        field: 'batchRecordId',
        form: {
          show: false
        }
      },
      {
        label: '产线/设备',
        field: 'deviceUnitId',
        form: {
          component: 'Select',
          componentProps: {
            optionsAlias: {
              labelField: 'name',
              valueField: 'id'
            }
          },
          api: DistributionApplicationApi.getUnitList
        }
      },
      {
        label: '物料条码',
        field: 'barCode',
      },
    ]
  ),

};

const ReceiptRecordApi = {
  // 新增生产单元签收记录
  batchRecordStart: async (data: any) => {
    return await request.post({ url: `/mcs/test/batchRecordStart`, data })
  },
  batchRecordEnd: async (data: any) => {
    return await request.post({ url: `/mcs/test/batchRecordEnd`, data })
  },
  materialReception: async (data: any) => {
  return await request.post({ url: `/mcs/test/materialReception`, data })
},
}




</script>
