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
  contentScripts: path.join(__dirname, 'src', 'contentScripts'),
  output: path.join(__dirname, 'dist'),
};

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
    const config = require(path.join(dirPath, 'config')); // eslint-disable-line global-require, import/no-dynamic-require
    const scriptName = `content_scripts/${name}`;
    contentScriptsEntries[scriptName] = dirPath;
    contentScriptsManifest.push({
      ...config,
      js: [`${scriptName}.js`],
      css: [`${scriptName}.css`],
    });
  });

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'source-map',
  entry: Object.assign(
    contentScriptsEntries,
    {
      popup: paths.popup,
      background: paths.background,
    },
  ),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        include: [paths.popup],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        // include: [paths.contentScripts],
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
      // {
      //   test: /\.css$/,
      //   include: [paths.popup],
      //   use: [
      //     'style-loader',
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         localIdentName: '[path]__[local]___[md5:hash:hex:5]',
      //         modules: true,
      //       },
      //     },
      //   ],
      // },
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
        transform: content => JSON.stringify(
          Object.assign(
            JSON.parse(content),
            {
              description: process.env.npm_package_description,
              version: process.env.npm_package_version,
              content_scripts: [
                ...contentScriptsManifest,
              ],
            },
          ),
          null,
          2,
        ),
      },
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
