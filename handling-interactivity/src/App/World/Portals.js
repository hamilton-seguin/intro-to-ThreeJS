import * as THREE from "three";

import App from "../App";
import { appStateStore } from "../Utils/Store.js";
import ModalManager from "../UI/ModalManager.js";

export default class Portal {
  constructor(portalMesh, modalInfo) {
    this.app = new App();
    this.portalMesh = portalMesh;
    this.modalInfo = modalInfo;
    this.modalManager = new ModalManager();

    this.portalNearMaterial = new THREE.MeshBasicMaterial({
      color: 0x863AD4,
      transparent: true,
      opacity: 0.6,
    });
    this.portalNearMaterial.side = THREE.DoubleSide;

    this.portalFarMaterial = new THREE.MeshBasicMaterial({
      color: 0x4B2076,
      transparent: true,
      opacity: 0.8,
    });
    this.portalFarMaterial.side = THREE.DoubleSide;

    this.portalMesh.material = this.portalFarMaterial;

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
      const portalPosition = this.portalMesh.getWorldPosition(
        new THREE.Vector3()
      );
      const distance = this.character.position.distanceTo(portalPosition);
      const isNear = distance < 2.5;
      if (isNear) {
        if (!this.prevIsNear) {
          this.modalManager.openModal(this.modalInfo.title, this.modalInfo.description);
          this.portalMesh.material = this.portalNearMaterial;
          this.prevIsNear = true;
        }
      } else {
        if (this.prevIsNear) {
          this.modalManager.closeModal();
          this.portalMesh.material = this.portalFarMaterial;
          this.prevIsNear = false;
        }
      }
    }
  }
}
