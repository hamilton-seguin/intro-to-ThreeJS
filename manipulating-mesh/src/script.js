import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// initialize the scene
const scene = new THREE.Scene();

// add objects to the scene
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: "violet",
  wireframe: true,
});

const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

const cubeMesh2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeMesh2.position.x = 2;
const cubeMesh3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeMesh3.position.x = -2;

const group = new THREE.Group();
// group.add(cubeMesh);
group.add(cubeMesh2);
group.add(cubeMesh3);

scene.add(group);

group.scale.setScalar(2)

scene.add(cubeMesh);

cubeMesh.position.setScalar(2)
cubeMesh.rotation.y = THREE.MathUtils.degToRad(75)  // rotation is in radians (180 = PI (3.14...))
cubeMesh.rotation.x = THREE.MathUtils.degToRad(90)

// AXESHELPER
const sceneAxesHelper = new THREE.AxesHelper(5);
const meshAxesHelper = new THREE.AxesHelper(5);

scene.add(sceneAxesHelper);
cubeMesh.add(meshAxesHelper);

// initialize the CAMERA
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.y = 7;
camera.position.z = 25;

// console.log(camera.position.distanceTo(cubeMesh.position));

// initialize the RENDERER
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// instantiate the CONTROLS
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.autoRotate = true;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// render the SCENE
const renderloop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
