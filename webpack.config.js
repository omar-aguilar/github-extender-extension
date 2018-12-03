const fs = require('fs');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = {
  src: path.join(__dirname, 'src'),
  popup: path.join(__dirname, 'src', 'popup'),
  background: path.join(__dirname, 'src', 'background'),
  output: path.join(__dirname, 'dist'),
};

const backgroundEntries = {};
fs.readdirSync(paths.background)
  .filter(file => file.includes('.js') && (!file.includes('index') && !fs.lstatSync(path.join(paths.background, file)).isDirectory()))
  .map(file => ([file.replace(/\.js$/, ''), path.join(paths.background, file)]))
  .forEach(([entryName, entryPath]) => { backgroundEntries[entryName] = entryPath; });

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'inline-source-map',
  entry: Object.assign(
    backgroundEntries,
    {
      popup: paths.popup,
      background: paths.background,
    },
  ),
  output: {
    path: paths.output,
    filename: '[name].js',
  },
  resolve: {
    modules: [
      paths.src,
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: `${paths.src}/manifest.json`,
        transform: content => JSON.stringify(
          Object.assign(
            JSON.parse(content),
            {
              description: process.env.npm_package_description,
              version: process.env.npm_package_version,
            },
          ),
          null,
          2,
        ),
      },
    ]),
    new HtmlWebpackPlugin({
      template: `${paths.popup}/popup.html`,
      filename: 'popup.html',
      chunks: ['popup'],
    }),
  ],
};
