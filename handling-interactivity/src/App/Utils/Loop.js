import * as THREE from "three";
import App from "../App.js";

import Stats from "stats.js";
let stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

export default class Loop {
  constructor() {
    this.app = new App();
    this.camera = this.app.camera;
    this.renderer = this.app.renderer;
    this.world = this.app.world;

    this.clock = new THREE.Clock();
    this.previousElapsedTime = 0;
    this.loop();
  }

  loop() {
    stats.begin()
    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.previousElapsedTime;
    this.previousElapsedTime = elapsedTime;

    this.world.loop(deltaTime, elapsedTime);
    this.camera.loop(deltaTime);
    this.renderer.loop();
    window.requestAnimationFrame(() => this.loop());
    stats.end()
  }
}
