import path from 'path';
import webpack from 'webpack';

import { SRC_FOLDER_PATH, BUILD_FOLDER_PATH } from '../config/projectPathConfig';
import { WEBPACK_HOST, WEBPACK_PORT } from '../config/serverAddressConfig';
import { JS_FOLDER_PATH } from '../config/publicFolderConfig';
import webpackConfigBase, { styleLoader } from './webpack.config.base';

export const jsLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel',
  query: {
    presets: ['es2015', 'stage-0', 'react'],
    env: {
      development: {
        plugins: [
          [
            'react-transform',
            {
              transforms: [
                {
                  transform: 'react-transform-hmr',
                  imports: ['react'],
                  locals: ['module'],
                },
                {
                  transform: 'react-transform-catch-errors',
                  imports: ['react', 'redbox-react'],
                },
              ],
            },
          ],
        ],
      },
    },
  },
};

export default {
  cache: true,
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: [
      `webpack-hot-middleware/client?path=http://${WEBPACK_HOST}:${WEBPACK_PORT}/__webpack_hmr`,
      path.join(SRC_FOLDER_PATH, 'client', 'Main.js'),
    ],
  },
  output: {
    path: BUILD_FOLDER_PATH,
    filename: '[name].js',
    publicPath: `http://${WEBPACK_HOST}:${WEBPACK_PORT}${JS_FOLDER_PATH}/`,
  },
  module: {
    preLoaders: webpackConfigBase.module.preLoaders,
    loaders: webpackConfigBase.module.loaders.concat([
      jsLoader,
      styleLoader,
    ]),
  },
  postcss: webpackConfigBase.postcss,
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  resolve: webpackConfigBase.resolve,
  eslint: {
    failOnError: false,
    emitWarning: true,
  },
};
