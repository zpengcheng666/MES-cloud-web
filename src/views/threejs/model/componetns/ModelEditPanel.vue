<template>
    <div class="model-panel">

        <el-tabs v-model="activeTab">
            <el-tab-pane label="材质信息" name="EditMaterial" class="panel-edit">
                <edit-material ref="material" :meshs="meshLists"/>
            </el-tab-pane>
        </el-tabs>


        <!--<ul class="panel-tabs">-->
            <!--<li v-for="tab in panelTabs" :key="tab.key" :class="activeTab == tab.key ? 'active' : ''"-->
                <!--@click="activeTab = tab.key">-->
                <!--<el-tooltip effect="light" :content="tab.name" placement="top">-->
                    <!--<div class="tab">-->
                        <!--<el-icon size="20px" :color="activeTab == tab.key ? '#fff' : ''">-->
                            <!--<component :is="tab.icon"/>-->
                        <!--</el-icon>-->
                    <!--</div>-->
                <!--</el-tooltip>-->
            <!--</li>-->
        <!--</ul>-->
        <!--<div class="panel-edit">-->

            <!--&lt;!&ndash; 材质 &ndash;&gt;-->
            <!--<div v-show="activeTab == 'EditMaterial'">-->

            <!--</div>-->

            <!--&lt;!&ndash; 几何体配置 &ndash;&gt;-->
            <!--<div v-show="activeTab == 'EditGeometry'">-->
                <!--&lt;!&ndash;<edit-geometry ref="geometry"></edit-geometry>&ndash;&gt;-->
            <!--</div>-->
            <!--&lt;!&ndash; 多模型添加 &ndash;&gt;-->
            <!--&lt;!&ndash; <div v-show="activeTab == 'EditMoreModel'">-->
              <!--<edit-more-model ref="more"></edit-more-model>-->
            <!--</div> &ndash;&gt;-->
        <!--</div>-->
    </div>
</template>
<script  lang="ts" setup>
    import EditMaterial from "./EditMaterial.vue";
    import { propTypes } from '@/utils/propTypes'
    // import EditGeometry from "./EditGeometry.vue";


    defineOptions({name: 'ModelEditPanel'})

    const props = defineProps<{
        meshList:propTypes.array,// 材质
    }>()

    const meshLists = ref([]);

    watch(
        () => props.meshList,
        (val) => {
            if (!val) {
                return
            }
            if (val.length>0) {

                meshLists.value = val

            }else {
                meshLists.value=[]
            }
        },
        {deep: true}
    )





    const panelTabs = [
        {
            name: "材质",
            key: "EditMaterial",
            icon: "DataAnalysis",
        },
        {
            name: "几何体模型配置",
            key: "EditGeometry",
            icon: "Cellphone",
        }
    ];
    const activeTab = ref("EditMaterial");
    const background = ref(null);
    const material = ref(null);
    const animation = ref(null);
    const attribute = ref(null);
    const light = ref(null);
    const stage = ref(null);
    const geometry = ref(null)
    const tags = ref(null)
    const more = ref(null)


    // 获取所有面板配置
    const getPanelConfig = () => {
        return {
            background: background.value.config,
            material: material.value.getMeshConfig(),
            animation: animation.value.config,
            attribute: attribute.value.getAttrbuteConfig(),
            light: light.value.config,
            stage: stage.value.getStageConfig(),
            tags:tags.value.config
        };
    };
    defineExpose({
        getPanelConfig,
    });
</script>
<style lang="scss" scoped>
    .model-panel {
        min-width: 380px;
        height: calc(100vh - 280px);
        background-color: #1b1c23;
    .panel-tabs {
        display: flex;
    .active {
        background-color: #4d57fd;
    }
    li {
        display: flex;
        align-items: center;
        padding: 10px;
        color: #888888;
        cursor: pointer;
        background: #272830;
        border-right: 1px solid #0a0a0a;
    .tab {
        line-height: initial;
    }
    }
    }
    }
</style>
