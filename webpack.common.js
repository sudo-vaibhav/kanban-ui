const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    board: './src/board/board.js',
    index: './src/index.js',
    main: './src/main.js',
  },

  module: {
    rules: [
      {
        test: /\.(svg|png|jpe?g|gif|mp3)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets',
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/src/index.ejs'),
      filename: path.join(__dirname, '/dist/index.html'),
      chunks: ['index', 'main'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/src/board/index.ejs'),
      filename: path.join(__dirname, '/dist/board/index.html'),
      chunk: ['board', 'main'],
    }),
  ],
};
