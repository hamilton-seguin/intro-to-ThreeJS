import * as THREE from 'three'

import App from '../App.js'
import { inputStore } from '../Utils/Store.js'
import { appStateStore } from '../Utils/Store.js'
import ModalManager from '../UI/ModalManager.js'

const clock = new THREE.Clock()
const GRAVITY = 9.8
let velocity_y = 0
let delta = 0
let alreadyDead = false

export default class CharacterController {
  constructor() {
    // Initialize app, scene, physics, and character properties
    this.app = new App()
    this.pane = this.app.gui.pane
    this.scene = this.app.scene
    this.physics = this.app.world.physics
    this.character = this.app.world.character.instance
    this.character.name = 'character-collider-box'
    this.modalManager = new ModalManager()

    appStateStore.subscribe((state) => {
      this.isFalling = state.isFalling
    })
    this.canJump = true
    this.jumpReleased = true

    // Subscribe to input store and update movement values
    inputStore.subscribe((state) => {
      this.forward = state.forward
      this.backward = state.backward
      this.left = state.left
      this.right = state.right
      this.jump = state.jump
      if (!state.jump) this.jumpReleased = true
    })

    // Instantiate controller and create rigid body and collider
    this.instantiateController()

    // Init ray helper
    this.addGUI()
    this.rayHelperEnabled = false

    this.eventQueue = new this.physics.rapier.EventQueue(true)
  }

  /**
   * Instantiate the character controller, rigid body, and collider.
   */
  instantiateController() {
    // Create a kinematic rigid body
    this.rigidBodyType =
      this.physics.rapier.RigidBodyDesc.kinematicPositionBased()
    this.rigidBody = this.physics.world.createRigidBody(this.rigidBodyType)

    // Create a cuboid collider
    this.colliderType = this.physics.rapier.ColliderDesc.cuboid(0.3, 1, 0.3)
      .setActiveEvents(this.physics.rapier.ActiveEvents.COLLISION_EVENTS)
      .setActiveCollisionTypes(
        this.physics.rapier.ActiveCollisionTypes.DEFAULT |
          this.physics.rapier.ActiveCollisionTypes.KINEMATIC_FIXED
      )
    this.collider = this.physics.world.createCollider(
      this.colliderType,
      this.rigidBody
    )
    // Set rigid body position to character position
    const worldPosition = this.character.getWorldPosition(new THREE.Vector3())
    const worldRotation = this.character.getWorldQuaternion(
      new THREE.Quaternion()
    )
    this.rigidBody.setTranslation(worldPosition)
    this.rigidBody.setRotation(worldRotation)

    // Create character controller, set properties, and enable autostepping
    this.characterController =
      this.physics.world.createCharacterController(0.01)
    this.characterController.setApplyImpulsesToDynamicBodies(true)
    this.characterController.enableAutostep(0.55, 0.45, false)
    this.characterController.enableSnapToGround(1)
  }

  detectGround() {
    const avatarHalfHeight = this.character.geometry.parameters.height / 2
    // set collider position
    const colliderPosition = new THREE.Vector3().copy(this.character.position)
    this.collider.setTranslation(colliderPosition)

    const rayDirection = new THREE.Vector3(0, -1, 0)
    // hitting the ground
    const rayOrigin = new THREE.Vector3().copy(this.character.position)
    // ray origin is slightly above the foot of the avatar
    rayOrigin.y -= avatarHalfHeight - 0.1

    if (this.rayHelperEnabled) {
      const rayHelper = new THREE.ArrowHelper(
        rayDirection,
        rayOrigin,
        10,
        0xff0000
      )
      this.scene.add(rayHelper)
    }

    const ray = new this.physics.rapier.Ray(rayOrigin, rayDirection)

    const groundUnderFootHit = this.physics.world.castRay(
      ray,
      100,
      true,
      this.physics.rapier.QueryFilterFlags.EXCLUDE_DYNAMIC,
      undefined,
      this.collider,
      this.rigidBody
    )

    if (groundUnderFootHit) {
      const hitPoint = ray.pointAt(groundUnderFootHit.toi)
      const distance = rayOrigin.y - hitPoint.y

      // Check if grounded based on distance and velocity
      const isGrounded = distance < 0.2 && velocity_y <= 0
      appStateStore.setState({ isFalling: !isGrounded })
      this.canJump = isGrounded

      if (isGrounded) {
        velocity_y = 0 // Reset velocity only if grounded
      }
    } else {
      // No ground detected
      appStateStore.setState({ isFalling: true })
      this.canJump = false
    }

    return this.isFalling
  }

