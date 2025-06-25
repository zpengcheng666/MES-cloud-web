<template>
    <el-row>
        <el-col :span="5">
            <dv-decoration-10 style="width:100%;height:2vh;" />
            <dv-decoration-3 style="width:80%;height:4vh;margin-left: 5%;" />
        </el-col>
        <el-col :span="4">
            <dv-decoration-8  style="width:100%;height:5vh;margin-top: 1vh" />
        </el-col>
        <el-col :span="6">
            <div style="width: 100%;margin-top: 1vh;text-align: center;font-size: 3vh;font-weight: bold;" :style="{color: titleColor}"> {{title}}</div>
            <dv-decoration-6 style="width:70%;height:2vh;margin:1vh auto;" />
        </el-col>
        <el-col :span="4">
            <dv-decoration-8 :reverse="true" style="width:100%;height:5vh;margin-top: 1vh" />
        </el-col>
        <el-col :span="5">
            <dv-decoration-10 style="transform: rotate(180deg);width:100%;height:2vh;" />
            <dv-decoration-1 style="width:80%;height:4vh;margin-left: 15%;" />
        </el-col>
    </el-row>
</template>
<script setup lang="ts">
defineOptions({ name: 'OperationTerminalHeader' })
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    titleColor: {
        type: String,
        default: '#3cb2df'
    }

})
</script>
