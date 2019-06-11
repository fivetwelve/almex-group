// Used specifically as a workaround for forwardEmail lambda that relies on mailjet where
// the issue is found
// c.f. https://stackoverflow.com/a/51995646

const webpack = require('webpack');

module.exports = {
  plugins: [new webpack.DefinePlugin({ 'global.GENTLY': false })],
};
