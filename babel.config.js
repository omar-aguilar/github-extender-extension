const presets = [
  ['@babel/preset-env', {
    targets: 'last 4 chrome versions',
    useBuiltIns: 'usage', // if 'usage' do not include @babel/polyfill
    modules: 'commonjs',
  }],
  '@babel/preset-react',
];

module.exports = { presets };
