<template>
    <el-Dialog v-model="dialogVisible" width="1200"  title="刀具拆卸" >
        <el-table :data="toolAssembleData"  row-key="key" border  default-expand-all>
        <el-table-column label="配刀条码" align="center" prop="appendageBarCode" />
        <el-table-column label="配刀编号" align="center" prop="appendageMaterialNumber" />
        <el-table-column label="配刀类码" align="center" prop="appendageMaterialCode" />
        <el-table-column label="配刀名称" align="center" prop="appendageMaterialName" />
        <el-table-column label="配刀刀位" align="center" prop="site" />
        <el-table-column label="配刀数量" align="center" prop="count" />
        <el-table-column width="200"  label="存放储位" align="center" prop="storageCode" >
            <template #default="scope">
                <el-input v-model="scope.row.storageCode" @click="openLocationDialog(scope.row)"/>
            </template>
        </el-table-column>
        <el-table-column fixed="right"   label="操作" width="80" align="center">
            <template #default="scope">
            <el-button
                    link
                    type="primary"
                    @click="removeAssemble(scope.row)"
            >
                作废
            </el-button>
            </template>
        </el-table-column>
        </el-table>
              
   
       <template #footer>
         <el-button @click="submitForm" type="primary" :disabled="formLoading">提交</el-button>
         <el-button @click="dialogVisible = false">取 消</el-button>
       </template>
     </el-Dialog>
    <SelectLocationDialog ref="selectLocationDialog" @selectPositionNode="selectPositionNode" />
   </template>
   <script setup lang="ts">
   import { ToolInfoApi } from '@/api/tms/toolinfo'
   import { MaterialStorageApi } from '@/api/wms/materialstorage'
   import SelectLocationDialog from '@/views/wms/dialog/SelectLocationDialog.vue'
   
   const dialogVisible = ref(false)
   const formLoading = ref(false)
   const message = useMessage() // 消息弹窗
   const toolInfoId = ref()
   const open = (id:string) => {
     dialogVisible.value = true
     toolInfoId.value = id;
     getList()
   }
   defineExpose({ open }) // 提供 open 方法，用于打开弹窗

   const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
   // 提交
   const submitForm = async () => {
   
       formLoading.value = true
       try {
            await ToolInfoApi.toolDisassembly(toolAssembleData.value,toolInfoId.value);
            message.success('拆卸成功')
            dialogVisible.value = false
            // 发送操作成功的事件
            emit('success')
       } finally {
            formLoading.value = false
       }
   }

   // 作废
   const removeAssemble = (row: any) => {
        row.type = 4// 作废
   }
   
    // 配刀信息
   const toolAssembleData = ref([]);

   const getList = async () => {
        // 配刀信息
        toolAssembleData.value = await ToolInfoApi.getCurrentAssembleRecord(toolInfoId.value)
   }

   const currentRow = ref<any>()

   // NULL全部  1 库位 2 储位
    provide('treeType', 2)
    // 打开储位选择弹框
    const selectLocationDialog = ref()
    const openLocationDialog = (row) => {
        selectLocationDialog.value.open()
        currentRow.value = row
    }

    // 选择储位
    const selectPositionNode = (node: any) => {
        const { id, type } = node
        getPostion(id,type)
    }

    // 回显数据
    const getPostion = async(id: number,type: number) => {
        const data = await MaterialStorageApi.getMaterialStorage(id)
        if(!data){message.error('请选择根节点！！！'); return}
        currentRow.value.storageCode = data.storageName
        currentRow.value.storageId = data.id
        currentRow.value.type = 2//卸刀
    }

   
   
   </script>
