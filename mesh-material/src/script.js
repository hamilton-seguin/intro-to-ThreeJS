import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Pane } from "tweakpane";

// initialize the pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

// initialize the geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);
const planeGeometry = new THREE.PlaneGeometry(1, 1);

const torusGeometry = new THREE.TorusKnotGeometry(0.5, 0.15, 1000, 16);

// initialize the material
// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 40;
// material.color.set("red");

// pane.addBinding(material, "shininess", {
//   min: 0,
//   max: 100,
//   step: 1,
//   label: "Shininess",
// });

const material = new THREE.MeshPhysicalMaterial();
material.color.set("red");

pane.addBinding(material, "metalness", {
  min: 0,
  max: 1,
  step: 0.01,
  label: "Metalness",
});
pane.addBinding(material, "roughness", {
  min: 0,
  max: 1,
  step: 0.01,
  label: "Roughness",
});
pane.addBinding(material, "clearcoat", {
  min: 0,
  max: 1,
  step: 0.01,
  label: "Clearcoat",
});
pane.addBinding(material, "reflectivity", {
  min: 0,
  max: 1,
  step: 0.01,
  label: "Reflectivity",
});


// material.color.set("violet"); // or new THREE.Color("violet")
// material.transparent = true;
// material.opacity = 1/3;
material.side = THREE.DoubleSide; // ThreeJS constant, log to 2

// initialize the mesh
const mesh = new THREE.Mesh(geometry, material);

const plane = new THREE.Mesh(planeGeometry, material);
plane.position.x = -1.5;

const torus = new THREE.Mesh(torusGeometry, material);
torus.position.x = 1.5;

scene.add(mesh);

scene.add(plane);
scene.add(torus);
// scene.fog = new THREE.Fog("white", 1, 10);
// scene.background = new THREE.Color("white");

// initialize the light
const light = new THREE.AmbientLight("white", 0.4);
scene.add(light);

const pointLight = new THREE.PointLight("white", 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  1,
  20
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
