<template>
  <Dialog top="75px" :title="dialogTitle" v-model="dialogVisible" width="820">
    <ContentWrap>
      <el-form
        class="-mb-15px"
        :model="formData"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="类型编码" prop="materialConfigId">
          <el-input disabled v-model="formData.materialConfigCode" placeholder="请输入物料类型编码" class="!w-240px"/>
        </el-form-item>
        <el-form-item label="资源类型">
          <el-checkbox-group disabled v-model="formData.type">
            <el-select disabled v-model="formData.resourceType" placeholder="请输入物料类型编码" class="!w-240px">
              <el-option
                v-for="dict in getIntDictOptions('wms_material_type')"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="需求数量" prop="needCount">
          <el-input disabled v-model="formData.needCount" disable type="number" class="!w-240px"/>
        </el-form-item>
        <el-form-item label="已选数量" prop="selectCount">
          <el-input disabled v-model="formData.selectCount" readonly type="number" class="!w-240px"/>
        </el-form-item>
        <el-form-item v-if="formData.lockCode" label="指定物料" prop="materialCode">
          <el-input disabled v-model="formData.materialCode" readonly class="!w-580px"/>
        </el-form-item>
      </el-form>
    </ContentWrap>
    <!-- 子表的表单 -->
    <ContentWrap class="materialContentWrap">
      <el-table ref="recordTable" @selection-change="selectionChange" v-loading="formLoading" :data="materialConfigList" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column type="selection" align="center" />
        <el-table-column label="物料编号" align="center" prop="materialNumber" width="100"/>
        <el-table-column label="物料条码" align="center" prop="barCode" />
        <el-table-column label="物料批次" align="center" prop="batchNumber" />
        <el-table-column label="可用数量" align="center" prop="totality" width="80"/>
        <el-table-column label="使用数量" align="center" prop="total" width="100">
          <template #default="scope">
            <el-input min="0" @input="(value: string | number)=>inputFun(value, scope.row)" v-model="scope.row.total" type="number" />
          </template>
        </el-table-column>
      </el-table>
    </ContentWrap>
    <template #footer>
      <el-button @click="submitForm" type="primary" >确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { BatchOrderDemandApi } from '@/api/mcs/batchorderdemand'
import { getIntDictOptions } from '@/utils/dict'
import {reactive} from "vue";

/** 物料配送申请 表单 */
defineOptions({ name: 'MaterialResourceSortingView' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  materialConfigCode: undefined,
  resourceType: undefined,
  needCount: 0,
  selectCount: 0,
  demandId: undefined,
  materialCode: undefined,
  materialCodeList: [],
  lockCode: false,
})
const formRules = reactive({
})
const materialConfigList = ref([]);
const hasSelectedIdList = ref([]);

/** 打开弹窗 */
const open = async (data: any) => {
  dialogVisible.value = true
  dialogTitle.value = "毛坯"
  resetForm()
  // 修改时，设置数据
  formLoading.value = true
  try {
    formData.value.materialConfigCode = data.resourceTypeCode;
    formData.value.resourceType = data.resourceType;
    formData.value.needCount = data.total;
    formData.value.demandId = data.id;
    if (data.materialCode) {
      formData.value.materialCode = data.materialCode;
      formData.value.materialCodeList = data.materialCode.split(",");
      formData.value.lockCode = true;
    }
    await getMaterialList(data.resourceTypeId);
    await getMaterialUsedList(data.id);

  } finally {
    formLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const getMaterialList = async (typeId: String) => {
  const data = await BatchOrderDemandApi.getMaterialsByConfigIds(typeId);
  if (formData.value.lockCode) {
    materialConfigList.value = data.filter(item => formData.value.materialCodeList.includes(item.barCode))
  } else {
    materialConfigList.value = data;
  }
}

const getMaterialUsedList = async (demandId: string) => {
  hasSelectedIdList.value = await BatchOrderDemandApi.getSelectedMaterialIdByDemandId(demandId);
  for (let materialS of hasSelectedIdList.value) {
    let materialN = materialConfigList.value.find(item => item.id == materialS.materialUid);
    if (materialN) {
      materialN.total = materialS.total
      recordTable.value.toggleRowSelection(materialN, true);
    }
  }
}

const recordTable = ref()
const selectionChange = (rows: any[]) => {
  let count = 0
  let flag = false;
  for (let row of rows) {
    if (count < formData.value.needCount) {
      if (!row.total || row.total == 0) {
        if (count + row.totality > formData.value.needCount) {
          row.total = formData.value.needCount - count;
        } else {
          row.total = row.totality;
        }
      } else {
        if (row.total > row.totality) {
          row.total = row.totality
        }
        if (count + row.total > formData.value.needCount) {
          row.total = formData.value.needCount - count;
        }
      }
      count += Number(row.total)
    } else {
      flag = true;
      recordTable.value.toggleRowSelection(row, false);
    }
  }
  formData.value.selectCount = count;
  if (flag) {
    message.warning("已达到需求数量");
  }
}

const inputFun = (value: string | number, row: any) => {
  if (value > row.totality) {
    row.total = row.totality;
  }
  let selectionRows = recordTable.value.getSelectionRows();
  let flag = selectionRows.some(item => item.id == row.id);
  if (flag) {
    let count = 0
    for (let rowS of selectionRows) {
      if (rowS.id == row.id) continue;
      count += Number(row.total)
    }
    if (count > formData.value.needCount) {
      recordTable.value.toggleRowSelection(row, false);
      return;
    }
    if (count + Number(row.total) > formData.value.needCount) {
      row.total = formData.value.needCount + count;
      formData.value.selectCount = formData.value.needCount;
      return;
    }
    formData.value.selectCount = count + Number(row.total);
  }
}
/**
 * 禁用,与输入框冲突
 */
const rowClick = (row:any) => {
  let selectionRows = recordTable.value.getSelectionRows();
  let flag = selectionRows.some(item => item.id == row.id);
  if (flag) {
    recordTable.value.toggleRowSelection(row, false);
  } else {
    recordTable.value.toggleRowSelection(row, true);
  }
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  if (formData.value.selectCount > formData.value.needCount) {
    message.warning("超出需求数量"); return
  } else if (formData.value.selectCount < formData.value.needCount) {
    message.warning("数量不足");return
  }
  const data = {
    id: formData.value.demandId,
    batchDemandResourceList: recordTable.value.getSelectionRows()
  }
  const msg = await BatchOrderDemandApi.resourceSortingSave(data)
  message.success(msg);
  // 提交请求
  dialogVisible.value = false
  // 发送操作成功的事件
  emit('success')
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    materialConfigCode: undefined,
    resourceType: undefined,
    needCount: 0,
    selectCount: 0,
    demandId: undefined,
    materialCode: [],
    lockCode: false,
  }
}
</script>
<style lang="scss" scoped>
.materialContentWrap {
  max-height: 450px;
  overflow:auto;
}
.materialContentWrap::-webkit-scrollbar {
  display: none;
}
</style>
