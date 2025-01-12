import * as THREE from 'three'
import App from '../App.js'

import Stats from 'stats.js'

let stats = new Stats()
stats.showPanel(0)

export default class Loop {
  constructor() {
    this.app = new App()
    this.pane = this.app.gui.pane
    this.camera = this.app.camera
    this.renderer = this.app.renderer
    this.world = this.app.world

    this.clock = new THREE.Clock()
    this.previousElapsedTime = 0
    this.isStatsActive = false
    this.loop()
    this.addGUI()
  }

  addGUI() {
    const loopFolder = this.pane.addFolder({
      title: 'Stats',
      expanded: false,
    })
    const btn = loopFolder.addButton({ title: 'Toggle Stats' })
    btn.on('click', () => {
      this.toggleStats()
    })
  }

  toggleStats() {
    if (this.isStatsActive) {
      document.body.removeChild(stats.dom) // Remove stats from DOM
    } else {
      document.body.appendChild(stats.dom) // Add stats to DOM
    }
    this.isStatsActive = !this.isStatsActive // Toggle the flag
  }

  loop() {
    stats.begin()
    const elapsedTime = this.clock.getElapsedTime()
    const deltaTime = elapsedTime - this.previousElapsedTime
    this.previousElapsedTime = elapsedTime

    this.world.loop(deltaTime, elapsedTime)
    this.camera.loop(deltaTime)
    this.renderer.loop()
    window.requestAnimationFrame(() => this.loop())
    stats.end()
  }
}
