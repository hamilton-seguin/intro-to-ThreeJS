import * as THREE from 'three'
import assetStore from '../Utils/AssetStore.js'

import App from '../App.js'
export default class Character {
  constructor(avatarChosen) {
    this.app = new App()
    this.scene = this.app.scene
    this.assetStore = assetStore.getState()
    this.avatar = this.assetStore.loadedAssets[avatarChosen]

    this.instantiateCharacter()
  }

  instantiateCharacter() {
    // create character and add to scene
    const geometry = new THREE.BoxGeometry(0.6, 2, 0.6)
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      wireframe: true,
      visible: false,
    })
    this.instance = new THREE.Mesh(geometry, material)
    this.instance.position.set(0, 10, 0)
    this.scene.add(this.instance)

    // add avatar to character
    const avatar = this.avatar.scene
    avatar.rotation.y = Math.PI
    avatar.position.y = -1
    avatar.scale.setScalar(1.1)
    this.instance.add(avatar)
  }
}
