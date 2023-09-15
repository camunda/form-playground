const path = require('path');

const {
  NormalModuleReplacementPlugin
} = require('webpack');

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
        { from: 'assets/**/*', context: '../dist' },
        { from: '@ibm/plex/{css/ibm-plex.min.css,{IBM-Plex-Sans,IBM-Plex-Mono}/fonts/{complete,split}/woff2/**}', context: '../node_modules', to: './vendor' },
      ],
    }),
    new NormalModuleReplacementPlugin(
      /^(..\/preact|preact)(\/[^/]+)?$/,
      function(resource) {

        const replMap = {
          'preact/hooks': path.resolve('../node_modules/preact/hooks/dist/hooks.module.js'),
          'preact/jsx-runtime': path.resolve('../node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js'),
          'preact': path.resolve('../node_modules/preact/dist/preact.module.js'),
          '../preact/hooks': path.resolve('../node_modules/preact/hooks/dist/hooks.module.js'),
          '../preact/jsx-runtime': path.resolve('../node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js'),
          '../preact': path.resolve('../node_modules/preact/dist/preact.module.js')
        };

        const replacement = replMap[resource.request];

        if (!replacement) {
          return;
        }

        resource.request = replacement;
      }
    )
  ],
  devtool: mode === 'development' ? 'eval-source-map' : 'source-map'
};