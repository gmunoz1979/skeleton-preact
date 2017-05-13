const path              = require('path');
const webpack           = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('babel-polyfill');

const plugins = [];

const NODE_ENV      = process.env.NODE_ENV;
const ISPRODUCTION  = NODE_ENV === 'production';
const ISDEVELOPMENT = NODE_ENV === 'development';

if (ISDEVELOPMENT) {
  plugins.push(new HtmlWebpackPlugin({
    template: path.resolve('src', 'templates', 'default.html')
  }));

  const browserSync = {};

  browserSync.host = 'localhost';
  browserSync.port = 3000;
  browserSync.server = { baseDir: ['www'] };

  plugins.push(new webpack.NoEmitOnErrorsPlugin());
  plugins.push(new BrowserSyncPlugin(browserSync));
}

plugins.push(new ExtractTextPlugin('css/[name].css'));

ISPRODUCTION &&
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      screw_ie8: true,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true,
    },
    output: {
      comments: false,
    },
  }));

const file_entry  = ISPRODUCTION ? 'js/index.js' : 'test/index.jsx';
const path_output = ISPRODUCTION ? './dist' : './www';

const entry = [];
ISDEVELOPMENT && entry.push('babel-polyfill');
entry.push(path.resolve(__dirname, 'src', file_entry));

const output = {
  path: path.resolve(__dirname, path_output),
  publicPath: '/',
  filename: 'js/skeleton-preact.js',
  sourceMapFilename: '[file].map',
};

if (ISPRODUCTION) {
  output.library = 'migtra-user-cognito';
  output.libraryTarget = 'commonjs2';
}

const config = {
  entry: entry,
  output: output,
  devtool: ISPRODUCTION ? 'eval' : 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        use: 'source-map-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: [
          'babel-loader',
          'eslint-loader',
        ]
      },
      {
        test: /\.(scss|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader?sourceMap',
            'sass-loader?sourceMap'
          ]
        })
      },
      {
        test: /\.(woff2?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?limit=1024&name=./fonts/[name].[ext]'
      },
      {
        test: /\.(jpe?g|png)$/,
        loader: 'file-loader?limit=1024&name=./images/[name].[ext]'
      }
    ]
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.jsx']
  }
};

module.exports = config;
