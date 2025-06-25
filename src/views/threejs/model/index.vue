<template>

    <!-- 左侧树形结构 -->
    <div>
      <treeTable :treeData="standardList"/>
    </div>
    <!-- 画布及按钮 -->
    <div id="container" class="container-style" ref="resizeTarget"></div>
    <!-- 右侧编辑栏 -->
    <div class="edit-panel"  id="rightDiv" v-show="isShow">
        <model-edit-panel ref="editPanel" :meshList="meshList"/>
    </div>


</template>

<script setup lang="ts">
    import * as THREE from 'three';
    import TWEEN from "@tweenjs/tween.js";
    import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
    // import model from './componetns/model.js'; //模型对象
    import {Display} from '@/components/threejs/display.js'; //模型对象
    import {Viewer} from '@/components/threejs/viewer.js'; //模型对象
    import {ElTree} from 'element-plus'
    import {SamplingStandardApi} from '@/api/qms/samplingstandard'
    import {defaultProps, handleTree} from '@/utils/tree'
    import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
    import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
    import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
    import {STLLoader} from 'three/examples/jsm/loaders/STLLoader'
    import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
    import {CSS3DRenderer} from 'three/addons/renderers/CSS3DRenderer.js';
    import ModelEditPanel from "./componetns/ModelEditPanel.vue";
    import {useMeshEditStore} from '@/components/threejs/meshEditStore'
    import treeTable from './componetns/treeTable.vue'

    /** 购销合同 列表 */
    defineOptions({name: 'threejsModel'})

    const props = defineProps < {
        modelUrl: undefined, // 模型URL
        processInfo:undefined //工艺信息
    } > ()
    

    //右侧材质栏显示隐藏
    const isShow=ref(false)
    //公共参数状态管理
    const store = useMeshEditStore();
    //场景
    let scene = new THREE.Scene();
    //右侧材质栏 模型mesh
    const meshList = ref([]);

    //按钮初始化
    let display = undefined;
    //场景渲染
    let viewer = undefined;
    //渲染模型组
    let model = new THREE.Group(); //声明一个组对象，用来添加加载成功的三维场景

    //文件加载器类型
    const fileLoaderMap = {
        'glb': new GLTFLoader(),
        'fbx': new FBXLoader(),
        'gltf': new GLTFLoader(),
        'obj': new OBJLoader(),
        'stl': new STLLoader(),
    }

    // 加载环境贴图
    // 加载周围环境6个方向贴图
    // 上下左右前后6张贴图构成一个立方体空间
    // 'px.jpg', 'nx.jpg'：x轴正方向、负方向贴图  p:正positive  n:负negative
    // 'py.jpg', 'ny.jpg'：y轴贴图
    // 'pz.jpg', 'nz.jpg'：z轴贴图
    // CubeTexture表示立方体纹理对象，父类是纹理对象Texture
    const textureCube = new THREE.CubeTextureLoader()
        .setPath('/model/环境贴图/环境贴图0/')
        .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
    const standardName = ref('')
    const standardList = ref < Tree[] > ([]) // 树形结构
    const treeRef = ref < InstanceType < typeof ElTree >> ()



    const viewerMode = "glass";
    const controlMode = "trackball/Y up";

    //展示信息
    const displayOptions = {
        cadWidth: 830,
        height: 700,
        treeWidth: 0,
        theme: "browser",
        pinning: true,
        keymap: {
            "shift": "shiftKey",
            "ctrl": "ctrlKey",
            "meta": "metaKey"
        }
    };
    const renderOptions = {
        ambientIntensity: 1.0,
        directIntensity: 1.1,
        metalness: 0.30,
        roughness: 0.65,
        edgeColor: 0x707070,
        defaultOpacity: 0.5,
        normalLen: 0,
        measureTools: false,
    };

    const viewerOptions = {
        ortho: true,
        ticks: 10,
        centerGrid: false,
        timeit: true,
        rotateSpeed: 1.0,
        zoomSpeed: 0.5,
        panSpeed: 0.5,
        collapse: 1,
        measureTools: true,
        newTreeBehaviour: true,
    };

    const  resizeTarget =ref()

    /** 初始化 **/
    onMounted(() => {

        const resizeObserver = new ResizeObserver(entries => {
            // console.log(entries[0].contentRect.width)
            // console.log(entries[0].contentRect.height)
            if (viewer){
                viewer.destroyThreejs();
                setModel()
            }
        })
        resizeObserver.observe(resizeTarget.value)


        if (props.modelUrl){
            setModel();
        }

    })



    /** 获得部门树 */
    const getTree = async (scene) => {
        standardList.value = []
        const aValue = [];
        let parId = 0;
        scene.traverse(function (obj) {
            if (obj.isScene) {
                const treeNode = {id: obj.id, parentId: '0', name: '模型', uuid: obj.uuid, visible: obj.visible}
                aValue.push(treeNode)
                parId = obj.id;
            } else {
                if (obj.isMesh && obj.name != '' && obj.type.indexOf('Helper') < 0 && obj.name.indexOf("mark") < 0) {
                    const treeNode = {id: obj.id, parentId: parId, name: obj.name, uuid: obj.uuid, visible: obj.visible}
                    aValue.push(treeNode)
                }
            }
        });
        meshList.value = aValue
        standardList.value.push(...handleTree(aValue))
        // debugger
    }

    //渲染模型
    const setModel = () => {
        return new Promise((reslove, reject) => {
            let loader;
            scene = new THREE.Scene();
            model = new THREE.Group()
            model.name='objMesh';
             display = undefined;
             viewer = undefined;
            const path = props.modelUrl == undefined ? '/model/PartWithDim.stl' : props.modelUrl;
            const fileTypes = path.split(".");
            const fileType = fileTypes[fileTypes.length -1];

            if (['glb', 'gltf'].includes(fileType)) {
                const dracoLoader = new DRACOLoader()
                dracoLoader.setDecoderPath(`draco/gltf/`)
                dracoLoader.setDecoderConfig({type: 'js'})
                dracoLoader.preload()
                loader = new GLTFLoader().setDRACOLoader(dracoLoader); //创建一个GLTF加载器
            } else {

                loader = fileLoaderMap[fileType]
            }

            loader.load(path, function (result) {

                let sModle;
                switch (fileType) {
                    case 'glb':
                        sModle = result.scene
                        break;
                    case 'fbx':
                        sModle = result

                        break;
                    case 'gltf':
                        sModle = result.scene
                        break;
                    case 'obj':
                        sModle = result
                        break;
                    case 'stl':
                        const material = new THREE.MeshStandardMaterial();
                        const mesh = new THREE.Mesh(result, material);
                        sModle = mesh
                        break;
                    default:
                        break;
                }


                sModle.traverse(function (obj) {
                    if (obj.isMesh) {//判断是否是网格模型
                        obj.material.metalness = 1.0;//金属度
                        obj.material.roughness = 0.5;//表面粗糙度
                        obj.material.envMap = textureCube; //设置环境贴图
                        obj.material.envMapIntensity = 1.0;//默认值1, 设置为0.0,相当于没有环境贴图
                        obj.material.side = THREE.DoubleSide;
                    }
                });
                model.add(sModle);
                scene.add(model); //模型对象添加到场景中
                scene.background = new THREE.Color("#82DBC5")
                let container1 = document.getElementById("container");
                let divWidth = container1.offsetWidth - 20;
                displayOptions.cadWidth = divWidth;
                display = new Display(container1, {
                    theme: 'light',
                    cadWidth: divWidth,
                    treeWidth: 0,
                    height: container1.offsetHeight,
                    pinning: false,
                    glass: false,
                    tools: true,
                    measureTools: false,
                });
                showViewer(controlMode, viewerMode, "canvs", display);
                getTree(scene)
            })


            reslove(true)
        })

    }


    //加载场景
    const showViewer = (control, mode, containerId, display) => {
        const container = document.getElementById(containerId);
        container.innerHTML = ""
        if (mode == "glass") {
            displayOptions.glass = true;
            displayOptions.tools = true
        } else if (mode == "no tools") {
            displayOptions.glass = false;
            displayOptions.tools = false;
        } else {
            displayOptions.glass = false;
            displayOptions.tools = true;
        }
        displayOptions.newTreeBehavior = true;
        displayOptions.height = container.offsetHeight
        let control_up = control.split("/");

        let box3_2 = new THREE.Box3().setFromObject(model);   //新建一个Box3包裹盒把模型包裹起来
        
        if (isNaN(box3_2.min.x)){
            // debugger
            box3_2 = new THREE.Box3(new THREE.Vector3( -100, -100, -100 ),new THREE.Vector3( 100, 100, 100 ))
        }
        const boxSize = box3_2.getSize(new THREE.Vector3()).length();  //综合计算出模型的长度值，利用它设置相机位置

        store.setBoxLength(Math.ceil(boxSize + 6))
        viewer = new Viewer(container, displayOptions, null, null, true, scene, boxSize, display)
        viewerOptions.control = control_up[0];
        viewerOptions.up = control_up[1][0];
        render();
        // console.log(scene)


        // renderTag()
    }

    //渲染场景
    const render = () => {
        // viewer.value?.clear();
        viewer.render(
            renderOptions,
            viewerOptions,
        );
        viewer.setSplitModel(scene.getObjectByName("objMesh"));
    }

    //坐标渲染
    const renderTag = () => {
        const a = new THREE.Vector3(-15, 8, 1);
        const b = new THREE.Vector3(15, 8, 1);

        let sizeTagGroup = viewer.sizeTag(a, b)

        scene.add(sizeTagGroup); //模型对象添加到场景中
        viewer.update(false, true);
    }


    const nc = (change) => {
        console.log("index.html:", JSON.stringify(change, null, 2));
    }


    /** 处理点击事件 */
    const handleNodeClick = async (row: { [key: string]: any }) => {
        let id = row.uuid;
        viewer.onChangeModelMeaterial(id, model);
        // this.outlinePass.selectedObjects = [mesh]
    }












    //监听url
    watch(() =>props.modelUrl ,
        (val) => {

        if (!val) {
            return
        }

        if (viewer){
            viewer.destroyThreejs();
        }
            setModel();
        }
    );



    //监听选中模型
    watch(() => store.selectMeshUuid,
        (val) => {
            viewer.onChangeModelMeaterial(val, model);
        }
    );
    //监听x切面
    watch(() => store.selectClipPlanes[0].constant,
        (val) => {
            if (!val) {
                return
            }
            viewer.onCancelModelMaterial();
            scene.traverse(function (obj) {
                if (obj.material && obj.isMesh && obj.name != 'mark') {
                    obj.material.clippingPlanes = store.selectClipPlanes
                    obj.material.clipIntersection = false
                }

            });
            //viewer.animate();
            viewer.update(false, true);
            console.log(scene)

        }
    );
    //监听y切面
    watch(() => store.selectClipPlanes[1].constant,
        (val) => {
            if (!val) {
                return
            }
            viewer.onCancelModelMaterial();
            scene.traverse(function (obj) {
                if (obj.material && obj.isMesh && obj.name != 'mark') {
                    obj.material.clippingPlanes = store.selectClipPlanes
                    obj.material.clipIntersection = false
                }
            });
            //viewer.animate();
            viewer.update(false, true);
            console.log(scene)

        }
    );
    //监听z切面
    watch(() => store.selectClipPlanes[2].constant,
        (val) => {
            if (!val) {
                return
            }
            viewer.onCancelModelMaterial();
            scene.traverse(function (obj) {
                if (obj.material && obj.isMesh && obj.name != 'mark') {
                    obj.material.clippingPlanes = store.selectClipPlanes
                    obj.material.clipIntersection = false
                }

            });
            //viewer.animate();
            viewer.update(false, true);
            console.log(scene)

        }
    );

    //监听模型显隐
    watch(() => store.selectVisibleMesh,
        (val) => {
            if (!val) {
                return
            }

            let s = val.split('_')
            viewer.onCancelModelMaterial();
            scene.traverse(function (obj) {
                if (obj.id == s[0]) {
                    if (s[1] == 'true') {
                        obj.visible = true
                    } else {
                        obj.visible = false
                    }
                }

            });
            viewer.update(false, true);
            console.log(scene)

        }
    );
    //监听右侧工具栏显隐
    watch(() => store.selectMeshTabShow,
        (val) => {
            if (!val) {
                return
            }
        // debugger
            isShow.value = val ==2?false:true
        }
    );

    watch(() => store.selectMeshDecompose,
        (val) => {
            if (!val) {
                return
            }
            viewer.setValue(val)

        }
    );


    const modelDecomposeMove = (obj, position) => {
        const Tween = new TWEEN.Tween(obj.position)
        Tween.to(position, 500)
        Tween.onUpdate(function (val) {
            obj.position.set(val.x || 0, val.y || 0, val.z || 0);
        })
        Tween.start()

        viewer.update(false, true);
    }



    const setModelMeshDecompose =(decompose)=>{
        if (meshList.value.length <=2) return false

        const length = meshList.value.length-1
        const angleStep = (2 * Math.PI) / length;

        meshList.value.forEach((item, index) => {
            if (item.parentId != '0'){

                const mesh = scene.getObjectByProperty('uuid', item.uuid)
                const angle = (index-1) * angleStep;
                const x = (decompose) * Math.cos(angle);
                const y = (decompose) * Math.sin(angle);
                const position = {
                    x, y, z: 0
                }
                modelDecomposeMove(mesh, position)

            }
        })

    }

