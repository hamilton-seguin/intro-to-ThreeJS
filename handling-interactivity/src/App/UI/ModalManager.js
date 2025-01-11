export default class ModalManager {
  constructor() {
    this.modal = document.getElementById('modal')
    this.close = document.getElementsByClassName('close')[0]
    this.description = document.getElementById('modalDescription')
    this.img = document.getElementById('modalImg')
    this.restartCallback = null // Add a property to store the restart callback

    this.close.onclick = () => {
      if (this.restartCallback) {
        this.restartCallback()
        this.restartCallback = null
      }
      this.closeModal()
    }

    // Add event listener for Escape key
    this.handleKeyDown = this.handleKeyDown.bind(this) // Bind the method to the class
    document.addEventListener('keydown', this.handleKeyDown)
  }

  openModal(title, description, imgPath, typeDeath, restartCallback) {
    document.getElementById('modalTitle').innerHTML = title
    this.description.innerHTML = description || ''
    this.img.src = imgPath || ''

    if (typeDeath && restartCallback) {
      this.close.innerHTML = 'Restart'
      this.restartCallback = restartCallback // Store the callback
    } else {
      this.close.innerHTML = 'Close'
      this.restartCallback = null // Clear the callback if not applicable
    }

    this.modal.classList.add('visible')
  }

  closeModal() {
    this.modal.classList.remove('visible')
  }

  // Handle Escape Key
  handleKeyDown(event) {
    if (event.key === 'Escape' && this.modal.classList.contains('visible')) {
      if (this.restartCallback) {
        this.restartCallback()
        this.restartCallback = null
      }
      this.closeModal()
    }
  }

  // Clean up event listener when not needed
  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }
}
