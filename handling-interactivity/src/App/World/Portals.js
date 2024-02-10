import * as THREE from "three";

import App from "../App";
import { appStateStore } from "../Utils/Store.js";
import ModalManager from "../UI/ModalManager.js";

export default class Portal {
  constructor(portalMesh, modalInfo) {
    this.app = new App();
    this.portalMesh = portalMesh;
    this.modalInfo = modalInfo;
    this.modalManager = new ModalManager()
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
      // const isNear = distance < 1.5;
      // if (isNear) {
      //   this.modalManager.openModal(this.modalInfo.title, this.modalInfo.description);
      // }
    }
  }
}
