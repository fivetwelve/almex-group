// Used specifically as a workaround for forwardEmail function that relies on mailjet
// c.f. https://stackoverflow.com/a/51995646

const webpack = require('webpack');

module.exports = {
  plugins: [new webpack.DefinePlugin({ 'global.GENTLY': false })],
};
