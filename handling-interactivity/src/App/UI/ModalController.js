import * as THREE from "three";

import App from "../App.js";
import { appStateStore } from "../Utils/Store.js";
import ModalManager from "./ModalManager.js";

function createMaterial(color, opacity, doubleSided) {
  const material = new THREE.MeshStandardMaterial({ color, transparent: true, opacity, emissive: color});
  doubleSided && (material.side = THREE.DoubleSide);
  return material;
}

const modalMeshNearMaterial = createMaterial(0x863ad4, 0.6, true);
const modalMeshFarMaterial = createMaterial(0x4b2076, 0.8, true);
const tutorialTileMeshNearMaterial = createMaterial(null, 0.8);

export default class ModalController {
  constructor(mesh, modalInfo) {
    this.app = new App();
    this.modalManager = new ModalManager();
    this.pane = this.app.gui.pane;

    this.mesh = mesh;
    this.modalInfo = modalInfo;

    this.tutorialTile = this.mesh.name === "tiles014" ? this : null;
    this.ModalNearMaterial = this.tutorialTile
      ? tutorialTileMeshNearMaterial
      : modalMeshNearMaterial;
    this.ModalFarMaterial = this.tutorialTile
      ? this.mesh.material
      : modalMeshFarMaterial;
    this.mesh.material = this.ModalFarMaterial;
    this.prevIsNear = false;

    const modalPortal = this.pane.addFolder({
      title: "Modal",
      expanded: false,
    });
    modalPortal.addBinding(this.mesh.material, "opacity", {
      min: 0,
      max: 1,
      step: 0.1,
    });
    modalPortal.addBinding(this.mesh.material, "color", {
      view: "text",
    });
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
          ? this.ModalNearMaterial
          : this.ModalFarMaterial;
        isNear
          ? this.modalManager.openModal( this.modalInfo.title, this.modalInfo.description)
          : this.modalManager.closeModal();
      }
    }
  }
}
