<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
      <!-- 新增等操作按钮 -->
      <template #actionMore>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['macs:door:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </template>
    </Search>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <Table
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
    >
      <template #action="{ row }">
        <el-button
          link
          type="primary"
          v-if="row.doorStatus === 0"
          @click="openDoor(row.id)"
          v-hasPermi="['macs:door:control']"
        >
          开门
        </el-button>
        <el-button
          link
          type="primary"
          v-if="row.doorStatus === 1"
          @click="closeDoor(row.id)"
          v-hasPermi="['macs:door:control']"
        >
          关门
        </el-button>
        <el-button
          link
          type="primary"
          @click="openForm('update', row.id)"
          v-hasPermi="['macs:door:update']"
        >
          编辑
        </el-button>
        <el-button
          link
          type="danger"
          v-hasPermi="['macs:door:delete']"
          @click="handleDelete(row.id)"
        >
          删除
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <DoorForm ref="formRef" @success="getList" />
</template>
<script setup lang="ts" name="Door">
import { allSchemas } from './door.data'
import * as DoorApi from '@/api/macs/door'
import DoorForm from './DoorForm.vue'
import { inject } from 'vue'

const region = inject("region");
const device = inject("device");
let defaultParams:any = {};
if (region) defaultParams.regionId = region.id;
if (device) defaultParams.deviceId = device.id;
// tableObject：表格的属性对象，可获得分页大小、条数等属性
// tableMethods：表格的操作对象，可进行获得分页、删除记录等操作
// 详细可见：https://doc.iocoder.cn/vue3/crud-schema/
const { tableObject, tableMethods } = useTable({
  defaultParams,
  getListApi: DoorApi.getDoorPage, // 分页接口
  delListApi: DoorApi.deleteDoor // 删除接口
})
// 获得表格的各种操作
const { getList, setSearchParams } = tableMethods

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = (id: string) => {
  tableMethods.delList(id, false)
}

const closeDoor = async (id: string) => {
  await DoorApi.closeDoor(id);
  await getList();
}

const openDoor = async (id: string) => {
  await DoorApi.openDoor(id);
  await getList();
}

/** 初始化 **/
onMounted(() => {
  getList();
  setInterval(getList,5000)
})
</script>
