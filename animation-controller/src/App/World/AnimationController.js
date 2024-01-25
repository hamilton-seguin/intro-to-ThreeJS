import * as THREE from "three";

import App from "../App";
import { inputStore } from "../Utils/Store";

export default class AnimationController {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.avatar = this.app.world.character.avatar;

    inputStore.subscribe((input) => {this.onInput(input)});

    this.instantiateAnimations();
  }

  instantiateAnimations() {
    this.animations = new Map();
    this.mixer = new THREE.AnimationMixer(this.avatar.scene);

    this.avatar.animations.forEach((clip) => {
      this.animations.set(clip.name, this.mixer.clipAction(clip));
    });

    this.currentAction = this.animations.get("Idle");
    this.currentAction.play();
  }

  playAnimation(name) {
    if (this.currentAction === this.animations.get(name)) return;
    const action = this.animations.get(name);
    action.reset();
    action.play();
    action.crossFadeFrom(this.currentAction, 0.2)
    this.currentAction = action;
  }

  onInput(input) {
    if (input.forward || input.backward || input.left || input.right) {
      this.playAnimation("Running");
    } else if (input.extra) {
      this.animations.get("Dancing") ? this.playAnimation("Dancing") : this.playAnimation("Idle-Hand");
    } else {
      this.playAnimation("Idle");
    }
  }

  loop(deltaTime) {
    if (this.mixer) this.mixer.update(deltaTime);
  }
}
