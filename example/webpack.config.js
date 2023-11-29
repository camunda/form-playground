const path = require('path');

const webpack = require('webpack');

const CopyPlugin = require('copy-webpack-plugin');

// get git info from command line
const branchName = require('child_process')
  .execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();

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
        { from: 'assets/**/*', context: '../dist' },
        { from: '@ibm/plex/{css/ibm-plex.min.css,{IBM-Plex-Sans,IBM-Plex-Mono}/fonts/{complete,split}/woff2/**}', context: '../node_modules', to: './vendor' },
      ],
    }),
    new webpack.DefinePlugin({
      'process.env.BRANCH_NAME': JSON.stringify(branchName)
    })
  ],
  devtool: mode === 'development' ? 'eval-source-map' : 'source-map'
};