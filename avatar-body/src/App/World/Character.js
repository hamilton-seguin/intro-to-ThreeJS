import * as THREE from "three";
import assetStore from "../Utils/AssetStore.js";

import App from "../App.js";
export default class Character {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.assetStore = assetStore.getState();
    console.log(this.assetStore);
    this.hAvatar = this.assetStore.loadedAssets.hAvatar;

    // create character and add to scene
    const geometry = new THREE.BoxGeometry(2, 5, 2);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      wireframe: true,
      visible: false,
    });
    this.instance = new THREE.Mesh(geometry, material);
    this.instance.position.set(0, 4, 0);
    this.scene.add(this.instance);

    const hAvatar = this.hAvatar.scene;
    hAvatar.rotation.y = Math.PI;
    hAvatar.position.y = -2.5;
    hAvatar.scale.setScalar(3.5);
    this.instance.add(hAvatar);
  }
}
