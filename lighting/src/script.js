import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper";
import { Pane } from "tweakpane";

// initialize the pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

// add meshes to the scene
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(0.75, 32, 32);
const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
const circleGeometry = new THREE.CircleGeometry(0.5, 32);

const material = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.43,
  roughness: 0.37,
});

const materialPane = pane.addFolder({ title: "Material" });
materialPane.addBinding(material, "metalness", { min: 0, max: 1, step: 0.01 });
materialPane.addBinding(material, "roughness", { min: 0, max: 1, step: 0.01 });
materialPane.addBinding(material, "color", { color: { type: "float" } });

const box = new THREE.Mesh(boxGeometry, material);
box.position.x = -2;
const box2 = new THREE.Mesh(boxGeometry, material);
box2.position.x = -2;
box2.position.z = -2;
const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.position.x = 0;
const sphere2 = new THREE.Mesh(sphereGeometry, material);
sphere2.position.x = 0;
sphere2.position.z = -2;
const torusKnot = new THREE.Mesh(torusKnotGeometry, material);
torusKnot.position.x = 2;
const torusKnot2 = new THREE.Mesh(torusKnotGeometry, material);
torusKnot2.position.x = 2;
torusKnot2.position.z = -2;
const circle = new THREE.Mesh(circleGeometry, material);
circle.scale.setScalar(20);
circle.position.y = -2;
circle.rotation.x = -Math.PI / 2;

scene.add(box, sphere, torusKnot, circle);
scene.add(box2, sphere2, torusKnot2);

// initialize the light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
const hemisphereLight = new THREE.HemisphereLight(0x000000, 0x422319, 1);
const directionalLight = new THREE.DirectionalLight(0x0000ff, 0.37);
const pointLight = new THREE.PointLight(0x00ff00, 0.64);
const spotLight = new THREE.SpotLight(0xff0000, 1.30);
const rectAreaLight = new THREE.RectAreaLight(0x0000ff, 0, 50, 2);

/** Natural looking value for pointLight and spotLight decay is 2 (don't touch for more realistic light)  */

scene.add(
  ambientLight,
  hemisphereLight,
  directionalLight,
  pointLight,
  spotLight,
  rectAreaLight
);

directionalLight.position.set(0, 5, 5);
pointLight.position.set(-4.6, 3, 0);
pointLight.distance = 19.6;
spotLight.position.set(-0.6, 7.5, -6.4);
spotLight.distance = 20;
spotLight.target.position.set(-2, -1, -1);
spotLight.penumbra = 0.5;
spotLight.angle = Math.PI *0.1;
scene.add(spotLight.target); // need to add target to scene so its updated each frame


rectAreaLight.position.set(0, 2, -1);
rectAreaLight.lookAt(0, 0, -1); // HAS to be after the position is set
rectAreaLight.castShadow = false;

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.5);
scene.add(directionalLightHelper);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
scene.add(pointLightHelper);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);


const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

const ambient = pane.addFolder({ title: "Ambient Light", expanded: false });
ambient.addBinding(ambientLight, "intensity", { min: 0, max: 1, step: 0.01 });
ambient.addBinding(ambientLight, "color", { color: { type: "float" } });

//hemisphere light is cheap (not intensive in terms of performance)
const hemisphere = pane.addFolder({
  title: "Hemisphere Light",
  expanded: false,
});
hemisphere.addBinding(hemisphereLight, "intensity", {
  min: 0,
  max: 1,
  step: 0.01,
});
hemisphere.addBinding(hemisphereLight, "color", { color: { type: "float" } });
hemisphere.addBinding(hemisphereLight, "groundColor", {
  color: { type: "float" },
});
console.log(hemisphereLight);

const directional = pane.addFolder({
  title: "Directional Light",
  expanded: true,
});
directional.addBinding(directionalLight, "position", {
  x: { min: -10, max: 10, step: 0.1 },
  y: { min: -10, max: 10, step: 0.1 },
  z: { min: -10, max: 10, step: 0.1 },
});
directional.addBinding(directionalLight, "intensity", {
  min: 0,
  max: 1,
  step: 0.01,
});
directional.addBinding(directionalLight, "color", { color: { type: "float" } });

const pointL = pane.addFolder({ title: "Point Light", expanded: true });
pointL.addBinding(pointLight, "position", {
  x: { min: -10, max: 10, step: 0.1 },
  y: { min: -10, max: 10, step: 0.1 },
  z: { min: -10, max: 10, step: 0.1 },
});
pointL.addBinding(pointLight, "distance", { min: 0, max: 100, step: 0.1 }); //distance is the maximum sphere of influence
pointL.addBinding(pointLight, "intensity", { min: 0, max: 1, step: 0.01 });
pointL.addBinding(pointLight, "color", { color: { type: "float" } });

const spotL = pane.addFolder({ title: "Spot Light", expanded: true });
spotL.addBinding(spotLight, "position", {
  x: { min: -10, max: 10, step: 0.1 },
  y: { min: -10, max: 10, step: 0.1 },
  z: { min: -10, max: 10, step: 0.1 },
});
spotL.addBinding(spotLight, "distance", { min: 0, max: 100, step: 0.1 });
spotL.addBinding(spotLight, "color", { color: { type: "float" } });
spotL.addBinding(spotLight, "intensity", { min: 0, max: 10, step: 0.01 });
spotL.addBinding(spotLight, "angle", { min: 0, max: Math.PI / 2, step: 0.01 });
spotL.addBinding(spotLight, "penumbra", { min: 0, max: 1, step: 0.01 });
spotL.addBinding(spotLight, "decay", { min: 1, max: 5, step: 0.01 });
spotL.addBinding(spotLight.target, "position", {
  x: { min: -10, max: 10, step: 0.1 },
  y: { min: -10, max: 10, step: 0.1 },
  z: { min: -10, max: 10, step: 0.1 },
  label: "target",
});
scene.add(spotLightHelper);

const rectL = pane.addFolder({ title: "Rectangular Area Light", expanded: false });
rectL.addBinding(rectAreaLight, "position", {
  x: { min: -10, max: 10, step: 0.1 },
  y: { min: -10, max: 10, step: 0.1 },
  z: { min: -10, max: 10, step: 0.1 },
});
rectL.addBinding(rectAreaLight, "intensity", { min: 0, max: 10, step: 0.01 });
rectL.addBinding(rectAreaLight, "color", { color: { type: "float" } });
rectL.addBinding(rectAreaLight, "width", { min: 0, max: 10, step: 0.01 });
rectL.addBinding(rectAreaLight, "height", { min: 0, max: 10, step: 0.01 });
rectL.addBinding(rectAreaLight, "rotation", {
  x: { min: -Math.PI, max: Math.PI, step: 0.01 },
  y: { min: -Math.PI, max: Math.PI, step: 0.01 },
  z: { min: -Math.PI, max: Math.PI, step: 0.1 },
});
// rectL.addBinding(rectAreaLight, "lookAt", {
//   x: { min: -10, max: 10, step: 0.1 },
//   y: { min: -10, max: 10, step: 0.1 },
//   z: { min: -10, max: 10, step: 0.1 },
// });
console.log(rectAreaLight);

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.set(20, 45, 30)


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
  spotLightHelper.update(); //to make sure the spotLightHelper is updated each frame
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
