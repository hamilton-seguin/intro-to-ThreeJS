import { createStore } from 'zustand/vanilla'

export const sizesStore = createStore(() => ({
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
}))

export const appStateStore = createStore(() => ({
  physicsReady: false,
  assetsReady: false,
  characterReady: false,
  isFalling: false,
}))

export const inputStore = createStore(() => ({
  forward: false,
  backward: false,
  left: false,
  right: false,
  extra: false,
  jump: false,
}))
