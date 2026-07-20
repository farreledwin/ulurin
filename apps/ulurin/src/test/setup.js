import "@testing-library/jest-dom/vitest";

// Node-environment test files (the api/* server handlers) share this global
// setup but have no `window`; only stub it where the DOM exists.
if (typeof window !== "undefined") {
  Object.defineProperty(window, "scrollTo", {
    configurable: true,
    value: () => {},
  });
}