</script>

<style lang="scss">
    @import url("@/assets/threejs/three-cad-viewer.scss");

    .edit-box {
        height: calc(100vh - 250px);
    }

    .edit-box,
    .model-choose {

    .header {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 35px;
        padding: 0 20px;
        color: #cccccc;
        background-color: #33343f;
        border-top: 1px solid #1b1c23;
        border-bottom: 1px solid #1b1c23;
    }

    .disabled {
        pointer-events: none;
        opacity: 0.3;
    }

    .options {
        box-sizing: border-box;
        max-width: 380px;
        background-color: #1b1c23;

    .option-active {
        background-color: #27282f;
    }

    .space-between {
        justify-content: space-between;
    }

    .option {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        height: 33px;
        padding: 0 18px;
        font-size: 14px;
        color: #cccccc;
        cursor: pointer;

    .icon-name {
        display: flex;
        align-items: center;
    }

    }
    }
    }
    .el-input-number {
        width: 90px !important;
    }

    .edit-panel {
        position: absolute !important;
        top: 5rem !important;
        right: 2.5rem;
        width: 380px;
    }

    .grid-txt {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }

    .grid-silder {
        flex: 5;
        padding-left: 10px;
    }

    .grid-style {
        min-width: 110px;
    }
    .container-style{
        width: 100%;
        height: calc(100vh - 230px);
    }

</style>

