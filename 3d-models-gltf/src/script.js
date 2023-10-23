import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Pane } from "tweakpane";

// initialize the pane
const pane = new Pane();

// add loaders
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath("textures/");

const gltfLoader = new GLTFLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/three/examples/js/libs/draco/");
gltfLoader.setDRACOLoader(dracoLoader)
/** This is needed to load DRACO Compressed Loaders, but we still load with gltfLoader everything to make it work for all type of loaders (gltf & DRACO) */


// initialize the scene
const scene = new THREE.Scene();

// add the environment map
const envMap = cubeTextureLoader.load([
  "px.png",
  "nx.png",
  "py.png",
  "ny.png",
  "pz.png",
  "nz.png",
]);

scene.background = envMap;
scene.environment = envMap; // to apply the envMap to all the objects in the scene, but cannot set the intensity from here
    /** envMapIntensity is the reflection of the envMap (background) in metalic objects */

// add stuff here
const model = await gltfLoader.loadAsync("/models/milkTruckGLB/CesiumMilkTruck.glb"); //async so we can use model const (otherwise use callback fn in .load())

const modelScene = model.scene;
// const material  = modelScene.children[0].material;
// material.envMap = envMap;
// material.envMapIntensity = 2;

modelScene.scale.setScalar(0.2);

  /** to access ALL the child of a complexe 3D Model */
modelScene.traverse((child) => {
  if (child.isMesh) {
    child.material.envMap = envMap;
    child.material.roughness = 0;
    child.material.metalness = 1;
  }
  if (child.name === "Wheels" || child.name === "Wheels001") {
    child.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  }
})
scene.add(modelScene);

//init light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-2, 1.5, 2);
scene.add(ambientLight, directionalLight);
// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.z = 5;

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// instantiate the controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// render the scene
const renderloop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
