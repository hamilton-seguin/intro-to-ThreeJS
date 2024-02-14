export default class ModalManager {
  constructor() {
    this.modal = document.getElementById("modal");
    this.close = document.getElementsByClassName("close")[0];
    this.description = document.getElementById("modalDescription");
    this.img = document.getElementById("modalImg");
    this.restartCallback = null; // Add a property to store the restart callback

    this.close.onclick = () => {
      if (this.restartCallback) {
        this.restartCallback();
        this.restartCallback = null;
      }
      this.closeModal();
    };
  }

  openModal(title, description, imgPath, typeDeath, restartCallback) {
    document.getElementById("modalTitle").innerHTML = title;
    description
      ? (this.description.innerHTML = description)
      : (this.description.innerHTML = null);
    imgPath ? (this.img.src = imgPath) : (this.img.src = null);
    if (typeDeath && restartCallback) {
      this.close.innerHTML = "Restart";
      this.restartCallback = restartCallback; // Store the callback
    } else {
      this.close.innerHTML = "Close";
      this.restartCallback = null; // Clear the callback if not applicable
    }

    this.modal.classList.add("visible");
  }

  closeModal() {
    this.modal.classList.remove("visible");
  }
}
