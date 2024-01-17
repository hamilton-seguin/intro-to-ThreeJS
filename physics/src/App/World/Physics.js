import * as THREE from "three";
import App from "../App.js";
import { appStateStore } from "../Utils/Store.js";

export default class Physics {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;

    this.meshMap = new Map();

    import("@dimforge/rapier3d").then((RAPIER) => {
      const gravity = { x: 0.0, y: -9.81, z: 0.0 };
      this.world = new RAPIER.World(gravity);
      this.rapier = RAPIER;

      // create my object and mesh - Threejs

      // create my rigid body - Rapier

      this.rapierLoaded = true;
      appStateStore.setState({ physicsReady: true });
    });
  }

  add(mesh, type, collider) {

    // Define the rigid body
    let rigidBodyType;
    if (type === "dynamic") {
      rigidBodyType = this.rapier.RigidBodyDesc.dynamic();
    } else if (type === "fixed") {
      rigidBodyType = this.rapier.RigidBodyDesc.fixed();
    }
    this.rigidBody = this.world.createRigidBody(rigidBodyType);

    let colliderType;
    switch (collider) {
        case "cuboid":
            const dimensions = this.computeCuboidDimensions(mesh);
            colliderType = this.rapier.ColliderDesc.cuboid(
              dimensions.x / 2,
              dimensions.y / 2,
              dimensions.z / 2
            );
            this.world.createCollider(colliderType, this.rigidBody);
            break;
        case "ball":
            const radius = this.computeBallDimensions(mesh);
            colliderType = this.rapier.ColliderDesc.ball(radius);
            this.world.createCollider(colliderType, this.rigidBody);
            break;
        case "trimesh":
            this.addTrimesh(mesh);
            break;
    }

    // Define the collider type


    // Set the rigidBody position and rotation
    const worldPosition = mesh.getWorldPosition(new THREE.Vector3());
    const worldRotation = mesh.getWorldQuaternion(new THREE.Quaternion());
    this.rigidBody.setTranslation(worldPosition);
    this.rigidBody.setRotation(worldRotation);
    this.meshMap.set(mesh, this.rigidBody);
  }

  computeCuboidDimensions(mesh) {
    // auto compute collider dimensions
    mesh.geometry.computeBoundingBox();
    const size = mesh.geometry.boundingBox.getSize(new THREE.Vector3());
    const worldScale = mesh.getWorldScale(new THREE.Vector3());
    size.multiply(worldScale);
    return size;
  }

  computeBallDimensions(mesh) {
    // auto compute collider dimensions
    mesh.geometry.computeBoundingSphere();
    const radius = mesh.geometry.boundingSphere.radius;
    const worldScale = mesh.getWorldScale(new THREE.Vector3());
    const maxScale = Math.max(worldScale.x, worldScale.y, worldScale.z);
    return radius * maxScale;
  }

  loop() {
    if (!this.rapierLoaded) return;
    this.world.step();

    this.meshMap.forEach((rigidBody, mesh) => {
      const position = new THREE.Vector3().copy(rigidBody.translation());
      const rotation = new THREE.Quaternion().copy(rigidBody.rotation());

      mesh.parent.worldToLocal(position);
      // or
      // position.applyMatrix4( new THREE.Matrix4().copy(mesh.parent.matrixWorld).invert());

      const inverseParentMatrix = new THREE.Matrix4()
        .extractRotation(mesh.parent.matrixWorld)
        .invert();
      const inverseParentRotation =
        new THREE.Quaternion().setFromRotationMatrix(inverseParentMatrix);
      rotation.premultiply(inverseParentRotation);

      mesh.position.copy(position);
      mesh.quaternion.copy(rotation);
    });
  }
}
