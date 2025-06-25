<template>
    <details open>
        <summary class="tree-item" @click="onChangeMaterialType(item)">
            {{ item.name }}
        </summary>
        <template v-if="item.children">
            <treeTableItem v-for="(i, idx) in item.children" :item="i"  :key="`items_${idx}`"/>
        </template>
    </details>
</template>

<script  setup lang="ts">
    import treeTableItem from './treeTableItem.vue'
    import { useMeshEditStore } from '@/components/threejs/meshEditStore'

    defineOptions({name: 'treeTableItem'})

    const props = defineProps < {
        item: undefined, // 模型
    } > ()
    const store = useMeshEditStore();

    // 选择材质
    const onChangeMaterialType = (mesh) => {
        store.selectMeshAction(mesh)

    };

</script>


<style lang="scss" scoped>
    .tree-item {
        display: flex;
    }
</style>
