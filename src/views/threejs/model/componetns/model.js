// 引入Three.js
import * as THREE from 'three';
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const loader = new GLTFLoader(); //创建一个GLTF加载器

const model = new THREE.Group(); //声明一个组对象，用来添加加载成功的三维场景


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




loader.load("/model/金属.glb", function (gltf) {
    // 递归遍历所有模型节点批量修改材质
    gltf.scene.traverse(function(obj) {
        if (obj.isMesh) {//判断是否是网格模型
            // console.log('obj.material',obj.material);
            // 重新设置材质的金属度和粗糙度属性
            obj.material.metalness = 1.0;//金属度
            obj.material.roughness = 0.5;//表面粗糙度
            obj.material.envMap = textureCube; //设置环境贴图
            // envMapIntensity：控制环境贴图对mesh表面影响程度
            obj.material.envMapIntensity = 1.0;//默认值1, 设置为0.0,相当于没有环境贴图
            // obj.material = new THREE.MeshStandardMaterial({
            //     color: obj.material.color, //读取材质原来的颜色
            //     // 金属度属性metalness：材质像金属的程度, 非金属材料,如木材或石材,使用0.0,金属使用1.0。
            //     // metalness默认0.5,0.0到1.0之间的值可用于生锈的金属外观
            //     metalness: 1.0,
            //     // metalness: 0.0,//没有金属质感    
            //     // 粗糙度属性roughness:模型表面粗糙程度,0.0表示平滑的镜面反射,1.0表示完全漫反射,默认0.5                      
            //     roughness: 0.5,
            //     // roughness: 1.0,//设置到完全漫反射状态，表面金属质感比较弱
            //     // roughness: 0.0,//完全镜面反射，就像一面镜子一样，注意配合环境贴图观察更明显
            // })
        }
    });
    model.add(gltf.scene);
    model.name="material";
})
export default model;
