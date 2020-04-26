export {}

declare global {
  interface NodeModule {
    hot: { accept: Function }
  }
}
