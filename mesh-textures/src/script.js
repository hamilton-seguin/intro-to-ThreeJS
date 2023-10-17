import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Pane } from "tweakpane";

// initialize the pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

// initialize group
const group = new THREE.Group();

// initialize the texture loader
const textureLoader = new THREE.TextureLoader();

// initialize the geometry
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const uv2Sphere = new THREE.BufferAttribute(sphereGeometry.attributes.uv.array,2);
sphereGeometry.setAttribute("uv2", uv2Sphere);

// initialize grass texture
const grassAlbedo = textureLoader.load("/textures/whispy-grass-meadow-bl/wispy-grass-meadow_albedo.png");
const grassAo = textureLoader.load("/textures/whispy-grass-meadow-bl/wispy-grass-meadow_ao.png");
const grassHeight = textureLoader.load("/textures/whispy-grass-meadow-bl/wispy-grass-meadow_height.png");
const grassMetallic = textureLoader.load("/textures/whispy-grass-meadow-bl/wispy-grass-meadow_metallic.png");
const grassNormal = textureLoader.load("/textures/whispy-grass-meadow-bl/wispy-grass-meadow_normal-ogl.png");
const grassRoughness = textureLoader.load("/textures/whispy-grass-meadow-bl/wispy-grass-meadow_roughness.png");

// initialize badlands texture
const badlandsAlbedo = textureLoader.load("/textures/badlands-boulders-bl/badlands-boulders_albedo.png");  
const badlandsAo = textureLoader.load("/textures/badlands-boulders-bl/badlands-boulders_ao.png");
const badlandsHeight = textureLoader.load("/textures/badlands-boulders-bl/badlands-boulders_height.png");
const badlandsMetallic = textureLoader.load("/textures/badlands-boulders-bl/badlands-boulders_metallic.png");
const badlandsNormal = textureLoader.load("/textures/badlands-boulders-bl/badlands-boulders_normal-ogl.png");
const badlandsRoughness = textureLoader.load("/textures/badlands-boulders-bl/badlands-boulders_roughness.png");

// initialize space cruiser texture
const spaceCruiserAlbedo = textureLoader.load("/textures/space-cruiser-panels2-bl/space-cruiser-panels2_albedo.png");
const spaceCruiserAo = textureLoader.load("/textures/space-cruiser-panels2-bl/space-cruiser-panels2_ao.png");
const spaceCruiserHeight = textureLoader.load("/textures/space-cruiser-panels2-bl/space-cruiser-panels2_height.png");
const spaceCruiserMetallic = textureLoader.load("/textures/space-cruiser-panels2-bl/space-cruiser-panels2_metallic.png");
const spaceCruiserNormal = textureLoader.load("/textures/space-cruiser-panels2-bl/space-cruiser-panels2_normal-ogl.png");
const spaceCruiserRoughness = textureLoader.load("/textures/space-cruiser-panels2-bl/space-cruiser-panels2_roughness.png");

// initialize the material
const grassMaterial = new THREE.MeshPhysicalMaterial();
grassMaterial.side = THREE.DoubleSide;
grassMaterial.map = grassAlbedo;
grassMaterial.roughnessMap = grassRoughness;
grassMaterial.metalnessMap = grassMetallic;
grassMaterial.normalMap = grassNormal;
grassMaterial.displacementMap = grassHeight;
grassMaterial.displacementScale = 0.05;
grassMaterial.aoMap = grassAo; //ambiant occlusion (= blocked light)

pane.addFolder({title: "Grass Sphere"});
pane.addBinding(grassMaterial, "metalness", {min: 0 ,max: 1 ,step: 0.01});
pane.addBinding(grassMaterial, "roughness", {min: 0 ,max: 1 ,step: 0.01});
pane.addBinding(grassMaterial, "displacementScale", {min: 0 ,max: 1 ,step: 0.01});
pane.addBinding(grassMaterial, "aoMapIntensity", {min: 0 ,max: 1 ,step: 0.01});

const badlandMaterial = new THREE.MeshPhysicalMaterial();
badlandMaterial.side = THREE.DoubleSide;
badlandMaterial.map = badlandsAlbedo;
badlandMaterial.roughnessMap = badlandsRoughness;
badlandMaterial.metalnessMap = badlandsMetallic;
badlandMaterial.normalMap = badlandsNormal;
badlandMaterial.displacementMap = badlandsHeight;
badlandMaterial.displacementScale = 0.05;
badlandMaterial.aoMap = badlandsAo;

