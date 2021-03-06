const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const extractSCSS = new ExtractTextPlugin({
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
      // CSS loader
      {
          test: /\.css$/,
          // include: /node_modules/,
          loader:  'style-loader!css-loader'
      },
      //sass-loader
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, 'src', 'assets', 'scss')],
        use: extractSCSS.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader', // Run post css actions
              options: {
                sourceMap: true,
                plugins: function () { // post css plugins, can be exported to postcss.config.js
                  return [
                    // require('precss'),
                    require('autoprefixer')
                  ];
                }
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
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
           name: '[name].[ext]',
           outputPath: './assets/fonts/',
           publicPath: '/'
          }
        }]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    extractSCSS,
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
