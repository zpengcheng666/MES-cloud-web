<template>
  <Dialog v-model="dialogVisible" :fullscreen="true" title="入库信息">
    <selectPositionDialog ref="positionForm" @success="selectPositionInfo" title="重新选择库位" />
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="物码" prop="code">
            <el-input
              v-model="formData.code"
              placeholder="请开始扫码..."
              clearable
              class="!w-240px"
              @blur="getToolData(formData.code)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="还料人员" prop="handover">
            <el-input
              v-model="formData.handover"
              placeholder="请填写还料人员..."
              clearable
              class="!w-240px"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="tableData">
        <el-table :data="formData.tableData" style="width: 100%" default-expand-all>
          <el-table-column type="expand">
            <template #default="props">
              <!-- <el-form-item :prop="'tableData.' + props.$index + '.childrens'"> -->
              <el-table :data="props.row.childrens">
                <el-table-column label="刀具物码" prop="objectCode" align="center" />
                <el-table-column label="刀具盒码" prop="boxCode" align="center">
                  <template #default="scope">
                    <el-form-item
                      style="margin: 18px 0"
                      :prop="
                        'tableData.' + props.$index + '.childrens.' + scope.$index + '.boxCode'
                      "
                      :rules="[
                        {
                          required: true,
                          message: '刀具盒码不得为空!',
                          trigger: 'blur',
                          whitespace: false
                        }
                      ]"
                    >
                      <el-input v-model="scope.row.boxCode" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="scope">
                    <el-popover
                      placement="bottom"
                      :visible="scope.row.visible !== undefined"
                      :width="200"
                    >
                      <p>确定要删除此条数据吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="small" @click="scope.row.visible = undefined"
                          >取消</el-button
                        >
                        <el-button
                          size="small"
                          type="primary"
                          @click="handleDelete(props.$index, scope.$index, scope.row)"
                        >
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
              </el-table>
              <!-- </el-form-item> -->
            </template>
          </el-table-column>

          <el-table-column prop="toolBrandId" label="刀具品牌" align="center">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.KNIFETOOL_BRAND" :value="scope.row.toolBrandId" />
            </template>
          </el-table-column>
          <el-table-column prop="toolCategoryValue" label="刀具分类" align="center" />
          <el-table-column prop="name" label="刀具名称" align="center" />
          <el-table-column prop="spec" label="通用规格" align="center" />
          <el-table-column prop="location" label="推荐仓位" align="center">
            <template #default="scope">
              <el-form-item
                style="margin: 18px 0"
                :prop="'tableData.' + scope.$index + '.location'"
                :rules="[
                  {
                    required: true,
                    message: '内容不得为空！',
                    trigger: 'change',
                    whitespace: false
                  }
                ]"
              >
                <el-input v-model="scope.row.location" readonly>
                  <template #append>
                    <el-button :icon="Search" @click="openPositionDialog(scope.$index)" />
                  </template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="isFull" label="是否满仓" align="center">
            <template #default="scope">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="请先选择入库仓位"
                placement="top-start"
                v-if="scope.row.location === '' || scope.row.location === undefined"
              >
                <el-switch
                  v-model="scope.row.isFull"
                  inline-prompt
                  active-text="是"
                  inactive-text="否"
                  :disabled="scope.row.location === '' || scope.row.location === undefined"
                />
              </el-tooltip>

              <el-popover
                v-else
                :visible="scope.row.visible !== undefined"
                placement="top"
                :width="160"
              >
                <p>是否确认{{ scope.row.isFull ? '满库' : '取消满库' }}?</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="small" @click="scope.row.visible = undefined">取消</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="handleSwitch(scope.row.storeLocationId, scope.row.isFull, scope.$index)"
                  >
                    确定
                  </el-button>
                </div>
                <template #reference>
                  <el-switch
                    v-model="scope.row.isFull"
                    inline-prompt
                    active-text="是"
                    inactive-text="否"
                    @change="scope.row.visible = true"
                  />
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="数量" align="center" />
        </el-table>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm(formRef)"
        >确 定</el-button
      >
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import selectPositionDialog from '@/components/store/selectPositionDialog.vue'
import { putLocationIsfull } from '@/api/knifetool/store/storeManage'
import { DICT_TYPE } from '@/utils/dict'
import { Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { createOldGood, getOldGoodCodeInfo, suggestedLocation } from '@/api/knifetool/store/oldStore'

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

const formRef = ref<FormInstance>()
const formData = ref<{
  tableData: tableDataItem[]
  handover: string
  code: string
}>({
  tableData: [],
  handover: '',
  code: ''
})

interface childrens {
  objectCode: string
  boxCode: string
}

interface tableDataItem {
  id: number
  toolBrandId: number
  informationId: number
  categoryId: number
  storeLocationId: number
  amount: number
  name: string
  spec: string
  location: string
  visible?: undefined
  childrens: Array<childrens>
}

// form 验证
const formRules = reactive({
  handover: [{ required: true, message: '对接人员必须填写!', trigger: 'blur' }],
  tableData: [{ required: true, message: '未选择刀具信息!', trigger: 'change' }]
})

// 显示当前弹窗
const open = async () => {
  resetForm()
  dialogVisible.value = true
}
// 向外暴露open方法，方便父组件调用，用于打开弹窗
defineExpose({ open })

const getToolData = async (record: string) => {
  if (record === '') return
  formData.value.code = ''
  let res = await getOldGoodCodeInfo({ code: record })
  console.log(res)
  if (res) {
    if (res.currentStatus === 1) {
      ElNotification({
        title: '提示',
        message: '此物码已入库！',
        type: 'info'
      })
    } else {
      const { toolInformationId, id } = res
      let location = await suggestedLocation({ id: toolInformationId })

      let ids = formData.value.tableData.map((item) => item.id)
      let toolIds = formData.value.tableData.map((item) => item.informationId)

      // children 里单条对应的 id
      if (ids.length > 0 && ids.indexOf(id) >= 0) return

      const currentIndex = toolIds.indexOf(toolInformationId)

      if (currentIndex >= 0) {
        formData.value.tableData[currentIndex].amount += 1
        formData.value.tableData[currentIndex].childrens.push({
          objectCode: res.objectCode,
          boxCode: res.objectCode
        })
      } else {
        const data = {
          id: res.id,
          toolBrandId: res.toolBrandId,
          informationId: res.toolInformationId,
          categoryId: res.toolCategoryId,
          location: location[0],
          storeLocationId: location[1],
          amount: 1,
          name: res.name,
          spec: res.spec,
          childrens: [
            {
              objectCode: res.objectCode,
              boxCode: res.boxCode
            }
          ]
        }
        formData.value.tableData.push(data)
      }
    }
  } else {
    ElNotification({
      title: '警告',
      message: '该物码不存在！',
      type: 'error'
    })
  }
}

const handleSwitch = async (id: number, val: boolean, index: number) => {
  const value = val ? 1 : 0
  await putLocationIsfull({ id: id, isfull: value })
  delete formData.value.tableData[index].visible
}

// 选中的货位
const positionForm = ref()
const currentIndex = ref()
const openPositionDialog = (index: number) => {
  currentIndex.value = index
  positionForm.value.open()
}
// 选中的仓位信息
const selectPositionInfo = (json: any) => {
  formData.value.tableData[currentIndex.value].location = `${json.layerNum}-${json.locationNum}`
  formData.value.tableData[currentIndex.value].storeLocationId = json.id
}

// 删除选中数据
const handleDelete = (tI: number, cI: number, row: any) => {
  console.log(tI, cI, row)
  formData.value.tableData[tI].childrens.splice(cI, 1)
  if (formData.value.tableData[tI].childrens.length < 1) {
    formData.value.tableData.splice(tI, 1)
  }
}

// 提交表单
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const valid = await formEl.validate()
  if (!valid) return
  try {
    console.log(formData)
    await createOldGood(formData)
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    tableData: [],
    handover: '',
    code: ''
  }
  formRef.value?.resetFields()
}

// 父组件充当中间件，将选中树节点传给子级
const treeSelectNode = reactive<any>({
  name: '',
  id: '',
  classification: null
})
provide('treeSelectNode', treeSelectNode)
</script>
<style scoped lang="scss"></style>
