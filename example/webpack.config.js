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
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat'
    }
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
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
  ],
  devtool: mode === 'development' ? 'eval-source-map' : 'source-map'
};