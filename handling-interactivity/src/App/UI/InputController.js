import { inputStore } from '../Utils/Store'

export default class InputController {
  constructor() {
    this.startListening()
    this.inputStore = inputStore
    this.keyPressed = {}
    this.setupButtonListeners()
  }

  startListening() {
    window.addEventListener('keydown', (event) => this.onKeyDown(event))
    window.addEventListener('keyup', (event) => this.onKeyUp(event))
  }

  // Add event listeners to the on-screen buttons
  setupButtonListeners() {
    const buttons = {
      T: 'ArrowUp',
      L: 'ArrowLeft',
      B: 'ArrowDown',
      R: 'ArrowRight',
    }

    Object.keys(buttons).forEach((buttonId) => {
      const buttonElement = document.getElementById(buttonId)

      if (buttonElement) {
        buttonElement.addEventListener(
          'touchstart',
          () => this.onKeyDown({ code: buttons[buttonId] }),
          { passive: true }
        )

        buttonElement.addEventListener(
          'touchend',
          () => this.onKeyUp({ code: buttons[buttonId] }),
          { passive: true }
        )

        // Mouse events for desktop
        buttonElement.addEventListener('mousedown', () =>
          this.onKeyDown({ code: buttons[buttonId] })
        )
        buttonElement.addEventListener('mouseup', () =>
          this.onKeyUp({ code: buttons[buttonId] })
        )
      }
    })
  }

  onKeyDown(event) {
    if (this.keyPressed[event.code]) return
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        inputStore.setState({ forward: true })
        break
      case 'KeyQ':
      case 'ArrowLeft':
        inputStore.setState({ left: true })
        break
      case 'KeyS':
      case 'ArrowDown':
        inputStore.setState({ backward: true })
        break
      case 'KeyE':
      case 'ArrowRight':
        inputStore.setState({ right: true })
        break
      case 'KeyF':
        inputStore.setState({ extra: true })
        break
      case 'Space':
        inputStore.setState({ jump: true })
        break
    }
    this.keyPressed[event.code] = true
    // jump is after the key pressed to avoid double jump
    switch (event.code) {
      case 'Space':
        inputStore.setState({ jump: true })
        break
    }
  }

  onKeyUp(event) {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        inputStore.setState({ forward: false })
        break
      case 'KeyQ':
      case 'ArrowLeft':
        inputStore.setState({ left: false })
        break
      case 'KeyS':
      case 'ArrowDown':
        inputStore.setState({ backward: false })
        break
      case 'KeyE':
      case 'ArrowRight':
        inputStore.setState({ right: false })
        break
      case 'KeyF':
        inputStore.setState({ extra: false })
        break
    }
    this.keyPressed[event.code] = false
    switch (event.code) {
      case 'Space':
        inputStore.setState({ jump: false })
        break
    }
  }
}
