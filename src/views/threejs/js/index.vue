<template>

<div id="container" style="width: 100%;"></div>
</template>

<script setup lang="ts">
    import * as THREE from 'three';
    import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
    import model from './componetns/model.js'; //模型对象

    /** 购销合同 列表 */
    defineOptions({name: 'threejsModel'})

    //场景
    const scene = new THREE.Scene();


    /** 初始化 **/
    onMounted(() => {
        scene.add(model); //模型对象添加到场景中


        //辅助观察的坐标系
        const axesHelper = new THREE.AxesHelper(100);
        scene.add(axesHelper);
        //背景颜色设置
        scene.background = new THREE.Color("#82DBC5")
        //光源设置
        const directionalLight = new THREE.DirectionalLight(0xE4E4E4, 0.8);
        directionalLight.position.set(400, 200, 300);
        scene.add(directionalLight);
        const ambient = new THREE.AmbientLight(0xE4E4E4, 0.4);
        scene.add(ambient);


        //渲染器和相机
        const width = window.innerWidth;
        const height = window.innerHeight;
        const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
        camera.position.set(40.0, 40.0,40.0);
        camera.lookAt(0, 0, 0);

        let container = document.getElementById("container");
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(container.clientWidth, window.innerHeight-180);

        container.appendChild(renderer.domElement);


        renderer.outputEncoding = THREE.sRGBEncoding;

        // 设置相机控件轨道控制器OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);


        // 渲染循环
        function render() {
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }
        render();

        // 画布跟随窗口变化
        window.onresize = function () {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        };
    })


</script>
