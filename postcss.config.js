/* eslint-disable import/no-extraneous-dependencies */
const postcssPresetEnv = require('postcss-preset-env');
const stylelint = require('stylelint');

const postcss = [
  postcssPresetEnv({
    features: {
      'nesting-rules': true,
    },
  }),
];

module.exports = {
  plugins: postcss,
  stylelint,
};
