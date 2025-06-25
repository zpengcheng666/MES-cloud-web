<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="60%" class="tool-group-dialog">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="刀组编码" prop="materialNumber">
            <el-input :disabled="formType === 'view'"  @click="openToolTypeDialog" v-model="formData.materialNumber" placeholder="请输入刀组编码" readonly class="!w-240px" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-card shadow="never">
            <template #header>
              <div class="clearfix">
                <span><span style="color: red">*</span>刀柄选择</span>
              </div>
            </template>
            <div style="margin-bottom: 10px" v-if="formType !== 'view'">
              <el-button type="primary" @click="openFitToolTypeDialog(1)">选择刀柄</el-button>
            </div>
            <el-table :data="formData.handle" border style="width: 100%;">
              <el-table-column
                prop="materialCode"
                label="刀柄类码"
                align="center"
                width="180"
              />
              <el-table-column prop="materialName" label="刀柄名称" align="center" />
              <el-table-column prop="toolModel" label="型号" align="center" />
              <el-table-column label="操作" align="center">
                <template #default="scope" v-if="formType !== 'view'">
                  <el-button type="danger" size="small" @click="handleDelete(1, scope.$index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col>
          <el-card shadow="never">
            <template #header>
              <div class="clearfix">
                <span><span style="color: red">*</span>刀具选择</span>
              </div>
            </template>
            <div style="margin-bottom: 10px" v-if="formType !== 'view'">
              <el-button type="primary" @click="openFitToolTypeDialog(2)">选择刀具</el-button>
            </div>
            <el-table :data="formData.tool" border style="width: 100%;">
              <el-table-column prop="materialCode" label="刀具类码" align="center" />
              <el-table-column prop="materialName" label="刀具名称" align="center" />
              <el-table-column prop="toolModel" label="型号" align="center" />
              <el-table-column prop="site" label="刀位" align="center">
                <template #default="scope">
                  <el-input-number v-model="scope.row.site" :min="1" :max="99" @focus="history(scope.row)" @blur="checkLocation(scope.row, scope.$index)" v-if="scope.row.materialCode!='DT'"/>
                  <span v-else>{{scope.row.site}}</span>
                </template>
              </el-table-column>

              <el-table-column label="操作" align="center">
                <template #default="scope" v-if="formType !== 'view'">
                  <el-button type="danger" size="small" @click="handleDelete(2, scope.$index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col>
          <el-card shadow="never">
            <template #header>
              <div class="clearfix">
                <span>配件选择</span>
              </div>
            </template>
            <div style="margin-bottom: 10px" v-if="formType !== 'view'">
              <el-button type="primary" @click="openFitToolTypeDialog(3)">选择配件</el-button>
            </div>
            <el-table :data="formData.accessories" border style="width: 100%;">
              <el-table-column prop="materialCode" label="配件类码" align="center" />
              <el-table-column prop="materialName" label="配件名称" align="center" />
              <el-table-column prop="count" label="数量" align="center">
                <template #default="scope">
                  <el-input-number v-model="scope.row.count" :min="1" :max="99" />
                </template>
              </el-table-column>

              <el-table-column label="操作" align="center">
                <template #default="scope" v-if="formType !== 'view'">
                  <el-button type="danger" size="small" @click="handleDelete(3, scope.$index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <ToolTypeChoose ref="toolTypeChooseRef" @getToolType="getToolType" />
  <ToolTypeDialog ref="toolTypeForm" @success="selectToolInfo" />

</template>
<script setup lang="ts">
import { GroupApi, GroupVO } from '@/api/tms/group'
import ToolTypeChoose from "@/views/tms/toolparamtemplate/ToolTypeChoose.vue";
import ToolTypeDialog from "./ToolTypeDialog.vue";

