const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const extractPlugin = new ExtractTextPlugin({
  filename: './assets/css/app.css'
});

const config = {
  context: path.resolve(__dirname, 'src'),

  entry: {
    app: './app.js',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "./assets/js/[name].bundle.js",
  },

  module: {
    rules: [
      //babel-loader
      {
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['env']
          }
        }
      },
      //html-loader
      { test: /\.html$/, use: ['html-loader'] },
      //sass-loader
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, 'src', 'assets', 'scss')],
        use: extractPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ],
          fallback: 'style-loader'
        })
      },
      //file-loader(for images)
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: './assets/media/'
            }
          }
        ]
      },
      //file-loader(for fonts)
      {
        test: /\.(woff|woff2|eot|ttff|otf)$/,
        use: ['file-loader']
      }

    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    extractPlugin
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist/assets/media'),
    compress: true,
    port: 12000,
    stats: 'errors-only',
    open: true,
  },
  devtool: 'inline-source-map',

}

module.exports = config;
