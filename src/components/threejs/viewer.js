import * as THREE from "three";
import { Display } from "./display.js";
//import { NestedGroup, ObjectGroup } from "./nestedgroup.js";
import { Grid } from "./grid.js";
import { AxesHelper } from "./axes.js";
import { OrientationMarker } from "./orientation.js";
import { Clipping } from "./clipping.js";
import { Animation } from "./animation.js";
import {
  clone,
  isEqual,
  sceneTraverse,
  KeyMapper,
  scaleLight,
} from "./utils.js";
import { Controls } from "./controls.js";
import { Camera } from "./camera.js";
import { BoundingBox, BoxHelper } from "./bbox.js";
import { Tools } from "./cad_tools/tools.js";
import { version } from "./_version.js";
import { PickedObject, Raycaster, TopoFilter } from "./raycast.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { vertexShader, fragmentShader } from './constant.js'
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import {useMeshEditStore} from '@/components/threejs/meshEditStore'
import TWEEN from "@tweenjs/tween.js";
const  store=useMeshEditStore();
class Viewer {
  /**
   * Create Viewer.
   * @param {Display} display - The Display object.
   * @param {DisplayOptions} options - configuration parameters.
   * @param {NotificationCallback} notifyCallback - The callback to receive changes of viewer parameters.
   * @param {boolean} updateMarker - enforce to redraw orientation marker after evry ui activity
   */
  constructor(
    container,
    options,
    notifyCallback,
    pinAsPngCallback = null,
    updateMarker = true,
    scene,
    boxLength,
    display
  ) {



    this.transparent=false;
    this.css2DRenderer = null;
    this.sizeTagGroup = new THREE.Group(); //声明一个组对象，用来添加加载成功的三维场景
    this.boxLength=boxLength;
    this.container =container;
    this.renderAnimation=null;
    this.setDisplayDefaults(options);
    this.effectComposer=null;
    this.outlinePass=null;
    this.notifyCallback = notifyCallback;
    this.pinAsPngCallback = pinAsPngCallback;
    this.updateMarker = updateMarker;
      this.unrealBloomPass
    this.hasAnimationLoop = false;

    if (options.keymap) {
      KeyMapper.set(options.keymap);
    }
    window.THREE = THREE;
      this.display = display;
    this.numberS=0;
    this.nestedGroup = null;
    this.mapping = null;
    this.tree = null;
    this.bbox = new BoundingBox(
        new THREE.Vector3(-boxLength/2, -boxLength/2, -boxLength/2),
        new THREE.Vector3(boxLength/2, boxLength/2, boxLength/2),
    );
    this.bb_max = 0;
    this.scene = scene;
    this.camera = null;
    this.orthographicCamera = null;
    // this.orthographicScene = null;
    this.gridHelper = null;
    this.axesHelper = null;
    this.controls = null;
    this.orientationMarker = null;
    this.treeview = null;
   // this.cadTools = new Tools(this);
    this.newTreeBehavior = options.newTreeBehavior;

    this.ready = false;
    this.mixer = null;
    this.animation = new Animation("|");
    this.continueAnimation = true;

    //爆炸效果
      this.meshList = [];
      this.running = false;
      this.targetSplitValue = 0;
      this.currentSplitValue = 0;
      this.offset = 1;

      this.splitScale = 2; //影响拆分距离，就是mesh的包围盒中心与爆炸中心的距离的倍率
      this.splitSpeed = 50;//影响拆分速度，反比例
      this.isQuit=false;




    this.clipNormals = [
      [-1, 0, 0],
      [0, -1, 0],
      [0, 0, -1],
    ];

    this.camera_distance = 0;

    this.mouse = new THREE.Vector2();

    // setup renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha:true,
      antialias: true,
      stencil: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.cadWidth, this.height);
    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.autoClear = false;
      this.renderer.localClippingEnabled = true;
  //  container.appendChild(this.renderer.domElement);







    this.lastNotification = {};
    this.lastBbox = null;

    // measure supporting exploded shapes and compact shapes
    this.explodedGroup = null;
    this.explodedTree = null;
    this.explodedStates = null;
    this.explodedNestedGroup = null;
    this.compactGroup = null;
    this.compactTree = null;
    this.compactStates = null;
    this.compactNestedGroup = null;
    this.lastObject = null;
    this.lastSelection = null;
    this.lastPosition = null;
    this.bboxNeedsUpdate = false;

    this.keepHighlight = false;

    this.setPickHandler(true);

    // this.renderer.domElement.addEventListener("contextmenu", (e) =>
    //   e.stopPropagation(),
    // );

    this.display.addCadView(this.renderer.domElement);

    console.debug("three-cad-viewer: WebGL Renderer created");

