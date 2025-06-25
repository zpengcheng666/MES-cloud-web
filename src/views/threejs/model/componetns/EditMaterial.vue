<template>
  <div class="edit-box" v-zLoading="loading">
    <div class="header">
      <span>材质</span>
    </div>
    <!-- 材质列表 -->
    <div class="options">
      <el-scrollbar max-height="200px">
        <div class="option" :class="state.selectMeshUuid== mesh.uuid ? 'option-active' : ''"
          @click.stop="onChangeMaterialType(mesh)" v-for="mesh in props.meshs" :key="mesh.uuid">
          <el-space>


            <el-icon>
              <Icon v-if="mesh.visible" icon="svg-icon:eyes" :size="18"  color="#409eff" @click="onSetMeshVisibe(mesh)" />
              <Icon v-else icon="svg-icon:eye-slash" :size="18" @click="onSetMeshVisibe(mesh)"  />
            </el-icon>
            <!--<el-icon @click="onSetMeshVisibe(mesh)" size="18" color="#409eff" v-if="mesh.visible">-->
              <!--<View />-->
            <!--</el-icon>-->
            <!--<el-icon size="18" @click="onSetMeshVisibe(mesh)" v-else>-->
              <!--<Hide />-->
            <!--</el-icon>-->
            <div class="icon-name">
              {{ mesh.name }}
            </div>
            <div class="check" v-show="state.selectMeshUuid == mesh.uuid">
              <el-icon size="20px" color="#2a3ff6">
                <Icon icon="svg-icon:check" :size="20" />
              </el-icon>
            </div>
          </el-space>
        </div>
      </el-scrollbar>
    </div>
    <!-- 材质属性 -->
    <div class="header">切面</div>
    <div class="options" :class="optionDisabled">
      <div class="option">
        <div class="grid-txt">
         X
        </div>
        <div class="grid-silder">
          <el-slider show-input  v-model="planeX" :min="-store.selectBoxLength" :max="store.selectBoxLength" @input="onChangePlane" @change="onChangePlane" />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
         Y
        </div>
        <div class="grid-silder">
          <el-slider show-input  v-model="planeY" :min="-store.selectBoxLength" :max="store.selectBoxLength" @input="onChangePlane" @change="onChangePlane" />
        </div>
      </div>
      <div class="option">
        <div class="grid-txt">
          Z
        </div>
        <div class="grid-silder">
          <el-slider show-input  v-model="planeZ" :min="-store.selectBoxLength" :max="store.selectBoxLength" @input="onChangePlane" @change="onChangePlane" />
        </div>
      </div>
    </div>

    <div class="header">模型操作</div>
    <div class="options" :class="optionDisabled">
      <div class="option">
        <div class="grid-txt">
          模型分解
        </div>
        <div class="grid-silder">
      <el-slider show-input v-model="decompose" @input="onChangeDecompose" :step="0.01" :min="0"
                 :max="1" />
        </div>
      </div>
    </div>



  </div>
</template>
<script   lang="ts" setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, watch } from "vue";
import { useMeshEditStore } from '@/components/threejs/meshEditStore'
import * as THREE from "three";
import { ElMessage } from "element-plus";
import TWEEN from "@tweenjs/tween.js";

const props = defineProps<{
    meshs: array, // 材质
}>()


const selectMesh=ref({uuid:0});



const ModelConfig = reactive({
    glow: false,
    threshold: 0.05,
    strength: 0.6,
    radius: 1,
    decompose: 0,
    transformType: 'translate',
    manageFlage: false,
    manageFlage: false,
    toneMappingExposure: 2,
    color: ''
});


const store = useMeshEditStore();

const planeX=ref(store.selectBoxLength)
const planeY=ref(store.selectBoxLength)
const planeZ=ref(store.selectBoxLength)
const decompose=ref(0)
const { $bus } = getCurrentInstance().proxy;
const config = reactive({
  meshName: null,
  color: null,
  wireframe: false,
  depthWrite: true,
  opacity: 1,
});
const loading = ref(false)
const activeMeshType = ref('');
const activeMeshMap = ref(null)
const activeMapId = ref(null);
const clipPlanes = ref([])
const optionDisabled = computed(() => {
  // const activeMesh = state.modelMaterialList.find((v) => v.uuid == state.selectMeshUuid) || {};
  // return activeMesh.uuid ? "" : "disabled";

  return "";
});
const state = reactive({
  modelMaterialList: computed(() => store.modelApi.modelMaterialList),
  originalMaterials: computed(() => store.modelApi.originalMaterials),
  modelApi: computed(() => store.modelApi),
  selectMeshUuid: computed(() => store.selectMeshUuid),
});



const onChangePlane = () => {
    if (clipPlanes.value.length>0){
        clipPlanes.value[0].constant=planeX.value;
        clipPlanes.value[1].constant=planeY.value;
        clipPlanes.value[2].constant=planeZ.value;

        store.setPlanes(clipPlanes.value)
    }else {

        let val = store.selectBoxLength;

        clipPlanes.value = [new THREE.Plane(new THREE.Vector3(-1, 0, 0), val), new THREE.Plane(new THREE.Vector3(0, -1, 0), val ), new THREE.Plane(new THREE.Vector3(0, 0, -1), val)];

    }

};

watch(() => store.selectBoxLength,
  (val) => {
      planeX.value=val
      planeY.value=val
      planeZ.value=val
      clipPlanes.value = [new THREE.Plane(new THREE.Vector3(-1, 0, 0), val), new THREE.Plane(new THREE.Vector3(0, -1, 0), val ), new THREE.Plane(new THREE.Vector3(0, 0, -1), val)];
  }
);


// 切换材质类型
const onChangeMeshType = (e) => {
  const activeMesh = meshTypeList.find((v) => v.type == e);
  state.modelApi.onChangeModelMeshType(activeMesh);
};


const onChangeDecompose = () => {
    store.setMeshDecompose(decompose.value);
};

// 选择材质
const onChangeMaterialType = (mesh) => {
    store.selectMeshAction(mesh)

};

// 设置材质显隐
const onSetMeshVisibe = (mesh) => {
  mesh.visible = !mesh.visible;
  //state.modelApi.onSetMeshVisibe(mesh);
  store.setVisibleMesh(mesh.id+"_"+mesh.visible);
};


const getMeshConfig = () => {
  return {
    materialType: activeMeshType.value,
    meshList: state.modelApi.onGetEditMeshList(),
  };
};
defineExpose({
  getMeshConfig,
});
</script>
<style scoped lang="scss">
.options {
  max-width: 380px;
}
.image-box {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 90px;
  cursor: pointer;
  opacity: 0.6;
  .el-map {
    max-height: 70px;
    padding: 6px;
  }


}
.select {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: auto;
}
.not-load {
  padding: 20px 0;
  font-size: 16px;
  color: #ffffff;
  text-align: center;
}
.mesh-image {
  position: relative;
  box-sizing: border-box;
  max-width: 140px;
  font-size: 0;
  cursor: pointer;
  opacity: 0.6;
  .mesh-map {
    position: relative;
    height: 100px;
    max-height: 100px;
    margin: 8px 9px;
  }
}
.active {
  border: 2px solid #18c174;
  opacity: 1;
}
</style>
