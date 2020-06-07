module.exports = {
  presets: ['es2019', 'react-app'].map(require.resolve),
  plugins: [
    'babel-polyfill',
    'transform-runtime',
    'react-hot-loader/babel',
    'inline-react-svg',
  ],
}
