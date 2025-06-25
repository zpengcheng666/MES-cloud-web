<template>
    <el-select @change="timeRangeChange" :style="{ width: `${width}px` }" v-model="value" >
        <el-option
            v-for="item in timeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
    </el-select>

    <el-dialog v-model="dialogVisible" :show-close="false"  width="300">
        <el-date-picker
            v-model="customTimeRange"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
            class="!w-240px"
        />

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="ok">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 自定义弹出框 -->

</template>
<script setup lang="ts">

defineOptions({name: 'TimeRange'})

const props = defineProps({
    width: {
        type: Number,
        default: 120
    },
    defaultValue: {
        type: Number,
        default: 1
    },
    // 时间选项
    timeOptions: {
        type: Array,
        default: () => [
            {label: '今天', value: 1},
            {label: '近7天', value: 7},
            {label: '近30天', value: 30},
            {label: '近90天', value: 90},
            {label: '自定义', value: 0}
        ]
    }
})

const dialogVisible = ref(false)
const value = ref(props.defaultValue)

const emit = defineEmits(['init','change'])

// 获取当前日期
const currentDate = new Date();
// 计算日期
const computeData = new Date(currentDate);

// 初始化时间范围
const init = () => {
    computeData.setDate(currentDate.getDate() - props.defaultValue + 1);

    const createTimeRange = ref(
    [
        computeData.toISOString().slice(0, 10) + ' 00:00:00', 
        new Date().toISOString().slice(0, 10) + ' 23:59:59'
    ]) 
    emit('init', createTimeRange.value)
}

// 时间范围选择
const timeRangeChange = (val: number) => {

    if (val === 0) {
        dialogVisible.value = true
    }else{
        computeData.setDate(currentDate.getDate() - val + 1);

        const createTimeRange = ref(
        [
            computeData.toISOString().slice(0, 10) + ' 00:00:00', 
            new Date().toISOString().slice(0, 10) + ' 23:59:59'
        ]) 
        emit('change', createTimeRange.value)
    }
}

// 自定义时间范围
const customTimeRange = ref(
    [
        computeData.toISOString().slice(0, 10) + ' 00:00:00', 
        new Date().toISOString().slice(0, 10) + ' 23:59:59'
    ]
) 

// 时间区间确认
const ok = () => {
    dialogVisible.value = false
    emit('change', customTimeRange.value)
}

/** 初始化 **/
init()

</script>