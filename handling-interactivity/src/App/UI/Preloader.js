import assetStore from "../Utils/AssetStore.js";
import { appStateStore } from "../Utils/Store.js";
import App from "../App.js";

export default class Preloader {
  constructor() {
    this.assetStore = assetStore;
    this.app = new App();

    // access to DOM elements
    this.overlay = document.querySelector(".overlay");
    this.loading = document.querySelector(".loading");
    this.startButton = document.querySelector(".start");
    this.hAvatar = document.getElementById("hAvatar");
    this.mAvatar = document.getElementById("mAvatar");

    this.assetStore.subscribe((state) => {
      this.numberOfLoadedAssets = Object.keys(state.loadedAssets).length;
      this.numberOfAssetsToLoad = state.assetsToLoad.length;
      this.progress = this.numberOfLoadedAssets / this.numberOfAssetsToLoad;
      this.progress = Math.trunc(this.progress * 100);
      document.getElementById("progressPercentage").innerHTML = this.progress;

      if (this.progress === 100) {
        appStateStore.setState({ assetsReady: true });
        this.loading.classList.add("fade");
        window.setTimeout(() => this.ready(), 1200);
      }
    });
  }

  ready() {
    this.loading.remove();

    this.startButton.style.display = "inline";
    this.startButton.classList.add("fadeIn");

    const hAvatarClickHandler = () => {
      this.mAvatar.removeEventListener("click", mAvatarClickHandler);
      this.app.world.setCharacter("hAvatar");
      this.removeOverlay();
      console.log(this.app.world);
    };

    const mAvatarClickHandler = () => {
      this.hAvatar.removeEventListener("click", hAvatarClickHandler);
      this.app.world.setCharacter("mAvatar");
      this.removeOverlay();
    };

    this.hAvatar.addEventListener("click", hAvatarClickHandler, { once: true });
    this.mAvatar.addEventListener("click", mAvatarClickHandler, { once: true });
  }

  removeOverlay() {
    this.overlay.classList.add("fade");
    this.startButton.classList.add("fadeOut");

    window.setTimeout(() => {
      this.overlay.remove();
      this.startButton.remove();
      this.hAvatar.remove();
      this.mAvatar.remove();
    }, 2000);
  }
}
