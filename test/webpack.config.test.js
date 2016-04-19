import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import precss from 'precss';

const ROOT_FOLDER_PATH = path.join(__dirname, '../');
const ASSETS_FOLDER_NAME = 'assets';
const SRC_FOLDER_PATH = path.join(ROOT_FOLDER_PATH, 'src');

export default {
  devtool: 'inline-source-map',
  eslint: {
    failOnError: false,
    emitWarning: true,
  },
  module: {
    loaders: [
      {
        test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|woff)$/,
        loader: `url-loader?limit=8192&name=${ASSETS_FOLDER_NAME}/[path][name]--[hash].[ext]`,
      },
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: path.join(__dirname, '../'),
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
    noParse: [
      /node_modules\/sinon/,
    ],
    postcss: [
      autoprefixer, precss,
    ],
    preLoaders: [
      {
        test: /\.js$/,
        include: SRC_FOLDER_PATH,
        loader: 'eslint-loader',
      },
    ],
    resolve: {
      extensions: ['', '.js', '.json'],
      fallback: path.join(ROOT_FOLDER_PATH, 'node_modules'),
      modulesDirectories: [SRC_FOLDER_PATH, ASSETS_FOLDER_NAME, 'node_modules'],
      root: ROOT_FOLDER_PATH,
    },
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
  ],
  externals: {
    cheerio: 'window',
    jsdom: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
};
