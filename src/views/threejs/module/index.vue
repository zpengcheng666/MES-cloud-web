<template>
    <el-row :gutter="20">
        <el-col :span="spans" :xs="24">
            <el-input v-model="mourl" placeholder="mourl" />
            <el-button @click="getMod" type="primary">加载</el-button>
            <el-button @click="getSpans" type="primary">全屏</el-button>
        </el-col>

        <el-col :span="24-spans" :xs="24">
            <threejsModel :modelUrl="modelUrl" :processInfo="processInfo"/>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
    import {reactive, shallowRef} from 'vue'
    import {dateFormatter, dateFormatter2} from '@/utils/formatTime'

    import threejsModel from '@/views/threejs/model/index.vue'

    /** 购销合同 列表 */
    defineOptions({name: 'threejsModule11'})


    const spans=ref(16)
    const mourl = ref();
    const modelUrl = ref('http://192.168.2.216:9000/model/金属.glb')
    const processInfo = ref()

    const getMod= ()=>{

        modelUrl.value = mourl.value;

    }

    const getSpans=()=>{

        spans.value=2
    }

</script>

<style lang="scss" scoped>

</style>
