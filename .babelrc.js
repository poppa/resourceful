module.exports = {
  presets: ['es2019', 'react-app'].map(require.resolve),
  plugins: ['transform-runtime', 'react-hot-loader/babel'],
}
