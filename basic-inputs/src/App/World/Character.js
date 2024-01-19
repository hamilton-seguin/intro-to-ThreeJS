import * as THREE from "three";
import App from "../App.js";
import { inputStore } from "../Utils/Store.js";

export default class Character {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.physics = this.app.world.physics;

    inputStore.subscribe((state) => {
      this.forward = state.forward;
      this.backward = state.backward;
      this.left = state.left;
      this.right = state.right;
    });

    this.instantiateCharacter();
  }

  instantiateCharacter() {
    const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    // const geometry = new THREE.SphereGeometry(1,32,32);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    this.character = new THREE.Mesh(geometry, material);
    this.character.position.set(0, 2.5, 0);
    this.scene.add(this.character);
    this.characterRigidBody = this.physics.add(
      this.character,
      "kinematic",
      "cuboid"
    );
  }

  loop() {
    let { x, y, z } = this.characterRigidBody.translation();
    let speed = 0.2

    if (this.forward) z -= speed;
    if (this.backward) z += speed;
    if (this.left) x -= speed;
    if (this.right) x += speed;
    this.characterRigidBody.setNextKinematicTranslation({ x, y, z });
  }
}