    this.display.setupUI(this);


  }

  /**
   * Return three-cad-viewer version as semver string
   * @returns semver version
   */
  version() {
    return version;
  }

  /**
   * Enhance the given options for viewer creation by default values.
   * @param {DisplayOptions} options - The provided options object for the viewer.
   */
  setDisplayDefaults(options) {
    this.theme = "light";
    this.cadWidth = 800;
    this.treeWidth = 250;
    this.height = 600;
    this.pinning = false;
    this.glass = false;
    this.tools = true;
    this.keymap = { shift: "shiftKey", ctrl: "ctrlKey", meta: "metaKey" };
    this.newTreeBehavior = true;

    for (var option in options) {
      if (this[option] == null) {
        console.warn(`Unknown option "${option}" to create a viewer - ignored`);
      } else {
        this[option] = options[option];
      }
    }
    if (
      options.theme === "dark" ||
      (options.theme == "browser" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      this.theme = "dark";
    } else {
      this.theme = "light";
    }
  }

  /**
   * Enhance the given options for rendering by default values.
   * @param {RenderOptions} options - The provided options object for the viewer.
   */
  setRenderDefaults(options) {
    this.ambientIntensity = 0.5;
    this.directIntensity = 0.6;
    this.metalness = 0.7;
    this.roughness = 0.7;
    this.defaultOpacity = 0.5;
    this.edgeColor = 0x707070;
    this.normalLen = 0;
    this.measureTools = false;

    for (var option in options) {
      if (this[option] === undefined) {
        console.warn(`Unknown option "${option}" to create a viewer - ignored`);
      } else {
        this[option] = options[option];
      }
    }

    this.materialSettings = {
      ambientIntensity: this.ambientIntensity,
      directIntensity: this.directIntensity,
      metalness: this.metalness,
      roughness: this.roughness,
    };
  }

  /**
   * Enhance the given options for the view by default values.
   * @param {ViewOptions} options - The provided options object for the viewer.
   */

  setViewerDefaults(options) {
    this.axes = false;
    this.axes0 = false;
    this.grid = [false, false, false];
    this.ortho = true;
    this.transparent = false;
    this.blackEdges = false;
    this.collapse = 0;

    this.clipIntersection = false;
    this.clipPlaneHelpers = false;
    this.clipObjectColors = false;
    this.clipNormal0 = [-1, 0, 0];
    this.clipNormal1 = [0, -1, 0];
    this.clipNormal2 = [0, 0, -1];
    this.clipSlider0 = -1;
    this.clipSlider1 = -1;
    this.clipSlider2 = -1;
    this.control = "orbit";
    this.up = "Z";
    this.ticks = 10;
    this.centerGrid = false;
    this.position = null;
    this.quaternion = null;
    this.target = null;
    this.measureTools = true;
    this.newTreeBehaviour = true;

    this.zoom = 1;

    this.panSpeed = 0.5;
    this.rotateSpeed = 1.0;
    this.zoomSpeed = 0.5;
    this.timeit = false;

    for (var option in options) {
      if (this[option] === undefined) {
        console.warn(`Unknown option ${option} to add shapes - ignored`);
      } else {
        this[option] = options[option];
      }
    }
  }

  dumpOptions() {
    console.log("Display:");
    console.log("- cadWidth", this.cadWidth);
    console.log("- control", this.control);
    console.log("- height", this.height);
    console.log("- pinning", this.pinning);
    console.log("- theme", this.theme);
    console.log("- treeHeight", this.treeHeight);
    console.log("- treeWidth", this.treeWidth);

    console.log("Render:");
    console.log("- ambientIntensity", this.ambientIntensity);
    console.log("- defaultOpacity", this.defaultOpacity);
    console.log("- directIntensity", this.directIntensity);
    console.log("- edgeColor", this.edgeColor);
    console.log("- normalLen", this.normalLen);

    console.log("View:");
    console.log("- axes", this.axes);
    console.log("- axes0", this.axes0);
    console.log("- blackEdges", this.blackEdges);
    console.log("- clipIntersection", this.clipIntersection);
    console.log("- clipPlaneHelpers", this.clipPlaneHelpers);
    console.log("- clipObjectColors", this.clipObjectColors);
    console.log("- clipNormal0", this.clipNormal0);
    console.log("- clipNormal1", this.clipNormal1);
    console.log("- clipNormal2", this.clipNormal2);
    console.log("- clipSlider0", this.clipSlider0);
    console.log("- clipSlider1", this.clipSlider1);
    console.log("- clipSlider2", this.clipSlider2);
    console.log("- grid", this.grid);
    console.log("- ortho", this.ortho);
    console.log("- panSpeed", this.panSpeed);
    console.log("- position", this.position);
    console.log("- quaternion", this.quaternion);
    console.log("- rotateSpeed", this.rotateSpeed);
    console.log("- ticks", this.ticks);
    console.log("- timeit", this.timeit);
    console.log("- tools", this.tools);
    console.log("- glass", this.glass);
    console.log("- transparent", this.transparent);
    console.log("- zoom", this.zoom);
    console.log("- zoom0", this.controls.getZoom0());
    console.log("- zoomSpeed", this.zoomSpeed);
  }
  // - - - - - - - - - - - - - - - - - - - - - - - -
  // Load Tesselated Shapes
  // - - - - - - - - - - - - - - - - - - - - - - - -

  /**
   * Render tessellated shapes of a CAD object.
   * @param {Shapes} shapes - The Shapes object representing the tessellated CAD object.
   * @returns {THREE.Group} A nested THREE.Group object.
   */
  _renderTessellatedShapes(shapes, states) {
    const nestedGroup = new NestedGroup(
      shapes,
      this.cadWidth,
      this.height,
      this.edgeColor,
      this.transparent,
      this.defaultOpacity,
      this.metalness,
      this.roughness,
      this.normalLen,
    );

    let box3_2 = new THREE.Box3().setFromObject(model);   //新建一个Box3包裹盒把模型包裹起来

      if (isNaN(box3_2.min.x)){
          box3_2 = new THREE.Box3(new THREE.Vector3( -100, -100, -100 ),new THREE.Vector3( 100, 100, 100 ))
      }
    const boxSize = box3_2.getSize(new THREE.Vector3()).length();
    nestedGroup.render(states);
    return nestedGroup;
  }

  /**
   * Retrieve the navigation tree from a Shapes object.
   * @param {Shapes} shapes - The Shapes object.
   * @param {States} states - the visibility state of meshes and edges
   * @returns {NavTree} The navigation tree object.
   */
  _getTree(shapes, states) {
    const delim = "/";

    const _getTree = (subGroup, path) => {
      const newPath = `${path}${delim}${subGroup.name}`;
      var result = {
        name: subGroup.name,
        id: newPath,
      };
      if (subGroup.parts) {
        result.type = "node";
        result.children = [];
        for (var part of subGroup.parts) {
          result.children.push(_getTree(part, newPath));
        }
      } else {
        result.type = "leaf";
        result.states = states[newPath];
      }
      return result;
    };

    return _getTree(shapes, "");
  }

  /**
   * Decompose a CAD object into faces, edges and vertices.
   * @param {Shapes} shapes - The Shapes object.
   * @param {States} states - the visibility state of meshes and edges
   * @returns {Shapes} A decomposed Shapes object.
   */
  _decompose(part, states) {
    const shape = part.shape;
    var j;

    part.parts = [];

    if (part.type == "shapes") {
      // decompose faces
      var new_part = {
        parts: [],
        loc: [
          [0, 0, 0],
          [0, 0, 0, 1],
        ],
        name: "faces",
        id: `${part.id}/faces`,
      };
      var triangles;
      const vertices = shape.vertices;
      const normals = shape.normals;
      const num = shape.triangles_per_face
        ? shape.triangles_per_face.length
        : shape.triangles.length;
      var current = 0;
      for (j = 0; j < num; j++) {
        if (shape.triangles_per_face) {
          triangles = shape.triangles.subarray(
            current,
            current + 3 * shape.triangles_per_face[j],
          );
          current += 3 * shape.triangles_per_face[j];
        } else {
          triangles = shape.triangles[j];
        }

        var vecs = new Float32Array(triangles.length * 3);
        var norms = new Float32Array(triangles.length * 3);
        for (var i = 0; i < triangles.length; i++) {
          var s = triangles[i];
          vecs[3 * i] = vertices[3 * s];
          vecs[3 * i + 1] = vertices[3 * s + 1];
          vecs[3 * i + 2] = vertices[3 * s + 2];
          norms[3 * i] = normals[3 * s];
          norms[3 * i + 1] = normals[3 * s + 1];
          norms[3 * i + 2] = normals[3 * s + 2];
        }
        var new_shape = {
          loc: [
            [0, 0, 0],
            [0, 0, 0, 1],
          ],
          name: `faces_${j}`,
          id: `${part.id}/faces/faces_${j}`,
          type: "shapes",
          color: part.color,
          alpha: part.alpha,
          renderback: true,
          accuracy: part.accuracy,
          bb: {},
          geomtype: shape.face_types[j],
          subtype: part.subtype,
          exploded: true,
          shape: {
            triangles: [...Array(triangles.length).keys()],
            vertices: vecs,
            normals: norms,
            edges: [],
          },
        };
        new_part.parts.push(new_shape);
        states[new_shape.id] = [1, 3];
      }

      part.parts.push(new_part);
    }

    if (part.type == "shapes" || part.type == "edges") {
      // decompose edges
      new_part = {
        parts: [],
        loc: [
          [0, 0, 0],
          [0, 0, 0, 1],
        ],
        name: "edges",
        id: `${part.id}/edges`,
      };
      const multiColor =
        Array.isArray(part.color) && part.color.length == shape.edges.length;
      var color;

      const num = shape.segments_per_edge
        ? shape.segments_per_edge.length
        : shape.edges.length;
      current = 0;
      var edge;
      for (j = 0; j < num; j++) {
        if (shape.segments_per_edge) {
          edge = shape.edges.subarray(
            current,
            current + 6 * shape.segments_per_edge[j],
          );
          current += 6 * shape.segments_per_edge[j];
        } else {
          edge = shape.edges[j];
        }
        color = multiColor ? part.color[j] : part.color;
        new_shape = {
          loc: [
            [0, 0, 0],
            [0, 0, 0, 1],
          ],
          name: `edges_${j}`,
          id: `${part.id}/edges/edges_${j}`,
          type: "edges",
          color: part.type == "shapes" ? this.edgeColor : color,
          width: part.type == "shapes" ? 1 : part.width,
          bb: {},
          geomtype: shape.edge_types[j],
          shape: { edges: edge },
        };
        new_part.parts.push(new_shape);
        states[new_shape.id] = [3, 1];
      }

      part.parts.push(new_part);
    }

    // decompose vertices
    new_part = {
      parts: [],
      loc: [
        [0, 0, 0],
        [0, 0, 0, 1],
      ],
      name: "vertices",
      id: `${part.id}/vertices`,
    };
    var vertices = shape.obj_vertices;
    for (j = 0; j < vertices.length / 3; j++) {
      new_shape = {
        loc: [
          [0, 0, 0],
          [0, 0, 0, 1],
        ],
        name: `vertices${j}`,
        id: `${part.id}/vertices/vertices${j}`,
        type: "vertices",
        color:
          part.type == "shapes" || part.type == "edges"
            ? this.edgeColor
            : part.color,
        size: part.type == "shapes" || part.type == "edges" ? 4 : part.size,
        bb: {},
        shape: {
          obj_vertices: [
            vertices[3 * j],
            vertices[3 * j + 1],
            vertices[3 * j + 2],
          ],
        },
      };
      new_part.parts.push(new_shape);
      states[new_shape.id] = [3, 1];
    }

    part.parts.push(new_part);

    delete part.shape;
    delete part.color;
    delete part.alpha;
    delete part.accuracy;
    delete part.renderBack;
    delete states[part.id];

    return part;
  }

  /**
   * Render the shapes of the CAD object.
   * @param {Shapes} shapes - The Shapes object.
   * @param {States} states - the visibility state of meshes and edges
   * @param {RenderOptions} options - the options for rendering
   * @returns {THREE.Group} A nested THREE.Group object.
   */
  renderTessellatedShapes(exploded, shapes, states) {
    const _render = (shapes, states) => {
      var part;
      if (shapes.version == 2 || shapes.version == 3) {
        var i, tmp;
        let parts = [];
        for (i = 0; i < shapes.parts.length; i++) {
          part = shapes.parts[i];
          if (part.parts != null) {
            tmp = _render(part, states);
            parts.push(tmp);
          } else {
            parts.push(this._decompose(part, states));
          }
        }
        shapes.parts = parts;
      }
      return shapes;
    };

    var exploded_states = structuredClone(states);
    var exploded_shapes;
    if (exploded) {
      exploded_shapes = _render(structuredClone(shapes), exploded_states);
    } else {
      exploded_shapes = structuredClone(shapes);
    }
    var nested_group = this._renderTessellatedShapes(
      exploded_shapes,
      exploded_states,
    );
    var rendered_tree = this._getTree(exploded_shapes, exploded_states);

    return {
      group: nested_group,
      tree: rendered_tree,
      states: exploded_states,
    };
  }

  // - - - - - - - - - - - - - - - - - - - - - - - -
  // Animation
  // - - - - - - - - - - - - - - - - - - - - - - - -

  /**
   * Add an animation track for a THREE.Group
   * @param {string} selector - path/id of group to be animated.
   * @param {string} action - one of "rx", "ry", "rz" for rotations around axes, "q" for quaternions or "t", "tx", "ty", "tz" for translations.
   * @param {number[]} time - array of times.
   * @param {number[]} values - array of values, the type depends on the action.
   */
  addAnimationTrack(selector, action, time, values) {
    this.animation.addTrack(
      selector,
      this.nestedGroup.groups[selector],
      action,
      time,
      values,
    );
  }

  /**
   * Initialize the animation.
   * @param {number} duration - overall duration of the anmiation.
   * @param {number} speed - speed of the animation.
   */
  initAnimation(duration, speed, label = "A", repeat = true) {
    if (this.animation == null || this.animation.tracks.lenght == 0) {
      console.error("Animation does not have tracks");
      return;
    }
    console.debug("three-cad-viewer: Animation initialized");
    if (!this.hasAnimationLoop) {
      this.toggleAnimationLoop(true);
    }

    this.display.showAnimationControl(true);
    this.clipAction = this.animation.animate(
      this.nestedGroup.rootGroup,
      duration,
      speed,
      repeat,
    );
    this.display.setAnimationLabel(label);
    this.display.resetAnimationSlider();
  }

  /**
   * Check whether animation object exists
   */
  hasAnimation() {
    return !!this.animation.clipAction;
  }

  /**
   * Clear the animation obect and dispose dependent objects
   */
  clearAnimation() {
    if (this.animation) {
      this.animation.dispose();
    }
    this.display.showAnimationControl(false);
    this.toggleAnimationLoop(false);
  }

  // - - - - - - - - - - - - - - - - - - - - - - - -
  // Update handling of the renderer
  // - - - - - - - - - - - - - - - - - - - - - - - -

  /**
   * Creates ChangeNotification object if new value != old value and sends change notifications via viewer.notifyCallback.
   * @function
   * @param {ChangeInfos} changes - change information.
   * @param {boolean} notify - whether to send notification or not.
   */
  checkChanges = (changes, notify = true) => {
    var changed = {};
    Object.keys(changes).forEach((key) => {
      if (!isEqual(this.lastNotification[key], changes[key])) {
        var change = clone(changes[key]);
        changed[key] = {
          new: change,
          // map undefined in lastNotification to null to enable JSON exchange
          old:
            this.lastNotification[key] == null
              ? null
              : clone(this.lastNotification[key]),
        };
        this.lastNotification[key] = change;
      }
    });

    if (Object.keys(changed).includes("position")) {
      if (this.keepHighlight) {
        this.keepHighlight = false;
      } else {
        this.display.clearHighlights();
      }
    }

    if (notify && this.notifyCallback && Object.keys(changed).length) {
      this.notifyCallback(changed);
    }
  };

  /**
   * Render scene and update orientation marker
   * If no animation loop exists, this needs to be called manually after every camera/scene change
   * @function
   * @param {boolean} updateMarker - whether to update the orientation marker
   * @param {boolean} fromAnimationLoop - whether a animation loop is running in the background. Update will skipped for this case
   * @param {boolean} notify - whether to send notification or not.
   */
  update = (updateMarker, notify = true) => {
    if (this.ready) {
      this.renderer.clear();

      if (this.raycaster && this.raycaster.raycastMode) {
        this.handleRaycast();
      }

      this.renderer.setViewport(0, 0, this.cadWidth, this.height);
      this.renderer.render(this.scene, this.camera.getCamera());
     // this.cadTools.update();

      this.directLight.position.copy(this.camera.getCamera().position);

      if (
        this.lastBbox != null &&
        (this.lastBbox.needsUpdate || this.bboxNeedsUpdate)
      ) {
        console.log("updated bbox");
        this.lastBbox.bbox.update();
        this.lastBbox.needsUpdate = false;
      }

      // if (updateMarker) {
      //   this.renderer.clearDepth(); // ensure orientation Marker is at the top
      //
      //   this.orientationMarker.update(
      //     this.camera.getPosition().clone().sub(this.controls.getTarget()),
      //     this.camera.getQuaternion(),
      //   );
      //   this.orientationMarker.render(this.renderer);
      // }

      if (this.animation) {
        this.animation.update();
      }

      this.checkChanges(
        {
          zoom: this.camera.getZoom(),
          position: this.camera.getPosition().toArray(),
          quaternion: this.camera.getQuaternion().toArray(),
          target: this.controls.getTarget().toArray(),
        },
        notify,
      );
    }
  };

  /**
   * Start the animation loop
   * @function
   */
  animate = () => {
    if (this.renderer) {

        this.updateExplose();
        this.renderAnimation = requestAnimationFrame(() => this.animate())
        if (this.effectComposer){
          this.effectComposer.render();
        }
        if (this.css2DRenderer) {
            this.css2DRenderer.render(this.scene,this.camera.getCamera());
        }
        this.renderer.localClippingEnabled = true
      //  requestAnimationFrame(this.animate);
      this.controls.update();

    } else {
      console.debug("three-cad-viewer: Animation loop stopped");
    }
  };

  toggleAnimationLoop(flag) {
    if (flag) {
      this.continueAnimation = true;
      this.hasAnimationLoop = true;
      this.controls.removeChangeListener();
      console.debug("three-cad-viewer: Change listener removed");

      console.debug("three-cad-viewer: Animation loop started");
    } else {
      if (this.hasAnimationLoop) {
        console.debug("three-cad-viewer: Turning animation loop off");
      }
      this.continueAnimation = false;
      this.hasAnimationLoop = false;
      this.controls.addChangeListener(() => this.update(true, true));
      console.debug("three-cad-viewer: Change listener registered");

      // ensure last animation cycle has finished
      setTimeout(() => this.update(true, true), 50);
    }
  }
  // - - - - - - - - - - - - - - - - - - - - - - - -
  // Clean up
  // - - - - - - - - - - - - - - - - - - - - - - - -

  /**
   * Remove assets and event handlers.
   */
  dispose() {
    this.clear();

    // dispose the orientation marker
    if (this.orientationMarker != null) {
      this.orientationMarker.dispose();
    }

    // dispose rendereranimate
    if (this.renderer != null) {
      this.renderer.renderLists.dispose();
      this.renderer
        .getContext("webgl2")
        .getExtension("WEBGL_lose_context")
        .loseContext();
      console.debug("three-cad-viewer: WebGL context disposed");
      this.renderer = null;
    }

    // dispose all event handlers and HTML content
    if (this.display != null) {
      this.display.dispose();
      this.display = null;
    }
  }

  /**
   * Clear CAD view and remove event handler.
   */
  clear() {
    if (this.scene != null) {
      // stop animation
      this.continueAnimation = false;

      // remove change listener if exists
      if (!this.hasAnimationLoop) {
        this.controls.removeChangeListener();
        console.debug("three-cad-viewer: Change listener removed");
      }
      this.hasAnimationLoop = false;
      this.display.showAnimationControl(false);

      if (this.animation != null) {
        this.animation.dispose();
      }

      this.display.setExplodeCheck(false);

      // clear render canvas
      this.renderer.clear();

      // dispose scene

      // sceneTraverse(this.scene, (o) => {
      //   o.geometry?.dispose();
      //   o.material?.dispose();
      // });
      // clear tree view
     // this.display.clearCadTree();

      // clear info
     // this.info.dispose();

      // dispose camera and controls
      this.camera.dispose();
      this.controls.dispose();
      this.ready = false;
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - -
  // Rendering
  // - - - - - - - - - - - - - - - - - - - - - - - -

  /**
   * Toggle the two version of the NestedGroup
   * @param exploded - whether to render the exploded or compact version
   */
  toggleGroup(exploded) {


   // this.scene.children[0] = model;
    console.log(this.numberS);

    this.numberS= this.numberS+1;
    var timer = new Timer("toggleGroup", true);
    var _config = () => {
      this.nestedGroup.setTransparent(this.transparent);
      this.nestedGroup.setBlackEdges(this.blackEdges);
      this.nestedGroup.setMetalness(this.metalness);
      this.nestedGroup.setRoughness(this.roughness);
      this.nestedGroup.setPolygonOffset(2);
    };

    if (
      (this.compactGroup == null && !exploded) ||
      (this.explodedGroup == null && exploded)
    ) {
      this.setRenderDefaults(this.renderOptions);

      var result;
      if (exploded) {
        if (this.explodedGroup == null) {
          result = this.renderTessellatedShapes(
            exploded,
            this.shapes,
            this.states,
          );
          this.nestedGroup = result["group"];
          this.explodedNestedGroup = result["group"];
          _config();
          this.explodedStates = result["states"];
          this.explodedTree = result["tree"];
          this.explodedGroup = this.nestedGroup.render(result["states"]);
        }
      } else {
        if (this.compactGroup == null) {
          result = this.renderTessellatedShapes(
            exploded,
            this.shapes,
            this.states,
          );
          this.nestedGroup = result["group"];
          this.compactNestedGroup = result["group"];
          _config();
          this.compactStates = result["states"];
          this.compactTree = result["tree"];
          this.compactGroup = this.nestedGroup.render(this.states);
        }
      }
      timer.split(`rendered${exploded ? " exploded" : " compact"} shapes`);
    } else {
      this.nestedGroup = exploded
        ? this.explodedNestedGroup
        : this.compactNestedGroup;
      _config();
    }
    
    this.states = exploded ? this.explodedStates : this.compactStates;
    this.tree = exploded ? this.explodedTree : this.compactTree;
    //TODO
   // this.scene.children[0] = exploded ? this.explodedGroup : this.compactGroup;

    timer.split("added shapes to scene");

    this.treeview = new TreeView(
      structuredClone(this.states),
      this.tree,
      this.setObjects,
      this.handlePick,
      this.theme,
      this.newTreeBehavior,
    );
    timer.split("rendered tree");
    timer.split("rendered tree");

    this.update(true, true);

    this.display.clearCadTree();
    this.display.addCadTree(this.treeview.render(this.collapse));
    this.display.selectTabByName("tree");
    timer.split("added tree to display");
    timer.stop();
    this.display.toggleClippingTab(!exploded);
  }

  /**
   * Render a CAD object and build the navigation tree
   * @param {Shapes} shapes - the Shapes object representing the tessellated CAD object
   * @param {States} states - the visibility state of meshes and edges
   * @param {ViewerOptions} viewerOptions - the viewer options
   * @param {RenderOptions} renderOptions - the render options
   */
  render(renderOptions, viewerOptions) {
    this.renderOptions = renderOptions;
    this.setViewerDefaults(viewerOptions);
    this.animation.cleanBackup();


    const that =this
   // this.toggleGroup(false);


    const center = new THREE.Vector3();
    this.bbox.getCenter(center);
    this.bb_max = this.bbox.max_dist_from_center();
    this.bb_radius =  center.length();

    this.camera = new Camera(
      this.cadWidth,
      this.height,
      this.boxLength-10,
      viewerOptions.target == null ? this.bbox.center() : viewerOptions.target,
      this.ortho,
      viewerOptions.up,
    );


    this.orthographicCamera = new THREE.OrthographicCamera(
      -10,
      10,
      -10,
      10,
      0,
      100,
    );
    this.orthographicCamera.position.z = 50;
    this.orthographicCamera.up = this.camera.up;

    this.controls = new Controls(
      this.control,
      this.camera.getCamera(),
      viewerOptions.target == null ? this.bbox.center() : viewerOptions.target,
      this.renderer.domElement,
      this.rotateSpeed,
      this.zoomSpeed,
      this.panSpeed,
    );
    this.controls.enableKeys = false;

    // ensure panning works for screen coordinates
    this.controls.controls.screenSpacePanning = true;

    // this needs to happen after the controls have been established
    if (viewerOptions.position == null && viewerOptions.quaternion == null) {
      this.presetCamera("iso", this.zoom);
      this.display.highlightButton("iso");
    } else if (viewerOptions.position != null) {
      this.setCamera(
        false,
        viewerOptions.position,
        viewerOptions.quaternion,
        this.zoom,
      );
      if (viewerOptions.quaternion == null) {
        this.camera.lookAtTarget();
      }
    } else {
      this.info.addHtml(
        "<b>quaternion needs position to be provided, falling back to ISO view</b>",
      );
      this.presetCamera("iso", this.zoom);
    }
    this.controls.update();

    this.controls.saveState();



    // this.directLight = new THREE.PointLight(0xffffff, this.directIntensity);
    this.directLight = new THREE.DirectionalLight(
        0xE4E4E4,
      0.8
    );
    this.directLight.position.set(40, 20, 30);
    this.scene.add(this.directLight);

    this.ambientLight =new THREE.AmbientLight(0xE4E4E4, 0.4);

    this.scene.add(this.ambientLight);
    // this.setAmbientLight(this.ambientIntensity);
    // this.setDirectLight(this.directIntensity);

    //
    // add grid helpers
    //
    this.gridHelper = new Grid(
      this.display,
      this.bbox,
      this.ticks,
      this.centerGrid,
      this.axes0,
      this.grid,
      viewerOptions.up == "Z",
      this.theme,
    );
    this.gridHelper.computeGrid();

    if (this.gridHelper){
        for (var i = 0; i < 3; i++) {
            this.scene.add(this.gridHelper.gridHelper[i]);
        }
    }

    this.gridSize = this.gridHelper.size;

    this.axesHelper = new AxesHelper(
      this.bbox.center(),
      this.gridSize / 2,
      2,
      this.cadWidth,
      this.height,
      this.axes0,
      this.axes,
      this.theme,
    );
    this.scene.add(this.axesHelper);

    const cSize =
      1.1 *
      Math.max(
        Math.abs(this.bbox.min.length()),
        Math.abs(this.bbox.max.length()),
      );
    // this.clipping = new Clipping(
    //   this.bbox.center(),
    //   2 * cSize,
    //   this.nestedGroup,
    //   this.display,
    //   this.theme,
    // );

    this.display.setSliderLimits(this.gridSize / 2, this.bbox.center());

    this.setClipNormal(0, viewerOptions.clipNormal0, true);
    this.setClipNormal(1, viewerOptions.clipNormal1, true);
    this.setClipNormal(2, viewerOptions.clipNormal2, true);

    this.clipSlider0 =
      viewerOptions.clipSlider0 != null
        ? viewerOptions.clipSlider0
        : this.gridSize / 2;
    this.clipSlider1 =
      viewerOptions.clipSlider1 != null
        ? viewerOptions.clipSlider1
        : this.gridSize / 2;
    this.clipSlider2 =
      viewerOptions.clipSlider2 != null
        ? viewerOptions.clipSlider2
        : this.gridSize / 2;

    this.setClipSlider(0, this.clipSlider0, true);
    this.setClipSlider(1, this.clipSlider1, true);
    this.setClipSlider(2, this.clipSlider2, true);

    this.setClipIntersection(viewerOptions.clipIntersection, true);
    this.setClipObjectColorCaps(viewerOptions.clipObjectColors, true);
    this.setClipPlaneHelpersCheck(viewerOptions.clipPlaneHelpers, true);

    //this.scene.add(this.clipping.planeHelpers);
    //this.nestedGroup.setClipPlanes(this.clipping.clipPlanes);

    this.setLocalClipping(true); // only allow clipping when Clipping tab is selected

    //this.clipping.setVisible(false);

    // this.display.metalnessSlider.setValue(this.metalness * 100);
    // this.display.roughnessSlider.setValue(this.roughness * 100);
    // this.display.ambientlightSlider.setValue(this.ambientIntensity * 100);
    // this.display.directionallightSlider.setValue(this.directIntensity * 100);

    const theme =
      this.theme === "dark" ||
      (this.theme === "browser" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
        ? "dark"
        : "light";


    //
    // this.orientationMarker = new OrientationMarker(
    //   80,
    //   80,
    //   this.camera.getCamera(),
    //   theme,
    // );
    // this.orientationMarker.create();


    this.display.updateUI(
      this.axes,
      this.axes0,
      this.ortho,
      this.transparent,
      this.blackEdges,
      this.tools,
      this.glass,
    );
    this.display.autoCollapse();

    // ensure all for all deselected objects the stencil planes are invisible
    this.setObjects(this.states, true, true);

    this.toggleAnimationLoop(this.hasAnimationLoop);

    this.display.showMeasureTools(viewerOptions.measureTools);

    this.ready = true;
    if (this.notifyCallback) {
      this.notifyCallback({
        tab: { old: null, new: this.display.activeTab },
        target: { old: null, new: this.controls.target },
        target0: { old: null, new: this.controls.target0 },
        clip_normal_0: { old: null, new: this.clipNormal0 },
        clip_normal_1: { old: null, new: this.clipNormal1 },
        clip_normal_2: { old: null, new: this.clipNormal2 },
      });
    }

      this.css2DRenderer =  new CSS2DRenderer();
      this.css2DRenderer.setSize(this.cadWidth, this.height);
      this.css2DRenderer.render(this.scene, this.camera.getCamera())
      this.css2DRenderer.domElement.style.position = 'absolute';
      this.css2DRenderer.domElement.style.top = 0;
      this.css2DRenderer.domElement.style.pointerEvents = 'none'; // 取消标签的点击事件
      this.container.appendChild(this.css2DRenderer.domElement);

      this.renderer.domElement.addEventListener('click', function (event) {

          that.rayChoosePoint(event)
          // if (testBool.value) {
          //     clickNum += 1;
          //     if (clickNum == 1) {
          //         p1 = rayChoosePoint(event, model, camera)
          //         console.log('p1', p1);
          //     } else {
          //         clickNum = 0;
          //         p2 = rayChoosePoint(event, model, camera)
          //         if (p1 && p2) {
          //             L = length(p1, p2).toFixed(2)
          //             console.log('L', L);
          //             sizeTag(p1, p2, L, camera);//尺寸标注 箭头线段、尺寸数值
          //         }
          //         p1 = null;
          //         p2 = null;
          //     }
          // }
      })


      this.animate();
    this.update(true, false);

  }

  // - - - - - - - - - - - - - - - - - - - - - - - -
  // Event handlers
  // - - - - - - - - - - - - - - - - - - - - - - - -

  /**
   * Move the camera to a given locations
   * @function
   * @param {relative} [relative=false] - flag whether the position is a relative (e.g. [1,1,1] for iso) or absolute point.
   * @param {number[]} position - the camera position as 3 dim array [x,y,z]
   * @param {number[]} [quaternion=null] - the camera rotation expressed by a quaternion array [x,y,z,w].
   * @param {number} [zoom=null] - zoom value.
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setCamera = (
    relative,
    position,
    quaternion = null,
    zoom = null,
    notify = true,
  ) => {
    this.camera.setupCamera(
      relative,
      new THREE.Vector3(...position),
      quaternion != null ? new THREE.Quaternion(...quaternion) : null,
      zoom,
      notify,
    );
    this.update(true, notify);
  };

  /**
   * Move the camera to one of the preset locations
   * @function
   * @param {string} dir - can be "iso", "top", "bottom", "front", "rear", "left", "right"
   * @param {number} [zoom=null] - zoom value
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  presetCamera = (dir, zoom = null, notify = true) => {
    this.camera.target = new THREE.Vector3(...this.bbox.center());
    this.camera.presetCamera(dir, zoom, notify);
    this.controls.setTarget(this.camera.target);
    this.update(true, notify);
  };

  /**
   * Get camera type.
   * @returns {string} "ortho" or "perspective".
   **/
  getCameraType() {
    return this.camera.ortho ? "ortho" : "perspective";
  }

  /**
   * Set camera mode to OrthographicCamera or PersepctiveCamera (see also setOrtho)
   * @param {boolean} flag - whether the camery should be orthographic or persepctive
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  switchCamera(flag, notify = true) {
    this.ortho = flag;
    this.camera.switchCamera(flag, notify);
    this.controls.setCamera(this.camera.getCamera());
    this.display.setOrthoCheck(flag);

    this.checkChanges({ ortho: flag }, notify);
    this.update(true, notify);
  }

  /**
   * TODO: Doesn't work as expected. Needs to be fixed.
   *
   * Set camera mode to OrthographicCamera or PersepctiveCamera (see also setOrtho)
   * @param {number} distance - if provided, new camera distance
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  recenterCamera(notify = true) {
    const camera = this.camera.getCamera();

    const center = new THREE.Vector3();
    const c = this.bbox.center();
    center.fromArray(c);

    const target = new THREE.Vector3();
    const t = this.controls.target;
    target.fromArray(t);

    this.camera.camera_distance = 5 * this.bb_radius;
    camera.position.sub(target).add(center);
    this.controls.controls.target = center;

    let cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);

    let p = center
      .clone()
      .add(cameraDir.normalize().multiplyScalar(-this.camera.camera_distance));
    camera.position.set(p.x, p.y, p.z);

    this.update(true, notify);
  }

  /**
   * Reset zoom to the initiale value
   * @function
   */
  resize = () => {
    this.camera.setZoom(this.controls.getZoom0());
    this.camera.updateProjectionMatrix();
    this.update(true);
  };

  /**
   * Reset the view to the initial camera and controls settings
   * @function
   */
  reset = () => {
    if (this.outlinePass){
        this.outlinePass.selectedObjects =[]
    }
    this.controls.reset();
    this.update(true);
  };

  /**
   * Enbable/disable local clipping
   * @param {boolean} flag - whether to enable local clipping
   */
  setLocalClipping(flag) {
    this.renderer.localClippingEnabled = flag;
    this.update(this.updateMarker);
  }

  /**
   * Set the rendered shape visibility state according to the states map
   * @function
   * @param {States} states
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setObjects = (states, force = false, notify = true) => {
    for (var key in this.states) {
      var oldState = this.states[key];
      var newState = states[key];
      var objectGroup = this.nestedGroup.groups[key];
      if (force || oldState[0] != newState[0]) {
        objectGroup.setShapeVisible(newState[0] === 1);
        this.states[key][0] = newState[0];
      }
      if (oldState[1] != newState[1]) {
        objectGroup.setEdgesVisible(newState[1] === 1);
        this.states[key][1] = newState[1];
      }
    }

    this.checkChanges({ states: states }, notify);

    this.update(this.updateMarker);
  };

  setBoundingBox = (id) => {
    const group = this.nestedGroup.groups[id];

    if (group != null) {
      if (this.lastBbox != null) {
        this.scene.remove(this.lastBbox.bbox);
      }
      if (
        this.lastBbox == null ||
        (this.lastBbox != null && id != this.lastBbox.id)
      ) {
        this.lastBbox = {
          id: id,
          bbox: new BoxHelper(group, 0xff00ff),
          needsUpdate: false,
        };
        this.scene.add(this.lastBbox.bbox);
      } else {
        this.lastBbox = null;
      }
      this.update(false, false, false);
    }
  };

  /**
   * Refresh clipping plane
   * @function
   * @param {number} index - index of the plane: 0,1,2
   * @param {number} value - distance on the clipping normal from the center
   */
  refreshPlane = (index, value) => {
    this.clipping.setConstant(index, value);
    this.update(this.updateMarker);
  };

  /**
   * Backup animation (for switch to explode animation)
   */
  backupAnimation() {
    if (this.animation.hasTracks()) {
      this.backupTracks = this.animation.backup();
    }
  }

  /**
   * Restore animation (for switch back from explode animation)
   */
  restoreAnimation() {
    if (this.animation.hasBackup()) {
      var params = this.animation.restore();
      this.initAnimation(params.duration, params.speed, "A", params.repeat);
    }
  }

  /**
   * Handler for the animation control
   * @function
   * @param {string} btn - the pressed button as string: "play", "pause", "stop"
   */
  controlAnimation = (btn) => {
    switch (btn) {
      case "play":
        if (this.clipAction.paused) {
          this.clipAction.paused = false;
        }
        this.clipAction.play();
        break;
      case "pause":
        this.clipAction.paused = !this.clipAction.paused;
        break;
      case "stop":
        this.clipAction.stop();
        break;
    }
  };

  /**
   * Set state of one entry of a treeview leaf given by an id
   * @function
   * @param {string} id - object id
   * @param {number[]} state - 2 dim array [mesh, edges] = [0/1, 0/1]
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setState = (id, state, nodeType = "leaf", notify = true) => {
    [0, 1].forEach((i) =>
      this.treeview.handleStateChange(nodeType, id, i, state[i]),
    );
    this.update(this.updateMarker, notify);
  };

  removeLastBbox() {
    if (this.lastBbox != null) {
      this.scene.remove(this.lastBbox.bbox);
      this.lastBbox = null;
      this.treeview.removeLabelHighlight();
    }
  }

  /**
   * Handle bounding box and notifications for picked elements
   * @function
   * @param {string} - path of object
   * @param {string} - name of object (id = path/name)
   * @param {boolean} - meta key pressed
   * @param {boolean} shift - whether to send notification or not.
   */
  handlePick = (
    path,
    name,
    meta,
    shift,
    nodeType = "leaf",
    highlight = true,
  ) => {
    const id = `${path}/${name}`;
    const object = this.nestedGroup.groups[id];
    let  boundingBox = new BoundingBox().setFromObject(model, true);
    if (isNaN(boundingBox.min.x)) {
        boundingBox = new BoundingBox(new THREE.Vector3( -100, -100, -100 ),new THREE.Vector3( 100, 100, 100 ))
    }

    if (this.lastBbox != null && this.lastBbox.id === id && !meta && !shift) {
      this.removeLastBbox();
    } else {
      if (highlight) {
        this.treeview.selectNode(id);
      }

      this.checkChanges({
        lastPick: {
          path: path,
          name: name,
          boundingBox: boundingBox,
          boundingSphere: boundingBox.boundingSphere(),
        },
      });

      if (this.animation.clipAction?.isRunning()) {
        this.bboxNeedsUpdate = true;
      }

      if (meta) {
        this.setState(id, [0, 0], nodeType);
      } else if (shift) {
        this.removeLastBbox();
        this.treeview.hideAll();
        this.setState(id, [1, 1], nodeType);
        const center = boundingBox.center();
        this.controls.setTarget(new THREE.Vector3(...center));
        this.info.centerInfo(center);
      } else {
        this.info.bbInfo(path, name, boundingBox);
        this.setBoundingBox(id);
      }
    }
    this.update(true);
  };

  setPickHandler(flag) {
    if (flag) {
      this.renderer.domElement.addEventListener("dblclick", this.pick, false);
    } else {
      this.renderer.domElement.removeEventListener(
        "dblclick",
        this.pick,
        false,
      );
    }
  }

  /**
   * Find the shape that was double clicked and send notification
   * @function
   * @param {MouseEvent} e - a DOM MouseEvent
   */
  pick = (e) => {
    const raycaster = new Raycaster(
      this.camera,
      this.renderer.domElement,
      this.cadWidth,
      this.height,
      this.bb_max / 30,
      this.scene.children.slice(0, 1),
      // eslint-disable-next-line no-unused-vars
      (ev) => {},
    );
    raycaster.init();
    raycaster.onPointerMove(e);

    const validObjs = raycaster.getIntersectedObjs(e);
    if (validObjs.length == 0) {
      return;
    }
    var nearestObj = validObjs[0]; // The first is the nearest since they are sorted by dist.
    const nearest = {
      path: nearestObj.object.parent.parent.name.replaceAll("|", "/"),
      name: nearestObj.object.name,
      boundingBox: nearestObj.object.geometry.boundingBox,
      boundingSphere: nearestObj.object.geometry.boundingSphere,
      objectGroup: nearestObj.object.parent,
    };
    if (nearest != null) {
      this.handlePick(
        nearest.path,
        nearest.name,
        KeyMapper.get(e, "meta"),
        KeyMapper.get(e, "shift"),
      );
    }
    raycaster.dispose();
  };

  //
  // Handle CAD Tools
  //

  clearSelection = () => {
    this.nestedGroup.clearSelection();
   // this.cadTools.handleResetSelection();
  };

  _releaseLastSelected = (clear) => {
    if (this.lastObject != null) {
      let objs = this.lastObject.objs();
      for (let obj of objs) {
        obj.unhighlight(true);
      }

      if (clear) {
        this.lastObject = null;
      }
    }
  };

  _removeLastSelected = () => {
    if (this.lastSelection != null) {
      let objs = this.lastSelection.objs();
      for (let obj of objs) {
        obj.unhighlight(false);
      }
      this.lastSelection = null;

     // this.cadTools.handleRemoveLastSelection();
    }
  };

  /**
   * Set raycast mode
   * @function
   * @param {boolean} flag - turn raycast mode on or off
   */
  setRaycastMode(flag) {
    if (flag) {
      // initiate raycasting
      this.raycaster = new Raycaster(
        this.camera,
        this.renderer.domElement,
        this.cadWidth,
        this.height,
        this.bb_max / 30,
        this.scene.children.slice(0, 1),
        this.handleRaycastEvent,
      );
      this.raycaster.init();
    } else {
      this.raycaster.dispose();
      this.raycaster = null;
    }
  }

  handleRaycast = () => {
    const objects = this.raycaster.getValidIntersectedObjs();
    if (objects.length > 0) {
      for (var object of objects) {
        {
          const objectGroup = object.object.parent;
          if (objectGroup !== this.lastObject) {
            this._releaseLastSelected(false);
            const fromSolid = this.raycaster.filters.topoFilter.includes(
              TopoFilter.solid,
            );

            const pickedObj = new PickedObject(objectGroup, fromSolid);
            for (let obj of pickedObj.objs()) {
              obj.highlight(true);
            }
            this.lastObject = pickedObj;
          }
          break;
        }
      }
    } else {
      this._releaseLastSelected(true);
    }
  };

  handleRaycastEvent = (event) => {
    if (event.key) {
      switch (event.key) {
        case "Escape":
          this.clearSelection();
          break;
        case "Backspace":
          this._removeLastSelected();
          break;
        default:
          break;
      }
    } else {
      switch (event.mouse) {
        case "left":
          if (this.lastObject != null) {
            const objs = this.lastObject.objs();
            for (let obj of objs) {
              obj.toggleSelection();
            }
           // this.cadTools.handleSelectedObj(this.lastObject);
            this.lastSelection = this.lastObject;
          }
          break;
        case "right":
          this._removeLastSelected();
          break;
        default:
          break;
      }
    }
  };

  /**
   * Handle a backend response sent by the backend
   * The response is a JSON object sent by the Python backend through VSCode
   * @param {object} response
   */
  handleBackendResponse = (response) => {
    if (response.subtype === "tool_response") {
    //  this.cadTools.handleResponse(response);
    }
  };

  //
  // Getters and Setters
  //

  /**
   * Get whether axes helpers are shon/hidden.
   * @returns {boolean} axes value.
   **/
  getAxes() {
    return this.axes;
  }

  /**
   * Show/hide axes helper
   * @function
   * @param {boolean} flag - whether to show the axes
   * @param {boolean} notify - whether to send notification or not.
   */
  setAxes = (flag, notify = true) => {
    this.axes = flag;
    this.axesHelper.setVisible(flag);
    this.display.setAxesCheck(flag);

    this.checkChanges({ axes: flag }, notify);

    this.update(this.updateMarker);
  };

  /**
   * Show/hide grids
   * @function
   * @param {string} action -  one of "grid" (all grids), "grid-xy","grid-xz", "grid-yz"
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setGrid = (action, flag, notify = true) => {
    this.gridHelper.setGrid(action, flag);
    this.checkChanges({ grid: this.gridHelper.grid }, notify);

    this.update(this.updateMarker);
  };

  /**
   * Get visibility of grids.
   * @returns {number[]} grids value.
   **/
  getGrids() {
    return this.grid;
  }

  /**
   * Toggle grid visibility
   * @function
   * @param {boolean[]} grids - 3 dim grid visibility (xy, xz, yz)
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setGrids = (grids, notify = true) => {
    this.gridHelper.setGrids(...grids);
    this.grid = this.gridHelper.grid;

    this.checkChanges({ grid: this.gridHelper.grid }, notify);

    this.update(this.updateMarker);
  };

  /**
   * Get location of axes.
   * @returns {boolean} axes0 value, true means at origin (0,0,0)
   **/
  getAxes0() {
    return this.axes0;
  }

  /**
   * Set whether grids and axes center at the origin or the object's boundary box center
   * @function
   * @param {boolean} flag - whether grids and axes center at the origin (0,0,0)
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setAxes0 = (flag, notify = true) => {
    this.axes0 = flag;
    this.gridHelper.setCenter(flag, this.up == "Z");
    this.display.setAxes0Check(flag);
    this.axesHelper.setCenter(flag);

    this.checkChanges({ axes0: flag }, notify);

    this.update(this.updateMarker);
  };

  getMetalness = () => {
    return this.metalness;
  };

  setMetalness = (value, notify = true) => {
    this.metalness = value;
    this.nestedGroup.setMetalness(value);
    this.checkChanges({ metalness: value }, notify);
    this.update(this.updateMarker);
  };
  getRoughness = () => {
    return this.roughness;
  };

  setRoughness = (value, notify = true) => {
    this.roughness = value;
    this.nestedGroup.setRoughness(value);
    this.checkChanges({ roughness: value }, notify);
    this.update(this.updateMarker);
  };

  resetMaterial = () => {
    this.setMetalness(this.materialSettings.metalness, true);
    this.display.setMetalness(this.materialSettings.metalness);

    this.setRoughness(this.materialSettings.roughness, true);
    this.display.setRoughness(this.materialSettings.roughness);

    this.setAmbientLight(this.materialSettings.ambientIntensity, true);
    this.display.setAmbientLight(this.materialSettings.ambientIntensity);

    this.setDirectLight(this.materialSettings.directIntensity, true);
    this.display.setDirectLight(this.materialSettings.directIntensity);
  };

  /**
   * Get transparency state of CAD objects.
   * @returns {boolean} transparent value.
   **/
  getTransparent() {
    return this.transparent;
  }

  /**
   * Set CAD objects transparency
   * @function
   * @param {boolean} flag - whether to show the CAD object in transparent mode
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setTransparent = (flag, notify = true) => {
    debugger
    this.transparent = flag;
    // this.nestedGroup.setTransparent(flag);
    this.display.setTransparentCheck(flag);
    store.setMeshTabShow(flag?1:2);
  };

  /**
   * Get blackEdges value.
   * @returns {boolean} blackEdges value.
   **/
  getBlackEdges() {
    return this.blackEdges;
  }

  /**
   * Show edges in black or the default edge color
   * @function
   * @param {boolean} flag - whether to show edges in black
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setBlackEdges = (flag, notify = true) => {
    this.blackEdges = flag;
    this.nestedGroup.setBlackEdges(flag);
    this.display.setBlackEdgesCheck(flag);

    this.checkChanges({ black_edges: flag }, notify);

    this.update(this.updateMarker);
  };

  /**
   * Get ortho value.
   * @returns {number} ortho value.
   **/
  getOrtho() {
    return this.camera.ortho;
  }

  /**
   * Set/unset camera's orthographic mode.
   * @param {boolean} whether to set orthographic mode or not.
   **/
  setOrtho(flag, notify = true) {
    this.switchCamera(flag, notify);
  }

  /**
   * Get zoom value.
   * @returns {number} zoom value.
   **/
  getCameraZoom() {
    return this.camera.getZoom();
  }

  /**
   * Set zoom value.
   * @param {number} val - float zoom value.
   * @param {boolean} [notify=true] - whether to send notification or not.
   **/
  setCameraZoom(val, notify = true) {
    this.camera.setZoom(val);
    this.controls.update();
    this.update(true, notify);
  }

  /**
   * Get the current camera position.
   * @returns {number[]} camera position as 3 dim array [x,y,z].
   **/
  getCameraPosition() {
    return this.camera.getPosition().toArray();
  }

  /**
   * Set camera position.
   * @param {number[]} position - camera position as 3 dim Array [x,y,z].
   * @param {relative} [relative=false] - flag whether the position is a relative (e.g. [1,1,1] for iso) or absolute point.
   * @param {boolean} [notify=true] - whether to send notification or not.
   **/
  setCameraPosition(position, relative = false, notify = true) {
    this.camera.setPosition(position, relative);
    this.controls.update();
    this.update(true, notify);
  }

  /**
   * Get the current camera rotation as quaternion.
   * @returns {number[]} camera rotation as 4 dim quaternion array [x,y,z,w].
   **/
  getCameraQuaternion() {
    return this.camera.getQuaternion().toArray();
  }

  /**
   * Set camera rotation via quaternion.
   * @param {number[]} quaternion - camera rotation as 4 dim quaternion array [x,y,z,w].
   * @param {boolean} [notify=true] - whether to send notification or not.
   **/
  setCameraQuaternion(quaternion, notify = true) {
    this.camera.setQuaternion(quaternion);
    this.controls.update();
    this.update(true, notify);
  }

  /**
   * Get the current camera target.
   * @returns {number[]} camera target as 3 dim array array [x,y,z].
   **/
  getCameraTarget() {
    return this.controls.getTarget().toArray();
  }

  /**
   * Set camera target.
   * @param {number[]} target - camera target as 3 dim quaternion array [x,y,z].
   * @param {boolean} [notify=true] - whether to send notification or not.
   **/
  setCameraTarget(target, notify = true) {
    this.camera.getCamera().lookAt(new THREE.Vector3(...target));
    this.controls.setTarget(new THREE.Vector3(...target));
    this.controls.update();
    this.update(true, notify);
  }

  getCameraLocationSettings() {
    return {
      position: this.getCameraPosition(),
      quaternion: this.getCameraQuaternion(),
      target: this.getCameraTarget(),
      zoom: this.getCameraZoom(),
    };
  }

  setCameraLocationSettings(
    position = null,
    quaternion = null,
    target = null,
    zoom = null,
    notify = true,
  ) {
    if (position != null) {
      this.camera.setPosition(position, false);
    }
    if (quaternion != null && this.control === "trackball") {
      this.camera.setQuaternion(quaternion);
    }
    if (target != null) {
      this.controls.setTarget(new THREE.Vector3(...target));
    }
    if (zoom != null) {
      this.camera.setZoom(zoom);
    }
    this.controls.update();
    this.update(true, notify);
  }

  /**
   * Get default color of the edges.
   * @returns {number} edgeColor value.
   **/
  getEdgeColor() {
    return this.edgeColor;
  }

  /**
   * Set the default edge color
   * @function
   * @param {number} edge color (0xrrggbb)
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setEdgeColor = (color, notify = true) => {
    this.edgeColor = color;
    this.nestedGroup.setEdgeColor(color);
    this.update(this.updateMarker, notify);
  };

  /**
   * Get default opacity.
   * @returns {number} opacity value.
   **/
  getOpacity() {
    return this.defaultOpacity;
  }

  /**
   * Set the default opacity
   * @function
   * @param {number} opacity (between 0.0 and 1.0)
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setOpacity = (opacity, notify = true) => {
    this.defaultOpacity = opacity;
    this.nestedGroup.setOpacity(opacity);
    this.update(this.updateMarker, notify);
  };

  /**
   * Get whether tools are shown/hidden.
   * @returns {boolean} tools value.
   **/
  getTools() {
    return this.tools;
  }

  /**
   * Show/hide the CAD tools
   * @function
   * @param {boolean} flag
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  showTools = (flag, notify = true) => {
    this.tools = flag;
    //this.display.showTools(flag);
    this.update(this.updateMarker, notify);
  };

  /**
   * Get intensity of ambient light.
   * @returns {number} ambientLight value.
   **/
  getAmbientLight() {
    return this.ambientIntensity;
  }

  /**
   * Set the intensity of ambient light
   * @function
   * @param {States} states
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setAmbientLight = (val, notify = true) => {
    this.ambientIntensity = val;
    this.ambientLight.intensity = scaleLight(val);
    this.checkChanges({ ambient_intensity: val }, notify);
    this.update(this.updateMarker, notify);
  };

  /**
   * Get intensity of direct light.
   * @returns {number} directLight value.
   **/
  getDirectLight() {
    return this.directIntensity;
  }
  /**
   * Set the intensity of directional light
   * @function
   * @param {States} states
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setDirectLight = (val, notify = true) => {
    this.directIntensity = val;
    this.directLight.intensity = scaleLight(val);
    this.checkChanges({ direct_intensity: val }, notify);
    this.update(this.updateMarker, notify);
  };

  /**
   * Get states of a treeview leafs.
   * @returns {States} states value.
   **/
  getStates() {
    return this.states;
  }

  /**
   * Get state of a treeview leafs for a path.
   * separator can be / or |
   * @param {string} path - path of the object
   * @returns {number[]} state value in the form of [mesh, edges] = [0/1, 0/1]
   **/
  getState(path) {
    var p = path.replaceAll("|", "/");
    return this.getStates()[p];
  }

  /**
   * Set states of a treeview leafs
   * @function
   * @param {States} - states
   */
  setStates = (states, notify = true) => {
    for (var id in states) {
      if (
        states[id][0] != this.states[id][0] ||
        states[id][1] != this.states[id][1]
      ) {
        this.setState(id, states[id], "leaf", notify);
      }
    }
  };

  /**
   * Get zoom speed.
   * @returns {number} zoomSpeed value.
   **/
  getZoomSpeed() {
    return this.zoomSpeed;
  }

  /**
   * Set zoom speed.
   * @function
   * @param {number} val - the new zoom speed
   * @param {boolean} notify - whether to send notification or not.
   */
  setZoomSpeed = (val, notify = true) => {
    this.zoomSpeed = val;
    this.controls.setZoomSpeed(val);
    this.checkChanges({ grid: this.gridHelper.grid }, notify);
  };

  /**
   * Get panning speed.
   * @returns {number} pan speed value.
   **/
  getPanSpeed() {
    return this.panSpeed;
  }

  /**
   * Set pan speed.
   * @function
   * @param {number} val - the new pan speed
   * @param {boolean} notify - whether to send notification or not.
   */
  setPanSpeed = (val, notify = true) => {
    this.panSpeed = val;
    this.controls.setPanSpeed(val);
    this.checkChanges({ grid: this.gridHelper.grid }, notify);
  };

  /**
   * Get rotation speed.
   * @returns {number} rotation speed value.
   **/
  getRotateSpeed() {
    return this.rotateSpeed;
  }

  /**
   * Set rotation speed.
   * @function
   * @param {number} val - the new rotation speed.
   * @param {boolean} notify - whether to send notification or not.
   */
  setRotateSpeed = (val, notify = true) => {
    this.rotateSpeed = val;
    this.controls.setRotateSpeed(val);
    this.checkChanges({ grid: this.gridHelper.grid }, notify);
  };

  /**
   * Get intersection mode.
   * @returns {boolean} clip intersection value.
   **/
  getClipIntersection() {
    return this.clipIntersection;
  }

  /**
   * Set the clipping mode to intersection mode
   * @function
   * @param {boolean} flag - whether to use intersection mode
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setClipIntersection = (flag, notify = true) => {
    if (flag == null) return;

    this.clipIntersection = flag;
    this.nestedGroup.setClipIntersection(flag);
    this.display.setClipIntersectionCheck(flag);

    for (var child of this.nestedGroup.rootGroup.children) {
      if (child.name == "PlaneMeshes") {
        for (var capPlane of child.children) {
          if (flag) {
            capPlane.material.clippingPlanes =
              this.clipping.reverseClipPlanes.filter(
                (_, j) => j !== capPlane.index,
              );
          } else {
            capPlane.material.clippingPlanes = this.clipping.clipPlanes.filter(
              (_, j) => j !== capPlane.index,
            );
          }
        }
      }
    }

    for (child of this.scene.children) {
      if (child.name == "PlaneHelpers") {
        for (var helper of child.children) {
          if (flag) {
            helper.material.clippingPlanes =
              this.clipping.reverseClipPlanes.filter(
                (_, j) => j !== helper.index,
              );
          } else {
            helper.material.clippingPlanes = this.clipping.clipPlanes.filter(
              (_, j) => j !== helper.index,
            );
          }
        }
      }
    }

    this.checkChanges({ clip_intersection: flag }, notify);

    this.update(this.updateMarker);
  };

  /**
   * Get whether the clipping caps color status
   * @returns {boolean} color caps value (object color (true) or RGB (false)).
   */
  getObjectColorCaps = () => {
    return this.clipping.getObjectColorCaps();
  };

  /**
   * Toggle the clipping caps color between object color and RGB
   * @function
   * @param {boolean} flag - whether to use intersection mode
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setClipObjectColorCaps = (flag, notify = true) => {
    if (flag == null) return;
    this.clipping.setObjectColorCaps(flag);
    this.display.setClipObjectColorsCheck(flag);
    this.checkChanges({ clip_object_colors: flag }, notify);
    this.update(this.updateMarker);
  };

  /**
   * Get clipping plane state.
   * @returns {boolean} clip plane visibility value.
   **/
  getClipPlaneHelpers() {
    return this.clipPlaneHelpers;
  }

  /**
   * Set clip plane helpers check box
   * @function
   * @param {boolean} flag - whether to show clip plane helpers
   */
  setClipPlaneHelpersCheck(flag) {
    if (flag == null) return;

    this.display.setClipPlaneHelpersCheck(flag);
  }

  /**
   * Show/hide clip plane helpers
   * @function
   * @param {boolean} flag - whether to show clip plane helpers
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setClipPlaneHelpers = (flag, notify = true) => {
    if (flag == null) return;

    this.clipPlaneHelpers = flag;
    this.clipping.planeHelpers.visible = flag;
    this.display.setClipPlaneHelpersCheck(flag);

    this.checkChanges({ clip_planes: flag }, notify);

    this.update(this.updateMarker);
  };

  /**
   * Get clipping plane state.
   * @param {boolean} index - index of the normal: 0, 1 ,2
   * @returns {boolean} clip plane visibility value.
   **/
  getClipNormal(index) {
    return this.clipNormals[index];
  }

  /**
   * Set the normal at index to a given normal
   * @function
   * @param {number} index - index of the normal: 0, 1 ,2
   * @param {number[]} normal - 3 dim array representing the normal
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setClipNormal(index, normal, notify = true) {
    if (normal == null) return;
    const normal1 = new THREE.Vector3(...normal).normalize().toArray();
    this.clipNormals[index] = normal1;

    this.clipping.setNormal(index, new THREE.Vector3(...normal1));
    this.clipping.setConstant(index, this.gridSize / 2);
    this.setClipSlider(index, this.gridSize / 2);
    var notifyObject = {};
    notifyObject[`clip_normal_${index}`] = normal1;

    this.checkChanges(notifyObject, notify);

    this.nestedGroup.setClipPlanes(this.clipping.clipPlanes);

    this.update(this.updateMarker);
  }

  /**
   * Set the normal at index to the current viewing direction
   * @function
   * @param {number} index - index of the normal: 0, 1 ,2
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setClipNormalFromPosition = (index, notify = true) => {
    const cameraPosition = this.camera.getPosition().clone();
    const normal = cameraPosition
      .sub(this.controls.getTarget())
      .normalize()
      .negate()
      .toArray();
    this.setClipNormal(index, normal, notify);
  };

  /**
   * Get clipping slider value.
   * @function
   * @param {number} index - index of the normal: 0, 1 ,2
   * @returns {boolean} clip plane visibility value.
   **/
  getClipSlider = (index) => {
    return this.display.clipSliders[index].getValue();
  };

  /**
   * Set clipping slider value.
   * @function
   * @param {number} index - index of the normal: 0, 1 ,2
   * @param {number} value - value for the clipping slide. will be trimmed to slide min/max limits
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setClipSlider = (index, value, notify = true) => {
    if (value == -1 || value == null) return;

 //   this.display.clipSliders[index].setValue(value, notify);
  };

  /**
   * Get reset location value.
   * @function
   * @returns {object} - target, position, quaternion, zoom as object.
   */
  getResetLocation = () => {
    const location = this.controls.getResetLocation();
    return {
      target0: location.target0.toArray(),
      position0: location.position0.toArray(),
      quaternion0: location.quaternion0.toArray(),
      zoom0: location.zoom0,
    };
  };

  /**
   * Set reset location value.
   * @function
   * @param {number[]} target - camera target as 3 dim Array [x,y,z].
   * @param {number[]} position - camera position as 3 dim Array [x,y,z].
   * @param {number[]} quaternion - camera rotation as 4 dim quaternion array [x,y,z,w].
   * @param {number} zoom - camera zoom value.
   * @param {boolean} [notify=true] - whether to send notification or not.
   */
  setResetLocation = (target, position, quaternion, zoom, notify = true) => {
    var location = this.getResetLocation();
    this.controls.setResetLocation(
      new THREE.Vector3(...target),
      new THREE.Vector3(...position),
      new THREE.Vector4(...quaternion),
      zoom,
    );
    if (notify && this.notifyCallback) {
      this.notifyCallback({
        target0: { old: location.target0, new: target },
        position0: { old: location.position0, new: position },
        quaternion0: { old: location.quaternion0, new: quaternion },
        zoom0: { old: location.zoom0, new: zoom },
      });
    }
  };

  /**
   * Replace CadView with an inline png image of the canvas.
   *
   * Note: Only the canvas will be shown, no tools and orientation marker
   */
  pinAsPng = () => {
    const screenshot = this.getImage("screenshot");
    screenshot.then((data) => {
      var image = document.createElement("img");
      image.width = this.cadWidth;
      image.height = this.height;
      image.src = data.dataUrl;
      if (this.pinAsPngCallback == null) {
        // default, replace the elements of the container with the image
        for (var c of this.container.children) {
          this.container.removeChild(c);
        }
        this.container.appendChild(image);
      }
    });
  };

  /**
   * Get the current canvas as png data.
   * @function
   * @param {string} taksId - and id to identify the screenshot
   * Note: Only the canvas will be shown, no tools and orientation marker
   */
  getImage = (taskId) => {
    // canvas.toBlob can be very slow when anmation loop is off!
    const animationLoop = this.hasAnimationLoop;
    if (!animationLoop) {
      this.toggleAnimationLoop(true);
    }
    let result = new Promise((resolve, reject) => {
      const canvas = this.display.getCanvas();
      this.renderer.setViewport(0, 0, this.cadWidth, this.height);
      this.renderer.render(this.scene, this.camera.getCamera());
      canvas.toBlob((blob) => {
        let reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            resolve({ task: taskId, dataUrl: reader.result });
            // set animation loop back to the stored value
            if (!animationLoop) {
              this.toggleAnimationLoop(false);
            }
          },
          false,
        );
        reader.readAsDataURL(blob);
      });
    });

    return result;
  };

  /**
   * Calculate explode trajectories and initiate the animation
   *
   * @param {number} [duration=2] - duration of animation.
   * @param {number} [speed=1] - speed of animation.
   * @param {number} [multiplier=2.5] - multiplier for length of trajectories.
   */
  explode(duration = 2, speed = 1, multiplier = 2.5) {
    this.clearAnimation();

    const use_origin = this.getAxes0();

    var worldCenterOrOrigin = new THREE.Vector3();
    var worldObjectCenter = new THREE.Vector3();

    var worldDirection = null;
    var localDirection = null;
    var scaledLocalDirection = null;

    if (!use_origin) {
      var bb = new THREE.Box3().setFromObject(this.nestedGroup.rootGroup);
      bb.getCenter(worldCenterOrOrigin);
    }
    for (var id in this.nestedGroup.groups) {
      // Loop over all Group elements
      var group = this.nestedGroup.groups[id];

      var b = new THREE.Box3();
      if (group instanceof ObjectGroup) {
        b.expandByObject(group);
      }
      if (b.isEmpty()) {
        continue;
      }
      b.getCenter(worldObjectCenter);
      // Explode around global center or origin
      worldDirection = worldObjectCenter.sub(worldCenterOrOrigin);
      localDirection = group.parent.worldToLocal(worldDirection.clone());

      // Use the parent to calculate the local directions
      scaledLocalDirection = group.parent.worldToLocal(
        worldDirection.clone().multiplyScalar(multiplier),
      );
      // and ensure to shift objects at its center and not at its position
      scaledLocalDirection.sub(localDirection);

      // build an animation track for the group with this direction
      this.addAnimationTrack(
        id,
        "t",
        [0, duration],
        [[0, 0, 0], scaledLocalDirection.toArray()],
      );
    }
    this.initAnimation(duration, speed, "E", false);
  }

  /**
   * Calculate explode trajectories and initiate the animation
   *
   * @param {string[]} tags - e.g. ["axes", "axes0", "grid", "ortho", "more", "help"]
   * @param {boolean} flag - whether to turn on or off the UI elements.
   */
  trimUI(tags, flag) {
    var display = flag ? "inline-block" : "none";
    for (var tag of tags) {
      var el;
      if (["axes", "axes0", "grid", "ortho", "more", "help"].includes(tag)) {
        if (tag != "more") {
          el = this.display._getElement(`tcv_${tag}`);
          el.style.display = display;
          if (tag !== "help") {
            el.nextElementSibling.style.display = display;
          }
        } else {
          el = this.display._getElement(`tcv_${tag}-dropdown`);
          el.style.display = display;
        }
      }
    }
  }

  /**
   * Set modifiers for keymap
   *
   * @param {config} keymap - e.g. {"shift": "shiftKey", "ctrl": "ctrlKey", "meta": "altKey"}
   */
  setKeyMap(config) {
    const before = KeyMapper.get_config();
    KeyMapper.set(config);
    this.display.updateHelp(before, config);
  }

  /**
   * Resize UI and renderer
   *
   * @param {number} cadWidth - new width of CAD View
   * @param {number} treeWidth - new width of navigation tree
   * @param {number} height - new height of CAD View
   * @param {boolean} [glass=false] - Whether to use glass mode or not
   */
  resizeCadView(cadWidth, treeWidth, height, glass = false) {
    debugger
    this.cadWidth = cadWidth;
    this.height = height;

    // Adapt renderer dimensions
    this.renderer.setSize(cadWidth, height);

    // Adapt display dimensions
    this.display.setSizes({
      treeWidth: treeWidth,
      cadWidth: cadWidth,
      height: height,
    });
    this.display.glassMode(glass);

    // Adapt camers to new dimensions
    this.camera.changeDimensions(this.bb_radius, cadWidth, height);


      // if (this.effectComposer) {
      //     // 假设抗锯齿效果是EffectComposer中的第一个pass
      //     this.effectComposer.setSize(cadWidth, height)
      // }


    // update the this
    //this.update(false,true);
    //this.update(false,true);

    // update the raycaster
    // if (this.raycaster) {
    //   this.raycaster.width = cadWidth;
    //   this.raycaster.height = height;
    // }
  }

  vector3(x = 0, y = 0, z = 0) {
    return new THREE.Vector3(x, y, z);
  }

  quaternion(x = 0, y = 0, z = 0, w = 1) {
    return new THREE.Quaternion(x, y, z, w);
  }

// 创建效果合成器
    createEffectComposer(mesh,model) {
        const meshs = [];
        meshs.push(mesh);
        if (!this.container) return false
        const { clientHeight, clientWidth } = this.container
        this.effectComposer = new EffectComposer(this.renderer, new THREE.WebGLRenderTarget(clientWidth, clientHeight))
        // this.effectComposer = new EffectComposer(this.renderer)
        const renderPass = new RenderPass(this.scene,this.camera.getCamera())

        this.effectComposer.addPass(renderPass)
        this.outlinePass = new OutlinePass(new THREE.Vector2(clientWidth, clientHeight), this.scene,   this.camera.getCamera())
        this.outlinePass.visibleEdgeColor = new THREE.Color('#FF8C00') // 可见边缘的颜色
        this.outlinePass.hiddenEdgeColor = new THREE.Color('#8a90f3') // 不可见边缘的颜色
        this.outlinePass.edgeGlow = 2 // 发光强度
        this.outlinePass.usePatternTexture = false // 是否使用纹理图案
        this.outlinePass.edgeThickness = 1 // 边缘浓度
        this.outlinePass.edgeStrength = 4 // 边缘的强度，值越高边框范围越大
        this.outlinePass.pulsePeriod = 200 // 闪烁频率，值越大频率越低
        this.outlinePass.selectedObjects =meshs
        this.effectComposer.addPass(this.outlinePass)
        let outputPass = new OutputPass()
        this.effectComposer.addPass(outputPass)

        let effectFXAA = new ShaderPass(FXAAShader)
        const pixelRatio = this.renderer.getPixelRatio()
        effectFXAA.uniforms.resolution.value.set(1 / (clientWidth * pixelRatio), 1 / (clientHeight * pixelRatio))
        effectFXAA.renderToScreen = true
        effectFXAA.needsSwap = true
        this.effectComposer.addPass(effectFXAA)
    }



    onChangeModelMeaterial(id,model) {
        this.effectComposer=null
        const mesh = this.scene.getObjectByProperty('uuid', id)
        this.createEffectComposer(mesh);

    }
    onCancelModelMaterial(){
        if (this.outlinePass) {
            this.outlinePass.selectedObjects=[]
        }
    }


    //划线
    createLine(p1, p2) {
        const material = new THREE.LineBasicMaterial({
            color: 0xffff00,
            depthTest: false,//不进行深度测试，后渲染，叠加在其它模型之上(解决两个问题)
            // 1.穿过模型，在内部看不到线条
            // 2.线条与mesh重合时候，深度冲突不清晰
        });
        const geometry = new THREE.BufferGeometry(); //创建一个几何体对象
        //类型数组创建顶点数据
        const vertices = new Float32Array([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z]);
        geometry.attributes.position = new THREE.BufferAttribute(vertices, 3);
        const line = new THREE.Line(geometry, material);
        return line
    }

    //画箭头
    createMesh(p,dir,camera) {
        const L = camera.position.clone().sub(p).length()
        const h  = L/40
        //尺寸你可以根据需要自由设置，比如距离相机距离，比如直接根据场景渲染范围给固定尺寸
        const geometry = new THREE.CylinderGeometry(0,L/400,h);
        geometry.translate(0,-h/2,0)
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ffff, //设置材质颜色
            depthTest: false,
        });
        const mesh = new THREE.Mesh(geometry, material);
        //通过四元数表示默认圆锥需要旋转的角度，才能和标注线段的方向一致
        const quaternion = new THREE.Quaternion();
        //参数dir表示线段方向，通过两点p1、p2计算即可，通过dir来控制圆锥朝向
        quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir)
        mesh.quaternion.multiply(quaternion)
        mesh.position.copy(p);
        mesh.name='mark'
        return mesh;
    }

    //计算两点之间的距离
    length(p1, p2) {
        return p1.clone().sub(p2).length()
    }


    //线段尺寸标注
    sizeTag(p1, p2) {
        const line = this.createLine(p1, p2);
        this.sizeTagGroup.add(line)

        const dir = p1.clone().sub(p2).normalize()
        this.sizeTagGroup.add(this.createMesh(p1, dir, this.camera.getCamera()))
        this.sizeTagGroup.add(this.createMesh(p2, dir.clone().negate(), this.camera.getCamera()))

        let  size = this.length(p1,p2).toFixed(2)

        // CSS2或CSS3渲染标注
        const div = document.createElement('div')
       this.container.appendChild(div)
        div.style.fontSize = "20px"
        div.style.marginTop = "-20px"
        div.style.color = "#FF8C00"
        // div.style.padding = "5px 10px"
        // div.style.background = "rgba(0,0,0,0.9)"
        div.textContent = size + 'mm';
        const tag = new CSS2DObject(div);
        const center = p1.clone().add(p2).divideScalar(2)
        tag.position.copy(center);
        this.sizeTagGroup.add(tag);

        return this.sizeTagGroup;
    }


    createCanvas(name) {
        /**
         * 创建一个canvas对象，绘制几何图案或添加文字
         */
        const canvas = document.createElement("canvas");
        const arr = name.split(""); //分割为单独字符串
        let num = 0;
        const reg = /[\u4e00-\u9fa5]/;
        for (let i = 0; i < arr.length; i++) {
            if (reg.test(arr[i])) { //判断是不是汉字
                num += 1;
            } else {
                num += 0.5; //英文字母或数字累加0.5
            }
        }
        // 根据字符串符号类型和数量、文字font-size大小来设置canvas画布宽高度
        const h = 240; //根据渲染像素大小设置，过大性能差，过小不清晰
        const w = h + num * 110;
        canvas.width = w;
        canvas.height = h;
        const h1 = h * 0.8;
        const c = canvas.getContext('2d');
        // 定义轮廓颜色，黑色半透明
        c.fillStyle = "rgba(0,0,0,0.4)";
        // 绘制半圆+矩形轮廓
        const R = h1 / 2;
        c.arc(R, R, R, -Math.PI / 2, Math.PI / 2, true); //顺时针半圆
        c.arc(w - R, R, R, Math.PI / 2, -Math.PI / 2, true); //顺时针半圆
        c.fill();
        // 绘制箭头
        c.beginPath();
        const h2 = h - h1;
        c.moveTo(w / 2 - h2 * 0.6, h1);
        c.lineTo(w / 2 + h2 * 0.6, h1);
        c.lineTo(w / 2, h);
        c.fill();
        // 文字
        c.beginPath();
        c.translate(w / 2, h1 / 2);
        c.fillStyle = "#ffffff"; //文本填充颜色
        c.font = "normal 128px Times New Roman"; //字体样式设置
        c.textBaseline = "middle"; //文本与fillText定义的纵坐标
        c.textAlign = "center"; //文本居中(以fillText定义的横坐标)
        c.fillText(name, 0, 0);
        return canvas;
    }



    rayChoosePoint = (event) =>{
        const px = event.offsetX;
        const py = event.offsetY;
        //屏幕坐标转标准设备坐标
        const x = (px / this.cadWidth) * 2 - 1;
        const y = -(py / this.height) * 2 + 1;
        const raycaster = new THREE.Raycaster();
        //.setFromCamera()在点击位置生成raycaster的射线ray
        raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera.getCamera());
        // 射线交叉计算拾取模型
        const intersects = raycaster.intersectObject(this.scene, true);

        let v3 = null;
        if (intersects.length > 0) {
            // 获取模型上选中的一点坐标
            v3 = intersects[0].point
        }

        console.log(v3)
        return v3;
    }



    destroyThreejs() {
        try {
            this.renderer.dispose();
            this.renderer.forceContextLoss();
            this.renderer.content = null;
            let gl = this.renderer.domElement.getContext("webgl");
            if (gl && gl.getExtension("WEBGL_lose_context")) {
                gl.getExtension("WEBGL_lose_context").loseContext();
            }
            this.renderer = null;
            this.camera.dispose()
            this.scene.traverse((child) => {
                if (child.material) {
                    child.material.dispose();
                }
                if (child.geometry) {
                    child.geometry.dispose();
                }
                child = null;
            });
            this.scene = null;
            this.camera = null;
            this.effectComposer=null;
        } catch (e) {
            console.error("Failed to destroy threejs", e);
        }
    }



    setSplitModel(model){
        // if(!model || model instanceof Mesh) {
        //     console.warn("只能处理Scene、Object3D、Group")
        //     return;
        // }
        this.quit();
        this.meshList = [];

        //计算模型整体包围盒中心作为爆炸中心
        model.updateMatrixWorld();
        var box = new THREE.Box3().expandByObject(model);
        var center = box.getCenter(new THREE.Vector3());
        model.traverse(node=>{
            if(node.type == "Mesh" && node.name != '' && node.type.indexOf('Helper') < 0 && node.name.indexOf("mark") < 0){
                //分别计算每个mesh的包围盒中心，其与爆炸中心连线作为爆炸方向
                let subBox = new THREE.Box3().expandByObject(node);
                let meshCenter = subBox.getCenter(new THREE.Vector3());
                node._splitSrcPos = node.getWorldPosition(new THREE.Vector3())
                node.beforePos = node.position

                //这里计算各个轴向分速度，这样可以使用滑动条控制进度
                let subSpeed = {
                    x:(meshCenter.x-center.x) * this.splitScale / this.splitSpeed,
                    y:(meshCenter.y-center.y) * this.splitScale / this.splitSpeed,
                    z:(meshCenter.z-center.z) * this.splitScale / this.splitSpeed,
                }
                node._splitSpeed = subSpeed;
                this.meshList.push(node);
            }
        })
        this.currentSplitValue = 0;
        this.targetSplitValue = 0;
        this.running = false;
    }

    /**
     * 开始爆炸
     */
    startSplit(){
      debugger
        this.targetSplitValue = this.splitSpeed;
        this.currentSplitValue = 0;
        this.offset = 1;
        this.running = true;
        this.isQuit = false;

    }

    /**
     * 开始反向爆炸（还原）
     */
    quitSplit(){
        this.targetSplitValue = 0;
        this.currentSplitValue = this.splitSpeed;
        this.offset = -1;
        this.running = true;
        this.isQuit = true;
    }

    /**
     * 退出拆分时还原
     */
    quit(){
        if(this.currentSplitValue != 0 && this.meshList.length > 0){
            for(var i=0;i<this.meshList.length;i++){
                let node = this.meshList[i];
                node.position.copy(node.beforePos);
            }
            this.currentSplitValue = 0;
            this.targetSplitValue = 0;
        }
    }

    /**
     * 如果用滑动条控制时将滑动条的值传入这个函数
     * @param {*} value [0,1]的值，表示爆炸进度
     */
    setValue(value){
        if(value < 0) value = 0;
        if(value > 1) value = 1;
        this.currentSplitValue = value * this.splitSpeed;
        for(var i=0;i<this.meshList.length;i++){
            let node = this.meshList[i];
            let x = node._splitSpeed.x * this.currentSplitValue + node._splitSrcPos.x;
            let y = node._splitSpeed.y * this.currentSplitValue + node._splitSrcPos.y;
            let z = node._splitSpeed.z * this.currentSplitValue + node._splitSrcPos.z;
            node.parent.updateMatrixWorld();
            let invMat = node.parent.matrixWorld.clone().invert();
            //不同版本的threejs用不同的方法获取逆矩阵,如果用上面的报错就换下面的
            //let invMat = new Matrix4().getInverse(node.parent.matrixWorld.clone());
            let pos = new THREE.Vector3(x,y,z).applyMatrix4(invMat);
            node.position.copy(pos);
        }
        this.update(false,true)
    }



    /**
     * 更新
     * @returns
     */
    updateExplose(){

        if(this.running && this.meshList.length > 0){

            if (this.currentSplitValue != this.targetSplitValue) {
                this.currentSplitValue += this.offset;
            }

            for(var i=0;i<this.meshList.length;i++){
                let node = this.meshList[i];
                let x = node._splitSpeed.x * this.currentSplitValue + node._splitSrcPos.x;
                let y = node._splitSpeed.y * this.currentSplitValue + node._splitSrcPos.y;
                let z = node._splitSpeed.z * this.currentSplitValue + node._splitSrcPos.z;
                node.parent.updateMatrixWorld();
                let invMat = node.parent.matrixWorld.clone().invert();
                //不同版本的threejs用不同的方法获取逆矩阵,如果用上面的报错就换下面的
                //let invMat = new Matrix4().getInverse(node.parent.matrixWorld.clone());
                let pos = new THREE.Vector3(x,y,z).applyMatrix4(invMat);
                node.position.copy(pos);
            }

            if(this.currentSplitValue == this.targetSplitValue){
                this.running = false;

                if(this.isQuit == true){
                    this.quit();
                    this.isQuit = false;
                }
            }

            this.update(false,true)
        }
    }


}

export { Viewer };
