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
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    this.instance = new THREE.Mesh(geometry, material);
    this.instance.position.set(0, 2.5, 0);
    this.scene.add(this.instance);

    const hAvatar = this.hAvatar.scene;
    hAvatar.scale.setScalar(3.5);
    hAvatar.rotation.y = Math.PI;
    this.instance.add(hAvatar);
  }
}
