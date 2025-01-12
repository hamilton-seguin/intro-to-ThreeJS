import * as THREE from 'three'

import App from '../App'
import { inputStore } from '../Utils/Store'
import { appStateStore } from '../Utils/Store'

export default class AnimationController {
  constructor() {
    this.app = new App()
    this.scene = this.app.scene
    this.avatar = this.app.world.character.avatar

    inputStore.subscribe((input) => this.onInput(input))
    appStateStore.subscribe((state) => {
      const wasFalling = this.isFalling
      this.isFalling = state.isFalling

      if (wasFalling && !this.isFalling) {
        this.onLand()
      }
    })

    this.instantiateAnimations()
    this.isJumping = false
    this.lastInput = {}
  }

  instantiateAnimations() {
    this.animations = new Map()
    this.mixer = new THREE.AnimationMixer(this.avatar.scene)

    this.avatar.animations.forEach((clip) => {
      this.animations.set(clip.name, this.mixer.clipAction(clip))
    })

    this.currentAction = this.animations.get('Idle')
    this.currentAction.play()
  }

  playAnimation(name) {
    if (this.currentAction === this.animations.get(name)) return
    const action = this.animations.get(name)
    action.reset()
    action.play()
    action.crossFadeFrom(this.currentAction, 0.2)
    this.currentAction = action
  }

  onInput(input) {
    this.lastInput = input

    // Prevent any animation changes while jumping
    if (this.isJumping) return

    // Handle jump input
    if (input.jump && !this.isFalling) {
      this.onJump()
      return
    }

    // Handle other inputs
    this.updateAnimationBasedOnInput(input)
  }

  onJump() {
    this.isJumping = true
    this.playAnimation('Jumping')
  }

  onLand() {
    if (this.isJumping) {
      this.isJumping = false // Reset jump state
      this.updateAnimationBasedOnInput(this.lastInput) // Play the appropriate animation
    }
  }

  updateAnimationBasedOnInput(input = {}) {
    if (input.forward || input.backward || input.left || input.right) {
      this.playAnimation('Running')
    } else if (input.extra) {
      this.animations.get('Dancing')
        ? this.playAnimation('Dancing')
        : this.playAnimation('Idle-Hand')
    } else {
      this.playAnimation('Idle')
    }
  }

  loop(deltaTime) {
    if (this.mixer) this.mixer.update(deltaTime)
  }
}
