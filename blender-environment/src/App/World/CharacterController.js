import * as THREE from "three";

import App from "../App.js";
import { inputStore } from "../Utils/Store.js";

var clock = new THREE.Clock();
let velocity_y = 0;
let delta = 0;

export default class CharacterController {
  constructor() {
    // Initialize app, scene, physics, and character properties
    this.app = new App();
    this.scene = this.app.scene;
    this.physics = this.app.world.physics;
    this.character = this.app.world.character.instance;

    this.isFalling = false;

    // Subscribe to input store and update movement values
    inputStore.subscribe((state) => {
      this.forward = state.forward;
      this.backward = state.backward;
      this.left = state.left;
      this.right = state.right;
      this.jump = state.jump;
    });

    // Instantiate controller and create rigid body and collider
    this.instantiateController();
  }

  /**
   * Instantiate the character controller, rigid body, and collider.
   */
  instantiateController() {
    // Create a kinematic rigid body
    this.rigidBodyType =
      this.physics.rapier.RigidBodyDesc.kinematicPositionBased();
    this.rigidBody = this.physics.world.createRigidBody(this.rigidBodyType);

    // Create a cuboid collider
    this.colliderType = this.physics.rapier.ColliderDesc.cuboid(0.3, 1, 0.3);
    this.collider = this.physics.world.createCollider(
      this.colliderType,
      this.rigidBody
    );

    // Set rigid body position to character position
    const worldPosition = this.character.getWorldPosition(new THREE.Vector3());
    const worldRotation = this.character.getWorldQuaternion(
      new THREE.Quaternion()
    );
    this.rigidBody.setTranslation(worldPosition);
    this.rigidBody.setRotation(worldRotation);

    // Create character controller, set properties, and enable autostepping
    this.characterController =
      this.physics.world.createCharacterController(0.01);
    this.characterController.setApplyImpulsesToDynamicBodies(true);
    this.characterController.enableAutostep(0.7, 0.45, false);
    this.characterController.enableSnapToGround(1);
  }

  detectGround() {
    const avatarHalfHeight = this.character.geometry.parameters.height / 2;
    // set collider position
    const colliderPosition = new THREE.Vector3().copy(this.character.position);
    this.collider.setTranslation(colliderPosition);
  
    const rayDirection = new THREE.Vector3(0, -1, 0);
    // hitting the ground
    const rayOrigin = new THREE.Vector3().copy(this.character.position);
    // ray origin is slightly above the foot of the avatar
    rayOrigin.y -= avatarHalfHeight - 0.1;
  
    const ray = new this.physics.rapier.Ray(rayOrigin, rayDirection);
  
    const groundUnderFootHit = this.physics.world.castRay(
      ray,
      1000,
      true,
      this.physics.rapier.QueryFilterFlags.EXCLUDE_DYNAMIC,
      undefined,
      this.collider,
      this.rigidBody
    );
  
    if (groundUnderFootHit) {
      const hitPoint = ray.pointAt(groundUnderFootHit.toi);
      const distance = rayOrigin.y - hitPoint.y;
  
      if (distance <= 0) {
        // * Grounded
        this.isFalling = false;
      } else {
        this.isFalling = true;
      }
    }
  }
  
  loop() {
    delta = clock.getDelta();
    // this.detectGround();
    // Initialize movement vector based on input values
    const movement = new THREE.Vector3();
    if (this.forward) {
      movement.z -= 1;
    }
    if (this.backward) {
      movement.z += 1;
    }
    if (this.left) {
      movement.x -= 1;
    }
    if (this.right) {
      movement.x += 1;
    }
    if (this.jump && !this.isFalling) {
      velocity_y = 8;
      movement.y += velocity_y * delta;
    }
    if (this.isFalling) {
      velocity_y -= 9.8 * 2 * delta;
      movement.y += velocity_y * delta;
    }
    if (!this.isFalling && !this.jump) {
      // Apply a constant downward force when not jumping or falling
      movement.y = -0.1;
    }

    // Rotate character based on movement vector
    if (movement.x !== 0 || movement.z !== 0) {
      const angle = Math.atan2(movement.x, movement.z) + Math.PI;
      const characterRotation = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        angle
      );
      this.character.quaternion.slerp(characterRotation, 0.1);
    }

    // Normalize and scale movement vector and set y component to -1
    movement.normalize().multiplyScalar(0.1);
    // movement.y = -1;

    // Update collider movement and get new position of rigid body
    this.characterController.computeColliderMovement(this.collider, movement);

    const newPosition = new THREE.Vector3()
      .copy(this.rigidBody.translation())
      .add(this.characterController.computedMovement());

    // Set next kinematic translation of rigid body and update character position
    this.rigidBody.setNextKinematicTranslation(newPosition);
    this.character.position.lerp(this.rigidBody.translation(), 0.25);
  }
}
