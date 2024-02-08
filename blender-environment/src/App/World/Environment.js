import * as THREE from "three";

import App from "../App.js";
import assetStore from "../Utils/AssetStore.js";

export default class Environment {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.physics = this.app.world.physics;
    this.pane = this.app.gui.pane;

    this.assetStore = assetStore.getState();
    this.environment = this.assetStore.loadedAssets.environment;

    this.loadEnvironment();
    this.addLights();
    this.addGUI();
  }

  loadEnvironment() {
    // load environment here
    const environmentScene = this.environment.scene;
    environmentScene.position.set(-1, 5.2, -17);
    environmentScene.rotation.set(0, -0.6, 0);
    environmentScene.scale.setScalar(1.3);
    this.scene.add(environmentScene);

    // add physics
    const physicalObjects = [
      "trees",
      "boulders",
      "terrain",
      "stairs",
      "gates",
      "invisibleWalls",
      "bushes",
      "pondRocks",
      "floor",
      "tiles"
    ];
    // loop through the top level of the environment scene and if the name of the object includes any of the strings in the physicalObjects array, traverse the object and add the physics
    for (const child of environmentScene.children) {
      const isPhysicalObject = physicalObjects.some((keyword) => child.name.includes(keyword));
      if (isPhysicalObject) {
        child.traverse((obj) => {
          if (obj.isMesh) {
            if (obj.name.includes("boulders") || obj.parent.name.includes("trees")) {
              if (obj.parent.name === "trees016") return
              this.physics.add(obj, "fixed", "trimesh");
            } else {
              this.physics.add(obj, "fixed", "cuboid");
            }
          }
        });
      }
    }

    console.log(this.environment.scene.children);
  }

  addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.directionalLight.position.set(3, 1, 1);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);
  }

  addGUI() {
    const environmentFolder = this.pane.addFolder({
      title: "Environment",
      expanded: false,
    });
    environmentFolder.addBinding(this.environment.scene, "position", {
      min: -100,
      max: 100,
      step: 0.1,
    });
    environmentFolder.addBinding(this.environment.scene, "rotation", {
      min: -Math.PI,
      max: Math.PI,
      step: 0.01,
    });

    const scale = { value: 1.3 };
    environmentFolder
      .addBinding(scale, "value", { min: 0, max: 3, step: 0.01 })
      .on("change", () => {
        this.environment.scene.scale.setScalar(scale.value);
      });
  }
}
