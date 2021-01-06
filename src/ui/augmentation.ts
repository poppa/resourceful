export {}

declare global {
  interface NodeModule {
    hot: { accept(fn: () => void): unknown }
  }
}
