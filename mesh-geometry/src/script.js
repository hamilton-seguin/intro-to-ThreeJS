import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Pane } from "tweakpane";

const pane = new Pane({
  title: "Controls",
});

const planeParameters = {
  width: 1,
  height: 1,
};

// initialize the scene
const scene = new THREE.Scene();

// add objects to the scene
let geometry = new THREE.PlaneGeometry(1, 1);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const geometry = new THREE.SphereGeometry(1, 32, 32);
// const geometry = new THREE.IcosahedronGeometry(1, 7);
// const geometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 60);

// create custom geometry
// const geometry = new THREE.BufferGeometry();
// const vertices = new Float32Array([
//   0, 0, 0,
//   0, -1, 0,
//   -1, 0, 0
// ]);
// geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

// const newMesh = new THREE.Mesh(geometry, cubeMaterial);
// scene.add(newMesh);

// Tweakpane

// const axisFolder = pane.addFolder({ title: "Axis" });
// axisFolder.addBinding(cubeMesh.scale, "x", {
//   min: 0,
//   max: 10,
//   step: 0.1,
//   label: "Scale X",
// });
// axisFolder.addBinding(cubeMesh.scale, "y", {
//   min: 0,
//   max: 10,
//   step: 0.1,
//   label: "Scale Y",
// });

pane
  .addBinding(planeParameters, "width", {
    min: 0,
    max: 10,
    step: 0.1,
    label: "width",
  })
  .on("change", (value) => {
    geometry = new THREE.BoxGeometry(value, planeParameters.height);
    cubeMesh.geometry = geometry;
  });

const cubeMaterial = new THREE.MeshBasicMaterial({
  color: "violet",
  wireframe: true,
});
const cubeMesh = new THREE.Mesh(geometry, cubeMaterial);
scene.add(cubeMesh);

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
// controls.autoRotate = true;

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
