<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="60%">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item prop="templateName" label="模版名称">
            <el-input :disabled="formType === 'detail'" v-model="formData.templateName" placeholder="请输入模版名称"
                      class="!w-240px" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="物料类别" prop="materialTypeId">
            <el-tree-select placeholder="请选择物料类别" check-strictly :props="defaultProps" default-expand-all
                            :disabled="formType === 'detail'" :data="materialTypeTreeList" :render-after-expand="false"  v-model="formData.materialTypeId"/>
          </el-form-item>
        </el-col>
<!--        <el-col :span="6">-->
<!--          <el-form-item label="物料编号" prop="toolNumber">-->
<!--              <el-input :disabled="formType === 'detail'"  @click="openToolTypeDialog" v-model="formData.toolNumber" placeholder="请选择物料编号" readonly />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
      </el-row>

      <!-- 几何参数 -->
      <el-row>
        <el-col>
          <el-card shadow="never">
            <template #header>
              <div class="clearfix">
                <span>几何参数</span>
              </div>
            </template>
            <div style="margin-bottom: 10px" v-if="formType !== 'detail'">
              <el-button type="primary" @click="handleGeoAdd">添加参数</el-button>
            </div>
            <el-table :data="formData.geoList" border style="width: 100%; text-align: center">
              <el-table-column prop="name" label="名称" align="center">
                <template #default="{ $index, row }">
                  <el-input v-if="formType !== 'detail'" placeholder="请输入" v-model="formData.geoList[$index].name"
                            :maxLength="64" />
                  <span v-else>{{ row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="abbr" label="缩写" align="center">
                <template #default="{ $index, row }">
                  <el-input v-if="formType !== 'detail'" placeholder="请输入" v-model="formData.geoList[$index].abbr"
                            :maxLength="16" />
                  <span v-else>{{ row.abbr }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="unit" label="单位" align="center">
                <template #default="{ $index, row }">
                  <el-input v-if="formType !== 'detail'" placeholder="请输入" v-model="formData.geoList[$index].unit"
                            :maxLength="16" />
                  <span v-else>{{ row.unit }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="sort" label="排序" align="center">
                <template #default="{ $index, row }">
                  <el-input-number v-if="formType !== 'detail'" placeholder="请输入" v-model="formData.geoList[$index].sort"
                                   :min="0" :max="10000" />
                  <span v-else>{{ row.sort }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center"  v-if="formType !== 'detail'">
                <template #default="scope">
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
      <!-- 切削参数 -->
      <el-row>
        <el-col>
          <el-card shadow="never">
            <template #header>
              <div class="clearfix">
                <span>切削参数</span>
              </div>
            </template>
            <div style="margin-bottom: 10px" v-if="formType !== 'detail'">
              <el-button type="primary" @click="handleCutAdd">添加参数</el-button>
            </div>
            <el-table :data="formData.cutList" border style="width: 100%; text-align: center">
              <el-table-column prop="name" label="名称" align="center">
                <template #default="{ $index, row }">
                  <el-input v-if="formType !== 'detail'" placeholder="请输入" v-model="formData.cutList[$index].name"
                            :maxLength="64" />
                  <span v-else>{{ row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="abbr" label="缩写" align="center">
                <template #default="{ $index, row }">
                  <el-input v-if="formType !== 'detail'" placeholder="请输入" v-model="formData.cutList[$index].abbr"
                            :maxLength="16" />
                  <span v-else>{{ row.abbr }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="unit" label="单位" align="center">
                <template #default="{ $index, row }">
                  <el-input v-if="formType !== 'detail'" placeholder="请输入" v-model="formData.cutList[$index].unit"
                            :maxLength="16" />
                  <span v-else>{{ row.unit }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="sort" label="排序" align="center">
                <template #default="{ $index, row }">
                  <!-- {{ scope }} -->
                  <el-input-number v-if="formType !== 'detail'" placeholder="请输入" v-model="formData.cutList[$index].sort"
                                   :min="0" :max="10000" />
                  <span v-else>{{ row.sort }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" v-if="formType !== 'detail'">
                <template #default="scope">
                  <el-button type="danger" size="small" @click="handleDelete(2, scope.$index)">
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

<!--  <ToolTypeChoose ref="toolTypeChooseRef" @getToolType="getToolType" />-->
<!--  <ToolTypeDialog ref="toolTypeForm" @success="selectToolInfo" />-->

</template>
<script setup lang="ts">
import { ToolParamTemplateApi, ToolParamTemplateVO } from '@/api/tms/toolparamtemplate'
import { FitConfigApi, FitConfigVO } from '@/api/tms/fitconfig'

import {MaterialTypeApi} from "@/api/mcc/materialtype";
import { handleTree } from '@/utils/tree'
import ToolTypeChoose from "./ToolTypeChoose.vue";
import ToolTypeDialog from '../toolconfig/ToolTypeDialog.vue'

/** 刀具参数模板 表单 */
defineOptions({ name: 'ToolParamTemplateForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

const formData = ref<{
  id?: number
  templeteName: string
  geoList: ListItem[]
  cutList: ListItem[]
  detailList: ListItem[]
}>({
  id: undefined,
  templateName: '',
  materialTypeId: '',
  // toolNumber: '',
  // toolConfigId: '',
  // toolTypeCode: undefined,
  geoList: [],
  cutList: [],
  detailList: []
})

interface ListItem {
  name: string
  abbr: string
  sort: number
  unit: string
  type: number
}

const formRules = reactive({
  templateName: [{required: true, message: '请输入模板名称', trigger: 'blur'}],
  materialTypeId: [{required: true, message: '请选择刀具类别', trigger: 'change'}],
  // toolNumber: [{required: true, message: '请选择刀具类型', trigger: 'change'}],
})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  // 获取刀具类别
  await getCategoryList()

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ToolParamTemplateApi.getToolParamTemplate(id)
      if (null === formData.value.cutList || undefined === formData.value.cutList) {
        formData.value.geoList = []
      }
      if (null === formData.value.cutList || undefined === formData.value.cutList) {
        formData.value.cutList = []
      }
      formData.value.detailList.forEach((item) => {
        if (item.type === 1) {
          formData.value.geoList.push(item)
        } else {
          formData.value.cutList.push(item)
        }
      })
      if (formData.value.geoList.length > 0) {
        formData.value.geoList.sort(sortList)
      }
      if (formData.value.cutList.length > 0) {
        formData.value.cutList.sort(sortList)
      }
    } finally {
      formLoading.value = false
    }
  }

  function sortList(a, b) {
    return a.sort - b.sort
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗


// 刀具分类
const materialTypeTreeList = ref<any>([]) // 刀具分类数据
/** 获取刀具分类树 */
const getCategoryList = async () => {
  const data = await MaterialTypeApi.getMaterialTypeList()
  materialTypeTreeList.value = handleTree(data.filter((item) => item.code != 'CP'), 'id', 'parentId').filter((item) => item.code == 'DJ')
}

const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id',
  isLeaf: 'leaf',
  emitPath: false // 用于 cascader 组件：在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
}


/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    formData.value.detailList = formData.value.geoList.concat(formData.value.cutList)
    const data = formData.value as unknown as ToolParamTemplateVO
    if (formType.value === 'create') {
      await ToolParamTemplateApi.createToolParamTemplate(data)
      message.success(t('common.createSuccess'))
    } else {
      await ToolParamTemplateApi.updateToolParamTemplate(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    templateName: '',
    materialTypeId: '',
    // toolNumber: '',
    // toolConfigId: '',
    // toolTypeCode: undefined,
    version: undefined,
    geoList: [],
    cutList: [],
    detailList: []
  }
  formRef.value?.resetFields()
}


const handleGeoAdd = () => {
  let item = {
    name: '',
    abbr: '',
    sort: 0,
    unit: '',
    type: 1
  }
  if (null === formData.value.geoList || undefined === formData.value.geoList) {
    formData.value.geoList = []
  }
  formData.value.geoList.push(item)
}

const handleCutAdd = () => {
  let item = {
    name: '',
    abbr: '',
    sort: 0,
    unit: '',
    type: 2
  }
  if (null === formData.value.cutList || undefined === formData.value.cutList) {
    formData.value.cutList = []
  }
  formData.value.cutList.push(item)
}

// 删除选中数据
const handleDelete = async (type: number, index: number) => {
  await message.confirm(`确定删除此条数据吗？`)
  if (type == 1) {
    formData.value.geoList.splice(index, 1)
  }

  if (type == 2) {
    formData.value.cutList.splice(index, 1)
  }
}

</script>
