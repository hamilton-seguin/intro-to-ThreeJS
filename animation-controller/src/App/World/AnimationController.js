import * as THREE from "three";

import App from "../App";

export default class AnimationController {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    console.log(this.app.world.character);
    this.avatar = this.app.world.character.avatar;

    this.instantiateAnimations();
  }
  instantiateAnimations(){
    
  }
}
