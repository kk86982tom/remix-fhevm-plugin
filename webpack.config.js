const path = require('path');

module.exports = {
  entry: './src/plugin.ts',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  mode: 'development', // TODO: production mode for production build
  devtool: 'source-map',
  target: 'web',
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  node: {
    fs: false,
    path: false,
    crypto: false,
    os: false,
    stream: false,
    buffer: false
  }
};