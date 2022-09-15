const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  watch: mode === 'development',
  entry: './src/app.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: '*.html', context: 'src', to: '.' },
        { from: '@camunda/form-playground/dist/assets/**/*', context: 'node_modules', to: './vendor' },
        { from: '@ibm/plex/{css/ibm-plex.min.css,IBM-Plex-Sans/fonts/{complete,split}/woff2/**}', context: 'node_modules', to: './vendor' }

      ],
    }),
  ],
  devtool: mode === 'development' ? 'eval-source-map' : 'source-map'
};