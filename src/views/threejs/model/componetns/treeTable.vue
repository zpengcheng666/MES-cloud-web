<template>
    <div class="tree" id="tree">
        <treeTableItem v-for="(item, idx) in treeData" :item="item" :key="`item_${idx}`"/>
    </div>
</template>

<script setup lang="ts">
    import treeTableItem from './treeTableItem.vue'

    defineOptions({name: 'treeTable'})

    const props = defineProps < {
        treeData: undefined, // 模型
    } > ()



</script>

<style lang="scss">

    .tree {
        flex: 1;
        overflow: auto;
        padding: 4px 0;
        position: absolute;
        height: 800px;
        width: 300px;
        margin-top: 80px;
        z-index: 999;
    }
    .tree summary {
        outline: 0;
        padding-left: 30px;
        list-style: none;
        background: repeating-linear-gradient(90deg, #999 0 1px, transparent 0px 2px)
        0px 50%/20px 1px no-repeat;
        /* background: linear-gradient(#999,#999) 0px 50%/20px 1px no-repeat; */
    }
    .tree details:last-child {
        background-size: 1px 23px;
    }
    .tree > details:not(:last-child) > details:last-child {
        background-size: 1px 100%;
    }
    .tree details {
        padding-left: 40px;
        background: repeating-linear-gradient(#999 0 1px, transparent 0px 2px) 40px
        0px/1px 100% no-repeat;
        /* background: linear-gradient(#999, #999) 40px 0px/1px 100% no-repeat; */
    }
    .tree > details {
        background: none;
        padding-left: 0;
    }
    .tree > details > summary {
        background: none;
    }
    .tree summary {
        display: flex;
        align-items: center;
        height: 46px;
        font-size: 15px;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.85);
        cursor: default;
    }
    .tree summary::after {
        content: "";
        position: absolute;
        left: 10px;
        right: 10px;
        height: 38px;
        background: #eef2ff;
        border-radius: 8px;
        z-index: -1;
        opacity: 0;
        transition: 0.2s;
    }
    .tree summary:hover::after {
        opacity: 1;
    }
    .tree summary:not(:only-child)::before {
        content: "";
        width: 14px;
        height: 14px;
        flex-shrink: 0;
        margin-right: 8px;
        border: 1px solid #999;
        background: linear-gradient(#999, #999) 50%/1px 10px no-repeat,
        linear-gradient(#999, #999) 50%/10px 1px no-repeat;
    }
    .tree details[open] > summary::before {
        background: linear-gradient(#999, #999) 50%/10px 1px no-repeat;
    }


</style>