/** 刀具组装 表单 */
defineOptions({ name: 'GroupForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  materialNumber: undefined,
  mainConfigId: undefined,
  handle: [],
  tool: [],
  accessories: [],
})
const formRules = reactive({
  materialNumber: [{ required: true, message: '刀组编码不能为空!', trigger: 'change' }],
  // handle: [{ required: true, message: '刀柄必须选择!', trigger: 'change' }],
  // tool: [{ required: true, message: '刀具必须选择!', trigger: 'change' }],
  // accessories: [{ required: false, message: '配件必须选择!', trigger: 'change' }]
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
      formData.value = await GroupApi.getGroup(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const toolTypeChooseRef = ref()
const openToolTypeDialog = () => {
  toolTypeChooseRef.value.open(null, 'CP')
}

//选择刀具编码
const getToolType = async (toolType: MaterialConfigVO) => {
  // 验证成品刀具是否保存过
  const data = await GroupApi.getGroupByMainConfigId(toolType.id)
  if(data.length > 0){
    message.error('当前成品刀具已经存在装配信息！')
    return
  }
  formData.value.materialNumber = toolType.materialNumber
  formData.value.mainConfigId = toolType.id
}

// 刀具信息组件
const toolTypeForm = ref()
const openFitToolTypeDialog = (type: any) => {
  // 选择刀柄 (根据已选择的刀具匹配)
  if(type === 1){
    const ids = formData.value.tool.map((item) => item.id)
    toolTypeForm.value.open(type, ids)
  }
  // 刀具 (根据已选择的刀柄和配件匹配)
  if(type === 2){
    const ids = formData.value.handle.concat(formData.value.accessories).map((item) => item.id)
    toolTypeForm.value.open(type, ids)
  }
  // 配件 (通过已选择的刀具进行匹配)
  if(type === 3){
    const ids = formData.value.tool.map((item) => item.id)
    toolTypeForm.value.open(type, ids)
  }
}

// 选中的刀具信息
const selectToolInfo = (json: any) => {
  changeData(json.selection, json.type)
}

const changeData = (arr, type) => {
  // 刀柄
  if (type === 1) {
    if (arr.length > 1) {
      message.error('只能选择一个刀柄！')
      return
    }
    if (formData.value.handle.length > 0) {
      message.error('刀柄已经选择，重新选择请先清空刀柄！')
      return
    }
  }

  // 刀具
  if (type === 2) {
    // 过滤刀头
    const arrDT = arr.filter((item) => item.materialTypeCode == 'DT')
    if (arrDT.length > 1) {
      message.error('只能选择一个刀头！')
      return
    }

    // 过滤刀头
    const arrToolDT = formData.value.tool.filter((item) => item.materialCode == 'DT')
    if (arrToolDT.length > 0 && arrDT.length > 0) {
      message.error('刀头已经选择，重新选择请先清空刀头！')
      return
    }
  }


  return arr.map((item) => {
    // const { id, code, toolCategoryValue, name, location } = item
    const { id, toolName, materialTypeCode, toolModel } = item
    // 刀柄
    if (type == 1) {
      const obj = formData.value.handle.find((c) => c.accessoryConfigId === id)
      if (obj === undefined)
        formData.value.handle.push({
          id: id,
          mainConfigId: formData.value.mainConfigId,
          materialName: toolName,
          materialCode: materialTypeCode,
          toolModel: toolModel,
          site: undefined,
          count: 1,
          accessoryConfigId: id
        })
    }

    // 刀具
    if (type == 2) {
      const obj = formData.value.tool.find((c) => c.accessoryConfigId === id)
      if (obj === undefined)
        formData.value.tool.push({
          id: id,
          mainConfigId: formData.value.mainConfigId,
          materialName: toolName,
          materialCode: materialTypeCode,
          toolModel: toolModel,
          site: materialTypeCode == 'DT' ? 1 : formData.value.tool.filter((item) => item.materialCode != 'DT').length + 1,
          count: undefined,
          accessoryConfigId: id
        })
    }
    // 配件
    if (type == 3) {
      const obj = formData.value.accessories.find((c) => c.accessoryConfigId === id)
      if (obj === undefined)
        formData.value.accessories.push({
          id: id,
          mainConfigId: formData.value.mainConfigId,
          materialName: toolName,
          materialCode: materialTypeCode,
          toolModel: toolModel,
          site: undefined,
          count: 1,
          accessoryConfigId: id
        })
    }
  })
}

// 删除选中数据
const handleDelete = async (type: number, index: number, row: any) => {
  await message.confirm(`确定删除此条数据吗？`)
  if (type == 1) {
    formData.value.handle.splice(index, 1)
  }

  if (type == 2) {
    formData.value.tool.splice(index, 1)
  }

  if (type == 3) {
    formData.value.accessories.splice(index, 1)
  }
}

//校验刀具位置是否重复
const checkLocation = (row: any, _index: number) => {
  if (row.site == undefined) {
    return
  }
  const dataSource = [...formData.value.tool]
  let data = dataSource.filter((item, i) => i !== _index && item.materialCode != 'DT')
  for (let j = 0; j < data.length; j++) {
    if (data[j].site == row.site) {
      message.error('刀具位置不能重复！')
      for (let i = 0; i < formData.value.tool.length; i++) {
        if (i == _index) {
          formData.value.tool[i].site = historyData.value
          return
        }
      }
    }
  }
}

const historyData = ref()
const history = (row: any) => {
  historyData.value = row.site
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    if (formType.value === 'create') {
      await GroupApi.createGroup(formData.value)
      message.success(t('common.createSuccess'))
    } else {
      await GroupApi.updateGroup(formData.value)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    materialNumber: undefined,
    mainConfigId: undefined,
    handle: [],
    tool: [],
    accessories: [],
  }
  formRef.value?.resetFields()
}
</script>


<style>
.tool-group-dialog .el-input-number .el-input__inner{
  text-align: center;
}
</style>
