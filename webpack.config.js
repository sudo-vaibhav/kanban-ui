const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    board: './src/board/board.js',
    index: './src/index.js',
    main: './src/main.js',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader', //3. Inject styles into DOM
          'css-loader', //2. Turns css into commonjs
          'sass-loader', //1. Turns sass into css
        ],
      },
      {
        test: /\.(svg|png|jpe?g|gif)$/,
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
  //   resolve: {
  //     extensions: ['.tsx', '.ts', '.js'],
  //   },
  //   output: {
  //     filename: 'bundle.js',
  //     path: path.resolve(__dirname, 'dist'),
  //   },
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
