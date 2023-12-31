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
const geometry = new THREE.BoxGeometry(1, 1, 1);
const uv2 = new THREE.BufferAttribute(geometry.attributes.uv.array, 2);
geometry.setAttribute("uv2", uv2);

const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16);
const uv2Knot = new THREE.BufferAttribute(
  torusKnotGeometry.attributes.uv.array,
  2
);
torusKnotGeometry.setAttribute("uv2", uv2Knot);

const planeGeometry = new THREE.PlaneGeometry(1, 1);
const uv2Plane = new THREE.BufferAttribute(
  planeGeometry.attributes.uv.array,
  2
);
planeGeometry.setAttribute("uv2", uv2Plane);

const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const uv2Sphere = new THREE.BufferAttribute(
  sphereGeometry.attributes.uv.array,
  2
);
sphereGeometry.setAttribute("uv2", uv2Sphere);

const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
const uv2Cylinder = new THREE.BufferAttribute(
  cylinderGeometry.attributes.uv.array,
  2
);
cylinderGeometry.setAttribute("uv2", uv2Cylinder);

// initialize the texture
/** // grasstexture on plane, repeat, offset
const grassTexture = textureLoader.load(
  "/textures/space-cruiser-panels2-bl/space-cruiser-panels2_albedo.png"
);

grassTexture.repeat.set(2, 2);

grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;


pane.addBinding(grassTexture, "offset", {
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
*/

const grassAlbedo = textureLoader.load("/textures/whispy-grass-meadow-bl/wispy-grass-meadow_albedo.png");
const grassAo = textureLoader.load("/textures/whispy-grass-meadow-bl/wispy-grass-meadow_ao.png");
const grassHeight = textureLoader.load("/textures/whispy-grass-meadow-bl/wispy-grass-meadow_height.png");
const grassMetallic = textureLoader.load("/textures/whispy-grass-meadow-bl/wispy-grass-meadow_metallic.png");
const grassNormal = textureLoader.load("/textures/whispy-grass-meadow-bl/wispy-grass-meadow_normal-ogl.png");
const grassRoughness = textureLoader.load("/textures/whispy-grass-meadow-bl/wispy-grass-meadow_roughness.png");

// initialize the material

const material = new THREE.MeshPhysicalMaterial();
material.side = THREE.DoubleSide;
material.map = grassAlbedo;

material.roughnessMap = grassRoughness;
material.metalnessMap = grassMetallic;

material.normalMap = grassNormal;

material.displacementMap = grassHeight;
material.displacementScale = 0.1;

//ambiant occlusion (= blocked light)
material.aoMap = grassAo;

pane.addBinding(material, "aoMapIntensity", {
  min: 0,
  max: 1,
  step: 0.01,
});

// initialize the mesh
const cube = new THREE.Mesh(geometry, material);

const knot = new THREE.Mesh(torusKnotGeometry, material);
knot.position.x = 1.5;

const plane = new THREE.Mesh(planeGeometry, material);
plane.position.x = -1.5;
// plane.rotation.x = -(Math.PI * 0.5);
// plane.scale.set(100, 100, 100);

const sphere = new THREE.Mesh(); //same but add geometry and material after initialization
sphere.geometry = sphereGeometry;
sphere.material = material;
sphere.position.y = 1.5;

const cylinder = new THREE.Mesh();
cylinder.geometry = cylinderGeometry;
cylinder.material = material;
cylinder.position.y = -1.5;

// add the mesh to the scene
group.add(cube, knot, plane, sphere, cylinder);
// group.add(plane);
scene.add(group);
console.log(scene);

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
camera.position.z = 10;
camera.position.y = 5;

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
