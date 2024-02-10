export default class ModalManager {
  constructor() {
    this.modal = document.getElementById("myModal");
    this.close = document.getElementsByClassName("close")[0];
    this.close.onclick = () => {
      this.closeModal();
    };
  }

  openModal(title, description) {
    document.getElementById("modalTitle").innerHTML = title;
    document.getElementById("modalDescription").innerHTML = description;
    this.modal.classList.remove("fadeOut");
    this.modal.classList.add("fadeIn");
    this.modal.style.display = "block";
    this.modal.style.opacity = 1;
  }

  closeModal() {
    this.modal.classList.remove("fadeIn");
    this.modal.classList.add("fadeOut");
    setTimeout(() => {
      this.modal.style.display = "none";
    }, 600);
    this.modal.style.opacity = 0;
  }
}
