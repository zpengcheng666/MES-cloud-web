<template>
    <el-table 
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        max-height="310">
        
        <el-table-column label="单号" align="center" prop="orderNumber" />
        <el-table-column label="类型" align="center" prop="orderType" />
        <el-table-column label="起始仓库" align="center" prop="startWarehouseName" />
        <el-table-column label="目标仓库" align="center" prop="targetWarehouseName" />
        <el-table-column label="物料编码" align="center" prop="materielNumber" />
        <el-table-column label="物料条码" align="center" prop="barCode" />
    </el-table>
</template>
<script setup lang="ts">
import {ElTable} from "element-plus";
import {WmsHomeApi} from "@/api/home/wms";


defineOptions({name: 'ManualInOut'})

const loading = ref(true)
const list = ref([])


const getManualInList = async () => {
    loading.value = true
    try {
        list.value = await WmsHomeApi.getManualInList()

    } finally {
        loading.value = false
    }
}


/** 初始化 **/
onMounted(() => {
    getManualInList()
})

</script>