  calculateJumpVelocity() {
    const jumpHeight = 1.2 // Desired jump height in units
    return Math.sqrt(2 * GRAVITY * jumpHeight) // Simplified jump velocity calculation
  }

  resetCharacter() {
    this.character.position.set(0, 10, 0)
    this.rigidBody.setTranslation({ x: 0, y: 10, z: 0 })
    velocity_y = 0
    appStateStore.setState({ isFalling: false })
    this.canJump = true
    alreadyDead = false
  }

  updateCharacterRotation(movement) {
    if (movement.x !== 0 || movement.z !== 0) {
      const angle = Math.atan2(movement.x, movement.z) + Math.PI

      // Only update the character's model rotation, not the global rotation
      const characterRotation = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        angle
      )
      this.character.quaternion.slerp(characterRotation, 0.1)
    }
  }

  applyMovement(movement) {
    // Update collider movement and get new position of rigid body
    this.characterController.computeColliderMovement(this.collider, movement)

    movement.y += velocity_y * delta * 2.5
    if (this.isFalling) {
    }

    const newPosition = new THREE.Vector3()
      .copy(this.rigidBody.translation())
      .add(this.characterController.computedMovement())

    // Update the kinematic rigid body to use the calculated position
    this.physics.updateKinematicBody(this.rigidBody, newPosition)

    // Smoothly update the character's position in the scene
    this.character.position.lerp(newPosition, 0.35)

    // Update rotation if there is horizontal movement
    if (movement.x !== 0 || movement.z !== 0) {
      const angle = Math.atan2(movement.x, movement.z) + Math.PI
      const characterRotation = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        angle
      )
      this.character.quaternion.slerp(characterRotation, 0.1)
    }

    // Save the last known position for potential reset logic
    this.lastPosition = this.character.getWorldPosition(new THREE.Vector3())
  }

  addGUI() {
    const rayHelperFolder = this.pane.addFolder({
      title: 'RayHelper',
      expanded: false,
    })
    const enabled = { toggle: false }
    rayHelperFolder.addBinding(enabled, 'toggle').on('change', () => {
      this.rayHelperEnabled = !this.rayHelperEnabled
    })
    rayHelperFolder.addButton({ title: 'reset' }).on('click', () => {
      const arrowHelpers = this.scene.children.filter(
        (element) => element instanceof THREE.ArrowHelper
      )
      arrowHelpers.forEach((arrowHelper) => {
        this.scene.remove(arrowHelper)
      })
    })
  }

  loop() {
    delta = clock.getDelta()
    this.detectGround()
    this.physics.world.step(this.eventQueue) // Step the world with the event queue

    this.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      let characterColliderHandle = this.collider.handle // Assuming you have a way to get your character's collider handle
      if (
        (handle1 === characterColliderHandle ||
          handle2 === characterColliderHandle) &&
        started
      ) {
        appStateStore.setState({ isFalling: false }) // Character has made contact with the ground
        this.canJump = true // Allow jumping again
        velocity_y = 0 // Reset the vertical velocity
      }
    })

    // Initialize movement vector based on input values
    const movement = new THREE.Vector3()
    if (this.forward) {
      movement.z -= 1
    }
    if (this.backward) {
      movement.z += 1
    }
    if (this.left) {
      movement.x -= 1
    }
    if (this.right) {
      movement.x += 1
    }

    if (this.jump && this.canJump && !this.isFalling && this.jumpReleased) {
      velocity_y = this.calculateJumpVelocity() // Calculate the initial jump velocity
      this.canJump = false
      this.jumpReleased = false
      appStateStore.setState({ isFalling: true })
    } else if (!this.jump && movement.y < 0.05) {
      this.jumpReleased = true
      this.canJump = true // Reset jump capability when spacebar released
    }

    if (this.isFalling) {
      velocity_y -= GRAVITY * delta
    }
    movement.y += velocity_y * delta
    this.characterController.computeColliderMovement(this.collider, movement)

    const horizontalMovement = new THREE.Vector3(movement.x, 0, movement.z)
      .normalize()
      .multiplyScalar(0.1)
    const finalMovement = new THREE.Vector3(
      horizontalMovement.x,
      movement.y,
      horizontalMovement.z
    )

    if (movement.x !== 0 || movement.z !== 0) {
      this.updateCharacterRotation(movement)
    }
    this.applyMovement(finalMovement)

    if (this.character.position.y < -70 && !alreadyDead) {
      this.modalManager.openModal(
        'Game Over',
        null,
        '/image/you-ded.webp',
        true,
        this.resetCharacter.bind(this)
      )
      alreadyDead = true
    }
  }
}
