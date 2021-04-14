const fs = require('fs');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const paths = {
  src: path.join(__dirname, 'src'),
  popup: path.join(__dirname, 'src', 'popup'),
  background: path.join(__dirname, 'src', 'background'),
  shared: path.join(__dirname, 'src', 'shared'),
  contentScripts: path.join(__dirname, 'src', 'contentScripts'),
  assets: path.join(__dirname, 'src', 'assets'),
  output: path.join(__dirname, 'dist'),
};

const webComponentsPolyfill = 'webcomponents-sd-ce.js';

const contentScriptsEntries = {};
const contentScriptsManifest = [];
fs.readdirSync(paths.contentScripts)
  .map((dir) => {
    const dirPath = path.join(paths.contentScripts, dir);
    if (fs.lstatSync(dirPath).isDirectory()) {
      return [dir, dirPath];
    }
    return null;
  })
  .filter(dirPath => dirPath)
  .forEach((contentScript) => {
    const [name, dirPath] = contentScript;
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const config = require(path.join(dirPath, 'config'));
    const scriptName = `content_scripts/${name}`;
    const webComponents = `content_scripts/${webComponentsPolyfill}`;
    contentScriptsEntries[scriptName] = dirPath;
    contentScriptsManifest.push({
      ...config,
      js: [webComponents, `${scriptName}.js`],
      css: [`${scriptName}.css`],
    });
  });

module.exports = {
  devtool: 'source-map',
  entry: {
    ...contentScriptsEntries,
    popup: paths.popup,
    background: paths.background,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/, `${paths.assets}/${webComponentsPolyfill}`],
        include: [paths.popup, paths.shared, paths.background],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              localIdentName: '[path]__[local]___[md5:hash:hex:5]',
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.gif$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 12288,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: 'raw-loader',
      },
    ],
  },
  output: {
    path: paths.output,
    filename: '[name].js',
  },
  resolve: {
    modules: [
      paths.src,
      'node_modules',
    ],
    extensions: ['*', '.js', '.jsx'],
  },
  plugins: [
    new CleanWebpackPlugin([paths.output]),
    new CopyWebpackPlugin([
      {
        from: `${paths.src}/manifest.json`,
        transform: (content) => {
          const template = JSON.parse(content);
          const newManifest = {
            ...template,
            description: process.env.npm_package_description,
            version: process.env.npm_package_version,
            content_scripts: [
              ...contentScriptsManifest,
            ],
          };
          return JSON.stringify(newManifest, null, 2);
        },
      },
      { from: `${paths.assets}/${webComponentsPolyfill}`, to: './content_scripts' },
    ]),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new HtmlWebpackPlugin({
      template: `${paths.popup}/popup.html`,
      filename: 'popup.html',
      chunks: ['popup'],
    }),
  ],
};
