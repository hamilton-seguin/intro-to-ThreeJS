import * as THREE from "three";

import App from "../App.js";
import assetStore from "../Utils/AssetStore.js";
import Portal from "./Portals.js";
import ModalContentProvider from "../UI/ModalContentProvider.js";

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
    this.addPortals();
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
      "tiles",
    ];
    const shadowCasters = [
      "trees",
      "boulders",
      "terrain",
      "stairs",
      "gates",
      "bushes",
      "pondRocks",
    ];
    const shadowReceivers = ["terrain", "floor"];

    // loop through the top level of the environment scene and if the name of the object includes any of the strings in the physicalObjects array, traverse the object and add the physics
    for (const child of environmentScene.children) {
      child.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = shadowCasters.some((keyword) => child.name.includes(keyword));
          obj.receiveShadow = shadowReceivers.some((keyword) => child.name.includes(keyword));
          if (obj.name.includes("boulders")||obj.parent.name.includes("trees")) {
            this.physics.add(obj, "fixed", "trimesh");
          } else if (physicalObjects.some((keyword) => child.name.includes(keyword))) {
            if (obj.name.includes("tilesEmpty")) return;
            this.physics.add(obj, "fixed", "cuboid");
          }
        }
      });
    }
  }

  addLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xe37730, 0.5);
    this.directionalLight.position.set(34, 50, -29);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.camera.top = 30;
    this.directionalLight.shadow.camera.right = 40;
    this.directionalLight.shadow.camera.bottom = -30;
    this.directionalLight.shadow.camera.left = -40;
    this.directionalLight.shadow.bias = -0.0004;
    this.directionalLight.shadow.normalBias = -0.0717;
    const floorObject = this.scene.getObjectByName("floor");
    this.directionalLight.target = floorObject;
    this.scene.add(this.directionalLight);

    this.directWaterLight = new THREE.DirectionalLight(0x35359c, 0.1);
    this.directWaterLight.position.set(-19, 15, -38);
    this.directWaterLight.name = "directWaterLight";
    this.directWaterLight.castShadow = true;
    this.directWaterLight.shadow.camera.top = 3;
    this.directWaterLight.shadow.camera.right = 3;
    this.directWaterLight.shadow.camera.bottom = -3;
    this.directWaterLight.shadow.camera.left = -3;
    const pondObject = this.scene.getObjectByName("pond");
    this.directWaterLight.target = pondObject;
    this.scene.add(this.directWaterLight);
  }

  addPortals(){
    const portalBotMesh = this.environment.scene.getObjectByName("portalBot");
    const portalMidMesh = this.environment.scene.getObjectByName("portalMid");
    const portalTopMesh = this.environment.scene.getObjectByName("portalTop");

    const modalContentProvider = new ModalContentProvider();

    this.portalBot = new Portal(portalBotMesh, modalContentProvider.getModalInfo("aboutMe"));
    this.portalMid = new Portal(portalMidMesh, modalContentProvider.getModalInfo("projects"));
    this.portalTop = new Portal(portalTopMesh, modalContentProvider.getModalInfo("contactMe"));
  }

  addGUI() {
    const shadowFolder = this.pane.addFolder({
      title: "Shadow",
      expanded: false,
    });
    shadowFolder.addBinding(this.directionalLight, "position", {
      min: -1000,
      max: 1000,
      step: 1,
    });
    shadowFolder.addBinding(this.directionalLight, "color", {
      view: "text",
    });
    shadowFolder.addBinding(this.directionalLight, "intensity", {
      min: 0,
      max: 2,
      step: 0.01,
    });
    shadowFolder.addBinding(this.directionalLight.shadow, "bias", {
      min: -0.1,
      max: 0.1,
      step: 0.0001,
    });
    shadowFolder.addBinding(this.directionalLight.shadow, "normalBias", {
      min: -0.1,
      max: 0.1,
      step: 0.0001,
    });

    const lightFolder = this.pane.addFolder({
      title: "Light",
      expanded: false,
    });
    lightFolder.addBinding(this.ambientLight, "intensity", {
      min: -2,
      max: 2,
      step: 0.01,
    });

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

  loop() {
    this.portalBot.loop();
    // this.portalMid.loop();
    // this.portalTop.loop();
  }
}
