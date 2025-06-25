import { defineStore } from 'pinia'
import * as THREE from "three";

export const useMeshEditStore = defineStore('useMeshEditStore', {
	state: () => ({
		//当前模型
		modelApi: {},
		//当前材质
		selectMesh: {},
		// 当前drag拖拽类型
		dragType: '',
		//模型长度
		boxLength:40,

        visibleMesh:'',


		meshTabShow:2,
        decompose:0,
		//切面
        clipPlanes:[new THREE.Plane(new THREE.Vector3(1, 0, 0), 20), new THREE.Plane(new THREE.Vector3(0, -1, 0), 20 ), new THREE.Plane(new THREE.Vector3(0, 0, -1), 20)]
	}),
	getters: {
		selectMeshUuid: (state) => state.selectMesh.uuid,
		selectClipPlanes: (state) => state.clipPlanes,
		selectBoxLength: (state) => state.boxLength,
		selectVisibleMesh: (state) => state.visibleMesh,
		selectMeshTabShow: (state) => state.meshTabShow,
		selectMeshDecompose: (state) => state.decompose
	},
	actions: {
		setModelApi(modelApi) {
			this.modelApi = modelApi
		},
		selectMeshAction(selectMesh) {
			this.selectMesh = selectMesh
		},
		changeDragType(dragType) {
			this.dragType = dragType
		},
		setBoxLength(boxLength){
			this.boxLength=boxLength
		},
        setPlanes(clipPlanes){
            this.clipPlanes=clipPlanes
        },
		setVisibleMesh(mesh){
			this.visibleMesh=mesh;
		},
		setMeshTabShow(meshTabShow){
			this.meshTabShow = meshTabShow
		},
		setMeshDecompose(decompose){
			this.decompose= decompose;
		}
	}
})

export const useIndexedDBStore = defineStore('useIndexedDBStore', {
	state: () => ({
		db: {}
	}),
	getters: {

	},
	actions: {
		setDbApi(db) {
			this.db = db
		}
	}
})