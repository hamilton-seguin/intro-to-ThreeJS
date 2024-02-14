import * as THREE from "three";

import App from "../App.js";
import { appStateStore } from "../Utils/Store.js";
import ModalManager from "./ModalManager.js";

function createMaterial(color, opacity, doubleSided) {
  const material = new THREE.MeshStandardMaterial({ color, transparent: true, opacity});
  doubleSided && (material.side = THREE.DoubleSide);
  return material;
}

const modalMeshNearMaterial = createMaterial(0x863ad4, 0.6, true);
const modalMeshFarMaterial = createMaterial(0x4b2076, 0.8, true);
const tutorialTileMeshNearMaterial = createMaterial(null, 0.4);

export default class ModalController {
  constructor(mesh, modalInfo) {
    this.app = new App();
    this.mesh = mesh;
    this.modalInfo = modalInfo;
    this.modalManager = new ModalManager();
    this.tutorialTile = this.mesh.name === "tiles014" ? this : null;
    this.portalNearMaterial = this.tutorialTile
      ? tutorialTileMeshNearMaterial
      : modalMeshNearMaterial;
    this.portalFarMaterial = this.tutorialTile
      ? this.mesh.material
      : modalMeshFarMaterial;
    this.mesh.material = this.portalFarMaterial;
    this.prevIsNear = false;
  }

  loop() {
    const unsub = appStateStore.subscribe((state) => {
      if (state.characterReady) {
        this.character = this.app.world.character.instance;
        unsub();
      }
    });

    if (this.character) {
      const portalPosition = this.mesh.getWorldPosition(new THREE.Vector3());
      const distance = this.character.position.distanceTo(portalPosition);
      const isNear = distance < 2.5;

      if (isNear !== this.prevIsNear) {
        this.prevIsNear = isNear;
        this.mesh.material = isNear
          ? this.portalNearMaterial
          : this.portalFarMaterial;
        isNear
          ? this.modalManager.openModal( this.modalInfo.title, this.modalInfo.description)
          : this.modalManager.closeModal();
      }
    }
  }
}
