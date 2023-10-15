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

const torusGeometry = new THREE.TorusKnotGeometry(10, 3, 100, 16)

// initialize the material
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
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
torus.scale.set(0.1, 0.1, 0.1);
torus.position.x = 3;

scene.add(mesh);

scene.add(plane);
scene.add(torus);
scene.fog = new THREE.Fog("white", 1, 10);
scene.background = new THREE.Color("white");

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
