<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="920">
    <!-- 列表 -->
    <ContentWrap>
      <el-table ref="recordTable" @selection-change="selectionChange" v-loading="formLoading" :data="materialConfigList" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column type="selection" align="center" />
        <el-table-column label="物料编号" align="center" prop="materialNumber"/>
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
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { number, string } from 'vue-types';
import {BatchOrderDemandApi} from "@/api/mcs/batchorderdemand";

defineOptions({ name: 'ResourceTypeSelectView' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const materialConfigList = ref([])
const needCount = ref(0)
const selectCount = ref(0)

let resourceType;
const open = async (type: number, typeId: string, count: number) => {
  dialogVisible.value = true
  dialogTitle.value = '物料'
  formLoading.value = true
  needCount.value = count;
  await getMaterialList(type, typeId);
  formLoading.value = false;
  // 修改时，设置数据
  resourceType = type;
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const getMaterialList = async (type: number, typeId: string) => {
  if (type == 'GJ') {
    materialConfigList.value = await BatchOrderDemandApi.getMaterialsByConfigIds(typeId);
  } else if (type == 'GZ') {
    const data = await BatchOrderDemandApi.getToolMaterialsByConfigIds({materialConfigId:typeId});
    materialConfigList.value = data.stock;
  } else if (type == 'DJ') {
    const data = await BatchOrderDemandApi.getCuttingMaterialsByConfigIds({materialConfigId:typeId});
    materialConfigList.value = data.stock;
  }
}

const recordTable = ref();
const selectionChange = (rows: any[]) => {
  let count = 0
  let flag = false;
  for (let row of rows) {
    if (count < needCount.value) {
      if (!row.total || row.total == 0) {
        if (count + row.totality > needCount.value) {
          row.total = needCount.value - count;
        } else {
          row.total = row.totality;
        }
      } else {
        if (row.total > row.totality) {
          row.total = row.totality
        }
        if (count + row.total > needCount.value) {
          row.total = needCount.value - count;
        }
      }
      count += Number(row.total)
    } else {
      flag = true;
      recordTable.value.toggleRowSelection(row, false);
    }
  }
  selectCount.value = count;
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
    if (count > needCount.value) {
      recordTable.value.toggleRowSelection(row, false);
      return;
    }
    if (count + Number(row.total) > needCount.value) {
      row.total = needCount.value + count;
      selectCount.value = needCount.value;
      return;
    }
    selectCount.value = count + Number(row.total);
  }
}

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  if (selectCount.value > needCount.value) {
    message.warning("超出需求数量"); return
  } else if (selectCount.value < needCount.value) {
    message.warning("数量不足");return
  }
  emit('success',recordTable.value.getSelectionRows());
  dialogVisible.value = false;
}

</script>
