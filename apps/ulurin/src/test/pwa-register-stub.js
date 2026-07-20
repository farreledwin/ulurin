// Pengganti "virtual:pwa-register/react" waktu vitest jalan — vitest tidak bisa
// resolve id virtual milik vite-plugin-pwa. Bentuknya sama dengan versi dev
// plugin (client/dev/react.js), plus dua kait supaya test bisa memancing
// prompt "versi baru" tanpa service worker sungguhan (tidak ada di jsdom).
export const swMock = {
  updateServiceWorker: () => {},
  needRefresh: () => {},
};

export function useRegisterSW(options = {}) {
  swMock.needRefresh = () => options.onNeedRefresh?.();
  return {
    needRefresh: [false, () => {}],
    offlineReady: [false, () => {}],
    updateServiceWorker: (...args) => swMock.updateServiceWorker(...args),
  };
}
