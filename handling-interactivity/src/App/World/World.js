import * as THREE from 'three'

import App from '../App.js'
import Physics from './Physics.js'
import Environment from './Environment.js'
import Character from './Character.js'
import CharacterController from './CharacterController.js'
import AnimationController from './AnimationController.js'

import { appStateStore } from '../Utils/Store.js'

export default class World {
  constructor() {
    this.app = new App()
    this.scene = this.app.scene

    this.physics = new Physics()

    // create world classes
    const unsub = appStateStore.subscribe((state) => {
      if (state.physicsReady && state.assetsReady) {
        this.environment = new Environment()
        unsub()
      }
    })

    this.loop()
  }

  setCharacter(avatar) {
    this.character = new Character(avatar)
    this.characterController = new CharacterController()
    this.animationController = new AnimationController()
    appStateStore.setState({ characterReady: true })
  }

  loop(deltaTime, elapsedTime) {
    this.physics.loop()
    if (this.environment) this.environment.loop()
    if (this.characterController) this.characterController.loop()
    if (this.animationController) this.animationController.loop(deltaTime)
  }
}
