const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/render.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'render.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader')
        }
      },
      {
        test: /\.svg$/,
        use: 'raw-loader'
      }
    ]
  },
  devtool: 'cheap-module-source-map'
};