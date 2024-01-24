import { createStore } from "zustand/vanilla";

const assetsToLoad = [
  {
    id: "hAvatar",
    path: "/models/h-avatar.glb",
    type: "model",
  },
  {
    id: "mAvatar",
    path: "/models/m-avatar.glb",
    type: "model",
  },
];

const assetStore = createStore((set) => ({
  assetsToLoad,
  loadedAssets: {},
  addLoadedAsset: (asset, id) =>
    set((state) => ({
      loadedAssets: {
        ...state.loadedAssets,
        [id]: asset,
      },
    })),
}));

export default assetStore;
