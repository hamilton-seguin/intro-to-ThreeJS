import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

const pane = new Pane();
const scene = new THREE.Scene();
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.0,
  roughness: 0.,
});

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(0.75, 32, 32);
const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
const circleGeometry = new THREE.CircleGeometry(0.5, 32);

const box = new THREE.Mesh(boxGeometry, material);
box.position.x = -2;
box.castShadow = true;

const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.position.x = 0;
sphere.castShadow = true;

const torusKnot = new THREE.Mesh(torusKnotGeometry, material);
torusKnot.position.x = 2;
torusKnot.castShadow = true;

const circle = new THREE.Mesh(circleGeometry, material);
circle.scale.setScalar(20);
circle.position.y = -2;
circle.rotation.x = -Math.PI / 2;
circle.receiveShadow = true;

scene.add(box, sphere, torusKnot, circle);

const directionalLight = new THREE.DirectionalLight(0xff0000, 0.8);
directionalLight.position.set(3, 10, 15);
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
// scene.add(directionalLightHelper);
scene.add(directionalLight);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024; // to make less pixelated (512 default; x2 but 1024 is good)
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.radius = 10;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.bottom = -2;

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightCameraHelper);
directionalLightCameraHelper.visible = false;

const pointLight = new THREE.PointLight(0x00ff00, 0.6);
pointLight.position.set(-3, 2, -3);
// const pointLightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(pointLightHelper);
scene.add(pointLight);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 512; // to make less pixelated (512 default; x2 but 1024 is good)
pointLight.shadow.mapSize.height = 512;
pointLight.shadow.radius = 5;

pointLight.shadow.camera.near = 1;
pointLight.shadow.camera.far = 50; //if set too low, it will bug the light of other source

const pointLightHelper = new THREE.PointLightHelper(pointLight);
scene.add(pointLightHelper);


const spotLight = new THREE.SpotLight(0x0000ff, 5, null, Math.PI * 0.1); // null here because we set in after 
spotLight.position.set(8, 4, 4);
spotLight.target.position.set(0, -1, 0);
// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);
scene.add(spotLight);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024; 
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.radius = 10;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 30;
spotLight.shadow.camera.fov = 30;

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightCameraHelper);
spotLightCameraHelper.visible = false;

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.z = 10;
camera.position.y = 5;

const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap //default (PCFShadowMap) is best

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const renderloop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