pane.addFolder({title: "Badlands Sphere"});
pane.addBinding(badlandMaterial, "metalness", {min: 0 ,max: 1 ,step: 0.01});
pane.addBinding(badlandMaterial, "roughness", {min: 0 ,max: 1 ,step: 0.01});
pane.addBinding(badlandMaterial, "displacementScale", {min: 0 ,max: 1 ,step: 0.01});
pane.addBinding(badlandMaterial, "aoMapIntensity", {min: 0 ,max: 1 ,step: 0.01});

const spaceCruiserMaterial = new THREE.MeshPhysicalMaterial();
spaceCruiserMaterial.side = THREE.DoubleSide;
spaceCruiserMaterial.map = spaceCruiserAlbedo;
spaceCruiserMaterial.roughnessMap = spaceCruiserRoughness;
spaceCruiserMaterial.metalnessMap = spaceCruiserMetallic;
spaceCruiserMaterial.normalMap = spaceCruiserNormal;
spaceCruiserMaterial.displacementMap = spaceCruiserHeight;
spaceCruiserMaterial.displacementScale = 0.05;
spaceCruiserMaterial.aoMap = spaceCruiserAo; 

spaceCruiserAlbedo.repeat.set(7, 3);
spaceCruiserAlbedo.wrapS = THREE.MirroredRepeatWrapping;
spaceCruiserAlbedo.wrapT = THREE.MirroredRepeatWrapping;
spaceCruiserAo.repeat.set(7, 3);
spaceCruiserAo.wrapS = THREE.MirroredRepeatWrapping;
spaceCruiserAo.wrapT = THREE.MirroredRepeatWrapping;
spaceCruiserHeight.repeat.set(7, 3);
spaceCruiserHeight.wrapS = THREE.MirroredRepeatWrapping;
spaceCruiserHeight.wrapT = THREE.MirroredRepeatWrapping;
spaceCruiserMetallic.repeat.set(7, 3);
spaceCruiserMetallic.wrapS = THREE.MirroredRepeatWrapping;
spaceCruiserMetallic.wrapT = THREE.MirroredRepeatWrapping;
spaceCruiserNormal.repeat.set(7, 3);
spaceCruiserNormal.wrapS = THREE.MirroredRepeatWrapping;
spaceCruiserNormal.wrapT = THREE.MirroredRepeatWrapping;
spaceCruiserRoughness.repeat.set(7, 3);
spaceCruiserRoughness.wrapS = THREE.MirroredRepeatWrapping;
spaceCruiserRoughness.wrapT = THREE.MirroredRepeatWrapping;

console.log(spaceCruiserMaterial);
pane.addFolder({title: "Space Cruiser Sphere"});
pane.addBinding(spaceCruiserMaterial, "metalness", {min: 0 ,max: 1 ,step: 0.01});
pane.addBinding(spaceCruiserMaterial, "roughness", {min: 0 ,max: 1 ,step: 0.01});
pane.addBinding(spaceCruiserMaterial, "displacementScale", {min: 0 ,max: 1 ,step: 0.01});
pane.addBinding(spaceCruiserMaterial, "aoMapIntensity", {min: 0 ,max: 1 ,step: 0.01});
pane.addBinding(spaceCruiserAlbedo, "offset", {
  x: {
    min: -1,
    max: 1,
    step: 0.01,
  },
  y: {
    min: -1,
    max: 1,
    step: 0.01,
  },
});

// initialize the mesh
const grassSphere = new THREE.Mesh(); //same but add geometry and material after initialization
grassSphere.geometry = sphereGeometry;
grassSphere.material = grassMaterial;

const badlandsSphere = new THREE.Mesh(sphereGeometry, badlandMaterial);
badlandsSphere.position.x = 1.5;

const spaceCruiserSphere = new THREE.Mesh(sphereGeometry, spaceCruiserMaterial)
spaceCruiserSphere.position.x = -1.5;

// add the mesh to the scene
group.add(grassSphere, badlandsSphere, spaceCruiserSphere);
scene.add(group);

// initialize the light
const light = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  20000
);
camera.position.z = 5;
camera.position.y = 2;

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
/** this rotates the camera around the scene */

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// render the scene
const renderloop = () => {
  // group.rotation.y += 0.01;
  /** this rotates whole group on 1 y axis (fix camera)  */

  // group.children.forEach((child) => {
  //   if (child instanceof THREE.Mesh) {
  //     child.rotation.y += 0.01;
  //   }
  // });
  /**  this rotates each mesh in the group on its y axis */

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
