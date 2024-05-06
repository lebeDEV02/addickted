const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
      },
      {
        test: /\.(pdf|jpg|png|gif|svg|ico)$/,
        use: [
          {
            loader: 'url-loader'
          },
        ]
      },
      {  
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader"
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.[contenthash].js' // Random name for JS file
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].css' // Random name for CSS file
    })
  ],
  devServer: {
    allowedHosts: "all",
    static: {
      directory: path.join(__dirname, 'dist')
    },
    historyApiFallback: true,
  }
};
