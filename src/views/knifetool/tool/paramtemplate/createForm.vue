<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="70%">
    <el-form ref="updateFormRef" :model="formData" :rules="formRules" v-loading="formLoading" inline>
      <!-- 模板名称、刀具分类、刀具类型 -->
      <el-form-item prop="templeteName" label="模版名称">
        <el-input :disabled="formType === 'view'" v-model="formData.templeteName" placeholder="请输入模版名称"
          class="!w-240px" />
      </el-form-item>

      <el-form-item label="刀具分类" prop="toolCategoryId">
        <el-tree-select :disabled="formType !== 'create'" placeholder="请选择刀具或刀柄分类" check-strictly :props="defaultProps"
          v-model="formData.toolCategoryId" :data="treeSelect" :render-after-expand="false" @change="handleChange"
          class="!w-240px" />
      </el-form-item>

      <el-form-item prop="toolType" label="刀具类型" v-if="isTypeItemExit">
        <el-select :disabled="formType !== 'create'" v-model="formData.toolType" placeholder="请选择刀具类型" clearable
          class="!w-240px">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_CUTTER_TYPE)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <!-- 几何参数 -->
      <el-row>
        <el-col>
          <el-card shadow="never">
            <template #header>
              <div class="clearfix">
                <span>几何参数</span>
              </div>
            </template>
            <div style="margin-bottom: 10px" v-if="formType !== 'view'">
              <el-button type="primary" @click="handleGeoAdd">添加参数</el-button>
            </div>
            <el-table :data="formData.geoList" border style="width: 100%; text-align: center">
              <el-table-column prop="name" label="名称" align="center">
                <template #default="{ $index, row }">
                  <el-input v-if="formType !== 'view'" placeholder="请输入" v-model="formData.geoList[$index].name"
                    :maxLength="64" />
                  <span v-else>{{ row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="abbr" label="缩写" align="center">
                <template #default="{ $index, row }">
                  <el-input v-if="formType !== 'view'" placeholder="请输入" v-model="formData.geoList[$index].abbr"
                    :maxLength="16" />
                  <span v-else>{{ row.abbr }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="unit" label="单位" align="center">
                <template #default="{ $index, row }">
                  <el-input v-if="formType !== 'view'" placeholder="请输入" v-model="formData.geoList[$index].unit"
                    :maxLength="16" />
                  <span v-else>{{ row.unit }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="sort" label="排序" align="center">
                <template #default="{ $index, row }">
                  <el-input-number v-if="formType !== 'view'" placeholder="请输入" v-model="formData.geoList[$index].sort"
                    :min="0" :max="10000" />
                  <span v-else>{{ row.sort }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template #default="scope" v-if="formType !== 'view'">
                  <el-popover :visible="scope.row.visible !== undefined" placement="top" :width="160">
                    <p>确定要删除此条数据吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="small" @click="scope.row.visible = undefined">取消</el-button>
                      <el-button size="small" type="primary" @click="handleDelete(1, scope.$index)">
                        确定
                      </el-button>
                    </div>
                    <template #reference>
                      <el-button type="danger" size="small" @click="scope.row.visible = true">
                        删除
                      </el-button>
                    </template>
                  </el-popover>
                </template>
              </el-table-column>
              <template #empty>
                <div class="empty">
                  <img src="@/assets/imgs/no_data.jpg" style="height: 135px; width: 250px" /><br />
                </div>
              </template>
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
            <div style="margin-bottom: 10px" v-if="formType !== 'view'">
              <el-button type="primary" @click="handleCutAdd">添加参数</el-button>
            </div>
            <el-table :data="formData.cutList" border style="width: 100%; text-align: center">
              <el-table-column prop="name" label="名称" align="center">
                <template #default="{ $index, row }">
                  <el-input v-if="formType !== 'view'" placeholder="请输入" v-model="formData.cutList[$index].name"
                    :maxLength="64" />
                  <span v-else>{{ row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="abbr" label="缩写" align="center">
                <template #default="{ $index, row }">
                  <el-input v-if="formType !== 'view'" placeholder="请输入" v-model="formData.cutList[$index].abbr"
                    :maxLength="16" />
                  <span v-else>{{ row.abbr }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="unit" label="单位" align="center">
                <template #default="{ $index, row }">
                  <el-input v-if="formType !== 'view'" placeholder="请输入" v-model="formData.cutList[$index].unit"
                    :maxLength="16" />
                  <span v-else>{{ row.unit }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="sort" label="排序" align="center">
                <template #default="{ $index, row }">
                  <!-- {{ scope }} -->
                  <el-input-number v-if="formType !== 'view'" placeholder="请输入" v-model="formData.cutList[$index].sort"
                    :min="0" :max="10000" />
                  <span v-else>{{ row.sort }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template #default="scope" v-if="formType !== 'view'">
                  <el-popover :visible="scope.row.visible !== undefined" placement="top" :width="160">
                    <p>确定要删除此条数据吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="small" @click="scope.row.visible = undefined">取消</el-button>
                      <el-button size="small" type="primary" @click="handleDelete(2, scope.$index)">
                        确定
                      </el-button>
                    </div>
                    <template #reference>
                      <el-button type="danger" size="small" @click="scope.row.visible = true">
                        删除
                      </el-button>
                    </template>
                  </el-popover>
                </template>
              </el-table-column>
              <template #empty>
                <div class="empty">
                  <img src="@/assets/imgs/no_data.jpg" style="height: 135px; width: 250px" /><br />
                </div>
              </template>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading" v-if="formType !== 'view'">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import * as ParamTemplateApi from '@/api/knifetool/tool/paramtemplate'
import { handleTree, checkSelectedNode } from '@/utils/tree'
import { getCategoryList } from '@/api/knifetool/tool/category'
  import { MaterialTypeApi, MaterialTypeVO } from '@/api/mcc/materialtype'

/** 参数模版主 表单 */
defineOptions({ name: 'ParamTemplateForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const isTypeItemExit = ref(false) // 根据刀具分类判断 是否展示 刀具类型
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const treeSelect = ref<any>([])
const treeSelectList = ref<any>([])
const category = reactive({
  id: undefined,
  toolCategoryId: undefined
})
const formData = ref<{
  id?: number
  templeteName: string
  toolCategoryId?: number
  toolType?: number
  geoList: ListItem[]
  cutList: ListItem[]
  detailList: ListItem[]
}>({
  id: undefined,
  templeteName: '',
  toolCategoryId: undefined,
  toolType: undefined,
  geoList: [],
  cutList: [],
  detailList: []
})

const formRules = reactive({
  templeteName: [
    {
      required: true,
      message: '请输入模板名称',
      trigger: 'blur'
    }
  ],
  toolCategoryId: [
    {
      required: true,
      message: '请选择刀具分类',
      trigger: 'blur'
    }
  ],
  toolTypeId: [
    {
      required: true,
      message: '请选择刀具类型',
      trigger: 'blur'
    }
  ]
})

interface ListItem {
  name: string
  abbr: string
  sort: number
  unit: string
  type: number
}

const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id',
  isLeaf: 'leaf',
  emitPath: false // 用于 cascader 组件：在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
}

const updateFormRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, row?: any) => {
  resetForm()
  dialogTitle.value = `${type === 'create' ? '新增' : type === 'view' ? '查看' : '修改'}参数模板`
  formType.value = type
  dialogVisible.value = true

  // 刀具分类数据
  // const data = await getCategoryList({ state: 1 })
  const data = await MaterialTypeApi.getMaterialTypeList()
  treeSelectList.value = data
  // treeSelect.value = handleTree(data, 'id', 'pid')
  treeSelect.value = handleTree(data, 'id', 'parentId')

  if (type !== 'create') {
    formLoading.value = true
    try {
      const data = await ParamTemplateApi.getParamTemplate(row.id)
      formData.value = data

      // 如果刀具分类为刀柄，则隐藏刀具类型
      if (data.toolCategoryId !== undefined) {
        handleChange(data.toolCategoryId)
      }

      if (formData.value.toolType == null) {
        isTypeItemExit.value = false
      }
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

const handleChange = (value) => {
  const selectedNode = treeSelectList.value.find((node) => node.id === value)
  if (selectedNode !== undefined) {
    // isTypeItemExit.value = selectedNode.type === 1 ? true : false
    isTypeItemExit.value = selectedNode.encodingProperty === 9 ? true : false
  }
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

  console.log(formData.value.geoList)
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

  console.log(formData.value.cutList)
}
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await updateFormRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    formData.value.detailList = formData.value.geoList.concat(formData.value.cutList)
    const data = formData.value as unknown as ParamTemplateApi.ParamTemplateVO
    console.log(data)

    if (formType.value === 'create') {
      await ParamTemplateApi.createParamTemplate(data)
      message.success(t('common.createSuccess'))
    } else {
      await ParamTemplateApi.updateParamTemplate(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

// 删除选中数据
const handleDelete = (type: number, index: number) => {
  if (type == 1) {
    formData.value.geoList.splice(index, 1)
  }

  if (type == 2) {
    formData.value.cutList.splice(index, 1)
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    templeteName: '',
    toolCategoryId: undefined,
    toolType: undefined,
    geoList: [],
    cutList: [],
    detailList: []
  }
  updateFormRef.value?.resetFields()
  isTypeItemExit.value = false
}
</script>
